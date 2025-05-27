export const THEMES = [
  {
    name: 'Default',
    value: 'default',
  },
  {
    name: 'Blue',
    value: 'blue',
  },
  {
    name: 'Green',
    value: 'green',
  },
  {
    name: 'Amber',
    value: 'amber',
  },
  {
    name: 'Scaled',
    value: 'scaled',
  },
];
export type Theme = (typeof THEMES)[number];
