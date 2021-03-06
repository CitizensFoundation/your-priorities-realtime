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
import './stars-rating.js';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';
import { CsStory } from '../cs-story/cs-story.js';

import { TextArea } from '@material/mwc-textarea';
import { Snackbar } from '@material/mwc-snackbar';

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
  votingIssueIndex = 0;

  @property({ type: Array })
  coreIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  participantsIssues: Array<IssueAttributes> | undefined;

  constructor() {
    super();
    this.storyNumber = 3;
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
    this.participantsIssues = (await window.serverApi.getSelectedIssues(
      this.meeting.Round!.projectId,
      issueType
    )) as Array<IssueAttributes> | undefined;
  }

  async addIssue() {
    const element = this.$$('#addIssueInput') as HTMLInputElement;

    if (element && element.value && element.value.length > 0) {
      const issue = {
        description: (this.$$('#addIssueInput') as HTMLInputElement).value,
        userId: this.user.id,
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

        @media (max-width: 1024px) {
          mwc-tab-bar {
            width: 100%;
          }
        }

        .header {
          height: 100px;
          font-size: var(--mdc-typegraphy-headline1-font-size, 24px);
        }

        .subjectHeader {
          margin: 32px;
          font-size: 24px;
        }
      `,
    ];
  }

  updateState() {
    if (this.isAdmin) {
      this.facilitatorName = this.user.name;

      this.sendState({
        tabIndex: this.selectedTab,
        isLive: this.isLive,
        storyPageIndex: this.storyPageIndex,
        votingIssueIndex: this.votingIssueIndex,
        coreIssueIndex: this.coreIssueIndex,
        facilitatorName: this.facilitatorName
      } as StateAttributes);
    }

    const rating = this.$$('#emoji') as any;

    if (rating) {
      //      rating.reset();
    }
  }

  _processState(state: StateAttributes) {
    if (!this.isAdmin || state.facilitatorName!=this.user.name) {
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

  async _rateIssue(event: CustomEvent) {
    const issue = this.allIssues![this.coreIssueIndex];
    const rating = event.detail;
    const userType = this.meeting.forUsers ? 1 : 2;

    //issue.userScore = (event.currentTarget as any).rating;

    if (rating != undefined) {
      await window.serverApi.rateIssue(
        issue.id,
        this.meeting.roundId,
        (event.currentTarget as any).rating,
        userType
      );
      this._updateRatings(this.allIssuesHash, userType);
    } else {
      console.error('No rating found from target');
    }
  }

  async voteIssueDown() {
    const issue = this.allIssues![this.coreIssueIndex];

    await window.serverApi.voteIssue(issue.id, -1);
  }

  renderIssue(index: number, hideRating = false, ordered = false) {
    let issue: IssueAttributes;
    let showVoting = true;
    let showComments = false;
    let disableVoting = false;
    let hideSubmitComment = false;
    let showNumbers = false;
    let toggleCommentsMode = false;
    let disableRating = false;

    if (ordered) {
      issue = this.orderedAllIssues![index];
    } else {
      issue = this.allIssues![index];
    }

    showComments = true;

    if (this.selectedTab == ScoringTabTypes.ReviewScoreCard) {
      disableVoting = true;
      showComments = false;
    }

    if (this.selectedTab == ScoringTabTypes.Results) {
      hideSubmitComment = false;
      disableRating = true;
    }

    if (this.selectedTab == ScoringTabTypes.ViewIssues) {
      hideRating = true;
      toggleCommentsMode = true;
    }

    if (this.selectedTab == ScoringTabTypes.RateIssues) {
      toggleCommentsMode = true;
    }

    if (this.selectedTab == ScoringTabTypes.Results) {
      toggleCommentsMode = true;
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
      this._rateIssue,
      toggleCommentsMode,
      disableRating
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
    this.currentCommentInput = undefined;

    const issue = this.allIssues![this.coreIssueIndex];

    this.completeAddingIssueComment(issue, this.meeting.forUsers ? 1 : 2);
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
    if (this.votingIssueIndex < this.allIssues!.length - 1) {
      this.votingIssueIndex += 1;
    }
    this.updateState();
  }

  renderIssues(title: string, hideRating = false) {
    if (this.allIssues && this.allIssues.length > 0) {
      return html`
        <div class="layout horizontal center-center sliderContainer">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.coreIssueIndex === 0 || (!this.isAdmin && this.isLive)}"
              icon="arrow_back"
              @click="${this.leftCoreIssueArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderIssue(this.coreIssueIndex)}
          </div>
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${(this.coreIssueIndex >= this.allIssues!.length - 1) || (!this.isAdmin && this.isLive)}"
              icon="arrow_forward"
              @click="${this.rightCoreIssueArrow}"
            ></mwc-icon-button>
          </div>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderReviewScoreCard() {
    if (this.allIssues && this.allIssues.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.allIssues.map((issue, index) => {
            return html`${this.renderIssue(index, true)}`;
          })}
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderResults() {
    if (this.orderedAllIssues && this.orderedAllIssues.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.orderedAllIssues.map((issue, index) => {
            return html`${this.renderIssue(index, false, true)}`;
          })}
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderTabs() {
    return html`
      <div class="layout vertical center-center">
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            ?hidden="${!this.isAdmin}"
            .label="${this.t('information')}"
            icon="info_outlined"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 1}"
            .label="${this.t('review')}"
            icon="format_list_numbered"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 2}"
            .label="${this.meeting.forUsers
              ? this.t('viewIssues')
              : this.t('viewIssues')}"
            icon="how_to_vote"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 3}"
            .label="${this.meeting.forUsers
              ? this.t('scoreIssues')
              : this.t('scoreIssues')}"
            icon="rate_review_outline"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 4}"
            .label="${this.t('results')}"
            icon="checklist"
            stacked
          ></mwc-tab>
        </mwc-tab-bar>
      </div>
    `;
  }

  renderCurrentTabPage(): TemplateResult | {} | undefined {
    let page: TemplateResult | {} | undefined;

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
    return html` ${this.renderTabs()} ${this.renderCurrentTabPage()} `;
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTab')) {
      this.updateState();

      if (this.selectedTab == ScoringTabTypes.Results) {
        this._getAnyParticipantsIssues();
      }

      if (this.selectedTab == ScoringTabTypes.RateIssues) {
        this.coreIssueIndex = 0;
      }
    }

    if (
      (changedProperties.has('participantsIssues') ||
        changedProperties.has('coreIssues')) &&
      this.participantsIssues &&
      this.coreIssues
    ) {
      this.allIssues = this.coreIssues.concat(this.participantsIssues);
      this.allIssuesHash = {};
      for (let i = 0; i < this.allIssues.length; i++) {
        this.allIssuesHash[this.allIssues[i].id] = this.allIssues[i];
      }
      this._updateRatings(this.allIssuesHash, this.meeting.forUsers ? 1 : 2);
    }

    if (changedProperties.has('allIssues') && this.allIssues) {
      this._updateOrderedIssues();
    }
  }

  _updateOrderedIssues() {
    this.orderedAllIssues = [...this.allIssues!];
    this.orderedAllIssues = this.orderedAllIssues.sort(function (a, b) {
      return a.score! - b.score!;
    });
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
