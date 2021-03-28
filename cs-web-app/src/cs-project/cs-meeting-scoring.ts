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
  orderedAllIssues: Array<IssueAttributes> | undefined;

  @property({ type: Object })
  allIssuesHash: Record<number,IssueAttributes> = {};

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

        #emoji,
        #emojiLarge {
          --star-size: 0.9em;
          cursor: pointer;
          padding: 2px;
        }

        #emojiLarge {
          --star-size: 1.1em;
        }

        .ratingContainer {
          margin-left: 32px;
          padding-left: 4px;
          padding-right: 4px;
          border-radius: 20px;
          margin-bottom: 14px;
          background-color: #eeeeee;
          border: 2px solid #eeeeee;
        }

        stars-rating {
          cursor: pointer;
          margin-bottom: 2px;
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

    const rating = this.$$("#emoji") as any;

    if (rating) {
//      rating.reset();
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

  async _rateIssue(event: CustomEvent) {
    const issue = this.allIssues![this.coreIssueIndex];
    const rating = event.detail;

    if (rating!=undefined) {
      await window.serverApi.rateIssue(issue.id, this.meeting.roundId, (event.currentTarget as any).rating);
    } else {
      console.error("No rating found from target")
    }
  }

  renderIssueHtml(
    issue: IssueAttributes,
    showVoting: boolean,
    disableVoting: boolean,
    showComments: boolean,
    hideSubmitComment: boolean,
    hideRating: boolean,
    addCommentFunction: Function | undefined = undefined,
    scoreIssueFunction: Function | undefined = undefined,
    toggleCommentsMode = false
  ) {
    return html`
      <div
        class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
      >
        <div class="layout vertical otherContainer">
          <div class="layout horizontal center-center">
            <mwc-icon class="bookmarkIcon bookmarkIconStronger">${this.getIconForIssueType(issue)}</mwc-icon>
          </div>

          <div class="issueName" ?has-standard="${issue.standard}">${issue.description}</div>
          <div class="issueStandard">${issue.standard}</div>
          <div class="layout horizontal" ?hidden="${!showVoting}">
            <div class="layout horizontal center-center ratingContainer">
              <stars-rating
                id="emoji"
                ?hidden="${hideRating}"
                .rating="${issue.score}"
                numstars="5"
                manual
                @rating-changed="${scoreIssueFunction}"
              ></stars-rating>
            </div>
          </div>
        </div>
      </div>

      ${this.renderComments(
        issue,
        showComments,
        disableVoting,
        this.addCoreIssueCommentFromInput,
        this.voteCommentUp,
        toggleCommentsMode
      )}`;
  }


  async voteIssueDown() {
    const issue = this.allIssues![this.coreIssueIndex];

    await window.serverApi.voteIssue(issue.id, -1);
  }

  renderIssue(index: number, hideRating = false) {
    let issue: IssueAttributes;
    let showVoting = true;
    let showComments = false;
    let disableVoting = false;
    let hideSubmitComment = false;
    let showNumbers = false;
    let toggleCommentsMode = false;

    issue = this.allIssues![index];
    showComments = true;

    if (this.selectedTab == ScoringTabTypes.ReviewScoreCard) {
      disableVoting = true;
      showComments = false;
    }

    if (this.selectedTab == ScoringTabTypes.Results) {
      hideSubmitComment = false;
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
      toggleCommentsMode
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

    this.completeAddingIssueComment(issue);
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
    if (this.orderedAllIssues && this.orderedAllIssues.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.orderedAllIssues.map((issue, index) => {
            return html`${this.renderIssue(index)}`;
          })}
        </div>
      `;
    } else {
      return html``;
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
          ?hidden="${!this.isAdmin && this.selectedTab!=1}"
          .label="${this.t('reviewScorecard')}"
          icon="format_list_numbered"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=2}"
          .label="${this.meeting.forUsers
            ? this.t('viewIssues')
            : this.t('viewIssues')}"
          icon="how_to_vote"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=3}"
          .label="${this.meeting.forUsers
            ? this.t('scoreIssues')
            : this.t('scoreIssues')}"
          icon="rate_review_outline"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=4}"
          .label="${this.t('results')}"
          icon="checklist"
          stacked
        ></mwc-tab>
      </mwc-tab-bar>
    </div>
  `;
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
      ${this.renderTabs()} ${this.renderCurrentTabPage()}
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

    if (changedProperties.has('allIssues') && this.allIssues) {
      this.allIssuesHash = {};
      for (let i=0;i<this.allIssues.length;i++)  {
        this.allIssuesHash[this.allIssues[i].id] = this.allIssues[i];
      }
    }

    if (
      (changedProperties.has('participantsIssues') ||
        changedProperties.has('coreIssues')) &&
      this.participantsIssues &&
      this.coreIssues
    ) {
      this.allIssues = this.coreIssues.concat(this.participantsIssues);
      this._getRatings();
    }


    if (
      changedProperties.has('allIssues') &&
      this.allIssues
    ) {
      this.orderedAllIssues = this.allIssues.sort(function(a, b){return a.score - b.score});
    }
  }

  async _getRatings() {
    const ratings = (await window.serverApi.getRatings(
      this.meeting.Round!.projectId
    )) as Array<IssueAttributes> | undefined;

    if (ratings && this.allIssuesHash) {
      for (let i=0;i<ratings.length;i++)  {
        this.allIssuesHash[ratings[i].id].score = parseFloat((ratings[i] as any).avgRating);
      }
    }

    this.allIssues = [...this.allIssues!];
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}