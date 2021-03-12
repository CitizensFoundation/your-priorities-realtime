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

import '../cs-story/cs-story.js';
import { CsStory } from '../cs-story/cs-story.js';

export const CreateCardTabTypes: Record<string, number> = {
  Infomation: 0,
  ReviewCoreIssues: 1,
  AddIssues: 2,
  Vote: 3,
  Review: 4,
};

export const IssueTypes: Record<string, number> = {
  CoreIssue: 0,
  UserIssue: 1,
  ProviderIssue: 2,
};

@customElement('cs-meeting-create-card')
export class CsMeetingCreateCard extends CsMeetingBase {
  @property({ type: Number })
  storyPageIndex: number | undefined;

  @property({ type: Number })
  coreIssueIndex = 0;

  @property({ type: Number })
  votingIssueIndex = 0;

  @property({ type: Array })
  coreIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  participantsIssues: Array<IssueAttributes> | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._getIssues();
  }

  async _getIssues() {
    this.coreIssues = undefined;
    this.coreIssues = (await window.serverApi.getIssues(
      1 /*this.meeting.Round.projectId*/,
      IssueTypes.CoreIssue
    )) as Array<IssueAttributes> | undefined;
    debugger;
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

        .subjectHeader {
          margin: 32px;
          font-size: 24px;
        }

        .issueCard {
          background-color: var(--mdc-theme-surface);
          margin: 8px;
          width: 300px;
          max-width: 300px;
        }

        .voteButton {
          padding-bottom: 8px;
          padding-top: 0;
        }
      `,
    ];
  }

  updateState() {
    if (this.isAdmin) {
      this.sendState({
        tabIndex: this.selectedTab,
        isLive: this.isLive,
        storyPageIndex: this.storyPageIndex,
        votingIssueIndex: this.votingIssueIndex,
        coreIssueIndex: this.coreIssueIndex,
      } as StateAttributes);
    }
  }

  _processState(state: StateAttributes) {
    if (!this.isAdmin) {
      super._processState(state);
      if (state.storyPageIndex) {
        (this.$$('#storyViewer') as CsStory).setIndex(state.storyPageIndex);
      }
      if (state.coreIssueIndex) {
        this.coreIssueIndex = state.coreIssueIndex;
      }
      if (state.votingIssueIndex) {
        this.votingIssueIndex = state.votingIssueIndex;
      }
      this.selectedTab = state.tabIndex;
    }
  }

  setStoryIndex(event: CustomEvent) {
    if (this.isAdmin && this.isLive) {
      this.storyPageIndex = event.detail as number;
      this.updateState();
    }
  }

  renderStory() {
    return html`
      <div class="layout horizontal center-center">
        <cs-story
          id="storyViewer"
          @cs-story-index="${this.setStoryIndex}"
        ></cs-story>
      </div>
    `;
  }

  renderIssue(index: number) {
    const issue = this.coreIssues![index];
    const showVoting = this.selectedTab == CreateCardTabTypes.Voting;
    return html`
      <div
        class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
      >
        <div class="layout vertical">
          <div class="issueName">${issue.description}</div>
          <div class="layout horizontal" ?hidden="${!showVoting}">
            <mwc-icon-button
              icon="arrow_upward"
              class="voteButton"
              .label="${this.t('voteUp')}"
            ></mwc-icon-button>
            <mwc-icon-button
              icon="arrow_downward"
              class="voteButton"
              .label="${this.t('voteDown')}"
            ></mwc-icon-button>
            <div class="flex"></div>
          </div>
        </div>
      </div>

      ${issue.Comments?.map(comment => {
        return html` <div class="comment">${comment.content}</div> `;
      })}
    `;
  }

  leftCoreIssueArrow() {
    if (this.coreIssueIndex>0) {
      this.coreIssueIndex -= 1;
      this.updateState();
    }
  }

  rightCoreIssueArrow() {
    if (this.coreIssueIndex<this.coreIssues!.length) {
      this.coreIssueIndex += 1;
      this.updateState();
    }
  }

  renderReviewCoreIssues() {
    if (this.coreIssues) {
      return html`
      <div ?hidden="${this.isAdmin}" class="subjectHeader">
        ${this.t('reviewCoreIssues')}
      </div>

      <div class="layout horizontal center-center">
        <div class="issueBack" ?hidden="${this.coreIssueIndex===0}">
          <mwc-icon-button  @click="${this.leftCoreIssueArrow}">left_arrow</mwc-icon-button>
        </div>
        <div class="layout vertical center-center">
          ${this.renderIssue(this.coreIssueIndex)}
        </div>
        <div class="issueBack" ?hidden="${this.coreIssueIndex>=this.coreIssues!.length}">
          <mwc-icon-button @click="${this.rightCoreIssueArrow}">right_arrow</mwc-icon-button>
        </div>
      </div>
    `;
    } else {
      return html``;
    }
  }

  renderTabs() {
    if (this.isAdmin) {
      return html`
        <div class="layout vertical center-center">
          <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
            <mwc-tab
              .label="${this.t('information')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('reviewCoreIssues')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.meeting.forUsers
                ? this.t('createScoreCard')
                : this.t('createSelfAssessment')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('voting')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('review')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
          </mwc-tab-bar>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case CreateCardTabTypes.Information:
        page = this.renderStory();
        break;
      case CreateCardTabTypes.ReviewCoreIssues:
        page = this.renderReviewCoreIssues();
        break;
      }

    return page;
  }

  render() {
    return html`
      ${this.renderHeader()} ${this.renderTabs()} ${this.renderCurrentTabPage()}
    `;
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
