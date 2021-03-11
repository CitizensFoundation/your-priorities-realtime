/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-tab-bar';
import '@material/mwc-fab';
import '@material/mwc-icon';
import '@material/mwc-radio';

import { Radio } from '@material/mwc-radio';

import '@material/mwc-formfield';
import '@material/mwc-button';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('cs-meeting-base')
export class CsMeetingBase extends YpBaseElement {
  @property({ type: Object })
  meeting: MeetingAttributes | undefined;

  @property({ type: Boolean })
  isAdmin = false

  @property({ type: Boolean })
  isLive = false

  @property({ type: Number })
  selectedTab = 0;

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
        headerTitle: this.t('newRound'),
        documentTitle: this.t('newRound'),
        headerDescription: '',
      });
    }, 500);
  }

  // DATA PROCESSING

  /*async _getHelpPages() {
    if (this.domainId) {
      const helpPages = (await window.serverApi.getHelpPages(
        this.collectionType,
        this.domainId
      )) as Array<YpHelpPage> | undefined;
      if (helpPages) {
        this.fire('yp-set-pages', helpPages);
      }
    } else {
      console.error('Collection id setup for get help pages');
    }
  }*/

  // UI

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        mwc-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
        }

        mwc-tab-bar {
          width: 960px;
          margin-bottom: 16px;
        }

        .header {
          height: 100px;
          font-size: var(--mdc-typegraphy-headline1-font-size, 24px);
        }

        .project {
          background-color: var(--mdc-theme-surface, #fff);
          color: var(--mdc-theme-on-surface);
          padding: 16px;
          margin: 16px;
          width: 960px;
        }

        .process {
          background-color: var(--mdc-theme-surface, #fff);
          color: var(--mdc-theme-on-surface);
          padding: 16px;
          margin: 8px;
          width: 420px;
        }

        .processes {
          margin-top: 32px;
          margin-bottom: 32px;
        }

        mwc-icon {
          margin-right: 8px;
        }

        .name {
          font-weight: bold;
          margin-bottom: 16px;
        }

        .withLineContainer {
          background-image: linear-gradient(#555, #aaa);
          background-size: 2px 100%;
          background-repeat: no-repeat;
          background-position: center center;
          height: 40px;
          width: 100px;
        }

        .processHeader {
          margin-bottom: 16px;
          font-style: bold;
          font-weight: 800;
        }
      `,
    ];
  }

  _liveChanged(event: CustomEvent) {
    if ((this.$$("#liveRadio") as Radio).checked) {
      this.isLive = true;
    } else {
      this.isLive = false;
    }
  }

  renderSendEmail() {
    return html`

    `;
  }

  renderHeader() {
    return html`
      <div class="layout horizontal">
        <div class="layout vertical">
          <mwc-formfield .label="${this.t('closed')}">
            <mwc-radio
              id="liveRadio"
              @change="${this._liveChanged}"
              ?checked="${this.isLive}"
              value="closed"
              name="accessRadioButtons"
            >
            </mwc-radio>
          </mwc-formfield>
        </div>
        <div class="layout vertical">
          ${this.renderSendEmail()}
        </div>
      </div>
    `;
  }

  renderTabs() {
    return html``;
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case RoundTabTypes.Process:
        page = this.renderProcesses();
        break;
      case RoundTabTypes.Activities:
        //page = this.renderProjectList({ archived: true });
        break;
      case RoundTabTypes.Analytics:
        //page = this.renderProjectList({ archived: true });
        break;
    }

    return page;
  }

  render() {
    return html` ${this.renderTabs()} ${this.renderCurrentTabPage()} `;
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  /*_setSelectedTabFromRoute(routeTabName: string): void {
    let tabNumber;

    switch (routeTabName) {
      case 'process':
        tabNumber = RoundTabTypes.Process;
        break;
      case 'activities':
        tabNumber = RoundTabTypes.Activities;
        break;
      case 'analytics':
        tabNumber = RoundTabTypes.Analytics;
        break;
    }
  }*/
}
