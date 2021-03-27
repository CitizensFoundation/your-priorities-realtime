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
import Picker from 'vanilla-picker';

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

    let parent = this.$$('#colorChooser');
    const picker = new Picker(parent!);

    picker.onChange = (color) => {
      this.userAvatarColor = color.rgbaString;
    };

  }

  async _checkLogin() {
    this.user = (await window.serverApi.checkLogin()) as
      | UserAttributes
      | undefined;

    if (this.user) {
      this.loggedIn();
    }
  }

  loggedIn() {
    this.fireGlobal('cs-user-logged-in', this.user);
    if (this.returnToPage) {
      YpNavHelpers.redirectTo(this.returnToPage);
    }
  }

  async login(avatar: string) {
    this.user = (await window.serverApi.login(
      this.userAvatar,
      this.userAvatarColor
    )) as UserAttributes | undefined;

    if (this.user) {
      this.loggedIn();
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
          padding: 16px;
          color: var(--cs-avatar-color, #fff);
        }
      `,
    ];
  }

  renderChooseAvatar() {
    const arr = [
      'psychology',
      'face',
      'mood',
      'science',
      'memory',
      'texture',
      'ac_unit',
      'light_mode',
      'music_note',
      'emoji_people',
      'self_improvement',
      'account_circle',
    ];

    return html`
      <div class="layout horizontal wrap avatarContainer">
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
    `;
  }

  render() {
    return html`
      <div class="layout vertical center-center">
        <div class="loginInfo">${this.t("createYourAvatarAndLogin")}</div>
        <div class="layout horizontal wrap">
          <div class="chooseAvatar">${this.renderChooseAvatar()}</div>
          <div id ="colorChooser" class="chooseAvatarColor"></div>
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
