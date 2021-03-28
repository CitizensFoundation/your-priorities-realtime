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
import '@material/mwc-checkbox';
import { Checkbox } from '@material/mwc-checkbox';

import '@material/mwc-formfield';

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

    if (element && element.value && element.value.length > 0) {
      const issue = {
        description: (this.$$('#addIssueInput') as HTMLInputElement).value,
        userId: 1,
        type: this.meeting.forUsers
          ? this.IssueTypes.UserIssue
          : this.IssueTypes.ProviderIssue,
        state: 0,
        standard: '',
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

        .votingContainer {
          align-items: flex-start !important;
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
          ${this.user
            ? html`
                <mwc-button
                  raised
                  ?disabled="${!this.currentIssueInput}"
                  class="layout addNewIssueButton"
                  @click="${this.addIssue}"
                  .label="${this.t('addIssue')}"
                  >${this.renderAvatarButtonIcon()}</mwc-button
                >
              `
            : nothing}
        </div>
      </div>

      <div class="layout vertical center-center">
        ${this.participantsIssues?.map(issue => {
          return html`
            <div class="issue shadow-elevation-2dp shadow-transition">
              <div class="layout horizontal center-center">
                <mwc-icon class="bookmarkIcon"
                  >${this.meeting.forUsers ? 'face' : 'groups'}</mwc-icon
                >
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

  async issueSelectionChanged(checkbox: Checkbox, issueId: number) {
    await window.serverApi.setSelectedStatus(issueId, checkbox.checked);
  }

  renderIssueHtml(
    issue: IssueAttributes,
    showVoting: boolean,
    disableVoting: boolean,
    showNumbers: boolean,
    showSelectionCheckbox: boolean,
    showComments: boolean
  ) {
    return html` <div
        class="issueCard shadow-elevation-2dp shadow-transition layout horizontal"
      >
        <div class="layout vertical otherContainer">
          <div class="layout horizontal center-center">
            <mwc-icon class="bookmarkIcon bookmarkIconStronger"
              >${this.getIconForIssueType(issue)}</mwc-icon
            >
          </div>
          <div class="issueName" ?has-standard="${issue.standard}">${issue.description}</div>
          <div class="issueStandard">${issue.standard}</div>
          <div class="layout horizontal" ?hidden="${!showVoting}">
            <div class="flex"></div>
            <mwc-icon-button
              icon="arrow_upward"
              ?hidden="${!showVoting}"
              ?disabled="${disableVoting}"
              class="voteButton"
              @click="${this.voteIssueUp}"
              .label="${this.t('voteUp')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">
              ${issue.counterUpVotes}
            </div>
            <mwc-icon-button
              icon="arrow_downward"
              ?hidden="${!showVoting}"
              ?disabled="${disableVoting}"
              @click="${this.voteIssueDown}"
              class="voteButton"
              .label="${this.t('voteDown')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">
              ${issue.counterDownVotes}
            </div>
            <div class="flex"></div>
            <mwc-checkbox
              ?hidden="${!this.isAdmin || !showSelectionCheckbox}"
              class="issueConfirmation"
              ?checked="${issue.selected}"
              @change="${(event: CustomEvent) =>
                this.issueSelectionChanged(
                  event.srcElement as Checkbox,
                  issue.id
                )}"
              value="closed"
              name="accessRadioButtons"
            >
            </mwc-checkbox>
          </div>
        </div>
      </div>

      ${this.renderComments(
        issue,
        showComments,
        disableVoting,
        this.addCoreIssueCommentFromInput,
        this.voteCommentUp
      )}`;
  }

  renderIssue(index: number) {
    let issue: IssueAttributes;
    let showVoting = false;
    let showComments = false;
    let disableVoting = false;
    let showNumbers = false;
    let showSelectionCheckbox = false;

    if (this.selectedTab == CreateCardTabTypes.Voting) {
      issue = this.participantsIssues![index];
      showVoting = true;
    } else if (this.selectedTab == CreateCardTabTypes.Review) {
      issue = this.orderedParticipantsIssues![index];
      showVoting = true;
      disableVoting = true;
      showNumbers = true;
      showSelectionCheckbox = true;
    } else {
      issue = this.coreIssues![index];
      showComments = true;
    }

    return this.renderIssueHtml(
      issue,
      showVoting,
      disableVoting,
      showNumbers,
      showSelectionCheckbox,
      showComments
    );
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
      'account_circle',
    ];
    let number = Math.floor(Math.random() * arr.length) + 1;
    console.error(arr[number - 1]);
    return arr[number - 1];
  }

  _processNewComment(comment: CommentAttributes) {
    this.addCoreIssueComment(comment);
  }

  async addCoreIssueCommentFromInput() {
    this.currentCommentInput = undefined;

    const issue = this.coreIssues![this.coreIssueIndex];

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
        <div class="layout horizontal center-center votingContainer">
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
        <div class="layout horizontal center-center votingContainer">
          <div class="issueBack issueVoting layout horizontal">
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
          .label="${this.t('reviewCoreIssues')}"
          icon="center_focus_weak"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=2}"
          .label="${this.meeting.forUsers
            ? this.t('createScoreCard')
            : this.t('createSelfAssessment')}"
          icon="${this.meeting.forUsers ? 'face' : 'groups'}"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=3}"
          .label="${this.t('voting')}"
          icon="how_to_vote"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=4}"
          .label="${this.t('review')}"
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
    return html` ${this.renderTabs()} ${this.renderCurrentTabPage()} `;
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
