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
  actionIssueIndex = 0;

  @property({ type: Array })
  actions: Array<ActionAttributes> | undefined;

  @property({ type: Array })
  sortedActions: Array<ActionAttributes> | undefined;

  @property({ type: String })
  currentActionInput: string | undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._getAllIssues();
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

        .addActionInput {
          width: 290px;
        }

        .action {
          margin-top: 16px;
          padding: 16px;
          width: 296px;
          max-width: 2228px;
          background-color: #f7f7f7;
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
            background:linear-gradient(225deg,#ffb241 40px,transparent 30px, #fefefe 30px);
            color: #FFF;
            padding: 10px;
            width: 290px;
            position: relative;
            min-height: 100px;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                0 1px 10px 0 rgba(0, 0, 0, 0.12),
                0 2px 4px -1px rgba(0, 0, 0, 0.4);
            margin-bottom: 8px;
          }

          .actionDescription {
            color: #000;
            padding: 16px;
            padding-top: 0;
            overflow: hidden;
            margin-top: -4px;
          }

          .actionIcons {
            color: #FFF;
            --mdc-icon-size: 28px;
            margin-right: -282px;
            margin-top: -5px;

          }

          .actionsHeader {
            padding-left: 16px;
          }

          .actionSign {
            display: none;
            color: transparent;
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
      false,undefined,undefined,toggleCommentMode
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
              ?hidden="${this.coreIssueIndex >= this.orderedAllIssues!.length - 1}"
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
                  >${this.renderAvatarButtonIcon()}</mwc-button>
                </div>
              </div>
            `
          : nothing}

        <div class="layout vertical center-center">
          ${issue.Actions?.map(action => {
            return html`
              <div class="action">
                <div class="layout horizontal actionHeader center-center">
                  <mwc-icon class="actionIcons">directions_run</mwc-icon>
                </div>
                <div class="actionDescription">
                  ${action.description}
                </div>
                <div class="actionSign">${this.t('action')}</div>
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

  renderAction(index: number, showNumbers = false, showVoting = true, disableVoting = false) {
    const action = this.actions![index];

    return html`
      <div
        class="issueCard shadow-elevation-4dp shadow-transition layout horizontal"
      >
        <div class="layout vertical sliderContainer">
          <div class="issueName"></div>${action.description}</div>
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

  renderVoting() {
    if (this.actions && this.actions.length > 0) {
      return html`
        <div class="layout horizontal center-center sliderContainert">
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
    if (this.orderedAllIssues && this.orderedAllIssues!.length > 0) {
      return html`
        <div class="layout vertical center-center">
           ${ this.orderedAllIssues?.map( (issue, index) => {
              return html`${this.renderIssue(index, true)}`
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
          .label="${this.t('createActionPlan')}"
          icon="create"
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
          .label="${this.t('assign')}"
          icon="assignment_outline"
          stacked
        ></mwc-tab>
        <mwc-tab
          ?hidden="${!this.isAdmin && this.selectedTab!=5}"
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

    if (changedProperties.has('allIssues') && this.allIssues) {
      this.setupActions();
      this.allIssuesHash = {};
      for (let i=0;i<this.allIssues.length;i++)  {
        this.allIssuesHash[this.allIssues[i].id] = this.allIssues[i];
      }

      this.orderedAllIssues = this.allIssues.sort(function(a, b){return a.score - b.score});
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
