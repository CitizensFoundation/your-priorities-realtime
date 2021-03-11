/* eslint-disable @typescript-eslint/camelcase */
import { property, html, css, LitElement, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
//import { ifDefined } from 'lit-html/directives/if-defined';
import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';

import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-button';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

import Chart from 'chart.js';

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';
import { YpFormattingHelpers } from '../@yrpri/YpFormattingHelpers.js';

export const ProjectTabTypes: Record<string, number> = {
  Information: 0,
  CoreIssues: 1,
  Participants: 2,
  Analytics: 3,
  Activities: 4
};

export const IssueTypes: Record<string, number> = {
  CoreIssue: 0,
  UserIssue: 1,
  ProviderIssue: 2,
};

@customElement('cs-project')
export class CsProject extends YpBaseElement {
  @property({ type: Boolean })
  noHeader = false;

  @property({ type: Boolean })
  tabsHidden = false;

  @property({ type: Object })
  project: ProjectAttributes | undefined;

  @property({ type: Number })
  projectId: number | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  selectedTab = ProjectTabTypes.Information;

  @property({ type: Boolean })
  saved = false;

  @property({ type: Array })
  coreIssues: Array<IssueAttributes> | undefined;

  @property({ type: Array })
  participants: Array<UserAttributes> | undefined;

  chart: Chart | undefined;

  charts: Record<number, Chart> = {};

  //TODO: Get from users
  roleNames = ["users","providers","workingGroup","facilitator"]

  constructor() {
    super();

    //TODO: Fix this as it causes loadMoreData to be called twice on post lists at least
    // this.addGlobalListener('yp-logged-in', this._getCollection.bind(this));
    //this.addGlobalListener('yp-got-admin-rights', this.refresh.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      this.fire('yp-change-header', {
        headerTitle: this.t('newProject'),
        documentTitle: this.t('newProject'),
        headerDescription: '',
      });
    }, 500);
  }

  // DATA PROCESSING

  refresh(): void {
    console.error('REFRESH');
    if (this.project) {
      /*if (this.project.default_locale != null) {
        window.appGlobals.changeLocaleIfNeeded(this.project.default_locale);
      }

      if (this.project.theme_id !== undefined) {
        window.appGlobals.theme.setTheme(this.project.theme_id);
      }

      this.fire('yp-set-home-link', {
        type: this.collectionType,
        id: this.project.id,
        name: this.project.name,
      });*/

      this.fire('yp-change-header', {
        headerTitle: null,
        documentTitle: this.project.name,
        headerDescription: this.project.description,
      });
    }
  }

  async _getProject() {
    this.project = undefined;
    this.project = (await window.serverApi.getProject(this.projectId!)) as
      | ProjectAttributes
      | undefined;
  }

  async _getIssues() {
    this.coreIssues = undefined;
    this.coreIssues = (await window.serverApi.getIssues(
      this.projectId!,
      IssueTypes.CoreIssue
    )) as Array<IssueAttributes> | undefined;
  }

  async _getParticipants() {
    this.participants = undefined;
    this.participants = (await window.serverApi.getParticipants(
      this.projectId!
    )) as Array<UserAttributes> | undefined;
  }

  async _getHelpPages() {
    /*if (this.domainId) {
      const helpPages = (await window.serverApi.getHelpPages(
        this.collectionType,
        this.domainId
      )) as Array<YpHelpPage> | undefined;
      if (helpPages) {
        this.fire('yp-set-pages', helpPages);
      }
    } else {
      console.error('Collection id setup for get help pages');
    }*/
  }

  randomChartScalingFactor(): number {
    return Math.trunc(Math.round(Math.random() * 5));
  }

  setupChart(number: number, title: string) {
    const lineChartElement = this.shadowRoot!.getElementById(
      `line-chart-${number}`
    );
    const config = {
      type: 'line',
      data: {
        labels: [
          'Round 1',
          'Round 2',
          'Round 3',
          'Round 4',
          'Round 5',
          'Round 6',
          'Round 7',
        ],
        datasets: [
          {
            label: this.t('projectScore'),
            backgroundColor: '#FFF',
            borderColor: '#000',
            beginAtZero: true,
            data: [
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
              this.randomChartScalingFactor(),
            ],
            fill: false,
          },
        ],
      },
      options: {
        responsive: false,
        elements: {
          line: {
            tension: 0.1,
          },
        },
        title: {
          display: true,
          text: title,
          fontSize: 20,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Rounds',
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Score',
              },
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          ],
        },
      },
    };

    if (this.charts[number]) {
      //      this.charts.destroy();
    }

    this.charts[number] = new Chart(
      lineChartElement as HTMLCanvasElement,
      config as any
    );
  }


  supportedLanguages: Record<string, string> = {
    en: 'English (US)',
    en_GB: 'English (GB)',
    fr: 'Français',
    is: 'Íslenska',
    es: 'Español',
    it: 'Italiano',
    ar: 'اَلْعَرَبِيَّةُ',
    ar_EG: 'اَلْعَرَبِيَّةُ (EG)',
    ca: 'Català',
    ro_MD: 'Moldovenească',
    de: 'Deutsch',
    da: 'Dansk',
    sv: 'Svenska',
    en_CA: 'English (CA)',
    nl: 'Nederlands',
    no: 'Norsk',
    uk: 'українська',
    sq: 'Shqip',
    ky: 'Кыргызча',
    uz: 'Ўзбек',
    tr: 'Türkçe',
    fa: 'فارسی',
    pl: 'Polski',
    pt: 'Português',
    pt_BR: 'Português (Brazil)',
    ru: 'Русский',
    hu: 'Magyar',
    zh_TW: '国语 (TW)',
    sr: 'Srpski',
    sr_latin: 'Srpski (latin)',
    hr: 'Hravtski',
    kl: 'Kalaallisut',
    sl: 'Slovenščina',
  };


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

        .name {
          font-weight: bold;
          margin-bottom: 16px;
        }

        .editBox {
          max-width: 960px;
          margin-top: 32px;
        }

        mwc-textfield,
        mwc-textarea {
          margin-bottom: 16px;
          width: 450px;
        }

        .coreIssuesTitle,
        .roundsTitle {
          font-size: var(--mdc-typography-headline1-font-size);
          font-weight: var(--mdc-typography-headline1-font-weight);
          margin-bottom: 16px;
          margin-top: 16px;
        }

        .issues,
        .rounds {
          font-size: var(--mdc-typography-body-font-size);
          font-weight: var(--mdc-typography-body-font-weight);
          max-width: 450px;
          width: 450px;
        }

        .issue {
          padding: 16px;
          margin-top: 16px;
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
        }

        .saveButton {
          margin-top: 32px;
          --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
          --mdc-theme-primary: var(--mdc-theme-secondary);
          width: 200px;
          margin-bottom: 32px;
        }

        #newRoundDateInput {
          width: 150px;
        }

        .round {
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
          padding: 16px;
          margin-top: 16px;
          font-size: var(--mdc-typography-headline2-font-size);
          font-weight: var(--mdc-typography-headline2-font-weight);
        }

        .newRoundButton {
          margin-left: 16px;
          --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
          --mdc-theme-primary: var(--mdc-theme-secondary);
        }

        .addNewIssueButton {
          margin-bottom: 32px;
        }

        a {
          text-decoration: none;
        }

        canvas {
          margin-top: 48px;
        }
      `,
    ];
  }

  get languages() {
    if (this.supportedLanguages) {
      let arr = [];
      const highlighted = [];
      let highlightedLocales = ['en', 'en_GB', 'is', 'fr', 'de', 'es', 'ar'];
      for (const key in this.supportedLanguages) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.supportedLanguages.hasOwnProperty(key)) {
          if (highlightedLocales.indexOf(key) > -1) {
            highlighted.push({
              language: key,
              name: this.supportedLanguages[key],
            });
          } else {
            arr.push({ language: key, name: this.supportedLanguages[key] });
          }
        }
      }

      arr = arr.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return highlighted.concat(arr);
    } else {
      return [];
    }
  }

  async addIssue() {

    const issue = {
      description: (this.$$('#coreIssueInput') as HTMLInputElement).value,
      userId: 1,
      type: 0,
      state: 0,
      projectId: this.projectId
    } as IssueAttributes;

    await window.serverApi.postIssue(
      this.projectId!,
      issue
    );

    this._getIssues();

    (this.$$('#coreIssueInput') as HTMLInputElement).value = '';
  }

  async addParticipants() {
    debugger;
    const particpantsUpload = {
      participants: (this.$$('#addParticipantsInput') as HTMLInputElement).value,
      roleId: parseInt((this.$$('#participantsRole') as HTMLInputElement).value),
      language: (this.$$('#participantsLanguage') as HTMLInputElement).value,
      projectId: this.projectId
    } as ParticipantsUploadAttributes;

    await window.serverApi.postParticipants(
      this.projectId!,particpantsUpload
    );

    this._getParticipants();
    (this.$$('#addParticipantsInput') as HTMLInputElement).value = '';
  }

  addRound() {
    /*this.rounds = [
      ...this.rounds,
      {
        id: 5,
        user_id: 1,
        cs_project_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        starts_at: new Date(),
        ends_at: new Date(),
      },
    ];*/
  }

  _getRoles(user: UserAttributes) {
    return user.Roles?.map(role => {
      return `${this.t(role.nameToken)}`
    })
  }

  renderTabs() {
    return html`
      <div class="layout vertical center-center">
        <mwc-tab-bar @MDCTabBar:activated="${this._selectTab}">
          <mwc-tab
            .label="${this.t('information')}"
            icon="info_outlined"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('coreIssues')}"
            icon="list"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('participants')}"
            icon="emoji_people"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('analytics')}"
            icon="equalizer"
            stacked
          ></mwc-tab>
          <mwc-tab
            .label="${this.t('activities')}"
            icon="rss_feed"
            stacked
          ></mwc-tab>
        </mwc-tab-bar>
      </div>
    `;
  }

  renderCoreIssues() {
    return html`
      <div class="layout horizontal center-center coreIssuesTitle">
        ${this.t('coreIssues')}
      </div>
      <div class="layout vertical">
        <mwc-textarea
          ?hidden="${this.saved}"
          charCounter
          maxLength="200"
          id="coreIssueInput"
          .label="${this.t('coreIssue')}"
        ></mwc-textarea>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            class="layout addNewIssueButton"
            @click="${this.addIssue}"
            .label="${this.t('addCoreIssue')}"
          ></mwc-button>
        </div>
      </div>
      <div class="layout vertical center-center">
        <div class="issues ">
          ${this.coreIssues?.map(
            (issue, index: number) => html`
              <div class="issue shadow-elevation-2dp shadow-transition">
                ${index + 1}. ${issue.description}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  renderParticipants() {
    return html`
      <div class="layout vertical">
        <mwc-textarea
          maxLength="20000"
          rows="10"
          id="addParticipantsInput"
          .label="${this.t('addOrUpdateParticipants')}"
        ></mwc-textarea>
        <div class="layout horizontal center-center">
          <div class="layout vertical">
          <mwc-select id="participantsRole"
            .label="${this.t("selectRole")}">
            ${this.roleNames.map(
                (translationKey, index) => html`
                  <mwc-list-item name="${translationKey}"
                    .value="${index}"
                    >${this.t(translationKey)}</mwc-list-item
                  >
                `
              )}
          </mwc-select>
          <mwc-select id="participantsLanguage" label="${this.t('selectLanguage')}">
                ${this.languages.map(
                  item => html`
                    <mwc-list-item
                      .value="${item.language}"
                      >${item.name}</mwc-list-item
                    >
                  `
                )}
              </mwc-select>
          </div>
          <mwc-button
            raised
            class="layout addParticipantsButton"
            @click="${this.addParticipants}"
            .label="${this.t('addParticipants')}"
          ></mwc-button>
        </div>
      </div>
      <div class="layout vertical center-center">
        <div class="participants shadow-elevation-2dp shadow-transition">
          ${this.participants?.map(
            (participant, index: number) => html`
              ${participant.email} ${participant.language} ${this._getRoles(participant)}
            `
          )}
        </div>
      </div>
    `;
  }

  renderEditLater() {
    return html`<div class="layout vertical center-center">
      <div class="layout vertical editBox">
        <div class="layout vertical center-center">
          <div class="layout vertical">
            <mwc-textfield
              charCounter
              id="projectName"
              maxLength="60"
              .label="${this.t('projectName')}"
              .value="${this.project?.name}"
            ></mwc-textfield>
            <mwc-textarea
              rows="3"
              charCounter
              maxLength="300"
              .label="${this.t('projectDescription')}"
              .value="${this.project?.description}"
            ></mwc-textarea>
          </div>
        </div>
        <div class="layout horizontal center-center">
          <mwc-button
            raised
            class="saveButton"
            ?hidden="${this.saved}"
            @click="${() => {
              this.saved = true;
            }}"
            .label="${this.t('save')}"
          ></mwc-button>
        </div>
      </div>
    </div> `;
  }

  renderAnalytics() {
    return html`
      <div class="layout vertical center-center">
        <canvas id="line-chart-1" width="800" height="400"></canvas>
        <canvas id="line-chart-2" width="800" height="400"></canvas>
        <canvas id="line-chart-3" width="800" height="400"></canvas>
        <canvas id="line-chart-4" width="800" height="400"></canvas>
        <canvas id="line-chart-5" width="800" height="400"></canvas>
        <canvas id="line-chart-6" width="800" height="400"></canvas>
        <canvas id="line-chart-7" width="800" height="400"></canvas>
        <canvas id="line-chart-8" width="800" height="400"></canvas>
        <canvas id="line-chart-9" width="800" height="400"></canvas>
      </div>
    `;
  }

  renderCurrentTabPage(): TemplateResult | undefined {
    let page: TemplateResult | undefined;

    switch (this.selectedTab) {
      case ProjectTabTypes.Information:
        page = this.renderInformation();
        break;
      case ProjectTabTypes.CoreIssues:
        page = this.renderCoreIssues();
        break;
      case ProjectTabTypes.Participants:
        page = this.renderParticipants();
        break;
        case ProjectTabTypes.Analytics:
        page = this.renderAnalytics();
        break;
    }

    return page;
  }

  renderProjectRounds() {
    return html`
      <div class="layout vertical center-center">
        <div class="layout horizontal center-center roundsTitle">
          ${this.t('projectRounds')}
        </div>
        <div class="layout horizontal">
          <mwc-button
            class="newRoundButton"
            @click="${this.addRound}"
            raised
            .label="${this.t('addNewRound')}"
          ></mwc-button>
        </div>
        <div class="rounds layout vertical">
          ${this.project?.Rounds?.map(
            (round: RoundAttributes, index: number) => html`
              <a @click="${this.gotoRound}" href="/round/${round.id}"
                ><div
                  class="layout vertical round shadow-elevation-2dp shadow-transition"
                >
                  <div>
                    ${(this.$$('#projectName') as HTMLInputElement).value}
                  </div>
                  <div class="">
                    ${this.t('round')} ${index + 1} -
                    ${round.startedAt
                      ? YpFormattingHelpers.formatDate(round.startedAt)
                      : nothing}
                  </div>
                </div></a
              >
            `
          )}
        </div>
      </div>
    `;
  }

  renderInformation() {
    return html`${this.project ? this.renderProjectRounds() : nothing}`;
  }

  render() {
    return html` ${this.renderTabs()} ${this.renderCurrentTabPage()} `;
  }

  createProject() {
    YpNavHelpers.redirectTo(`/project/new`);
  }

  // EVENTS

  gotoRound(event: CustomEvent) {
    event.preventDefault();
    YpNavHelpers.redirectTo('/round/1');
  }

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('subRoute') && this.subRoute) {
      const splitSubRoute = this.subRoute.split('/');
      this.projectId = parseInt(splitSubRoute[1]);
      if (splitSubRoute.length > 2) {
        this._setSelectedTabFromRoute(splitSubRoute[1]);
      } else {
        this._setSelectedTabFromRoute('default');
      }
    }

    if (changedProperties.has('projectId') && this.projectId) {
      this._getProject();
      this._getIssues();
      //this._getHelpPages();
    }

    if (changedProperties.has('selectedTab')) {
      if (this.selectedTab == ProjectTabTypes.Analytics) {
        await this.requestUpdate();
        this.setupChart(1, this.stockIssues[0]);
        this.setupChart(2, this.stockIssues[1]);
        this.setupChart(3, this.stockIssues[2]);
        this.setupChart(4, this.stockIssues[3]);
        this.setupChart(5, this.stockIssues[4]);
        this.setupChart(6, this.stockIssues[5]);
        this.setupChart(7, this.stockIssues[6]);
        this.setupChart(8, this.stockIssues[7]);
        this.setupChart(9, this.stockIssues[8]);
      }
    }
  }

  stockIssues = [
    'Attitute of staff',
    'Affordability of services',
    'Availability of medicine',
    'Distance to health centre',
    'Equal access to the health services for all project members',
    'Punctuality of staff',
    'Polite behavior',
    "Listening to patients' problems",
    'Honest and transparent staff (in terms of dealing with drugs, food, etc)',
  ];

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }

  async _setSelectedTabFromRoute(routeTabName: string) {
    let tabNumber;

    switch (routeTabName) {
      case 'current':
        tabNumber = ProjectTabTypes.Information;
        break;
      case 'analytics':
        tabNumber = ProjectTabTypes.Analytics;
        break;
      default:
        tabNumber = ProjectTabTypes.Information;
    }

    if (tabNumber) {
      this.selectedTab = tabNumber;
      /*window.appGlobals.activity(
        'open',
        this.collectionType + '_tab_' + routeTabName
      );*/
    }
  }
}
