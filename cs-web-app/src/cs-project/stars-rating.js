import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { classMap } from 'lit-html/directives/class-map';

/**
 * `stars-rating`
 * Stars Rating
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class StarsRating extends LitElement {
  static get properties() {
    return {
      _stars: {
        type: Array
      },
      numstars: {
        type: Number,
        value: 7
      },
      rating: {
        type: Number,
        value: 0
      },

      disableRating: {
        type: Boolean,
        value: false
      },

      userRating: {
        type: Number,
        value: 0
      },
      manual: {
        type: Boolean,
        value: false
      },
      mode: {
        type: String,
        value: 'auto'
      },
      resetbtn: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return css`
      :host(:not([hidden])) {
          display: block;
          font-size: 2em;
          --star-size: 1em;
          --star-color: #FFD700;
        }
        fieldset,
        label {
          margin: 0;
          padding: 0;
        }
        fieldset {
          border: none;
        }
        input {
          display: none;
        }
        label:before {
          font-size: var(--star-size, 1em);
          display: inline-block;
        }

        label {
          color: var(--star-color);
          opacity: 0.3;
        }
        label[data-hightlight] {
          opacity: 1;
        }
        label.resetbtn {
          color: #F00;
          font-size:0.5em;
          opacity: 1;
        }

        label.resetbtn:before {
          font-size: var(--star-size, 1em);
          display: inline-block;
          content: var(--start-unicode, "ø");
          opacity:1;
        }
        .on0:before {
          content: var(--start-unicode, "😟");
        }

        .on1:before {
          content: var(--start-unicode, "🙁");
        }

        .on2:before {
          content: var(--start-unicode, "😐");
        }

        .on3:before {
          content: var(--start-unicode, "🙂");
        }

        .on4:before {
          content: var(--start-unicode, "😊");
        }

    `;
  }

  constructor() {
    super();
    this._rate = this._rate.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateNumstars();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.renderRoot.querySelector('#rating').removeEventListener('click', this._rate);
  }

  updated(changedProperties, o) {
    if (changedProperties.get('manual') !== this.manual) {
      this._manualChanged();
    }

    if (changedProperties.get('rating') !==  this.rating && this.rating!=this.setRating) {
      this._ratingChange();
    }

    if (changedProperties.has('userRating') && this.userRating) {
      this.dispatchEvent(new CustomEvent('rating-changed', { detail: this.userRating }));
    }
  }

  _updateNumstars() {
    this._stars = new Array(this.numstars);
  }

  _isHightlight(index) {
    return index < this.rating;
  }

  _ratingChange() {
    if (this.rating < 0) {
      this.rating = 0;
    } else if (this.rating > this.numstars) {
      this.rating = this.numstars;
    }
  }

  reset() {
    this.rating = 0;
  }

  _manualChanged() {
    if (this.manual) {
      this.renderRoot.querySelector('#rating').addEventListener('click', this._rate);
    } else {
      this.renderRoot.querySelector('#rating').removeEventListener('click', this._rate);
    }
  }

  _rate(ev) {
    if (ev.target.nodeName === 'INPUT') {
      this.rating = parseInt(ev.target.value) + 1;
      this.userRating = this.rating;
    }
  }

  render() {
    let index = 1;
    return html`
      <fieldset id="rating" ?disabled="${this.disableRating}">
        ${(this.resetbtn && this.manual) ? html`<label class="resetbtn"><input @click="${this.reset}" type="radio" id="x" name="resetbtn" value="-1" /></label>  ` : html``}
        ${repeat(
          this._stars,
          item => item,
          (item, i) => html`<label for="star${i}" class="on${i}" ?data-hightlight="${this._isHightlight(i)}">
                              <input type="radio" id="star${i}" name="rating" value="${i}" />
                            </label>`
        )}
      </fieldset>
    `;
  }
}

window.customElements.define('stars-rating', StarsRating);