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
import { TextArea } from '@material/mwc-textarea';
import { Snackbar } from '@material/mwc-snackbar';

import { random, sortBy } from 'lodash-es';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';
import { CsStory } from '../cs-story/cs-story.js';

export const CreateCardTabTypes: Record<string, number> = {
  Information: 0,
  ReviewCoreIssues: 1,
  CreateLocal: 2,
  Voting: 3,
  Review: 4,
};

@customElement('cs-meeting-create-card')
export class CsMeetingCreateCard extends CsMeetingBase {
  @property({ type: Number })
  coreIssueIndex = 0;

  @property({ type: Number })
  votingIssueIndex = 0;

  @property({ type: Array })
  coreIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  participantsIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  orderedParticipantsIssues: Array<IssueAttributes> | undefined;

  @property({ type: String })
  currentCommentInput: string | undefined;

  @property({ type: String })
  currentIssueInput: string | undefined;

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
    this.currentIssueInput = undefined;

    const element = this.$$('#addIssueInput') as HTMLInputElement;

    debugger;
    if (element && element.value && element.value.length > 0) {
      const issue = {
        description: (this.$$('#addIssueInput') as HTMLInputElement).value,
        userId: 1,
        type: this.meeting.forUsers
          ? this.IssueTypes.UserIssue
          : this.IssueTypes.ProviderIssue,
        state: 0,
        standard: "",
        roundId: 1,
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
          width: 296px;
          margin-bottom: 24px;
          padding-bottom: 8px;
        }

        .issueCardNotUsed {
          background-color: #fefefe;
          background: #fefefe;
          background: radial-gradient(
              circle at 146px 155px,
              transparent 35px,
              #fefefe 0
            )
            0 0;
          background-size: 100% 100%;
          background-repeat: no-repeat;

        }

        .voteButton {
          padding-bottom: 8px;
          padding-top: 0;
        }

        .issueName {
          padding: 16px;
          font-weight: bold;
          padding-bottom: 4px;
          padding-top: 4px;
        }

        .issueStandard {
          padding: 16px;
          padding-top: 0;
        }

        .addCommentInput {
          margin-top: 0;
          width: 292px;
        }

        .issueVoting {
          width: 48px;
        }

        .issue {
          margin-top: 8px;
          width: 290px;
          max-width: 290px;
          margin-bottom: 8px;
          background-color: #fefefe;
          overflow: hidden;
        }

        .issueDescription {
          z-index: 5;
        }

        .comments {
          margin-top: 16px;
        }

        .comment {
          margin-top: 16px;
          padding: 16px;
          width: 280px;
          max-width: 280px;
          margin-bottom: 24px;
          background-color: #fefefe;
          background: #fefefe;
          background: radial-gradient(
              circle at 137px 0,
              transparent 35px,
              #fefefe 0
            )
            0 0;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          padding-bottom: 0;
          padding-left: 0;
          padding-right: 0;
        }

        .addNewIssueButton {
          margin-top: 16px;
          margin-bottom: 32px;
        }

        .votingNumber {
          margin-left: -4px;
          margin-top: 14px;
          margin-right: 0;
          padding-right: 0;
        }

        .votingContainer {
          position: relative;
          height: 100%;
        }

        .voting {
          position: absolute;
          bottom: -104px;
          right: -28px;
          margin-right: 0;
        }

        mwc-textarea.addCommentInput,
        mwc-textfield {
        }

        .comment {
          margin-top: 24px;
        }

        .innerContainer {
          position: relative;
          width: 100%;
        }

        .commentContent {
          font-size: 14px;
          margin-top: 38px;
          padding-left: 16px;
          padding-right: 16px;
          overflow: hidden;
        }

        .commentLikeButton {
          margin-right: 0px;
        }

        .commentVotingNumber {
          margin-top: 16px;
          padding-left: 8px;
          padding-right: 0px;
          font-size: 15px;
        }

        .avatarIcon {
          position: absolute;
          top: -80px;
          left: 110px;
          --mdc-icon-size: 54px;
        }

        .bookmarkIcon {
          --mdc-icon-size: 28px;
          padding: 8px;
          padding-top: 12px;
          color: #555;
        }

        .bookmarkIconStronger {
          color: #333;
        }

        .largePerson {
          width: 200px;
          height: 100px;
        }

        .issueRel {
          position: relative;
        }

        .issueDescription {
          padding: 16px;
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

  renderCreateLocal() {
    return html`
      <div ?hidden="${this.isAdmin}" class="subjectHeader">
        ${this.meeting.forUsers
          ? this.t('createScoreCard')
          : this.t('createSelfAssessment')}
      </div>

      <div class="layout vertical center-center comments">
        <mwc-textarea
          id="addIssueInput"
          charCounter
          outlined
          class="addCommentInput"
          maxLength="200"
          @keyup="${this.setIssueInput}"
          rows="4"
          .label="${this.t('yourIssue')}"
        ></mwc-textarea>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            ?disabled="${!this.currentIssueInput}"
            class="layout addNewIssueButton"
            @click="${this.addIssue}"
            .label="${this.t('addIssue')}"
          ></mwc-button>
        </div>
      </div>

      <div class="layout vertical center-center">
        ${this.participantsIssues?.map(issue => {
          return html`
            <div class="issue shadow-elevation-2dp shadow-transition">
              <div class="layout horizontal center-center">
                <mwc-icon class="bookmarkIcon">${ this.meeting.forUsers ? "face" : "local_hospital"}</mwc-icon>
              </div>
              <div class="issueDescription">${issue.description}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  async voteIssueUp() {
    const issue = this.participantsIssues![this.votingIssueIndex];

    await window.serverApi.voteIssue(issue.id, 1);
  }

  async voteIssueDown() {
    const issue = this.participantsIssues![this.votingIssueIndex];

    await window.serverApi.voteIssue(issue.id, -1);
  }

  renderIssue(index: number) {
    let issue: IssueAttributes;
    let showVoting = false;
    let showComments = false;
    let disableVoting = false;
    let showNumbers = false;

    if (this.selectedTab == CreateCardTabTypes.Voting) {
      issue = this.participantsIssues![index];
      showVoting = true;
    } else if (this.selectedTab == CreateCardTabTypes.Review) {
      issue = this.orderedParticipantsIssues![index];
      showVoting = true;
      disableVoting = true;
      showNumbers = true;
    } else {
      issue = this.coreIssues![index];
      showComments = true;
    }

    return html`
      <div
        class="issueCard shadow-elevation-2dp shadow-transition layout horizontal"
      >
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <mwc-icon class="bookmarkIcon bookmarkIconStronger">center_focus_weak</mwc-icon>
          </div>
          <div class="issueName">${issue.description}</div>
          <div class="issueStandard">${issue.standard}</div>
          <div class="layout horizontal" ?hidden="${!showVoting}">
            <mwc-icon-button
              icon="arrow_upward"
              ?hidden="${disableVoting}"
              class="voteButton"
              @click="${this.voteIssueUp}"
              .label="${this.t('voteUp')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">
              ${issue.counterUpVotes}
            </div>
            <mwc-icon-button
              icon="arrow_downward"
              ?hidden="${disableVoting}"
              @click="${this.voteIssueDown}"
              class="voteButton"
              .label="${this.t('voteDown')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">
              ${issue.counterDownVotes}
            </div>
            <div class="flex"></div>
          </div>
        </div>
      </div>

      <div
        class="layout vertical center-center comments"
        ?hidden="${!showComments}"
      >
        <mwc-textarea
          id="addCommentInput"
          charCounter
          class="addCommentInput"
          maxLength="300"
          outlined
          @keyup="${this.setCommentInput}"
          rows="4"
          id="coreIssueInput"
          .label="${this.t('yourComment')}"
        ></mwc-textarea>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            ?disabled="${!this.currentCommentInput}"
            class="layout addNewIssueButton"
            @click="${this.addCoreIssueCommentFromInput}"
            .label="${this.t('addComment')}"
          ></mwc-button>
        </div>
      </div>

      <div class="layout vertical">
        ${issue.Comments?.map(comment => {
          return html`
            <div class="comment">
              <div class="innerContainer">
                <div class="commentContent">${comment.content}</div>
                <mwc-icon
                  class="avatarIcon"
                  style="color:${comment.User?.selectedAvatarColor}"
                  >${comment.User?.selectedAvatar}</mwc-icon
                >
                <div class="layout horizontal self-end">
                  <div class="flex"></div>
                  <div class="commentVotingNumber">
                    ${this.getRandomNumber()}
                  </div>
                  <mwc-icon-button
                    icon="arrow_upward"
                    ?disabled="${disableVoting}"
                    @click="${this.voteIssueDown}"
                    class="commentLikeButton"
                    .label="${this.t('voteDown')}"
                  ></mwc-icon-button>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  setCommentInput() {
    this.currentCommentInput = (this.$$(
      '#addCommentInput'
    ) as HTMLInputElement).value;
  }

  setIssueInput() {
    this.currentIssueInput = (this.$$(
      '#addIssueInput'
    ) as HTMLInputElement).value;
  }

  hsvToRgb(h: any, s: any, v: any) {
    var chroma = (s * v) / 10000,
      min = v / 100 - chroma,
      hdash = h / 60,
      x = chroma * (1 - Math.abs((hdash % 2) - 1)),
      r = 0,
      g = 0,
      b = 0;

    switch (true) {
      case hdash < 1:
        r = chroma;
        g = x;
        break;
      case hdash < 2:
        r = x;
        g = chroma;
        break;
      case hdash < 3:
        g = chroma;
        b = x;
        break;
      case hdash < 4:
        g = x;
        b = chroma;
        break;
      case hdash < 5:
        r = x;
        b = chroma;
        break;
      case hdash <= 6:
        r = chroma;
        b = x;
        break;
    }

    r += min;
    g += min;
    b += min;

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  getRandomColor() {
    var golden_ratio_conjugate = 0.618033988749895,
      h = ((Math.random() + golden_ratio_conjugate) % 1) * 360,
      rgb = this.hsvToRgb(h, 80, 55);
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 25) + 1;
  }

  getRandomIcon() {
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
      'account_circle'
    ];
    let number = Math.floor(Math.random() * arr.length)+1;
    console.error( arr[number-1])
    return arr[number-1];
  }

  async addCoreIssueComment(comment: CommentAttributes) {
    const issue = this.coreIssues![this.coreIssueIndex];

    issue.Comments!.unshift(comment);

    this.coreIssues = [...this.coreIssues!];
  }

  _processNewComment(comment: CommentAttributes) {
    this.addCoreIssueComment(comment);
  }

  async addCoreIssueCommentFromInput() {
    this.currentCommentInput = undefined;
    const issue = this.coreIssues![this.coreIssueIndex];

    const comment = {
      content: (this.$$('#addCommentInput') as HTMLInputElement).value,
      userId: window.app.user!.id,
      issueId: issue.id,
      User: window.app.user!,
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
    if (this.coreIssueIndex < this.coreIssues!.length - 1) {
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

  renderReviewCoreIssues() {
    if (this.coreIssues && this.coreIssues.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('reviewCoreIssues')}
        </div>

        <div class="layout horizontal center-center">
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
              ?hidden="${this.coreIssueIndex >= this.coreIssues!.length - 1}"
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

  renderVoting() {
    if (this.participantsIssues && this.participantsIssues.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('voting')}
        </div>

        <div class="layout horizontal center-center">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.votingIssueIndex === 0}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_back"
              @click="${this.leftVotingIssueArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderIssue(this.votingIssueIndex)}
          </div>
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.votingIssueIndex >=
              this.participantsIssues!.length - 1}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_forward"
              @click="${this.rightVotingIssueArrow}"
            ></mwc-icon-button>
          </div>
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderReview() {
    if (
      this.orderedParticipantsIssues &&
      this.orderedParticipantsIssues.length > 0
    ) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('review')}
        </div>

        <div class="layout vertical center-center">
          ${this.orderedParticipantsIssues.map((issue, index) => {
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
              .label="${this.t('reviewCoreIssues')}"
              icon="pending_actions"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.meeting.forUsers
                ? this.t('createScoreCard')
                : this.t('createSelfAssessment')}"
              icon="${this.meeting.forUsers ? "face" : "local_hospital"}"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('voting')}"
              icon="how_to_vote"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('review')}"
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
      case CreateCardTabTypes.Information:
        page = this.renderStory();
        break;
      case CreateCardTabTypes.ReviewCoreIssues:
        page = this.renderReviewCoreIssues();
        break;
      case CreateCardTabTypes.CreateLocal:
        page = this.renderCreateLocal();
        break;
      case CreateCardTabTypes.Voting:
        page = this.renderVoting();
        break;
      case CreateCardTabTypes.Review:
        page = this.renderReview();
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

      if (
        this.selectedTab == CreateCardTabTypes.Review ||
        this.selectedTab == CreateCardTabTypes.Voting
      ) {
        this._getAnyParticipantsIssues();
      }
    }

    if (
      changedProperties.has('participantsIssues') &&
      this.participantsIssues
    ) {
      this.orderedParticipantsIssues = sortBy(this.participantsIssues, item => {
        return item.counterDownVotes - item.counterUpVotes;
      });
    }
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
