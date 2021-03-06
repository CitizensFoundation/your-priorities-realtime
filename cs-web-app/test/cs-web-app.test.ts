import { html, fixture, expect } from '@open-wc/testing';

import { CsApp } from '../src/cs-app/cs-app';
import '../src/cs-web-app.js';

describe('CsWebApp', () => {
  let element: CsApp;
  beforeEach(async () => {
    element = await fixture(html`<cs-web-app></cs-web-app>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
