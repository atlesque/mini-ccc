export default defineAppConfig({
  ui: {
    colors: {
      primary: 'lime',
      neutral: 'zinc',
    },
    button: {
      slots: {
        base: 'font-mono uppercase tracking-[0.12em] text-[0.7rem] rounded-none min-h-8',
      },
    },
    input: {
      slots: {
        base: 'rounded-none font-mono',
      },
    },
    badge: {
      slots: {
        base: 'font-mono uppercase tracking-[0.14em] rounded-none',
      },
    },
    toast: {
      slots: {
        root: 'rounded-none font-mono',
      },
    },
  },
});
