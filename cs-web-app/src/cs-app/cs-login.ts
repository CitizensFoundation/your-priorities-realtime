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
import { TextField } from '@material/mwc-textfield';

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
      picker.addEventListener('color-changed', event => {
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
    let facilitatorName;

    if (this.isAdmin) {
      facilitatorName = (this.$$('#facilitatorName') as TextField).value;
    }

    if (this.userAvatar && this.userAvatarColor) {
      this.user = (await window.serverApi.login(
        this.userAvatar,
        this.userAvatarColor,
        facilitatorName
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
          --mdc-icon-size: 38px;
          padding: 12px;
          color: var(--cs-avatar-color, #000);
        }

        .avatarContainer,

        .chooseAvatarColor {
          background-color: #fefefe;
          max-width: 300px;
          width: 300px;
          color: #000;
          margin: 0;
          height: 100%;
          padding-top: 0;
          margin-left: 0;
          margin-right: 0;
          margin-top: 0;
        }

        .chooseAvatarColor {
          margin-left: 20px;
        }

        .avatarContainer {
          margin-right: 16px;
        }

        .loginInfo {
          font-size: 16px;
          padding-bottom: 8px;
        }

        .chooseAvatarColor {
        }

        mwc-button {
          margin-top: 24px;
          margin-top: 16px;
          --mdc-theme-primary: #fff;
          --mdc-theme-on-primary: #000;
          --mdc-typography-button-font-size: 16px;
        }

        hex-color-picker {
          padding-bottom: 0px;
          padding-top: 0px;
        }

        .avatarColorText {
          padding-bottom: 24px;
        }

        .buttonIcon {
          margin-left: 6px;
          color: var(--cs-avatar-color, #000);
        }

        .container {
          background-color: #fff;
          height: 100%;
          width: 720px;
          padding-bottom: 30px;
          margin-top: 16px;
        }

        .loginButton {
          width: 175px;
          margin-top: 38px;
        }

        .avatarContainer {
          margin-top: 0;
          padding-top: 0;
        }

        .mainTitle {
          margin-top:16px;
          font-size: 28px;
          color: #fff;
          background-color: #000;

        }

        .mainTitleContainer {
          color: #fff;
          padding-bottom: 16px;
          margin-bottom: 16px;
          background-color: #000;
        }


        .subContainer {
          height: 250px;
        }

        @media (max-width: 720px) {
          .container {
            width: 100%;
          }

          .subContainer {
            height: 100%;
          }

          .chooseAvatarColor {
            width: 100%;
          }

          .chooseAvatarText {
            margin-top: 16px;
          }

          .avatarColorText {
            margin-top: 16px;
          }

          .mainTitleContainer {
            text-align: center;
          }
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
        <div class="loginInfo chooseAvatarText">${this.t('chooseAvatar')}</div>
        <div class="layout horizontal center-center wrap avatarWrapper">
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
        <div
          class="layout vertical wrap shadow-elevation-2dp shadow-transition container"
        >

          <div class="layout horizontal center-center mainTitleContainer">
            <div class="mainTitle">${this.t('welcomeToTheCommunityScoreCardApp')}</div>
          </div>

          <div class="layout horizontal center-center wrap">
            <div class="chooseAvatar layoutself-start subContainer">
              ${this.renderChooseAvatar()}
            </div>

            <div class="layout vertical center-center wrap chooseAvatarColor subContainer">
              <div class="loginInfo avatarColorText">
                ${this.t('chooseAvatarColor')}
              </div>
              <hex-color-picker color="#000"></hex-color-picker>
            </div>
          </div>

          <div class="layout horizontal center-center">
            <mwc-button
              @click="${this.login}"
              class="loginButton"
              ?disabled="${!this.userAvatar || !this.userAvatarColor}"
              raised
              .label="${this.userAvatar ? this.t('loginAs') : this.t('login')}"
            >
              <mwc-icon class="buttonIcon" ?hidden="${!this.userAvatar}"
                >${this.userAvatar}</mwc-icon
              >
            </mwc-button>
          </div>

          ${this.isAdmin ? html`
            <div class="layout vertical">
              <mwc-textfield
                id="facilitatorName"
                maxLength="60"
                .label="${this.t('facilitatorName')}"
              ></mwc-textfield>
            </div>
          ` : nothing}
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
