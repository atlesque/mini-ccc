import rawCsv from './bom.csv?raw';
import metadata from './project-metadata.json';

export type BomItem = {
  number: number;
  name: string;
  cost: number;
  url: string;
};

export type Project = {
  number: number;
  name: string;
  slug: string;
  tag: string;
  kind: string;
  summary: string;
  description: string;
  accent: string;
  visual: string;
  items: BomItem[];
  total: number;
  votes: number;
  featuredRank?: number;
};

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const metadataByName = metadata as Record<string, Omit<Project, 'number' | 'name' | 'slug' | 'items' | 'total'>>;

const rows = parseCsv(rawCsv).slice(1);
const buildNames = [...new Set(rows.map((row) => row[1]))];

export const projects: Project[] = buildNames.map((name, index) => {
  const projectRows = rows.filter((row) => row[1] === name);
  const meta = metadataByName[name];
  if (!meta) throw new Error(`Missing project metadata for build: ${name}`);
  const items = projectRows.map((row) => ({
    number: Number(row[2]),
    name: row[3],
    cost: Number(row[4]),
    url: row[5],
  }));

  return {
    number: Number(projectRows[0][0]),
    name,
    slug: slugify(name),
    ...meta,
    items,
    total: Number(items.reduce((sum, item) => sum + item.cost, 0).toFixed(2)),
    votes: meta.votes + index % 2,
  };
});

export const totalBudget = Number(projects.reduce((sum, project) => sum + project.total, 0).toFixed(2));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
