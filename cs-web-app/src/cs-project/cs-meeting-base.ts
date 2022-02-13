/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-textarea';

import { Radio } from '@material/mwc-radio';

import '@material/mwc-formfield';
import '@material/mwc-button';
import '@material/mwc-checkbox';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import '../cs-story/cs-story.js';
import { IconButton } from '@material/mwc-icon-button';

@customElement('cs-meeting-base')
export class CsMeetingBase extends YpBaseElement {
  @property({ type: Number })
  storyPageIndex: number | undefined;

  @property({ type: Object })
  meeting!: MeetingAttributes;

  @property({ type: Object })
  user!: UserAttributes;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  isLive = false;

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: String })
  currentCommentInput: string | undefined;

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
  currentIssueInput: string | undefined;

  @property({ type: Array })
  orderedAllIssues: Array<IssueAttributes> | undefined;

  @property({ type: Object })
  allIssuesHash: Record<number, IssueAttributes> = {};

  @property({ type: Array })
  allIssues: Array<IssueAttributes> | undefined;

  @property({ type: Number })
  storyNumber!: number;

  roomName: string | undefined;

  socket: any | undefined;

  io: any | undefined;

  stateListener: any | undefined;

  constructor() {
    super();
  }

  IssueTypes: Record<string, number> = {
    CoreIssue: 0,
    UserIssue: 1,
    ProviderIssue: 2,
    AllIssues: -1,
  };

  _processState(state: StateAttributes) {
    this.isLive = state.isLive;
  }

  setCommentInput() {
    this.currentCommentInput = (this.$$(
      '#addCommentInput'
    ) as HTMLInputElement).value;
  }

  getIconForIssueType(issue: IssueAttributes) {
    if (issue.type == this.IssueTypes.CoreIssue) {
      return 'center_focus_weak';
    } else if (issue.type == this.IssueTypes.UserIssue) {
      return 'face';
    } else if (issue.type == this.IssueTypes.ProviderIssue) {
      return 'groups';
    }
  }

  async _updateRatings(
    allIssuesHash: Record<number, IssueAttributes>,
    userType: 1 | 2 | undefined = undefined
  ) {
    const ratings = (await window.serverApi.getRatings(
      this.meeting.Round!.projectId
    )) as Array<GetRatingsAttributes> | undefined;

    if (ratings && allIssuesHash) {
      for (let i = 0; i < ratings.length; i++) {
        if (allIssuesHash[ratings[i].id]) {
          let count = 0;
          let totalRating = 0;
          for (let n = 0; n < ratings[i].Ratings.length; n++) {
            if (!userType || ratings[i].Ratings[n].userType == userType) {
              count++;
              totalRating += ratings[i].Ratings[n].value;
              if (this.user.id === ratings[i].Ratings[n].userId) {
                allIssuesHash[ratings[i].id].userScore =
                  ratings[i].Ratings[n].value;
              }
            }
          }
          if (count > 0 && totalRating > 0) {
            allIssuesHash[ratings[i].id].score = totalRating / count;
          } else {
            allIssuesHash[ratings[i].id].score = 0;
          }
        }
      }
    } else {
      console.error("Can't find ratings index: ");
    }

    this.allIssues = [...this.allIssues!];
  }

  sendState(state: StateAttributes) {
    //console.error(state);
    this.io.emit('meetingState', state);
  }

  //TODO: Fix storyPageIndex where you go live, then offline, move to another story page, go live and state doesn't update
  updateState() {
    this.sendState({
      tabIndex: this.selectedTab,
      isLive: this.isLive,
    } as StateAttributes);
  }

  _setupSockets() {
    this.io = io({
      query: {
        meetingId: this.meeting.id,
      },
    });

    this.io.on('meetingState', (...args: any) => {
      //console.error(args);
      if (this.isAdmin) {
        this.isLive = (args[0] as StateAttributes).isLive;
      } else {
        this._processState(args[0] as StateAttributes);
      }
    });

    this.io.on('newComment', (...args: any) => {
      //console.error(args);
      this._processNewComment(args[0] as CommentAttributes);
    });

    this.io.on('newAction', (...args: any) => {
      //console.error(args);
      this._processNewAction(args[0] as ActionAttributes);
    });

    this.io.on('newIssue', (...args: any) => {
      //console.error(args);
      this._processNewIssue(args[0] as IssueAttributes);
    });

    this.io.on('newVoteComment', (...args: any) => {
      //console.error(args);
      this._processNewCommentVote(args[0] as CommentAttributes);
    });
  }

  _closeSockets() {
    //TODO
  }

  _processNewComment(comment: CommentAttributes) {}

  _processNewIssue(issue: IssueAttributes) {}

  _processNewAction(action: ActionAttributes) {}

  setStoryIndex(event: CustomEvent) {
    if (this.isAdmin && this.isLive) {
      this.storyPageIndex = event.detail as number;
      this.updateState();
    }
  }

  _processNewCommentVote(comment: CommentAttributes) {
    if (this.coreIssues) {
      loop1: for (let i = 0; i < this.coreIssues.length; i++) {
        if (this.coreIssues[i].Comments) {
          for (let n = 0; n < this.coreIssues[i].Comments!.length; n++) {
            if (this.coreIssues[i].Comments![n].id == comment.id) {
              this.coreIssues[i].Comments![n] = comment;
              this.coreIssues = [...this.coreIssues];
              break loop1;
            }
          }
        }
      }
    }
    if (this.participantsIssues) {
      loop2: for (let i = 0; i < this.participantsIssues.length; i++) {
        if (this.participantsIssues[i].Comments) {
          for (
            let n = 0;
            i < this.participantsIssues[i].Comments!.length;
            n++
          ) {
            if (this.participantsIssues[i].Comments![n].id == comment.id) {
              this.participantsIssues[i].Comments![n] = comment;
              this.participantsIssues = [...this.participantsIssues];
              break loop2;
            }
          }
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupSockets();
    this.addGlobalListener('cs-live', this._liveChanged.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener('cs-live', this._liveChanged.bind(this));
    this._closeSockets();
  }

  // DATA PROCESSING

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

        .sendEmailContainer {
          padding: 16px;
          margin: 16px;
        }

        .liveButton {
          font-size: 18px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .issueName[has-standard] {
          font-weight: bold;
        }

        .issueCard {
          background-color: var(--mdc-theme-surface);
          margin: 8px;
          width: 296px;
          margin-bottom: 24px;
        }

        .issueCard[comments-hidden] {
          margin-bottom: 16px;
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
          padding-top: 0;
        }

        .issueName {
          padding: 16px;
          padding-bottom: 8px;
          padding-top: 12px;
          text-align: center;
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
          vertical-align: top;
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

        mwc-button {
          --mdc-theme-primary: #fff;
          --mdc-theme-on-primary: #000;
          --mdc-typography-button-font-size: 15px;
        }

        .buttonIcon {
          margin-left: 6px;
          color: var(--cs-avatar-color, #000);
        }

        .otherContainer {
          width: 100%;
        }

        .issueConfirmation {
          --mdc-theme-secondary: #000;
        }

        .commentToggleIcons {
          --mdc-icon-size: 36px;
          margin-top: 0;
          padding-top: 0;
          margin-bottom: 16px;
        }

        .commentsOpenClose {
          padding-top: 16px;
          padding-right: 4px;
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

        .sliderContainer {
          align-items: flex-start !important;
        }

        mwc-textarea {
          --mdc-shape-small: 20px;
        }

        .issueImage {
          width: 120px;
          height: 68px;
          margin-top: 16px;
        }
      `,
    ];
  }

  async completeAddingIssueComment(issue: IssueAttributes) {
    const comment = {
      content: (this.$$('#addCommentInput') as HTMLInputElement).value,
      userId: this.user!.id,
      issueId: issue.id,
      User: this.user!,
      type: 0,
      status: 0,
    } as CommentAttributes;

    const newComment = await window.serverApi.postIssueComment(
      issue.id,
      comment
    );

    this.addCoreIssueComment(newComment);

    this.io.emit('newComment', newComment);

    (this.$$('#addCommentInput') as HTMLInputElement).value = '';
  }

  async addCoreIssueComment(comment: CommentAttributes) {
    const issue = this.coreIssues![this.coreIssueIndex];

    issue.Comments!.unshift(comment);

    this.coreIssues = [...this.coreIssues!];
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('isLive')) {
      this.fire('yp-set-live-status', this.isLive);
    }
  }

  _liveChanged(event: CustomEvent) {
    this.isLive = event.detail;
    this.updateState();
  }

  async voteCommentUp(comment: CommentAttributes, event: CustomEvent) {
    const updatedComment = await window.serverApi.voteComment(comment.id, 1);
    this.io.emit('newVoteComment', updatedComment);
    const el = event.target as HTMLInputElement;
    el.blur();
    comment.counterUpVotes += 1;
    this.requestUpdate();
  }

  _toggleCommentsForIssue(issueId: number, button: IconButton) {
    const input = this.$$(`#issue${issueId}inputComments`);

    if (input) input.hidden = !input.hidden;

    const output = this.$$(`#issue${issueId}outputComments`);

    if (output) output.hidden = !output.hidden;

    if (button.icon == 'keyboard_arrow_right') {
      button.icon = 'keyboard_arrow_down';
    } else {
      button.icon = 'keyboard_arrow_right';
    }

    button.blur();
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
    toggleCommentsMode = false,
    disableRating = true
  ) {
    return html` <div
        class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
        ?comments-hidden="${!showComments}"
      >
        <div class="layout vertical otherContainer">
          <div class="layout horizontal center-center">
            ${issue.imageUrl != null
              ? html`
                  <div class="layout vertical center-center">
                    <img class="issueImage" src="${issue.imageUrl!}" />
                  </div>
                `
              : html`
                  <div class="layout horizontal center-center">
                    <mwc-icon class="bookmarkIcon bookmarkIconStronger"
                      >${this.getIconForIssueType(issue)}</mwc-icon
                    >
                  </div>
                `}
          </div>

          <div class="issueName" ?has-standard="${issue.standard}">
            ${issue.description}
          </div>
          <div class="issueStandard">${issue.standard}</div>
          <div class="layout horizontal" ?hidden="${!showVoting}">
            <div class="layout horizontal center-center ratingContainer">
              <stars-rating
                id="emoji"
                ?hidden="${hideRating}"
                .rating="${disableRating ? issue.score : issue.userScore}"
                numstars="5"
                .disableRating="${disableRating}"
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
        addCommentFunction!,
        this.voteCommentUp.bind(this),
        toggleCommentsMode,
        hideSubmitComment
      )}`;
  }

  renderComments(
    issue: IssueAttributes,
    showComments: boolean,
    disableVoting: boolean,
    addCoreIssueCommentFromInput: Function,
    voteCommentUp: Function,
    toggleCommentMode = false,
    hideSubmitComment = false
  ) {
    if (showComments) {
      return html`
        ${toggleCommentMode &&
        !(hideSubmitComment && issue.Comments?.length === 0)
          ? html`
              <div class="layout horizontal">
                <div class="commentsOpenClose">${this.t('toggleComments')}</div>
                <mwc-icon-button
                  icon="keyboard_arrow_right"
                  class="commentToggleIcons"
                  @click="${(event: CustomEvent) =>
                    this._toggleCommentsForIssue(
                      issue.id,
                      event.srcElement as IconButton
                    )}"
                >
                </mwc-icon-button>
              </div>
            `
          : nothing}
        <div
          id="issue${issue.id}inputComments"
          class="layout vertical center-center comments"
          ?hidden="${toggleCommentMode}"
        >
          <mwc-textarea
            id="addCommentInput"
            ?hidden="${hideSubmitComment}"
            charCounter
            class="addCommentInput"
            maxLength="300"
            outlined
            @keyup="${this.setCommentInput}"
            rows="4"
            id="coreIssueInput"
            .label="${this.t('yourComment')}"
          ></mwc-textarea>
          <div
            class="layout horizontal center-center"
            ?hidden="${hideSubmitComment}"
          >
            <mwc-button
              raised
              ?disabled="${!this.currentCommentInput}"
              class="layout addNewIssueButton"
              @click="${addCoreIssueCommentFromInput}"
              .label="${this.t('addComment')}"
              >${this.renderAvatarButtonIcon()}</mwc-button
            >
          </div>
        </div>

        <div
          id="issue${issue.id}outputComments"
          class="layout vertical"
          ?hidden="${toggleCommentMode}"
        >
          ${this._sortComments(issue.Comments!).map(comment => {
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
                      ${comment.counterUpVotes && comment.counterDownVotes
                        ? comment.counterUpVotes - comment.counterDownVotes
                        : comment.counterUpVotes
                        ? comment.counterUpVotes
                        : 0}
                    </div>
                    <mwc-icon-button
                      icon="arrow_upward"
                      ?disabled="${disableVoting}"
                      @click="${(event: any) =>
                        this.voteCommentUp(comment, event)}"
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
    } else {
      return nothing;
    }
  }

  _sortComments(comments: Array<CommentAttributes>) {
    const byTime = comments.sort(
      (a: CommentAttributes, b: CommentAttributes) => {
        //@ts-ignore
        return new Date(b.createdAt!) - new Date(a.createdAt!);
      }
    );

    const tenSeconds = Date.now() - 1000 * 10;

    const newComments = [];
    const oldComments = [];

    for (let i = 0; i < byTime.length; i++) {
      const date = new Date(byTime[i].updatedAt!);
      //@ts-ignore
      if (date > tenSeconds) {
        newComments.push(byTime[i]);
      } else {
        oldComments.push(byTime[i]);
      }
    }

    const oldByVotes = oldComments.sort(
      (a: CommentAttributes, b: CommentAttributes) => {
        //@ts-ignore
        return b.counterUpVotes - a.counterUpVotes;
      }
    );

    return [...newComments, ...oldByVotes];
  }

  renderStory() {
    return html`
      <div class="layout horizontal center-center">
        <cs-story
          id="storyViewer"
          number="${this.storyNumber}"
          @cs-story-index="${this.setStoryIndex}"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        ></cs-story>
      </div>
    `;
  }

  renderAvatarButtonIcon() {
    return this.user
      ? html`
          <mwc-icon
            class="buttonIcon"
            style="color:${this.user.selectedAvatarColor}"
            >${this.user.selectedAvatar}</mwc-icon
          >
        `
      : nothing;
  }

  sendEmail() {}

  renderSendEmail() {
    return html`
      <div class="layout horizontal sendEmailContainer">
        <mwc-textarea
          hidden
          maxLength="20000"
          rows="4"
          id="addParticipantsInput"
          .label="${this.t('emailToParticipants')}"
        ></mwc-textarea>
        <mwc-button
          outlined
          class="layout"
          @click="${this.sendEmail}"
          .label="${this.t('sendMeetingEmail')}"
        ></mwc-button>
      </div>
    `;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
