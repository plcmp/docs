import { css } from 'polylib';

export const componentStyles = css`
  :host { display: grid; gap: var(--pl-space-lg); min-width: 0; }
  .fields { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: var(--pl-space-lg); align-items: start; }
  .actions { display: flex; flex-wrap: wrap; gap: var(--pl-space-sm); align-items: center; }
  .stack { display: grid; gap: var(--pl-space-md); }
  p { margin: 0; }
  output { display: block; font: var(--pl-text-font); overflow-wrap: anywhere; }
  pre { margin: 0; padding: var(--pl-space-md); border: 1px solid var(--pl-grey-light); border-radius: var(--pl-border-radius); background: var(--pl-grey-lightest); font: 12px/1.6 monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
`;
