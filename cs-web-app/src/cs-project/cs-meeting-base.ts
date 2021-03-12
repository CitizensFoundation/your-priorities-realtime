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

@customElement('cs-meeting-base')
export class CsMeetingBase extends YpBaseElement {
  @property({ type: Object })
  meeting!: MeetingAttributes;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  isLive = false;

  @property({ type: Number })
  selectedTab = 0;

  roomName: string | undefined

  socket: any | undefined;

  io: any | undefined;

  stateListener: any | undefined;

  constructor() {
    super();
  }

  _processState(state: StateAttributes) {
    if (!this.isAdmin) {
      this.isLive = state.isLive;
    }
  }

  sendState(state: StateAttributes) {
    console.error(state)
    this.io.emit("meetingState", (state));
  }

  updateState() {
    this.sendState({
      tabIndex: this.selectedTab,
      isLive: this.isLive
    } as StateAttributes)
  }

  _setupSockets() {
    this.io = io();

    this.io.on("meetingState", (...args: any) => {
      console.error(args);
      if (!this.isAdmin) {
        this._processState(args[0] as StateAttributes);
      }
    });

    this.io.on("newComment", (...args: any) => {
      console.error(args);
      this._processNewComment(args[0] as CommentAttributes);
    });


    this.io.on("newIssue", (...args: any) => {
      console.error(args);
      this._processNewIssue(args[0] as IssueAttributes);
    });
  }

  _closeSockets() {
    //TODO
  }

  _processNewComment(comment: CommentAttributes) {

  }

  _processNewIssue(issue: IssueAttributes) {

  }

  connectedCallback() {
    super.connectedCallback();
    this._setupSockets();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
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
      `,
    ];
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('isLive')) {
      this.fire('yp-set-live-status', this.isLive);
    }
  }

  _liveChanged(event: CustomEvent) {
    if ((this.$$('#liveRadio') as Radio).checked) {
      this.isLive = true;
    } else {
      this.isLive = false;
    }

    this.updateState();
  }

  sendEmail() {}

  renderSendEmail() {
    return html`
      <div class="layout horizontal sendEmailContainer" hidden>
        <mwc-textarea
          maxLength="20000"
          rows="4"
          id="addParticipantsInput"
          .label="${this.t('emailToParticipants')}"
        ></mwc-textarea>
        <mwc-button
          raised
          class="layout"
          @click="${this.sendEmail}"
          .label="${this.t('sendMeetingEmail')}"
        ></mwc-button>
      </div>
    `;
  }

  renderHeader() {
    if (this.isAdmin) {
      return html`
      <div class="layout horizontal center-center liveButton">
      <mwc-formfield .label="${this.t('live')}">
            <mwc-checkbox
              id="liveRadio"
              @change="${this._liveChanged}"
              ?checked="${this.isLive}"
              value="closed"
              name="accessRadioButtons"
            >
            </mwc-checkbox>
          </mwc-formfield>
        <div class="layout vertical">${this.renderSendEmail()}</div>
      </div>
    `;
    } else {
      return nothing;
    }
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
