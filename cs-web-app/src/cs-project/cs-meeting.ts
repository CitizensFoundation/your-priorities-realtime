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

import { CsServerApi } from '../CsServerApi.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

import './cs-meeting-orientation.js';
import './cs-meeting-create-card.js';

export const MeetingTypes: Record<string, number> = {
  TypeOrientation: 0,
  TypeCreateCard: 1,
  TypeScoring: 2,
  TypeActionPlan: 3,
  TypeReporting: 4,
};

@customElement('cs-meeting')
export class CsMeeting extends YpBaseElement {
  @property({ type: Object })
  meeting: MeetingAttributes | undefined;

  @property({ type: Object })
  loggedInUser: UserAttributes | undefined;

  @property({ type: String })
  loginToken: string | undefined;

  @property({ type: String })
  subRoute: string | undefined;

  @property({ type: Number })
  meetingId: number | undefined;

  @property({ type: Boolean })
  isAdmin = false;

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
        headerTitle: this.t('meeting'),
        documentTitle: this.t('meeting'),
        headerDescription: '',
      });
    }, 500);

    if (window.appGlobals.originalQueryParameters.isAdmin) {
      this.isAdmin = true;
    }

    if (window.appGlobals.originalQueryParameters.loginToken) {
      this.loginToken = window.appGlobals.originalQueryParameters
        .loginToken as string;
    }
  }

  // DATA PROCESSING

  // UI

  static get styles() {
    return [super.styles, ShadowStyles, css``];
  }

  render() {
    if (this.meeting) {
      let meetingPage: TemplateResult | undefined;
      switch (this.meeting.type) {
        case MeetingTypes.TypeOrientation:
          meetingPage = html`<cs-meeting-orientation
            ?isAdmin="${this.isAdmin}"
            .loggedInUser="${this.loggedInUser} "
            .meeting="${this.meeting}"
          ></cs-meeting-orientation>`;
          break;
        case MeetingTypes.TypeCreateCard:
          meetingPage = html`<cs-meeting-create-card
            ?isAdmin="${this.isAdmin}"
            .loggedInUser="${this.loggedInUser}"
            .meeting="${this.meeting}"
          ></cs-meeting-create-card>`;
          break;
        case MeetingTypes.TypeScoring:
          meetingPage = html`<cs-meeting-scoring
            ?isAdmin="${this.isAdmin}"
            .loggedInUser="${this.loggedInUser}"
            .meeting="${this.meeting}"
          ></cs-meeting-scoring>`;
          break;
        case MeetingTypes.TypeActionPlan:
          meetingPage = html`<cs-meeting-action-plan
            ?isAdmin="${this.isAdmin}"
            .loggedInUser="${this.loggedInUser}"
            .meeting="${this.meeting}"
          ></cs-meeting-action-plan>`;
          break;
        case MeetingTypes.TypeReporting:
          meetingPage = html`<cs-meeting-reporting
            ?isAdmin="${this.isAdmin}"
            .loggedInUser="${this.loggedInUser}"
            .meeting="${this.meeting}"
          ></cs-meeting-reporting>`;
          break;
      }

      return meetingPage;
    } else {
      return nothing;
    }
  }

  async _getMeeting() {
    this.meeting = undefined;
    this.meeting = (await window.serverApi.getMeeting(this.meetingId!)) as
      | MeetingAttributes
      | undefined;
  }

  async _getLoggedInUser() {
    this.loggedInUser = undefined;
    this.loggedInUser = (await window.serverApi.getUserFromLoginToken(
      this.loginToken!
    )) as UserAttributes | undefined;
  }

  // EVENTS

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('subRoute') && this.subRoute) {
      const splitSubRoute = this.subRoute.split('/');
      this.meetingId = parseInt(splitSubRoute[1]);
    }

    if (changedProperties.has('meetingId') && this.meetingId) {
      this._getMeeting();
      this._getLoggedInUser();
      //this._getCollection();
      //this._getHelpPages();
    }
  }
}
