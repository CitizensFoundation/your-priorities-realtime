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
  isLive = false;

  @property({ type: Boolean })
  isAdmin = false;

  setIndex(index: number) {
    (this.$$('#viewer') as CsStoryViewer).setIndex(index);
  }

  stories: Record<number, TemplateResult> = {
    1: html`
      <cs-story-viewer
        id="viewer"
        ?isLive="${this.isLive}"
        ?isAdmin="${this.isAdmin}"
      >
        <cs-story-card>
          <img
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png"
          />
          <div class="bottom">
            <h1 style="font-family: serif">SERVICE STANDARDS</h1>
          </div>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="smallImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med1.png"
              />
            </div>
          </div>
          <h3>
            Your health center is meant to perform according to the national
            standards set by the Ministry of Health for all health centers
          </h3>

          <p>For instance:</p>
          <ol>
            <li>
              <b>Staff on duty (XX per population)</b> during working hours to
              provide you with the care that meets your needs
            </li>
            <li>
              Staff attending the health center on time and being present all
              day <b>Out of hours standards: 24 hour standby duty</b> for
              emergencies with publicly posted contact information and schedule
            </li>
            <li>
              Access to medicines: <b>12 drug deliveries</b> per year to your
              health center ensure there is enough medicine for treatment
            </li>
            <li>Care for women: Pregnancy and newborn screening</li>
            <li>Care for the elderly</li>
          </ol>
        </cs-story-card>

        <cs-story-card>
          <img
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png"
          />
          <div class="bottom">
            <h1 style="font-family: serif">YOUR RIGHTS</h1>
            <p style="color: white">
              You also have rights and responsibilities when you attend a health
              center
            </p>
          </div>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>
            Your Health Center staff should treat you equally and with respect
          </h3>
          <ul>
            <li>
              Your Health Center staff will provide you with healthcare and
              services that meet your needs
            </li>
            <li>
              You have the right to be treated with respect and dignity by the
              Health Center staff
            </li>
            <li>
              No person should be discriminated because of race, ethnicity,
              color, poverty, sex, marital status, physical or mental disability
              and illnesses, age, language, religion, political orientation,
              national or social origin when receiving health care
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>
            Your Health Center staff will display service information about the
            Health Center
          </h3>
          <ul>
            <li>
              You have the right to obtain information on the type of health
              services offered, working hours, client flow, price lists and
              exemptions, including method of payment for services used
            </li>
            <li>You can ask for information to be explained.</li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>
            Your Health Center staff will help you understand your and your
            family’s health, and for confidentiality
          </h3>
          <ul>
            <li>
              You have the right to know about your health status and care, it
              should be explained so you can understand easily
            </li>
            <li>
              All of your health information including your health status,
              diagnosis, and treatment, are confidential and will be kept in a
              safe place
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>Your Health Center staff will charge you only listed fees</h3>
          <ul>
            <li>
              You will be informed about the price of services, how to pay for
              services, and if you need to pay for the health care services you
              receive
            </li>
            <li>
              You will not be asked to pay any amounts more than what is
              displayed
            </li>
            <li>
              Your Health Center staff will not accept any extra informal
              payments for health services
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>You can expect privacy, especially for women</h3>
          <ul>
            <li>
              During your treatment, the Health Center staff will make sure you
              have privacy, particularly when carrying out physical exams and
              treatment, especially for women
            </li>
            <li>Woman should have separate areas for treatment</li>
            <li>You can access to separate and functioning toilets</li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med2.png"
              />
            </div>
          </div>
          <h3>Ask you for consent and feedback</h3>
          <ul>
            <li>
              Health Center staff must provide all information on choices of
              care and treatment, and make recommendations for you to make the
              appropriate decisions for your health
            </li>
            <li>
              Your Health Center staff will always ask if you agree to
              treatments or procedures, before they provide the service . they
              should ask you for feedback after
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card>
          <img
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png"
          />
          <div class="bottom">
            <h1>YOUR RESPONSIBILITIES</h1>
            <p style="color: white">
              You have responsibilities as a client at the Health Center to
              ensure you receive good quality care and treatment
            </p>
          </div>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="smallImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med3.png"
              />
            </div>
          </div>
          <h3>Before going to the Health Center</h3>
          <ul>
            <li>
              You should actively learn about your rights, you ask for
              clarification to know your rights
            </li>
            <li>
              You should always participate in prevention and health promotion
              activities recommended by Health Center staff
            </li>
          </ul>
          <h3>During your visit at the Health Center</h3>
          <ul>
            <li>
              You should provide accurate and complete information about health
              condition and records
            </li>
            <li>
              You are responsible to pay the official fees, you should not pay
              informal fees
            </li>
            <li>
              You are responsible to treat the Health Center staff with respect
              and courtesy
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card>
          <img
            slot="media"
            src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/shutterstock_1147582w93.png"
          />
          <div class="bottom">
            <h1>
              CHECK YOUR HEALTH CENTER’S PERFORMANCE COMPARED WITH NATIONAL
              SERVICE STANDARDS
            </h1>
            <p style="color: white">
              Does your Health Center provide the services according to national
              service standards?
            </p>
          </div>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med3.png"
              />
            </div>
          </div>
          <h3>
            Does your Health Center have enough staff working to provide health
            care?
          </h3>
          <ul>
            <li>What is the required number of staff in your health center?</li>
            <li>
              Last year, how many staff did your Health Center employ during
              working hours?
            </li>
            <li>
              Were they always present? (This information is kept on the
              timesheets).
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med3.png"
              />
            </div>
          </div>
          <h3>Does your Health Center have 24hr standby duty?</h3>
          <ul>
            <li>
              Your Health Center should have 24 hour standby duty for
              emergencies with publicly posted contact information and schedule
            </li>
            <li>
              Last year, did your health center ensure there were staff on call
              to provide you with care?
            </li>
            <li>
              Last year, did your health center have the required 24 hour
              standby duty? YES/NO
            </li>
          </ul>
        </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <div class="layout horizontal center-center">
            <div>
              <img
                width="75"
                class="moreImagepadding"
                src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/med3.png"
              />
            </div>
          </div>
          <h3>Does your health center have enough medicines?</h3>
          <ul>
            <li>
              Your Health Center should receive 12 drug deliveries each year,
              about one a month.
            </li>
            <li>
              Last year, how many drug deliveries did your health center
              receive?
            </li>
            <li>
              Last year, did your health center receive the planned drug
              deliveries?
            </li>
          </ul>
        </cs-story-card>

        <img
          style="object-fit: cover"
          src="https://i.imgur.com/ktDKGxb.jpg"
          draggable="false"
        />
      </cs-story-viewer>
    `,
    2: html`
      <cs-story-viewer
        id="viewer"
        ?isLive="${this.isLive}"
        ?isAdmin="${this.isAdmin}"
      >

        <cs-story-card style="background: white;color: black"> </cs-story-card>

        <cs-story-card style="background: white;color: black">
          <p>Dear resident of <b>Simin Han,</b></p>
          <p>
            As a user of the Simin Han Health Centre, you are invited to join a
            <b>Community Score Card process</b> – to design a tool for giving
            feedback on your experience of using the health centre.
          </p>
          <p>
            This is to help identify <b>priorities for improvement</b> which, in
            discussion with health service providers, will lead to a joint
            <b>action plan</b>.
          </p>
          <p>
            Please <b>save the dates</b> – for which you will receive an
            invitation link:
          </p>
          <ul>
            <li>
              <b>Thursday May 13th at 1400 BST</b> – for an Orientation on your
              rights and responsibilities, and what standards you can expect
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
              <span class="rightsTextColor">Responsibilities</span> as a user of
              health services
            </li>
            <li>The Community Score Card process</li>
            <p>
              Three of these standards/rights have been identified as
              <b>national priorities for feedback</b> (called ‘core’). These are
              highlighted in yellow and will automatically be included in the
              Score Card
            </p>
            <p>
              In addition, you will be able to discuss and select
              <b>three additional issues</b> that are most relevant to your
              local experience.
            </p>
          </ul>
        </cs-story-card>

        <style>
          .tableHeader {
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
            background-color: #fff2cc;
            color: #000;
          }

          .standardsHighlightBackground {
            background-color: #ffff00;
            color: #000;
          }

          .standardsTextColor {
            color: #c55a11;
          }

          .standardsFooterBackground {
            color: #fff;
            background-color: #c55a11;
          }
        </style>

        <cs-story-card style="background: white;color: black">
          <div class="bigHeader">
            What <span class="standardsTextColor">standards</span> can you
            expect?
          </div>
          <p>
            Your Health Centre should perform to these National Standards set by
            the Ministry of Health for all Health Centres.
          </p>
          <table>
            <tr>
              <td class="tableHeader standardsHeaderBackgroundColor">&nbsp;</td>
              <td class="tableHeader standardsBackgroundColor">Standards</td>
            </tr>
            <tr>
              <td class="tableImages standardsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText standardsContentBackground">
                <b>Staff/pop ratio:</b> At Simin Han, 4.4 staff include 1
                doctor, 2 nurses and a part-time medical assistant and
                receptionist.
              </td>
            </tr>
            <tr>
              <td class="tableImages standardsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText standardsHighlightBackground">
                <b>Staff Punctuality:</b>Staff attend the Centre on time, and
                are present all day.
              </td>
            </tr>
            <tr>
              <td class="tableImages standardsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText standardsHighlightBackground">
                <b>Emergency service:</b> Out of working hours ‘on call’ duty
                medic, with publicly posted contact information and schedule.<b
                  >Staff Punctuality:</b
                >Staff attend the Centre on time, and are present all day.
              </td>
            </tr>
            <tr>
              <td class="tableImages standardsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText standardsContentBackground">
                <b>Screening service:</b> for pregnant women and newborn babies.
              </td>
            </tr>
            <tr>
              <td class="tableImages standardsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText standardsHighlightBackground">
                <b>Medicines:</b> 12 drug deliveries per year ensures that there
                is adequate medicine for treatment.
              </td>
            </tr>
            <tr>
              <td colspan="2" class="tableFooter standardsFooterBackground">
                For more detail,
                <a href="https://link"
                  >click on this link to find a PDF of the full set of
                  standards, rights and responsibilities.</a
                >
              </td>
            </tr>
          </table>
        </cs-story-card>

        <style>
          .tableHeader {
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
            background-color: ##d8e2f3;
            color: #000;
          }

          .rightsHighlightBackground {
            background-color: #ffff00;
            color: #000;
          }

          .rightsTextColor {
            color: #2f5496;
          }

          .rightsFooterBackground {
            color: #fff;
            background-color: #2f5496;
          }
        </style>

        <cs-story-card style="background: white;color: black">
          <div class="bigHeader">
            What are your <span class="rightsTextColor">rights</span>?
          </div>
          <p>
            In relation to your Health Centre and local health service, you have the following rights:
          </p>
          <table>
            <tr>
              <td class="tableHeader rightsHeaderBackgroundColor">&nbsp;</td>
              <td class="tableHeader rightsBackgroundColor">Your Health Centre staff</td>
            </tr>
            <tr>
              <td class="tableImages rightsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText rightsContentBackground">
                Should treat you equally and with <b>respect</b>.
              </td>
            </tr>
            <tr>
              <td class="tableImages rightsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText rightsContentBackground">
                Will <b>display</b> service information about the Health Centre
              </td>
            </tr>
            <tr>
              <td class="tableImages rightsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText rightsHighlightBackground">
                Will <b>help</b> you and your family understand your health needs,
                and treat this information <b>confidentially</b>.
              </td>
            </tr>
            <tr>
              <td class="tableImages rightsContentBackground">
                <img src="https://..." />
              </td>
              <td class="tableText rightsContentBackground">
              Will charge you only <b>listed fees.</b>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="tableFooter rightsFooterBackground">
                For more detail,
                <a href="https://link"
                  >click on this link to find a PDF of the full set of
                  rights, rights and responsibilities.</a
                >
              </td>
            </tr>
          </table>
        </cs-story-card>

      </cs-story-viewer>
    `,
  };

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
        .regulationHeader {
          font-size: 16px;
          color: black;
          margin-bottom: 16px;
          margin-top: 16px;
        }

        .regulationText {
          font-size: 11px;
          color: black;
          margin-bottom: 8px;
        }

        p {
          color: black;
          font-size: 20px;
          margin-bottom: 16px;
        }

        ol {
          color: black;
          font-size: 16px;
        }

        h3 {
          color: black;
          font-size: 18px;
          margin-bottom: 16px;
        }

        h1 {
          font-size: 26px;
        }

        ul {
          color: black;
          font-size: 16px;
        }

        @media (max-width: 600px) {
          cs-story-viewer {
            overflow-y: scroll;
          }

          p {
            font-size: 18px;
            margin-bottom: 16px;
          }

          ol {
            font-size: 14px;
          }

          h1 {
            font-size: 24px;
          }

          h3 {
            font-size: 14px;
            margin-bottom: 16px;
          }

          ul {
            font-size: 14px;
          }
        }

        li {
          margin-bottom: 16px;
        }

        .moreImagepadding {
          margin-bottom: 16px;
        }

        .smallImagepadding {
          margin-bottom: 8px;
        }
      `,
    ];
  }

  renderStory() {
    return this.stories[this.number];
  }

  render() {
    return this.renderStory();
  }
}
