// Originally from here: https://dev.to/straversi/build-a-story-web-component-with-litelement-e59

import { LitElement, html, css, property, customElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

// Gesture control
import Hammer from 'hammerjs';
import { YpBaseElement } from '../@yrpri/yp-base-element';

@customElement('cs-story-viewer')
export class CsStoryViewer extends YpBaseElement {
  @property({type: Number})
  _index = 0;

  @property({type: Boolean})
  isLive!: boolean;

  @property({type: Boolean})
  isAdmin = false

  @property() _panData: { isFinal?: boolean; deltaX?: number } = {};

  get index() {
    return this._index;
  }
  set index(value: number) {
    this.children[this._index].dispatchEvent(new CustomEvent('exited'));
    this.children[value].dispatchEvent(new CustomEvent('entered'));
    this._index = value;
  }

  constructor() {
    super();
    // Detect pans easily with Hammer.js
    const hammer = new Hammer(this);
    hammer.on('panleft', this.processPanData.bind(this));
    hammer.on('panright', this.processPanData.bind(this));
    this.index = 0;
  }

  processPanData(event: any) {
    if (!this.disableNav) {
      this._panData = event;
    }
  }

  firstUpdated() {
    this.children[this._index].dispatchEvent(new CustomEvent('entered'));
  }

  update(changedProperties: Map<string | number | symbol, unknown>) {
    // eslint-disable-next-line prefer-const
    let { deltaX = 0, isFinal = false } = this._panData;

    // Guard against an infinite loop by looking for index.
    if (!changedProperties.has('_index') && isFinal) {
      deltaX > 0 ? this.previous() : this.next();
    }

    this.fire('cs-story-index', this.index);

    const width = this.clientWidth;
    const minScale = 0.8;
    // We don't want the latent deltaX when releasing a pan.
    deltaX = isFinal ? 0 : deltaX;

    (Array.from(this.children) as Array<HTMLElement>).forEach((el: HTMLElement, i) => {
      const x = (i - this.index) * width + deltaX;

      // Piecewise scale(deltaX), looks like: __/\__
      const u = deltaX / width + (i - this.index);
      const v = -Math.abs(u * (1 - minScale)) + 1;
      const scale = Math.max(v, minScale);

      el.style.transform = `translate3d(${x}px,0,0) scale(${scale})`;
    });

    super.update(changedProperties);
  }

  setIndex(index: number) {
    this.index = index;
  }

  /* Advance to the next story card if possible */
  next() {
    this.index = Math.max(
      0,
      Math.min(this.children.length - 1, this.index + 1)
    );

    if (this.index === this.children.length - 1) {
      this.fire('cs-last-story-card')
    }
  }

  /* Go back to the previous story card if possible */
  previous() {
    this.index = Math.max(
      0,
      Math.min(this.children.length - 1, this.index - 1)
    );
  }

  static get styles() {
    return [css`
    :host {
      display: block;
      position: relative;
      align-items: center;
      width: 400px;
      height: 711px;
    }

    @media (max-width: 600px) {
      :host {
        display: block;
        position: absolute;
        top: 48px;
        left: 0;
        width: 100vw;
        height: calc(100vh - 48px);
      }
    }

    ::slotted(*) {
      position: absolute;
      width: 100%;
      height: calc(100% - 20px);
      transition: transform 0.35s ease-out;
    }

    svg {
      position: absolute;
      top: calc(50% - 16px);
      height: 42px;
      width: 42px;
      cursor: pointer;
    }

    @media (max-width: 600px) {
      svg {
        position: absolute;
        top: calc(50% - 25px);
        height: 32px;
        width: 32px;
        cursor: pointer;
      }
    }

    @media (max-width: 340px) {
      svg {
        position: absolute;
        top: calc(50% - 25px);
        height: 30px;
        width: 30px;
        cursor: pointer;
      }
    }

    #next {
      right: 0;
    }

    #progress {
      position: relative;
      top: calc(100% - 20px);
      height: 20px;
      width: 50%;
      margin: 0 auto;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      grid-gap: 10px;
      align-content: center;
    }
    #progress > div {
      background: grey;
      height: 4px;
      transition: background 0.3s linear;
      cursor: pointer;
    }
    #progress > div.watched {
      background: white;
    }
    [hidden] {
      display: none !important;
    }

    @media (max-width: 600px) {
      #progress {
        display: none !important;
      }

      ::slotted(*) {
        height: 100%;
      }
    }
 `];
  }

  navClick(index: number) {
    if (!this.disableNav) {
      this.index = index;
    }
  }

  navClickPrevious() {
    if (!this.disableNav) {
      this.previous()
    }
  }

  navClickNext() {
    if (!this.disableNav) {
      this.next();
    }
  }

  get disableNav() {
    return (this.isLive && !this.isAdmin);
  }

  render() {
    return html`
      <slot></slot>

      <svg ?hidden="${this.disableNav || this.index==0}" id="prev" viewBox="0 0 10 10" @click=${(e: CustomEvent) => this.navClickPrevious()}>
        <path d="M 6 2 L 4 5 L 6 8" stroke="#eee" fill="none" />
      </svg>

      <svg ?hidden="${this.disableNav || this.index==this.children.length-1}" id="next" viewBox="0 0 10 10" @click=${(e: CustomEvent) => this.navClickNext()}>
        <path d="M 4 2 L 6 5 L 4 8" stroke="#eee" fill="none" />
      </svg>

      <div id="progress" ?hidden="${this.disableNav}">
        ${Array.from(this.children).map(
          (_, i) => html` <div
            class=${classMap({ watched: i <= this.index })}
            @click=${() => this.navClick(i) }
          ></div>`
        )}
      </div>
    `;
  }
}
