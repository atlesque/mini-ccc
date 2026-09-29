import { readFile, mkdir, writeFile, stat, rename } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { BUILD_IMAGE_SIZE, createBuildImagePrompt } from './build-image-prompt.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = path.join(projectRoot, 'src/assets/builds');
const metadataPath = path.join(projectRoot, 'src/data/project-metadata.json');
const bomPath = path.join(projectRoot, 'src/data/bom.csv');
const [width, height] = BUILD_IMAGE_SIZE.split('x').map(Number);

for (const envPath of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(path.join(projectRoot, envPath));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';
const quality = process.env.OPENAI_IMAGE_QUALITY || 'medium';

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];

    if (character === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(field);
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseWebpDimensions(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkType = buffer.toString('ascii', offset, offset + 4);
    const chunkLength = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (chunkType === 'VP8X' && chunkLength >= 10) {
      return {
        width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
        height: 1 + buffer.readUIntLE(dataOffset + 7, 3),
      };
    }

    if (chunkType === 'VP8 ' && chunkLength >= 10 && buffer[dataOffset + 3] === 0x9d && buffer[dataOffset + 4] === 0x01 && buffer[dataOffset + 5] === 0x2a) {
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
      };
    }

    if (chunkType === 'VP8L' && chunkLength >= 5 && buffer[dataOffset] === 0x2f) {
      return {
        width: 1 + buffer[dataOffset + 1] + ((buffer[dataOffset + 2] & 0x3f) << 8),
        height: 1 + (buffer[dataOffset + 2] >> 6) + (buffer[dataOffset + 3] << 2) + ((buffer[dataOffset + 4] & 0x0f) << 10),
      };
    }

    offset = dataOffset + chunkLength + (chunkLength % 2);
  }

  return null;
}

function readImageDimensions(buffer) {
  return parseWebpDimensions(buffer);
}

function parseArguments(args) {
  const options = { force: false, promptsOnly: false, concurrency: 3, slug: null };
  for (const arg of args) {
    if (arg === '--force') options.force = true;
    else if (arg === '--prompts-only') options.promptsOnly = true;
    else if (arg.startsWith('--slug=')) options.slug = arg.slice('--slug='.length);
    else if (arg.startsWith('--concurrency=')) options.concurrency = Number(arg.slice('--concurrency='.length));
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!Number.isInteger(options.concurrency) || options.concurrency < 1 || options.concurrency > 6) {
    throw new Error('--concurrency must be an integer between 1 and 6');
  }
  return options;
}

function printHelp() {
  console.log(`Generate one dark-mode-ready image per Mini CCC build.\n\nUsage:\n  pnpm run generate:build-images [-- --slug=lora-network] [--force] [--concurrency=3]\n  pnpm run generate:build-images -- --prompts-only [--slug=lora-network]\n\nOptions:\n  --slug=SLUG       Generate or preview one build only\n  --force           Regenerate images that already exist\n  --concurrency=N   Concurrent API requests, from 1 to 6 (default: 3)\n  --prompts-only    Print the prompt(s) without calling the API\n`);
}

async function loadProjects() {
  const [csv, metadataText] = await Promise.all([readFile(bomPath, 'utf8'), readFile(metadataPath, 'utf8')]);
  const metadata = JSON.parse(metadataText);
  const names = [...new Set(parseCsv(csv).slice(1).map((row) => row[1]).filter(Boolean))];
  return names.map((name) => {
    const details = metadata[name];
    if (!details) throw new Error(`Missing project metadata for build: ${name}`);
    return { name, slug: slugify(name), description: details.description, accent: details.accent };
  });
}

async function requestImage(prompt, apiKey) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        size: BUILD_IMAGE_SIZE,
        quality,
        background: 'opaque',
        output_format: 'webp',
      }),
      signal: AbortSignal.timeout(240_000),
    });

    if (response.ok) return response.json();

    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error?.message || response.statusText || 'Unknown API error';
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === 3) throw new Error(`OpenAI image API returned ${response.status}: ${message}`);

    const retryAfter = Number(response.headers.get('retry-after'));
    const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1500 * (2 ** attempt);
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 30_000)));
  }
  throw new Error('OpenAI image request did not complete');
}

async function generateImage(project, prompt, apiKey) {
  const result = await requestImage(prompt, apiKey);
  const encodedImage = result.data?.[0]?.b64_json;
  if (!encodedImage) throw new Error('OpenAI returned no image data');

  const image = Buffer.from(encodedImage, 'base64');
  if (image.toString('ascii', 0, 4) !== 'RIFF' || image.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('OpenAI did not return a WebP file as requested');
  }
  const dimensions = readImageDimensions(image);
  if (!dimensions) throw new Error('Generated WebP image dimensions could not be read');
  if (dimensions.width !== width || dimensions.height !== height) {
    throw new Error(`Generated image is ${dimensions.width}x${dimensions.height}; expected ${BUILD_IMAGE_SIZE}`);
  }

  const outputPath = path.join(outputDirectory, `${project.slug}.webp`);
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, image);
  const { size } = await stat(temporaryPath);
  await rename(temporaryPath, outputPath);
  return { outputPath, size };
}

const options = parseArguments(process.argv.slice(2).filter((arg) => arg !== '--'));
if (options.help) {
  printHelp();
  process.exit(0);
}

const allProjects = await loadProjects();
const projects = options.slug ? allProjects.filter((project) => project.slug === options.slug) : allProjects;
if (projects.length === 0) throw new Error(`No build found for slug: ${options.slug}`);

const jobs = projects.map((project) => ({ project, prompt: createBuildImagePrompt(project) }));
if (options.promptsOnly) {
  for (const { project, prompt } of jobs) {
    console.log(`--- ${project.slug} ---\n${prompt}\n`);
  }
  process.exit(0);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Set OPENAI_API_KEY in the environment or in .env.local before generating images. Use --prompts-only to inspect prompts without an API key.');
}

await mkdir(outputDirectory, { recursive: true });
const queue = [...jobs];
const failures = [];
let completed = 0;

async function worker() {
  while (queue.length > 0) {
    const { project, prompt } = queue.shift();
    const outputPath = path.join(outputDirectory, `${project.slug}.webp`);
    if (!options.force) {
      try {
        const existing = await readFile(outputPath);
        const dimensions = readImageDimensions(existing);
        if (dimensions?.width === width && dimensions?.height === height) {
          completed += 1;
          console.log(`[${completed}/${jobs.length}] ${project.name}: already generated`);
          continue;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }

    try {
      const result = await generateImage(project, prompt, apiKey);
      completed += 1;
      console.log(`[${completed}/${jobs.length}] ${project.name}: generated (${(result.size / 1024).toFixed(0)} KB)`);
    } catch (error) {
      failures.push({ name: project.name, message: error.message });
      console.error(`${project.name}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(options.concurrency, queue.length) }, () => worker()));

if (failures.length > 0) {
  console.error(`\n${failures.length} of ${jobs.length} image jobs failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${jobs.length} build images are ready in src/assets/builds/.`);
}
