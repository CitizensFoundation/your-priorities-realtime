/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';

import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon-button';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';
import 'vanilla-colorful';

@customElement('cs-login')
export class CsLogin extends YpBaseElement {
  @property({ type: Object })
  user: UserAttributes | undefined;

  @property({ type: String })
  userAvatar: string | undefined;

  @property({ type: String })
  userAvatarColor: string | undefined;

  @property({ type: String })
  returnToPage: string | undefined;

  constructor() {
    super();

    //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
    // this.addGlobalListener('yp-logged-in', this._getCollection.bind(this));
    //this.addGlobalListener('yp-got-admin-rights', this.refresh.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      this.fire('yp-change-header', {
        headerTitle: this.t('login'),
        documentTitle: this.t('login'),
        headerDescription: '',
      });
    }, 500);
  }

  firstUpdated(changedProperties: any) {
    const picker = this.$$('hex-color-picker');
    if (picker) {
      picker.addEventListener('color-changed', (event) => {
        // @ts-ignore
        const newColor = event.detail.value;
        this.userAvatarColor = newColor;
        this.style.setProperty('--cs-avatar-color', this.userAvatarColor!);
      });
    }
  }

  loggedIn() {
    this.fireGlobal('cs-user-logged-in', this.user);
  }

  async login() {
    if (this.userAvatar && this.userAvatarColor) {
      this.user = (await window.serverApi.login(
        this.userAvatar,
        this.userAvatarColor
      )) as UserAttributes | undefined;

      if (this.user) {
        this.loggedIn();
      }
    }
  }

  async _getHelpPages() {
    /*if (this.domainId) {
      const helpPages = (await window.serverApi.getHelpPages(
        this.collectionType,
        this.domainId
      )) as Array<YpHelpPage> | undefined;
      if (helpPages) {
        this.fire('yp-set-pages', helpPages);
      }
    } else {
      console.error('Collection id setup for get help pages');
    }*/
  }

  // UI

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .avatarIcon {
          --mdc-icon-size: 64px;
          padding: 24px;
          color: var(--cs-avatar-color, #000);
        }

        .avatarContainer, .chooseAvatarColor {
          background-color: #fefefe;
          max-width: 300px;
          width: 300px;
          color: #000;
          padding: 16px;
          margin: 16px;
          height: 100%;
          padding-top: 0;
          margin-left: 0;
          margin-right: 0;
        }

        .loginInfo {
          font-size: 22px;
        }

        .chooseAvatarColor {
          margin-top: 48px;
        }

        mwc-button {
          margin-top: 24px;
          margin-top: 16px;
          --mdc-theme-primary: #FFF;
          --mdc-theme-on-primary: #000;
          --mdc-typography-button-font-size: 16px;
        }

        .avatarColor {
          margin-bottom: 16px;
          margin-top: -8px;
          padding-top: 0;
        }

        .buttonIcon {
          margin-left: 6px;
          color: var(--cs-avatar-color, #000);
        }

        .container {
          background-color: #FFF;
          height: 100%;
          padding-bottom: 42px;
          position: relative;
          margin-top: 32px;
        }

        .loginButton {
          position: absolute;
          bottom: 24px;
          right: 24px;
        }
      `,
    ];
  }

  renderChooseAvatar() {
    const arr = [
      'psychology',
      'face',
      'mood',
      'accessibility',
      'flutter_dash',
      'face_retouching_natural',
      'ac_unit',
      'light_mode',
      'directions_run',
      'emoji_people',
      'self_improvement',
      'person_outline',
    ];

    return html`
      <div class="layout vertical center-center wrap avatarContainer">
        <div class="loginInfo">${this.t("chooseAvatar")}</div>
        <div class="layout horizontal center-center wrap">
          ${arr.map(icon => {
            return html`
              <mwc-icon-button
                class="avatarIcon"
                .icon="${icon}"
                @click="${() => {
                  this.userAvatar = icon;
                }}"
              ></mwc-icon-button>
            `;
          })}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal wrap shadow-elevation-2dp shadow-transition container">
          <div class="chooseAvatar layoutself-start">${this.renderChooseAvatar()}</div>
          <div class="layout vertical center-center wrap chooseAvatarColor">
            <div class="loginInfo avatarColor">${this.t("chooseAvatarColor")}</div>
            <hex-color-picker color="#000"></hex-color-picker>
          </div>
          <div class="layout horizontal self-end">
            <mwc-button @click="${this.login}" class="loginButton" ?disabled="${!this.userAvatar || !this.userAvatarColor}" raised .label="${this.userAvatar ? this.t("loginAs") : this.t('login')}">
              <mwc-icon class="buttonIcon" ?hidden="${!this.userAvatar}">${this.userAvatar}</mwc-icon>
            </mwc-button>
          </div>
        </div>
      </div>
    `;
  }

  // EVENTS

  gotoRound(event: CustomEvent) {
    event.preventDefault();
    YpNavHelpers.redirectTo('/round/1');
  }

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
  }
}
