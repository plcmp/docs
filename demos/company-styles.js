import { css } from 'polylib';

/** Общая раскладка интерактивных примеров Demo-company. */
export const companyStyles = css`
  :host { display: grid; gap: var(--pl-space-lg); min-width: 0; }
  [hidden] { display: none !important; }
  h3 { margin: 0; font: 600 16px/1.5 system-ui, sans-serif; }
  p { margin: 0; line-height: 1.6; }
  section { display: grid; gap: var(--pl-space-md); min-width: 0; }
  .zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr)); gap: var(--pl-space-lg); }
  .zone { border: 1px solid var(--pl-grey-base); border-radius: var(--pl-border-radius); padding: var(--pl-space-lg); }
  .toolbar, .row { display: flex; flex-wrap: wrap; gap: var(--pl-space-sm); align-items: flex-end; }
  .row pl-input { flex: 1 1 160px; min-width: 0; }
  pl-input { --pl-content-width: 100%; }
  .status { font-weight: 600; }
  .muted { color: var(--pl-header-color); font-size: 12px; }
  .error { color: #9b3830; }
  output { display: block; line-height: 1.6; }
  details { min-width: 0; border: 1px solid var(--pl-grey-base); border-radius: var(--pl-border-radius); padding: var(--pl-space-md); }
  summary { cursor: pointer; font-weight: 600; }
  pre { margin: var(--pl-space-md) 0 0; white-space: pre-wrap; overflow-wrap: anywhere; font: 12px/1.6 monospace; max-height: 360px; overflow: auto; }
`;
