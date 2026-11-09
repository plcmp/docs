import '@plcmp/pl-iconset';

const iconset = document.createElement('pl-iconset');
iconset.iconset = 'demo';
iconset.hidden = true;
iconset.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <g id="search" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <circle cx="6.75" cy="6.75" r="4.25"></circle>
      <path d="m10 10 3.5 3.5"></path>
    </g>
    <g id="download" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 2v8m-3-3 3 3 3-3M2.5 10v3.5h11V10"></path>
    </g>
    <g id="settings" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 4h12M2 8h12M2 12h12"></path>
      <path d="M5 2.5v3M11 6.5v3M6 10.5v3"></path>
    </g>
    <g id="plus" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M8 3v10M3 8h10"></path>
    </g>
    <g id="check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 8 3.25 3.25L13 4.5"></path>
    </g>
  </svg>
`;

document.body.append(iconset);
// pl-iconset регистрирует группы после slotchange; затем можно создавать pl-icon.
await new Promise(resolve => {
  iconset.shadowRoot.querySelector('slot').addEventListener('slotchange', resolve, { once: true });
});
