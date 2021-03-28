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

import { sortBy } from 'lodash-es';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { CsMeetingBase } from './cs-meeting-base.js';
import { CsStory } from '../cs-story/cs-story.js';
import '@material/mwc-checkbox';
import { Checkbox } from '@material/mwc-checkbox';

import '@material/mwc-formfield';

export const ActionPlanTabTypes: Record<string, number> = {
  Information: 0,
  ReviewScores: 1,
  CreationActions: 2,
  Voting: 3,
  Confirm: 4,
  AssignActions: 5,
  FinalReview: 6,
};

@customElement('cs-meeting-action-plan')
export class CsMeetingActionPlan extends CsMeetingBase {
  @property({ type: Number })
  actionIssueIndex = 0;

  @property({ type: Array })
  actions: Array<ActionAttributes> | undefined;

  @property({ type: Array })
  sortedActions: Array<ActionAttributes> | undefined;

  @property({ type: String })
  currentActionInput: string | undefined;

  @property({ type: Boolean })
  onlyShowSelected = false;


  @property({ type: String })
  currentAssignmentInput: string | undefined;



  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._getAllIssues();
  }

  async actionSelectionChanged(checkbox: Checkbox, actionId: number) {
    await window.serverApi.setActionSelectedStatus(actionId, checkbox.checked);
  }

  async _getAllIssues() {
    this.allIssues = undefined;
    this.allIssues = (await window.serverApi.getSelectedIssues(
      this.meeting.Round!.projectId,
      this.IssueTypes.AllIssues
    )) as Array<IssueAttributes> | undefined;

    if (this.allIssues) {
      this._getRatings();
    }
  }


  async saveAssignment(action: ActionAttributes) {
    const element = this.$$('#addAssignmentInput') as HTMLInputElement;

    if (element && element.value && element.value.length > 0) {

      await window.serverApi.updateAssignmentForAction(action.id!, element.value);

      (this.$$('#addAssignmentInput') as HTMLInputElement).value = '';
    }
  }

  async addAction() {
    const element = this.$$('#addActionInput') as HTMLInputElement;
    const issue = this.orderedAllIssues![this.coreIssueIndex];

    if (element && element.value && element.value.length > 0) {
      const action = {
        description: (this.$$('#addActionInput') as HTMLInputElement).value,
        userId: 1,
        counterDownVotes: 0,
        counterUpVotes: 0,
        state: 0,
        completedPercent: 0,
        selected: false,
        completeBy: null,
        issueId: issue.id,
        projectId: this.meeting.Round!.projectId,
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

        .addActionInput {
          width: 290px;
        }

        .action {
          margin-top: 16px;
          padding: 16px;
          width: 296px;
          max-width: 2228px;
          background-color: #fefefe;
          margin-left: 8px;
          margin-right: 8px;
        }

        .actions {
          margin-top: 24px;
        }

        .addNewIssueButton {
          margin-top: 16px;
          margin-bottom: 24px;
        }

        .action {
          color: #000;
          border-top-left-radius: 35px;
          color: #fff;
          padding: 10px;
          width: 285px;
          position: relative;
          min-height: 120px;

          margin-bottom: 8px;
        }

        .votingNumber {
          margin-top: 0px;
        }

        .actionDescription {
          color: #444;
          padding: 16px;
          padding-top: 0;
          overflow: hidden;
          margin-top: -4px;
        }

        .assignedTo {
          color: #444;
          padding: 16px;
          padding-top: 0;
          overflow: hidden;
          margin-top: -4px;
        }

        .actionDescriptionLessPadding {
          padding-bottom: 4px;
        }

        .actionIcons {
          color: #000;
          --mdc-icon-size: 28px;
          margin-top: -5px;
          padding-top: 8px;
          padding-bottom: 12px;
        }

        .actionsHeader {
          padding-left: 16px;
        }

        .actionSign {
          display: none;
          color: transparent;
        }

        .actionText {
          color: #111;
          font-size: 18px;
          padding-bottom: 16px;
          padding-top: 8px;
          text-align: left;
          margin-left: 16px;
          width: 100%;
        }

        .buttonContainer {
          color: #000;
          padding-right: 8px;
        }

        .lessActionPadding {
          padding-bottom: 0;
        }

        .sliderContainer {
          align-items: flex-start !important;
        }

        #addAssignmentInput {
          margin-left: 14px;
          margin-right: 16px;
          margin-top: 8px;
          width: 258px;
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
    let toggleCommentMode = true;

    issue = this.orderedAllIssues![index];

    return this.renderIssueHtml(
      issue,
      showVoting,
      disableVoting,
      showComments,
      hideSubmitComment,
      false,
      undefined,
      undefined,
      toggleCommentMode
    );
  }

  async addActionFromEvent(action: ActionAttributes) {
    const issue = this.orderedAllIssues![this.coreIssueIndex];

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
    if (this.coreIssueIndex < this.orderedAllIssues!.length - 1) {
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

    await window.serverApi.voteAction(action.id!, 1);
  }

  async voteActionDown() {
    const action = this.actions![this.actionIssueIndex];

    await window.serverApi.voteAction(action.id!, -1);
  }

  renderIssues(title: string, hideRating = false) {
    if (this.orderedAllIssues && this.orderedAllIssues.length > 0) {
      const issue = this.orderedAllIssues[this.coreIssueIndex];
      return html`
        <div class="layout horizontal center-center sliderContainer">
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
              ?hidden="${this.coreIssueIndex >=
              this.orderedAllIssues!.length - 1}"
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
                  outlined
                  @keyup="${this.setActionInput}"
                  rows="3"
                  class="addActionInput"
                  maxLength="500"
                  .label="${this.t('action')}"
                ></mwc-textarea>
                <div class="layout horizontal center-center">
                  <mwc-button
                    raised
                    ?disabled="${!this.currentActionInput}"
                    class="layout addNewIssueButton"
                    @click="${this.addAction}"
                    .label="${this.t('addAction')}"
                    >${this.renderAvatarButtonIcon()}</mwc-button
                  >
                </div>
              </div>
            `
          : nothing}

        <div class="layout vertical center-center">
          ${issue.Actions?.map(action => {
            return html`
              <div class="action shadow-elevation-2dp shadow-transition">
                <div class="layout horizontal actionHeader">
                  <div class="actionText">${this.t('action')}</div>
                </div>
                <div class="actionDescription">${action.description}</div>
              </div>
            `;
          })}
        </div>
      `;
    } else {
      return html``;
    }
  }

  setActionInput() {
    this.currentActionInput = (this.$$(
      '#addActionInput'
    ) as HTMLInputElement).value;
  }

  setAssignmentInput() {
    this.currentAssignmentInput = (this.$$(
      '#addAssignmentInput'
    ) as HTMLInputElement).value;
  }


  renderAction(
    index: number,
    showNumbers = false,
    showVoting = true,
    disableVoting = false,
    showSelectionCheckbox = false,
    showAssignment = false
  ) {
    const action = this.actions![index];

    return html`
      <div class="action lessActionPadding layout vertical shadow-elevation-2dp shadow-transition">
        <div class="layout horizontal actionHeader center-center">
          <div class="actionText">${this.t('action')}</div>
        </div>
        <div class="actionDescription">${action.description}</div>
        <div class="assignedTo layout vertical" ?hidden="${!action.assignedTo}">
          <div>${this.t('assignedTo')}</div>
          <div>${action.assignedTo}</div>
        </div>

        ${showAssignment
          ? html`
              <mwc-textarea
                id="addAssignmentInput"
                charCounter
                outlined
                rows="3"
                @keyup="${this.setAssignmentInput}"
                class="addActionInput"
                maxLength="200"
                .label="${this.t('taskIsAssignedTo')}"
              ></mwc-textarea>
              <div class="layout horizontal center-center">
                <mwc-button
                  raised
                  ?disabled="${!this.currentAssignmentInput}"
                  class="layout addNewIssueButton saveAssignment"
                  @click="${() => this.saveAssignment(action)}"
                  .label="${this.t('saveAssignment')}"
                  ></mwc-button
                >
              </div>
            `
          : nothing}
        <div class="layout horizontal center-center buttonContainer">
          <mwc-checkbox
            ?hidden="${!this.isAdmin || !showSelectionCheckbox}"
            class="issueConfirmation self-start start"
            ?checked="${action.selected}"
            @change="${(event: CustomEvent) =>
              this.actionSelectionChanged(
                event.srcElement as Checkbox,
                action.id as number
              )}"
            value="closed"
            name="accessRadioButtons"
          >
          </mwc-checkbox>
          <div class="flex"></div>
          <mwc-icon-button
            icon="arrow_upward"
            ?hidden="${!showVoting}"
            ?disabled="${disableVoting}"
            class="voteButton"
            @click="${this.voteActionUp}"
            .label="${this.t('voteUp')}"
          ></mwc-icon-button>
          <div class="votingNumber" ?hidden="${!showNumbers}">
            ${action.counterUpVotes}
          </div>
          <mwc-icon-button
            icon="arrow_downward"
            ?disabled="${disableVoting}"
            ?hidden="${!showVoting}"
            @click="${this.voteActionDown}"
            class="voteButton"
            .label="${this.t('voteDown')}"
          ></mwc-icon-button>
          <div class="votingNumber" ?hidden="${!showNumbers}">
            ${action.counterDownVotes}
          </div>
        </div>
      </div>
    `;
  }

  renderActions(title: string) {
    if (this.actions && this.actions.length > 0) {
      const issue = this.actions[this.actionIssueIndex];
      return html`
        <div class="layout horizontal center-center sliderContainer">
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
    if (this.orderedAllIssues && this.orderedAllIssues.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.orderedAllIssues?.map((issue, index) => {
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

  renderConfirm() {
    if (this.actions && this.actions.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.sortedActions!.map((issue, index) => {
            return html`${this.renderAction(index, true, true, true, true)}`;
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
        <div class="layout horizontal center-center sliderContainer">
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

  renderAssign() {
    if (this.actions && this.actions.length > 0) {
      return html`
        <div class="layout horizontal center-center sliderContainer">
          <div class="issueBack issueVoting">
            <mwc-icon-button
              ?hidden="${this.actionIssueIndex === 0}"
              ?disabled="${!this.isAdmin && this.isLive}"
              icon="arrow_back"
              @click="${this.leftActionArrow}"
            ></mwc-icon-button>
          </div>
          <div class="layout vertical center-center">
            ${this.renderAction(
              this.actionIssueIndex,
              false,
              false,
              true,
              false,
              true
            )}
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
    if (this.orderedAllIssues && this.orderedAllIssues!.length > 0) {
      return html`
        <div class="layout vertical center-center">
          ${this.orderedAllIssues?.map((issue, index) => {
            return html`${this.renderIssue(index, true)}`;
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
            ?hidden="${!this.isAdmin && this.selectedTab != 1}"
            .label="${this.t('reviewScorecard')}"
            icon="format_list_numbered"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 2}"
            .label="${this.t('actionPlan')}"
            icon="create"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 3}"
            .label="${this.t('vote')}"
            icon="how_to_vote"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 4}"
            .label="${this.t('confirm')}"
            icon="check_circle_outline"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 5}"
            .label="${this.t('assign')}"
            icon="assignment_outline"
            stacked
          ></mwc-tab>
          <mwc-tab
            ?hidden="${!this.isAdmin && this.selectedTab != 6}"
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
      case ActionPlanTabTypes.Confirm:
        page = this.renderConfirm();
        break;
      case ActionPlanTabTypes.AssignActions:
        page = this.renderAssign();
        break;
      case ActionPlanTabTypes.FinalReview:
        page = this.renderResults();
        break;
    }

    return page;
  }

  render() {
    return html` ${this.renderTabs()} ${this.renderCurrentTabPage()} `;
  }

  setupActions() {
    if (this.allIssues) {
      let allActions: Array<ActionAttributes> = [];
      for (let i = 0; i < this.allIssues.length; i++) {
        if (
          this.allIssues[i].Actions != null &&
          this.allIssues[i].Actions!.length > 0
        ) {
          allActions = allActions.concat(this.allIssues[i].Actions!);
        }
      }
      if (this.onlyShowSelected) {
        allActions = allActions.filter(action => action.selected == true);
      }

      this.actions = [...allActions];
      this.setupSortedActions();
    } else {
      this.actions = undefined;
    }
  }

  // EVENTS

  setupSortedActions() {
    this.sortedActions = this.actions?.sort(function (a, b) {
      return (
        b.counterUpVotes -
        b.counterDownVotes -
        (a.counterUpVotes - a.counterDownVotes)
      );
    });
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTab')) {
      this.updateState();

      if (
        [
          ActionPlanTabTypes.FinalReview,
          ActionPlanTabTypes.AssignActions,
        ].indexOf(this.selectedTab) > -1
      ) {
        this.onlyShowSelected = true;
        this._getAllIssues();
      } else {
        this.onlyShowSelected = false;
        this._getAllIssues();
      }

      if (this.selectedTab == ActionPlanTabTypes.AssignActions) {
        this.actionIssueIndex = 0;
      }
    }

    if (changedProperties.has('allIssues') && this.allIssues) {
      this.setupActions();
      this.allIssuesHash = {};
      for (let i = 0; i < this.allIssues.length; i++) {
        this.allIssuesHash[this.allIssues[i].id] = this.allIssues[i];
      }

      this.orderedAllIssues = this.allIssues.sort(function (a, b) {
        return a.score - b.score;
      });
    }

    if (changedProperties.has('actions') && this.actions) {
      this.setupSortedActions();
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
