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

  haveSetVideoEndEvent = false

  constructor() {
    super();
    this.isiOs =
    /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (this.$$("#videoPlayer") && !this.haveSetVideoEndEvent) {
      this.haveSetVideoEndEvent = true;
      const videoPlayer = this.$$("#videoPlayer") as HTMLVideoElement;
      videoPlayer.addEventListener('ended', (event: any) => {
        event.preventDefault();
        this.videoEnded();
      })
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
              Introduction to the Community Score Card
            </div>
            <p class="swipeText">Please swipe to continue</p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <video
              id="videoPlayer"
              slot="media"
              src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/b4839.mp4"
              ?controls="${this.isiOs}"
            ></video>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="layout vertical center-center">
              <img
                class="areaLogo"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/siminHan.png"
              />
            </div>
            <p>Dear resident of <b>Simin Han,</b></p>
            <p>
              As a user of the Simin Han Health Centre, you are invited to join
              a
              <b>Community Score Card process</b> – to design a tool for giving
              feedback on your experience of using the health centre.
            </p>
            <p>
              This is to help identify <b>priorities for improvement</b> which,
              in discussion with health service providers, will lead to a joint
              <b>action plan</b>.
            </p>
            <p>
              Please <b>save the dates</b> – for which you will receive an
              invitation link:
            </p>
            <ul>
              <li>
                <b>Thursday May 13th at 1400 BST</b> – for an Orientation on
                your rights and responsibilities, and what standards you can
                expect
              </li>
              <li>
                <b>Friday May 14th at 1400 BST</b> – to discuss and agree
                priorities standards for inclusion in the
                <b>Community Score Card.</b>
              </li>
            </ul>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">Find out more before Thursday…</div>

            <p>Here’s some information about :</p>
            <ul>
              <li>
                the <span class="standardsTextColor">Standards</span> you can
                expect from your Simin Han Health Centre, and
              </li>
              <li>
                Your <span class="rightsTextColor">Rights</span> and
                <span class="rightsTextColor">Responsibilities</span> as a user
                of health services
              </li>
              <li>The Community Score Card process</li>
            </ul>
            <p>
              Three of these standards/rights have been identified as
              <b>national priorities for feedback</b> (called ‘core’). These are
              <u>highlighted</u> with a (*) and will automatically be included in the
              Score Card
            </p>
            <p>
              In addition, you will be able to discuss and select
              <b>three additional issues</b> that are most relevant to your
              local experience.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What <span class="standardsTextColor">standards</span> can you
              expect?
            </div>
            <p>
              Your Health Centre should perform to these National Standards set
              by the Ministry of Health for all Health Centres.
            </p>
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
                  <b>Staff/pop ratio:</b> At Simin Han, 4.4 staff include 1
                  doctor, 2 nurses and a part-time medical assistant and
                  receptionist.
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
                  <b>Staff Punctuality:</b>Staff attend the Centre on time, and
                  are present all day.
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
                  <b><u>Emergency service:</u></b> Out of working hours ‘on
                  call’ duty medic, with publicly posted contact information and
                  schedule. (*)
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
                  <b>Screening service:</b> for pregnant women and newborn
                  babies.
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
                  <b><u>Medicines:</u></b> 12 drug deliveries per year ensures
                  that there is adequate medicine for treatment. (*)
                </td>
              </tr>
              <tr>
                <td colspan="2" class="tableFooter standardsFooterBackground">
                  For more detail,
                  <a
                    href="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/220510+SERVICE+STANDARDS+BRIEFING+NOTE.pdf"
                    target="_blank"
                    >click on this link to find a PDF of the full set of
                    standards, rights and responsibilities.</a
                  >
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your <span class="rightsTextColor">rights</span>?
            </div>
            <p>
              In relation to your Health Centre and local health service, you
              have the following rights:
            </p>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Centre staff
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
                  Should treat you equally and with <b>respect</b>.
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
                  Will <b>display</b> service information about the Health
                  Centre
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
                  Will <b>help</b> you and your family understand your health
                  needs, and treat this information <b>confidentially</b>.
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
                  Will charge you only <b>listed fees.</b>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="tableFooter rightsFooterBackground">
                  For more detail,
                  <a
                    href="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/220510+SERVICE+STANDARDS+BRIEFING+NOTE.pdf"
                    target="_blank"
                    >click on this link to find a PDF of the full set of rights,
                    rights and responsibilities.</a
                  >
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              What are your
              <span class="responsibilitiesTextColor">responsibilities</span>?
            </div>
            <p>
              You have responsibilities as a user of the Health Centre to ensure
              you receive good quality care and treatment.
            </p>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                  You should...
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
                  promotion activities run by your Health Centre
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
                  Pay the <b>official listed fees</b> and you should not pay
                  informal fees.
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
                  Treat the Health Centre staff with respect and courtesy.
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="tableFooter responsibilitiesFooterBackground"
                >
                  For more detail,
                  <a
                    href="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/220510+SERVICE+STANDARDS+BRIEFING+NOTE.pdf"
                    target="_blank"
                    >click on this link to find a PDF of the full set of
                    responsibilities, responsibilities and responsibilities.</a
                  >
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="smallHeader">
              If you have the time, here’s some more information about Community
              Score Card
            </div>
            <p>
              It’s a constructive <b>5-step process</b> that helps citizens give
              feed-back to service providers on their experience of the service.
            </p>
            <p>
              With support of a facilitator, a
              <b>community of users develops a Score Card</b> of priority
              issues.
            </p>
            <p>
              This is then used to <b>score performance</b> and to develop, with
              service providers, an <b>Action Plan for improvement</b> –
              monitored over time.
            </p>
            <p>
              This week, we’re working on <b>Step 1</b> (Orientation) and
              <b>Step 2</b> (Scorecard).
            </p>
            <div class="layout vertical center-center">
              <img
                class="cscoverview"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/cscoverivew.png"
              />
            </div>
          </cs-story-card>
        </cs-story-viewer>
      `;
    } else if (id == 2) {
      return html`
        <cs-story-viewer
          id="viewer"
          ?isLive="${this.isLive}"
          ?isAdmin="${this.isAdmin}"
        >
          <cs-story-card style="background: white;color: black">

            <div class="bigHeader extraBottom">
              Welcome to Orientation!
            </div>
            <div class="layout vertical center-center">
              <img
                class="areaLogo"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/siminHan.png"
              />
            </div>

            <p>
              You’ve joined a meeting with other residents of Simin Han.
            </p>
            <p>
              All of you are health service users.
            </p>
            <p>
              The purpose of today is to review the service standards of your
              Health Center, and to review your rights and responsibilities as users.
            </p>
            <p>
            Your facilitator for today is <b>Bev Jones.</b> Bev is an independent facilitator
            who has worked in NGOs for many years.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">A quick reminder of what we’re doing today</div>

            <p>We’ll run through the information already provided:</p>
            <ul>
              <li>
                the <span class="standardsTextColor">Standards</span> you can
                expect from your Simin Han Health Centre, and
              </li>
              <li>
                Your <span class="rightsTextColor">Rights</span> and
                <span class="rightsTextColor">Responsibilities</span> as a user
                of health services
              </li>
              <li>The Community Score Card process</li>
            </ul>
            <p>
              Three of these standards/rights have been identified as
              <b>national priorities for feedback</b> (called ‘core’). These are:
            </p>
            <ol>
              <li>Staff punctuality</li>
              <li>Medicines supplies</li>
              <li>Fee charges</li>
            </ol>
            <p>
              These are <u>highlighted</u> with a (*) and will automatically be included in the Score Card.
            </p>
            <p>
              In addition, you will be able to discuss and select <b>three additional issues</b> that are
              most relevant to your local experience.
            </p>

            <p>
            Let’s start with <span class="standardsTextColor">Standards</span>.
            </p>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              Here are the <span class="standardsTextColor">standards</span> you
              expect
            </div>
            <p>
            - What more would you like to know about thee standards?<br>
            - Why do you think #2 and #5 are core issues of interest at national level?
            </p>
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
                  <b>1. Staff/pop ratio:</b> At Simin Han, 4.4 staff include 1
                  doctor, 2 nurses and a part-time medical assistant and
                  receptionist.
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
                  <b>2. Staff Punctuality:</b>Staff attend the Centre on time, and
                  are present all day.
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
                  <b><u>3. Emergency service:</u></b> Out of working hours ‘on
                  call’ duty medic, with publicly posted contact information and
                  schedule. (*)
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
                  <b>4. Screening service:</b> for pregnant women and newborn
                  babies.
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
                  <b><u>5. Medicines:</u></b> 12 drug deliveries per year ensures
                  that there is adequate medicine for treatment. (*)
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              Here are your <span class="rightsTextColor">rights</span> as users.
            </div>
            <p>
               - What more would you like to know about these rights?<br>
              - Why do you think #3 is of national interest?
            </p>
            <table>
              <tr class="headerTr">
                <td colspan="2" class="tableHeader rightsHeaderBackgroundColor">
                  Your Health Centre staff
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
                  1. Should treat you equally and with <b>respect</b>.
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
                  2. Will <b>display</b> service information about the Health
                  Centre
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
                  3. Will <b>help</b> you and your family understand your health
                  needs, and treat this information <b>confidentially</b>.
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
                  4. Will charge you only <b><u>listed fees</u>.(*)</b>
                </td>
              </tr>
            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              Here are your
              <span class="responsibilitiesTextColor">responsibilities</span> as users.
            </div>
            <p>
              - What do you think of these responsibilities?<br>
              - Which is the most important?<br>
              - Which is the most challenging to do?<br>
            </p>
            <table>
              <tr class="headerTr">
                <td
                  colspan="2"
                  class="tableHeader responsibilitiesHeaderBackgroundColor"
                >
                  You should...
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
                  promotion activities run by your Health Centre
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
                  Pay the <b>official listed fees</b> and you should not pay
                  informal fees.
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
                  Treat the Health Centre staff with respect and courtesy.
                </td>
              </tr>

            </table>
          </cs-story-card>

          <cs-story-card style="background: white;color: black">
            <div class="smallHeader">
              More on the Score Card Process
            </div>
            <p>
              It’s a constructive <b>5-step process</b> that helps citizens give
              feed-back to service providers on their experience of the service.
            </p>
            <p>
              With support of a facilitator, a
              <b>community of users develops a Score Card</b> of priority
              issues.
            </p>
            <p>
              This is then used to <b>score performance</b> and to develop, with
              service providers, an <b>Action Plan for improvement</b> –
              monitored over time.
            </p>
            <p>
              This week, we’re working on <b>Step 1</b> (Orientation) and
              <b>Step 2</b> (Scorecard).
            </p>
            <div class="layout vertical center-center">
              <img
                class="cscoverview"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/csc/cscoverivew.png"
              />
            </div>
            <div class="moreQuestionsBox">
              Do you have any questions about the process and how it works?
            </div>

          </cs-story-card>
          <cs-story-card style="background: white;color: black">
            <div class="bigHeader">
              For tomorrow
            </div>
            <p>
              At our meeting tomorrow, we’ll be doing three things:
            </p>
            <ol>
              <li><b>Discussing your experience</b> of your local Health Center –
                what works well, and what does not.</li>
              <li><b>Identifying the key issues</b> that matter to you locally
                (including what you think about the three ‘core’ issues already identified).</li>
              <li><b>Prioritising the three most important</b> ones for you (in addition to the core ones).</li>
            </ol>
            <p>
              These will then be added to the Score Card so that there will be 5 areas of
              assessment in the next part of the process.
            </p>

          </cs-story-card>
        </cs-story-viewer>
      `;
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
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
    (this.$$("#viewer") as CsStoryViewer).next();
  }

  renderStory() {
    return this.renderStoryNumber(this.number);
  }

  render() {
    return this.renderStory();
  }
}
