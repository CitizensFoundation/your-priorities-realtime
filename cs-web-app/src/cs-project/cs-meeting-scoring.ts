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
import '@material/mwc-textarea';
import '@manufosela/stars-rating';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';

import '../cs-story/cs-story.js';
import { CsStory } from '../cs-story/cs-story.js';
import { TextArea } from '@material/mwc-textarea';
import { Snackbar } from '@material/mwc-snackbar';

import { sortBy } from 'lodash-es';

export const ScoringTabTypes: Record<string, number> = {
  Information: 0,
  ReviewScoreCard: 1,
  ViewIssues: 2,
  RateIssues: 3,
  Results: 4,
};

@customElement('cs-meeting-scoring')
export class CsMeetingScoring extends CsMeetingBase {
  @property({ type: Number })
  coreIssueIndex = 0;

  @property({ type: Number })
  votingIssueIndex = 0;

  @property({ type: Array })
  coreIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  participantsIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  allIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  orderedParticipantsIssues: Array<IssueAttributes> | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._getIssues();
    this._getAnyParticipantsIssues();
  }

  _getAnyParticipantsIssues() {
    if (this.meeting.forUsers) {
      this._getParticipantsIssues(this.IssueTypes.UserIssue);
    } else {
      this._getParticipantsIssues(this.IssueTypes.ProviderIssue);
    }
  }

  async _getIssues() {
    this.coreIssues = undefined;
    this.coreIssues = (await window.serverApi.getIssues(
      1 /*this.meeting.Round.projectId*/,
      this.IssueTypes.CoreIssue
    )) as Array<IssueAttributes> | undefined;
  }

  async _getParticipantsIssues(issueType: number) {
    this.participantsIssues = undefined;
    this.participantsIssues = (await window.serverApi.getIssues(
      1 /*this.meeting.Round.projectId*/,
      issueType
    )) as Array<IssueAttributes> | undefined;
  }

  async addIssue() {
    const element = this.$$('#addIssueInput') as HTMLInputElement;

    if (element && element.value && element.value.length > 0) {
      const issue = {
        description: (this.$$('#addIssueInput') as HTMLInputElement).value,
        userId: 1,
        type: this.meeting.forUsers
          ? this.IssueTypes.UserIssue
          : this.IssueTypes.ProviderIssue,
        state: 0,
        projectId: 1, //TODO: FIX
      } as IssueAttributes;

      await window.serverApi.postIssue(1, issue);

      this.participantsIssues?.unshift(issue);

      this.participantsIssues = [...this.participantsIssues!];

      this.io.emit('newIssue', issue);

      (this.$$('#addIssueInput') as HTMLInputElement).value = '';
    }
  }

  _processNewIssue(issue: IssueAttributes) {
    this.participantsIssues?.unshift(issue);
    this.participantsIssues = [...this.participantsIssues!];
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
          width: 260px;
          max-width: 260px;
        }

        .voteButton {
          padding-bottom: 8px;
          padding-top: 0;
        }

        .issueName {
          padding: 16px;
        }

        .addCommentInput {
          width: 260px;
        }

        .issueVoting {
          width: 48px;
        }

        .comments {
          margin-top: 32px;
        }

        .comment {
          margin-top: 16px;
          padding: 16px;
          width: 228px;
          max-width: 2228px;
          background-color: #f7f7f7;
        }

        .addNewIssueButton {
          margin-top: 16px;
          margin-bottom: 8px;
        }

        #emoji,
        #emojiLarge {
          --start-unicoder: '❤️';
          --start-unicode: '🙂';
          --star-size: 0.9em;
          cursor: pointer;
          padding: 8px;
        }

        #emojiLarge {
          --star-size: 1.1em;
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
      if (this.isLive) {
        if (state.storyPageIndex != null && this.$$('#storyViewer')) {
          (this.$$('#storyViewer') as CsStory).setIndex(state.storyPageIndex);
        }
        if (state.coreIssueIndex != null) {
          this.coreIssueIndex = state.coreIssueIndex;
        }
        if (state.votingIssueIndex != null) {
          this.votingIssueIndex = state.votingIssueIndex;
        }
        this.selectedTab = state.tabIndex;
      }
    }
  }

  async _scoreIssue(event: CustomEvent) {
    const issue = this.participantsIssues![this.votingIssueIndex];

    //TODO: Fix
    const randomScore = Math.floor(Math.random() * 5) + 1;
    await window.serverApi.scoreIssue(issue.id, randomScore);
  }

  renderIssue(index: number, hideRating = false) {
    let issue: IssueAttributes;
    let showVoting = true;
    let showComments = false;
    let disableVoting = false;
    let hideSubmitComment = false;
    let showNumbers = false;

    issue = this.allIssues![index];
    showComments = true;

    if (this.selectedTab == ScoringTabTypes.ReviewScoreCard) {
      disableVoting = true;
      showComments = false;
    }

    if (this.selectedTab == ScoringTabTypes.Results) {
      hideSubmitComment = true;
    }

    return this.renderIssueHtml(
      issue,
      showVoting,
      disableVoting,
      showComments,
      hideSubmitComment,
      hideRating,
      this.addCoreIssueCommentFromInput,
      this._scoreIssue
    );
  }

  async addCoreIssueComment(comment: CommentAttributes) {
    const issue = this.allIssues![this.coreIssueIndex];

    issue.Comments!.unshift(comment);

    this.allIssues = [...this.allIssues!];
  }

  _processNewComment(comment: CommentAttributes) {
    this.addCoreIssueComment(comment);
  }

  async addCoreIssueCommentFromInput() {
    const issue = this.allIssues![this.coreIssueIndex];

    const comment = {
      content: (this.$$('#addCommentInput') as HTMLInputElement).value,
      userId: 1,
      issueId: issue.id,
      type: 0,
      status: 0,
    } as CommentAttributes;

    await window.serverApi.postIssueComment(issue.id, comment);

    this.addCoreIssueComment(comment);

    this.io.emit('newComment', comment);

    (this.$$('#addCommentInput') as HTMLInputElement).value = '';
  }

  leftCoreIssueArrow() {
    if (this.coreIssueIndex > 0) {
      this.coreIssueIndex -= 1;
      (this.$$('#addCommentInput') as TextArea).value = '';
    }
    this.updateState();
  }

  rightCoreIssueArrow() {
    if (this.coreIssueIndex < this.allIssues!.length - 1) {
      this.coreIssueIndex += 1;
      (this.$$('#addCommentInput') as TextArea).value = '';
    }
    this.updateState();
  }

  leftVotingIssueArrow() {
    if (this.votingIssueIndex > 0) {
      this.votingIssueIndex -= 1;
    }
    this.updateState();
  }

  rightVotingIssueArrow() {
    if (this.votingIssueIndex < this.participantsIssues!.length - 1) {
      this.votingIssueIndex += 1;
    }
    this.updateState();
  }

  renderIssues(title: string, hideRating = false) {
    if (this.allIssues && this.allIssues.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">${title}</div>

        <div class="layout horizontal center-center self-start">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.coreIssueIndex === 0}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_back"
              @click="${this.leftCoreIssueArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderIssue(this.coreIssueIndex)}
          </div>
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.coreIssueIndex >= this.allIssues!.length - 1}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_forward"
              @click="${this.rightCoreIssueArrow}"
            ></mwc-icon-button>
          </div>
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderReviewScoreCard() {
    if (this.allIssues && this.allIssues.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('review')}
        </div>

        <div class="layout vertical center-center">
          ${this.allIssues.map((issue, index) => {
            return html`${this.renderIssue(index, true)}`;
          })}
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderResults() {
    if (this.allIssues && this.allIssues.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('review')}
        </div>

        <div class="layout vertical center-center">
          ${this.allIssues.map((issue, index) => {
            return html`${this.renderIssue(index)}`;
          })}
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
              icon="info_outlined"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('reviewScorecard')}"
              icon="format_list_numbered"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.meeting.forUsers
                ? this.t('viewIssues')
                : this.t('viewIssues')}"
              icon="how_to_vote"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.meeting.forUsers
                ? this.t('scoreIssues')
                : this.t('scoreIssues')}"
              icon="rate_review_outline"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('results')}"
              icon="checklist"
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
      case ScoringTabTypes.Information:
        page = this.renderStory();
        break;
      case ScoringTabTypes.ReviewScoreCard:
        page = this.renderReviewScoreCard();
        break;
      case ScoringTabTypes.ViewIssues:
        page = this.renderIssues(this.t('viewIssues'), true);
        break;
      case ScoringTabTypes.RateIssues:
        page = this.renderIssues(this.t('scoreIssues'));
        break;
      case ScoringTabTypes.Results:
        page = this.renderResults();
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

    if (changedProperties.has('selectedTab')) {
      this.updateState();

      if (this.selectedTab == ScoringTabTypes.Results) {
        this._getAnyParticipantsIssues();
      }
    }

    if (
      (changedProperties.has('participantsIssues') ||
        changedProperties.has('coreIssues')) &&
      this.participantsIssues &&
      this.coreIssues
    ) {
      this.allIssues = this.coreIssues.concat(this.participantsIssues);
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
