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

import './cs-story-viewer.js';
import './cs-story-card.js';
import { runInThisContext } from 'vm';
import { CsStoryViewer } from './cs-story-viewer.js';

@customElement('cs-story')
export class CsStory extends YpBaseElement {
  @property({ type: Number })
  number = 1;

  @property({ type: Boolean })
  isLive!: boolean;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  isiOs: boolean;

  setIndex(index: number) {
    (this.$$('#viewer') as CsStoryViewer).setIndex(index);
  }

  haveSetVideoEndEvent = false;

  constructor() {
    super();
    this.isiOs =
      /iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (this.$$('#videoPlayer') && !this.haveSetVideoEndEvent) {
      this.haveSetVideoEndEvent = true;
      const videoPlayer = this.$$('#videoPlayer') as HTMLVideoElement;
      videoPlayer.addEventListener('ended', (event: any) => {
        event.preventDefault();
        this.videoEnded();
      });
    }
  }

  renderStoryNumber(id: number) {
    if (id == 1) {
      return html`
        <cs-story-viewer
          id="viewer"
          ?isiOs="${this.isiOs}"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        >
          <cs-story-card style="background: white;color: black">
            <div class="bigHeader introHeader">
              Introduction to the Community Priorities
            </div>
            <p class="swipeText">Please swipe to continue</p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <video
              id="videoPlayer"
              slot="media"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/Bev2022.mp4"
              playsinline
              ?controls="${this.isiOs}"
            ></video>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Your health service<br />
              Your feedback!
            </div>

            <p>Dear Health Service User</p>
            <p>
              You are warmly invited to participate in a process of
              <b>giving feedback</b> on your rural
              <b>‘field ambulatory’ health service.</b>
            </p>

            <p>
              This will be through <b>two on-line 2-hour meetings</b> taking
              place from <b>1100 to 1300</b> tomorrow <b>(Tuesday 15th)</b> and
              <b>Wednesday 16th February.</b> The link is here and at the end of
              this presentation.
            </p>
            <p>
              You will <b>meet with the health team</b> that provides you with
              field level services. And, with them, you will have a chance to
              discuss options for making some <b>priority improvements.</b>
            </p>
            <p>
              Please <b>save the dates</b> and read on to
              <b>find out more...</b>
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              A bit more about the<br />
              exercise...
            </div>

            <p>
              You live in a rural community of 3,000 people, served by a field
              health team. This team needs your feedback to know what it is
              doing well, and where it could do better.
            </p>

            <p>
              And the team also needs your help to make best use of the service.
            </p>

            <p>From Ministry of Health, here is more information about what you should expect, and what is expected of you:</p>

            <p>
              <ul>
                <li>
                  the <span class="standardsTextColor">Standards</span> the field ambulatory should meet
                </li>
                <li>
                  Your <span class="rightsTextColor">Rights</span> and
                  <span class="rightsTextColor">Responsibilities</span> as a user
                  of health services
                </li>
              </ul>
            </p>

            <p></p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What <span class="standardsTextColor">standards</span> can you
              expect from your field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader standardsHeaderBackgroundColor"
                >
                  Standards
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctors1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                <b>Health Team composition.</b> There is 1 full-time medical doctor; 1 full-time qualified nurse and 1 part-time contract cleaner.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/clock1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Health Team availability.</b> Working hours are well-publicised and the Health Team is present and available during these hours.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/siren1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                <b>Equipment.</b> The minimum list of basic health equipment is available, in working order and clean.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/pregnant1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                <b>Building and facilities.</b> A dedicated building with a separate consultation and treatment area which ensures patient privacy.  A clean toilet in working order. Patient  data stored securely.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/drugs2.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                <b>Emergency service.</b> The Out of Hours emergency service (‘on call’ duty medic and referral facilities) is easy to access and up-to-date.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your <span class="rightsTextColor">rights</span> when using the field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Team
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/docktors2.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Treats you equally and with <b>respect</b> and care for <b>your personal dignity</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctorinfo1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Understands that you have the right to <b>refuse treatment</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustdoctor1.png"
                  />
                </td>
                <td class="tableText rightsHighlightBackground">
                <b>Helps</b> you and your family understand your health needs, and treats this information <b>confidentially.</b>

                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Understands that you have the right to a <b>second medical opinion</b> and helps you to access this.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your
              <span class="responsibilitiesTextColor">responsibilities</span> when using this service?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                It is your responsibility to...
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthjustice.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  <b>Learn</b> about your rights, and ask for any clarifications
                  you may need
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/bosnia1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Always <b>participate</b> in sickness prevention and health
                  promotion activities run by your Health service
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                Provide accurate and <b>complete information</b> about your health condition
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustInToctors.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                Treat the Health Team with <b>respect</b> and courtesy.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Looking forward to<br> tomorrow...
            </div>
            <p>
              You can find out more about these standards and rights
              <a href="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/220207+A+NOTE+ON+SERVICE+STANDARDS+%26+RIGHTS.pdf">here</a>.
            </p>
            <p>
              At <b>tomorrow’s meeting</b>, you are invited to share your experiences and to identify any other issues that matter to you and other health users. You will agree a list of priority areas and then go through an anonymous ranking exercise.
            </p>
            <p>
            On <b>Wednesday’s meeting</b>, you will have the chance to meet your health team, to review the results of your ranking and to see how they assess their performance. Together you’ll look at what actions can be taken to make improvements.
            </p>

            <p>
              Here’s the <a href="https://csc.citizens.is/meeting/3">link</a> to tomorrow’s meeting. We’ll resend it just before 11.00.
            </p>
          </cs-story-card>
        </cs-story-viewer>
      `;
    } else if (id == 2) {
      return html`
        <cs-story-viewer
          id="viewer"
          ?isiOs="${this.isiOs}"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        >
          <cs-story-card style="background: white;color: black">
            <div class="bigHeader introHeader">
              Introduction to the Community Priorities
            </div>
            <p class="swipeText">Please swipe to continue</p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <video
              id="videoPlayer"
              slot="media"
              src="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/Bev2022.mp4"
              playsinline
              ?controls="${this.isiOs}"
            ></video>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Your health service<br />
              Your self-assessment!
            </div>

            <p>Dear Health Service Provider</p>
            <p>
            You are warmly invited to participate in a process of <b>self-assessing</b> on rural <b>‘field ambulatory’ health service</b> that you provide.
            </p>

            <p>
              This will be through <b>two on-line 2-hour meetings</b> taking
              place from <b>1100 to 1300</b> tomorrow <b>(Tuesday 15th)</b> and
              <b>Wednesday 16th February.</b> The link is here and at the end of
              this presentation.
            </p>
            <p>
              You will also <b>meet with some of the health service users</b> from the community you serve. With them, you will discuss options for <b>priority improvements.</b>
            </p>
            <p>
              Please <b>save the dates</b> and read on to
              <b>find out more...</b>
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              A bit more about the<br />
              exercise...
            </div>

            <p>
            You are part of the field ambulatory health team that serves a rural
            community of 3,000 people. Receiving feedback on <b>what is going well</b>,
            and <b>where the service could do better,</b> helps you to provide the best service you can.

            </p>

            <p>
            This is also an opportunity to <b>remind health service users of their responsibilities and obligations</b> to make best use of the service that you provide.
            </p>

            <p>From Ministry of Health, this is the information that service users have been given about <b>what they can expect</b> from your service, and <b>what is expected of them.</b> </p>
            <p>
              <ul>
                <li>
                  the <span class="standardsTextColor">Standards</span> the field ambulatory should meet
                </li>
                <li>
                  Your <span class="rightsTextColor">Rights</span> and
                  <span class="rightsTextColor">Responsibilities</span> as a user
                  of health services
                </li>
              </ul>
            </p>

            <p></p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What <span class="standardsTextColor">standards</span> can you
              expect from your field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader standardsHeaderBackgroundColor"
                >
                  Standards
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctors1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                <b>Health Team composition.</b> There is 1 full-time medical doctor; 1 full-time qualified nurse and 1 part-time contract cleaner.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/clock1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Health Team availability.</b> Working hours are well-publicised and the Health Team is present and available during these hours.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/siren1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                <b>Equipment.</b> The minimum list of basic health equipment is available, in working order and clean.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/pregnant1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                <b>Building and facilities.</b> A dedicated building with a separate consultation and treatment area which ensures patient privacy.  A clean toilet in working order. Patient  data stored securely.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/drugs2.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                <b>Emergency service.</b> The Out of Hours emergency service (‘on call’ duty medic and referral facilities) is easy to access and up-to-date.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your <span class="rightsTextColor">rights</span> when using the field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Team
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/docktors2.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Treats you equally and with <b>respect</b> and care for <b>your personal dignity</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctorinfo1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Understands that you have the right to <b>refuse treatment</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustdoctor1.png"
                  />
                </td>
                <td class="tableText rightsHighlightBackground">
                <b>Helps</b> you and your family understand your health needs, and treats this information <b>confidentially.</b>

                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                Understands that you have the right to a <b>second medical opinion</b> and helps you to access this.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your
              <span class="responsibilitiesTextColor">responsibilities</span> when using this service?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                It is your responsibility to...
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthjustice.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  <b>Learn</b> about your rights, and ask for any clarifications
                  you may need
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/bosnia1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Always <b>participate</b> in sickness prevention and health
                  promotion activities run by your Health service
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                Provide accurate and <b>complete information</b> about your health condition
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustInToctors.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                Treat the Health Team with <b>respect</b> and courtesy.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Looking forward to<br> tomorrow...
            </div>
            <p>
              You can find out more about these standards and rights
              <a href="https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/220207+A+NOTE+ON+SERVICE+STANDARDS+%26+RIGHTS.pdf">here</a>.
            </p>
            <p>
              At <b>tomorrow’s meeting</b>, you can share your experience of trying to provide services to these standards and rights. You will also be able to identify other issues that affect your work. With your team, you will agree a list of priority areas and then do a self-assessment.
            </p>
            <p>
            On <b>Wednesday’s meeting</b>, you will join health service users from the community you serve and compare notes from the assessment results. Together you’ll look at what actions can be taken to make improvements.
            </p>

            <p>
              Here’s the <a href="https://csc.citizens.is/meeting/4">link</a> to tomorrow’s meeting. We’ll resend it just before 11.00.
            </p>
          </cs-story-card>
        </cs-story-viewer>
      `;
    } else if (id == 3) {
      return html`
        <cs-story-viewer
          id="viewer"
          ?isiOs="${this.isiOs}"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        >
          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Your health service<br />
              Feedback and Action
            </div>

            <p style="text-align: center"><b>Welcome everyone!</b></p>
            <p>
              You have joined <b>Day 1</b> of the Feedback process for your
              rural field ambulatory health service.
            </p>
            <p>
              I’m <b>Bev Jones</b>, your facilitator for the next 2 hours, along
              with <b>Pietro Fiorentini.</b> And <b>Robert Bjarnason</b>
              is our producer.
            </p>

            <p>
              In the room we have the <b>health team</b> that provides services
              to about 3,000 <b>members of this rural community.</b> And we have
              members of that community here as well.
            </p>

            <p>
              <b>Thank you</b> for coming today. We know you are all very busy
              people.
            </p>

            <p>
              Your feedback and your experience is really
              <b>important for helping to improve services.</b>
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">The journey today</div>
            <p>
              For today, <b>most of our work will be in 2 separate groups</b> so
              that we can discuss our experiences openly.
            </p>

            <p>
              Tomorrow we will come together to
              <b>compare notes</b> and
              <b>identify what actions can be taken jointly</b> to help achieve
              the best service we can.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">Ground rules</div>
            <p>A few <b>ground rules</b> to help us.</p>

            <ul>
              <li>
                Please <b>keep on mute</b> when you are not speaking to improve
                sound quality.
              </li>
              <li>
                Please put <b>comments and questions in the chat</b> during
                presentations or discussions and we’ll try to bring you in.
              </li>
              <li>
                <b>Raise your hand</b> if you want to say something, and open
                your mike when invited to speak.
              </li>
              <li>
                Please <b>allow the facilitator to keep the process moving.</b>
              </li>
            </ul>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">1. Orientation</div>
            <p>
              We are now going to go through the information that we shared with
              you yesterday.
            </p>
            <p>
              This is a chance for you to raise questions of clarification. The
              main discussion will come afterwards in separate groups when you
              can also consider others issues that interest you.
            </p>

            <p>
              From Ministry of Health, this is the information intended to
              <b>guide the expectations and behaviours</b> of health service
              users, and the performance of the health team:
            </p>

            <ul>
              <li>
                the <span class="standardsTextColor">Standards</span> the field
                ambulatory should meet
              </li>
              <li>
                Your <span class="rightsTextColor">Rights</span> and
                <span class="rightsTextColor">Responsibilities</span> as a user
                of health services
              </li>
            </ul>

            <p>
              We’ll <b>familiarise ourselves</b> and then go into
              <b> separate groups</b> to discuss.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What <span class="standardsTextColor">standards</span> can you
              expect from your field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader standardsHeaderBackgroundColor"
                >
                  Standards
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctors1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                  <b>Health Team composition.</b> There is 1 full-time medical
                  doctor; 1 full-time qualified nurse and 1 part-time contract
                  cleaner.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/clock1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Health Team availability.</b> Working hours are
                  well-publicised and the Health Team is present and available
                  during these hours.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/siren1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Equipment.</b> The minimum list of basic health equipment
                  is available, in working order and clean.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/pregnant1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                  <b>Building and facilities.</b> A dedicated building with a
                  separate consultation and treatment area which ensures patient
                  privacy. A clean toilet in working order. Patient data stored
                  securely.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/drugs2.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Emergency service.</b> The Out of Hours emergency service
                  (‘on call’ duty medic and referral facilities) is easy to
                  access and up-to-date.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your <span class="rightsTextColor">rights</span> when
              using the field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Team
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/docktors2.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Treats you equally and with <b>respect</b> and care for
                  <b>your personal dignity</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctorinfo1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Understands that you have the right to <b>refuse treatment</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustdoctor1.png"
                  />
                </td>
                <td class="tableText rightsHighlightBackground">
                  <b>Helps</b> you and your family understand your health needs,
                  and treats this information <b>confidentially.</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Understands that you have the right to a
                  <b>second medical opinion</b> and helps you to access this.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your
              <span class="responsibilitiesTextColor">responsibilities</span>
              when using this service?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                  It is your responsibility to...
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthjustice.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  <b>Learn</b> about your rights, and ask for any clarifications
                  you may need
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/bosnia1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Always <b>participate</b> in sickness prevention and health
                  promotion activities run by your Health service
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Provide accurate and <b>complete information</b> about your
                  health condition
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustInToctors.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Treat the Health Team with <b>respect</b> and courtesy.
                </td>
              </tr>
            </table>
            <div class="blackBackground">
              Together, these 13 standards, rights and responsibilities form a
              Priority List for assessment - to which one further issue can be
              added by each group through the discussion.
            </div>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">2. Prioritization</div>
            <p>
              In a moment our producer will send you (virtually) into two
              separate groups: health service users and providers.
            </p>
            <p>
              With the help of a facilitator, each group will
              <b
                >discuss their experience of these standards, rights and
                responsibilities from their own perspective.</b
              >
            </p>

            <p>
              They will also <b>identify other areas or issues of interest.</b>
            </p>
            <p>
              They will then be asked to <b>vote for one more issue</b> to be
              included in the list of Priorities for assessment.
            </p>

            <p>
              Towards the end of the meeting, everyone will be asked to
              <b>rank each of the Priority issues.</b>
            </p>

            <ul>
              <li>Health service users will <b>assess their experience</b></li>

              <li>
                Health Service providers will
                <b>assess their own performance</b>
              </li>
            </ul>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">3. Ranking/Assessment</div>
            <p><b>Voting for one more issue</b></p>
            <p>
              Now that we have heard from people, it is time to vote for one
              more issue to be added to the Priority List.
            </p>

            <p><b>Ranking the whole list</b></p>

            <p>
              <b>For Health service users:</b> now it is time to rank the extent
              to which these standards and rights are being met in your field
              ambulatory, and the extent to which you feel you are meeting your
              responsibilities as users.
            </p>

            <p>
              <b>For Health service providers:</b> now it is time to rank your
              performance against the standards and rights, and to assess the
              extent to which you feel patients are fulfilling their
              responsibilities.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">For tomorrow</div>
            <p>
              Tomorrow, at the same time,
              <b>both groups will come together</b> again to
              <b>share the results</b> from their assessment of standards,
              rights and responsibilities.
            </p>

            <p>
              Then we’ll review and discuss the results to see where there are
              most
              <b>strengths and most challenges</b>, and
              <b>what improvements</b> can be made,
              <b>and how.</b>
            </p>

            <p>
              The aim of this exercise is to produce a
              <b>concise Action Plan</b> for the year ahead.
            </p>
          </cs-story-card>
        </cs-story-viewer>
      `;
    } else if (id == 5) {
      return html`
        <cs-story-viewer
          id="viewer"
          ?isiOs="${this.isiOs}"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        >
          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">
              Your health service<br />
              Feedback and Action
            </div>

            <p style="text-align: center"><b>Welcome everyone!</b></p>
            <p>
              You have joined <b>Day 1</b> of the Feedback process for your
              rural field ambulatory health service.
            </p>
            <p>
              A reminder that I’m <b>Bev Jones</b>, your facilitator for the
              next 2 hours, along with <b>Pietro Fiorentini.</b> And
              <b>Robert Bjarnason</b>
              is our producer.
            </p>

            <p>
              In the room we have the <b>health team</b> that provides services
              to about 3,000 <b>members of this rural community.</b> And we have
              members of that community here as well.
            </p>

            <p>
              <b>Thank you</b> for coming back. We had some great discussions
              yesterday. And your feedback and your experience is really
              <b>important for helping to improve services.</b>
            </p>

            <p>
              Your feedback and your experience is really
              <b>important for helping to improve services.</b>
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">The journey today</div>
            <p>
              For today, we will continue from Step 4 (Results) and work
              together, learning from the assessment and looking forward to
              improvements.
            </p>

            <p>
              Tomorrow we will come together to to step out of our roles and
              reflect on what we have learned from the exercise.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">Ground rules refresher</div>
            <p>A few <b>ground rules</b> to help us.</p>

            <ul>
              <li>
                Please <b>keep on mute</b> when you are not speaking to improve
                sound quality.
              </li>
              <li>
                Please put <b>comments and questions in the chat</b> during
                presentations or discussions and we’ll try to bring you in.
              </li>
              <li>
                <b>Raise your hand</b> if you want to say something, and open
                your mike when invited to speak.
              </li>
              <li>
                Please <b>allow the facilitator to keep the process moving.</b>
              </li>
            </ul>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">5. Review Results</div>
            <p>
              Here are the results from yesterday’s assessment exercise in
              separate groups:
            </p>

            <ul>
              <li>
                the <span class="standardsTextColor">Standards</span> the field
                ambulatory should meet
                <ul>
                  <li>From the community of users</li>
                  <li>From the Health team</li>
                </ul>
              </li>
              <li>
                Your <span class="rightsTextColor">Rights</span> and
                <span class="rightsTextColor">Responsibilities</span> as a user
                of health services
                <ul>
                  <li>From the community of users</li>
                  <li>From the Health team</li>
                </ul>
              </li>
            </ul>

            <p>And combined results.</p>

            <p>
              Let’s look at the results closely and then make sense of these.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">6. Developing Action Plan</div>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What <span class="standardsTextColor">standards</span> can you
              expect from your field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader standardsHeaderBackgroundColor"
                >
                  Standards
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctors1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                  <b>Health Team composition.</b> There is 1 full-time medical
                  doctor; 1 full-time qualified nurse and 1 part-time contract
                  cleaner.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/clock1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Health Team availability.</b> Working hours are
                  well-publicised and the Health Team is present and available
                  during these hours.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/siren1.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Equipment.</b> The minimum list of basic health equipment
                  is available, in working order and clean.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/pregnant1.png"
                  />
                </td>
                <td class="tableText standardsContentBackground">
                  <b>Building and facilities.</b> A dedicated building with a
                  separate consultation and treatment area which ensures patient
                  privacy. A clean toilet in working order. Patient data stored
                  securely.
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages standardsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/drugs2.png"
                  />
                </td>
                <td class="tableText standardsHighlightBackground">
                  <b>Emergency service.</b> The Out of Hours emergency service
                  (‘on call’ duty medic and referral facilities) is easy to
                  access and up-to-date.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your <span class="rightsTextColor">rights</span> when
              using the field ambulatory?
            </div>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Team
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/docktors2.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Treats you equally and with <b>respect</b> and care for
                  <b>your personal dignity</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/doctorinfo1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Understands that you have the right to <b>refuse treatment</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustdoctor1.png"
                  />
                </td>
                <td class="tableText rightsHighlightBackground">
                  <b>Helps</b> you and your family understand your health needs,
                  and treats this information <b>confidentially.</b>
                </td>
              </tr>
              <tr class="featureTr">
                <td class="tableImages rightsContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText rightsContentBackground">
                  Understands that you have the right to a
                  <b>second medical opinion</b> and helps you to access this.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your
              <span class="responsibilitiesTextColor">responsibilities</span>
              when using this service?
            </div>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                  It is your responsibility to...
                </td>
              </tr>
              <tr class="topFeatureTr">
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthjustice.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  <b>Learn</b> about your rights, and ask for any clarifications
                  you may need
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/bosnia1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Always <b>participate</b> in sickness prevention and health
                  promotion activities run by your Health service
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/healthprices1.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Provide accurate and <b>complete information</b> about your
                  health condition
                </td>
              </tr>
              <tr>
                <td class="tableImages responsibilitiesContentBackground">
                  <img
                    class="featureImage"
                    src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/trustInToctors.png"
                  />
                </td>
                <td class="tableText responsibilitiesContentBackground">
                  Treat the Health Team with <b>respect</b> and courtesy.
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">7. Voting on priority actions</div>
            <p>
              Once each issue and potential actions have been discussed,
              <b>a list of possible actions is assembled</b> the
              facilitator/producer.
            </p>
            <p>
              Participants then <b>vote for the actions</b> that they think are
              most important or urgent.
            </p>

            <p>
              The results are then
              <b>incorporated into an Action Plan template,</b> ready for
              further refinement and negotiation. (In some cases actions will be
              for actors outside the immediate group.)
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">8. Action Plan & Follow-up</div>
            <p>The meeting agrees ‘what next’ to:</p>

            <ul>
              <li>
                <b>Finalise the plan</b>
              </li>
              <li>
                <b>Share with relevant stakeholders</b>
                (including wider community and authorities)
              </li>
              <li>
                <b>Communicate proposed actions</b> to different stakeholders
              </li>
              <li>
                Put in place <b>a joint monitoring group</b> to track progress
                and launch the next update review
              </li>

              <p>
                A <b>note of the agreements</b> reached by the end of the
                meeting is made and circulated to all participants.
              </p>

              <p>
                Thank you to everyone for their participation! Now it’s time to
                step out of your roles.
              </p>
            </ul>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="blueHeader">For tomorrow</div>
            <p>
              We come together as <b>one group</b>
              tomorrow as ourselves (no more roles). Our task is to spend some
              time reflecting on the exercise:
            </p>
            <ul>
              <li>
                The
                <b>blend of digital, virtual and other facilitation</b> methods
              </li>
              <li>
                The <b>information content</b> of the feedback (standards,
                rights and responsibilities)
              </li>
              <li>
                The <b>feedback process</b>, from separate groups to analyse and
                assess, then joint meeting and discussion for action planning.
              </li>
            </ul>
          </cs-story-card>
        </cs-story-viewer>
      `;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        .blueHeader {
          background-color: #daeaf5;
          color: #222;
          padding: 16px;
          line-height: 1.35;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .blackBackground {
          background-color: #111;
          color: #daeaf5;
          padding: 12px;
          line-height: 1.2;
          font-size: 14px;
          margin-top: 16px;
        }

        cs-story-viewer {
          width: 400px;
          max-width: 100%;
          overflow: hidden;
        }

        /* Styles for specific story cards */
        .bottom {
          position: absolute;
          width: 100%;
          bottom: 48px;
          left: 0;
        }

        .bottom > * {
          margin: 0;
          text-align: center;
        }

        .bigHeader {
          font-size: 22px;
          padding: 8px;
          color: #000;
          text-align: center;
          padding-top: 0;
          margin-top: 0;
        }

        .smallHeader {
          font-size: 14px;
          font-weight: bold;
          padding: 8px;
          color: #000;
          text-align: center;
          padding-top: 0;
          margin-top: 0;
        }

        .moreQuestionsBox {
          padding: 8px;
          margin-top: 16px;
          background-color: #c55a11;
          color: #fff;
          font-size: 14px;
        }

        p {
          color: black;
          font-size: 14px;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        ol {
          color: black;
          font-size: 14px;
        }

        ul {
          color: black;
          font-size: 14px;
        }

        li {
          margin-bottom: 16px;
        }

        .extraBottom {
          margin-bottom: 16px;
        }

        .moreImagepadding {
          margin-bottom: 16px;
        }

        .smallImagepadding {
          margin-bottom: 8px;
        }

        .standardsHeaderBackgroundColor {
          color: #fff;
          background-color: #c55a11;
        }

        .standardsFooterBackground {
          color: #fff;
          background-color: #c55a11;
        }

        .standardsContentBackground {
          background-color: #fff;
          color: #000;
        }

        .standardsHighlightBackground {
          background-color: #fff;
          color: #000;
        }

        .standardsTextColor {
          color: #c55a11;
          font-weight: bold;
        }

        .standardsFooterBackground {
          color: #fff;
          background-color: #c55a11;
        }

        .rightsHeaderBackgroundColor {
          color: #fff;
          background-color: #2f5496;
        }

        .rightsFooterBackground {
          color: #fff;
          background-color: #2f5496;
        }

        .rightsContentBackground {
          background-color: #fff;
          color: #000;
        }

        .rightsHighlightBackground {
          background-color: #fff;
          color: #000;
        }

        .rightsTextColor {
          color: #2f5496;
          font-weight: bold;
        }

        .rightsFooterBackground {
          color: #fff;
          background-color: #2f5496;
        }

        .responsibilitiesHeaderBackgroundColor {
          color: #fff;
          background-color: #548135;
        }

        .responsibilitiesFooterBackground {
          color: #fff;
          background-color: #548135;
        }

        .responsibilitiesContentBackground {
          background-color: #fff;
          color: #000;
        }

        .responsibilitiesHighlightBackground {
          background-color: #fff;
          color: #000;
        }

        .responsibilitiesTextColor {
          color: #548135;
          font-weight: bold;
        }

        .responsibilitiesFooterBackground {
          color: #fff;
          background-color: #548135;
        }

        .featureImage {
          width: 120px;
          height: 68px;
          padding-top: 1px;
        }

        .tableText {
          font-size: 11px;
          vertical-align: top;
          padding-left: 4px;
        }

        .tableHeader {
          font-size: 16px;
          padding-top: 8px;
          padding-left: 8px;
        }

        table {
          border-collapse: collapse;
          border-spacing: 0;
        }

        .featureTr {
          border-top: 4px solid transparent;
        }

        .topFeatureTr {
          border-top: 16px solid transparent;
        }

        .tableFooter {
          font-size: 11px;
          padding: 8px;
          margin-top: 8px;
          text-align: center;
          color: #000 !important;
          background-color: #fff !important;
        }

        img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }

        a {
          color: #000;
        }

        .cscoverview {
          width: 250px;
          margin-top: 8px;
        }

        .areaLogo {
          width: 300px;
          margin-bottom: 16px;
        }

        .swipeText {
          font-size: 14px;
          text-align: center;
          margin-top: 128px;
        }

        @media (max-width: 600px) {
          cs-story-viewer {
            overflow-y: scroll;
          }

          .areaLogo {
            width: 280px;
          }

          p {
            font-size: 14px;
            margin-bottom: 16px;
          }

          ol {
            font-size: 14px;
          }

          ul {
            font-size: 14px;
          }

          .bigHeader {
            font-size: 18px;
          }
        }

        @media (max-width: 340px) {
          .areaLogo {
            width: 220px;
          }

          .bigHeader {
            font-size: 16px;
          }

          p {
            font-size: 12px;
            margin-bottom: 8px;
          }

          ol {
            font-size: 12px;
          }

          ul {
            font-size: 12px;
          }

          .tableText {
            font-size: 9px;
          }

          .tableHeader {
            font-size: 12px;
          }

          .bigHeader {
            padding-bottom: 4px;
          }

          .introHeader {
            font-size: 18px;
          }

          .featureImage {
            width: 90px;
            height: 51px;
          }
        }
      `,
    ];
  }

  videoEnded() {
    (this.$$('#viewer') as CsStoryViewer).next();
  }

  renderStory() {
    return this.renderStoryNumber(this.number);
  }

  render() {
    return this.renderStory();
  }
}
