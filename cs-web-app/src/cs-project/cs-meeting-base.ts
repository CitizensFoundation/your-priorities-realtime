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

  io: any | undefined;

  stateListener: any | undefined;

  constructor() {
    super();
  }

  _processState(state: StateAttributes) {
    if (!this.isAdmin) {
      this.selectedTab = state.tabIndex;
      this.isLive = state.isLive;
    }
  }

  sendState(state: StateAttributes) {
    this.io.broadcast.emit(state)
  }

  updateState() {
    this.sendState({
      tabIndex: this.selectedTab,
      isLive: this.isLive
    } as StateAttributes)
  }

  _setupSockets() {
    this.io = io(`meeting_${this.meeting.id}`);

    this.stateListener = (...args: any) => {
      if (!this.isAdmin) {
        this._processState(args[0] as StateAttributes);
      }
    }

    this.io.on("connection", (socket: any)=> {
      socket.on("meetingState", this.stateListener);
    })
  }

  _closeSockets() {
    //TODO
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
      `,
    ];
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
      <div class="layout vertical">
        <mwc-textarea
          maxLength="20000"
          rows="10"
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
    return html`
      <div class="layout horizontal">
        <div class="layout vertical">
          <mwc-formfield .label="${this.t('closed')}">
            <mwc-radio
              id="liveRadio"
              @change="${this._liveChanged}"
              ?checked="${this.isLive}"
              value="closed"
              name="accessRadioButtons"
            >
            </mwc-radio>
          </mwc-formfield>
        </div>
        <div class="layout vertical">${this.renderSendEmail()}</div>
      </div>
    `;
  }

  _selectTab(event: CustomEvent) {
    this.selectedTab = event.detail?.index as number;
  }
}
