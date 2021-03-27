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
import { TextArea } from '@material/mwc-textarea';
import { Snackbar } from '@material/mwc-snackbar';

import { sortBy } from 'lodash-es';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';
import { CsStory } from '../cs-story/cs-story.js';


export const ActionPlanTabTypes: Record<string, number> = {
  Information: 0,
  ReviewScores: 1,
  CreationActions: 2,
  Voting: 3,
  AssignActions: 4,
  FinalReview: 5
};

@customElement('cs-meeting-action-plan')
export class CsMeetingActionPlan extends CsMeetingBase {
  @property({ type: Number })
  coreIssueIndex = 0;

  @property({ type: Number })
  actionIssueIndex = 0;

  @property({ type: Array })
  allIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  actions: Array<ActionAttributes> | undefined;

  @property({ type: Array })
  sortedActions: Array<ActionAttributes> | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._getAllIssues();
  }

  async _getAllIssues() {
    this.allIssues = undefined;
    this.allIssues = (await window.serverApi.getIssues(
      1 /*this.meeting.Round.projectId*/,
      this.IssueTypes.AllIssues
    )) as Array<IssueAttributes> | undefined;
  }

  async addAction() {
    const element = this.$$('#addActionInput') as HTMLInputElement;
    const issue = this.allIssues![this.coreIssueIndex];

    if (element && element.value && element.value.length > 0) {
      const action = {
        description: (this.$$('#addActionInput') as HTMLInputElement).value,
        userId: 1,
        counterDownVotes: 0,
        counterUpVotes: 0,
        state: 0,
        completedPercent: 0,
        completeBy: null,
        issueId: issue.id,
        projectId: 1, //TODO: FIX
      } as ActionAttributes;

      await window.serverApi.postAction(issue.id, action);

      issue!.Actions!.unshift(action);

      this.allIssues = [...this.allIssues!];

      this.io.emit('newAction', action);

      (this.$$('#addActionInput') as HTMLInputElement).value = '';
    }
  }

  _processNewIssue(issue: IssueAttributes) {
    this.allIssues?.unshift(issue);
    this.allIssues = [...this.allIssues!];
  }

  // UI

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .actionsHeader {
          font-size: 18px;
          margin-top: 20px;
        }

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

        .addActionInput {
          width: 260px;
        }

        .issueVoting {
          width: 48px;
        }

        .comments {
          margin-top: 16px;
        }

        .comment {
          margin-top: 16px;
          padding: 16px;
          width: 228px;
          max-width: 2228px;
          background-color: #f7f7f7;
        }

        .action {
          margin-top: 16px;
          padding: 16px;
          width: 228px;
          max-width: 2228px;
          background-color: #f7f7f7;
        }

        .actions {
          margin-top: 16px;
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
        actionIssueIndex: this.actionIssueIndex,
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
        if (state.actionIssueIndex != null) {
          this.actionIssueIndex = state.actionIssueIndex;
        }
        this.selectedTab = state.tabIndex;
      }
    }
  }

  async _scoreIssue(event: CustomEvent) {
    const issue = this.allIssues![this.actionIssueIndex];

    await window.serverApi.voteIssue(issue.id, 1);
  }

  renderIssue(index: number, hideRating = false) {
    let issue: IssueAttributes;
    let showVoting = true;
    let showComments = true;
    let disableVoting = true;
    let hideSubmitComment = true;
    let showNumbers = false;

    issue = this.allIssues![index];

    return this.renderIssueHtml(
      issue,
      showVoting,
      disableVoting,
      showComments,
      hideSubmitComment,
      false
    );
  }

  async addActionFromEvent(action: ActionAttributes) {
    const issue = this.allIssues![this.coreIssueIndex];

    issue.Actions!.unshift(action);

    this.allIssues = [...this.allIssues!];
  }

  _processNewAction(action: ActionAttributes) {
    this.addActionFromEvent(action);
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

  leftActionArrow() {
    if (this.actionIssueIndex > 0) {
      this.actionIssueIndex -= 1;
    }
    this.updateState();
  }

  rightActionArrow() {
    if (this.actionIssueIndex < this.actions!.length - 1) {
      this.actionIssueIndex += 1;
    }
    this.updateState();
  }

  async voteActionUp() {
    const action = this.actions![this.actionIssueIndex];

    await window.serverApi.voteAction(
      action.id!,
      1
    );
  }

  async voteActionDown() {
    const action = this.actions![this.actionIssueIndex];

    await window.serverApi.voteAction(
      action.id!,
      -1
    );
  }

  renderIssues(title: string, hideRating = false) {
    if (this.allIssues && this.allIssues.length > 0) {
      const issue = this.allIssues[this.coreIssueIndex];
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

        ${this.isAdmin
          ? html`
              <div class="layout vertical center-center actions">
                <mwc-textarea
                  id="addActionInput"
                  charCounter
                  class="addActionInput"
                  maxLength="500"
                  .label="${this.t('action')}"
                ></mwc-textarea>
                <div class="layout horizontal center-center">
                  <mwc-button
                    raised
                    class="layout addNewIssueButton"
                    @click="${this.addAction}"
                    .label="${this.t('addAction')}"
                  ></mwc-button>
                </div>
              </div>
            `
          : nothing}

        <div class="layout vertical center-center">
          <div class="actionsHeader">${this.t('actions')}</div>
          ${issue.Actions?.map(action => {
            return html`
              <div class="action shadow-elevation-4dp shadow-transition">
                ${action.description}
              </div>
            `;
          })}
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderAction(index: number, showNumbers = false, showVoting = true, disableVoting = false) {
    let issue: IssueAttributes;

    const action = this.actions![index];

    return html`
      <div
        class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
      >
        <div class="layout vertical">
          <div class="issueName">${action.description}</div>
          <div class="layout horizontal">
            <mwc-icon-button
              icon="arrow_upward"
              ?hidden="${!showVoting}"
              ?disabled="${disableVoting}"
              class="voteButton"
              @click="${this.voteActionUp}"
              .label="${this.t('voteUp')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">${action.counterUpVotes}</div>
            <mwc-icon-button
              icon="arrow_downward"
              ?disabled="${disableVoting}"
              ?hidden="${!showVoting}"
              @click="${this.voteActionDown}"
              class="voteButton"
              .label="${this.t('voteDown')}"
            ></mwc-icon-button>
            <div class="votingNumber" ?hidden="${!showNumbers}">${action.counterDownVotes}</div>
            <div class="flex"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderActions(title: string) {
    if (this.actions && this.actions.length > 0) {
      const issue = this.actions[this.actionIssueIndex];
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">${title}</div>

        <div class="layout horizontal center-center self-start">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.actionIssueIndex === 0}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_back"
              @click="${this.leftActionArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderAction(this.actionIssueIndex)}
          </div>
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.actionIssueIndex >= this.actions!.length - 1}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_forward"
              @click="${this.rightActionArrow}"
            ></mwc-icon-button>
          </div>
        </div>
      `;
    } else {
      return html``;
    }
  }


  renderReviewScores() {
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

  renderResults() {
    if (this.actions && this.actions.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('review')}
        </div>

        <div class="layout vertical center-center">
          ${this.sortedActions!.map((issue, index) => {
            return html`${this.renderAction(index, true, true, true)}`;
          })}
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderVoting() {
    if (this.actions && this.actions.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('voting')}
        </div>

        <div class="layout horizontal center-center self-start">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.actionIssueIndex === 0}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_back"
              @click="${this.leftActionArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderAction(this.actionIssueIndex)}
          </div>
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.actionIssueIndex >= this.actions!.length - 1}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_forward"
              @click="${this.rightActionArrow}"
            ></mwc-icon-button>
          </div>
        </div>
      `;
    } else {
      return html``;
    }
  }

  renderReview() {
    if (this.allIssues && this.allIssues!.length > 0) {
      return html`
        <div ?hidden="${this.isAdmin}" class="subjectHeader">
          ${this.t('review')}
        </div>

        <div class="layout vertical center-center">
           ${ this.allIssues.map( (issue, index) => {
              return html`${this.renderIssue(index, true)}`
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
              .label="${this.t('createActionPlan')}"
              icon="create"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('voting')}"
              icon="how_to_vote"
              stacked
            ></mwc-tab>
            <mwc-tab
              .label="${this.t('assign')}"
              icon="assignment_outline"
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
      case ActionPlanTabTypes.Information:
        page = this.renderStory();
        break;
      case ActionPlanTabTypes.ReviewScores:
        page = this.renderReviewScores();
        break;
      case ActionPlanTabTypes.CreationActions:
        page = this.renderIssues(this.t('createActions'));
        break;
      case ActionPlanTabTypes.Voting:
        page = this.renderVoting();
        break;
        case ActionPlanTabTypes.AssignActions:
        page = this.renderIssues(this.t('assignActions'));
        break;
      case ActionPlanTabTypes.FinalReview:
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

  setupActions() {
    if (this.allIssues) {
      let allActions: Array<ActionAttributes> = [];
      for (let i=0;i<this.allIssues.length;i++) {
        if (this.allIssues[i].Actions!=null && this.allIssues[i].Actions!.length>0) {
          allActions = allActions.concat(this.allIssues[i].Actions!);
        }
      }
      this.actions = allActions;
    } else {
      this.actions = undefined;
    }
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTab')) {
      this.updateState();

      if (this.selectedTab == ActionPlanTabTypes.FinalReview) {
        this._getAllIssues();
      }
    }

    if (changedProperties.has('allIssues')) {
      this.setupActions();
    }

    if (changedProperties.has('actions') && this.actions) {
      this.sortedActions = sortBy(this.actions,  (item) => {
        return (item.counterDownVotes-item.counterUpVotes)
      })
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
