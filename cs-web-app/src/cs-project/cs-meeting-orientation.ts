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
import '@material/mwc-button';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';
import { CsStory } from '../cs-story/cs-story.js';

export const OrientationTabTypes: Record<string, number> = {
  Orientation: 0,
};

@customElement('cs-meeting-orientation')
export class CsMeetingOrientation extends CsMeetingBase {
  constructor() {
    super();
    this.storyNumber = 2;
  }

  connectedCallback() {
    super.connectedCallback();
  }

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
      `,
    ];
  }

  updateState() {
    this.sendState({
      tabIndex: this.selectedTab,
      isLive: this.isLive,
      storyPageIndex: this.storyPageIndex
    } as StateAttributes)
  }

  _processState(state: StateAttributes) {
    if (!this.isAdmin) {
      super._processState(state);
      if (state.storyPageIndex) {
        (this.$$("#storyViewer") as CsStory).setIndex(state.storyPageIndex);
      }
      this.selectedTab = state.tabIndex;
    }
  }

  renderTabs() {
    return html`
      <div class="layout vertical center-center">
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            ?hidden="${!this.isAdmin}"
            .label="${this.t('orientation')}"
            icon="format_list_numbered"
            stacked
          ></mwc-tab>
        </mwc-tab-bar>
      </div>
    `;
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case OrientationTabTypes.Orientation:
        page = this.renderStory();
        break;
    }

    return page;
  }

  render() {
    return html`${this.renderTabs()} ${this.renderCurrentTabPage()} `;
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
