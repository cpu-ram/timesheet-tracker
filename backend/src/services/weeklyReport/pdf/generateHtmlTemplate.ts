import { WorkBlock } from '../../../types/WorkBlock.js';
import { FormattedWorkBlock } from '../../../types/FormattedWorkBlock.js';
import { ReportData } from '../../../types/ReportData.js';

export default function generateHtmlTemplate(reportData: ReportData): string {
  const contents =
    `
    ${reportData.workBlocks.map(
      (workBlock: FormattedWorkBlock) => {
        return `${TableRow(workBlock)}`;
      })
      .join('')
    }
  `;

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

    body {
      margin: 0.5em 2%;
    }

    header,
      footer {
      display: block;
      width: 50%;
      margin: 0 0 0 8%;
    }

    header > p,
      footer > p {
      display: inline-block;
      min-width: 24em;
      max-width: 24em;
      box-sizing: border-box;
      text-align: right;
    }

      h1 {
      text-transform: uppercase;
      font-family: 'Roboto', sans-serif;
      font-style: italic;
      margin-left: 5%;
      font-size: 1.3em;
    }

      table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    tr.table-header {
      font-weight: bold;
      font-size: 0.8em;
    }

    td {
      border: 1px solid black;
      margin: 0;
      padding: 0.2em 0.5em;
    }

    td.table-embedded {
      padding: 0;
      border: 0;
    }

    td.table-embedded p {
        text-align: right;
    }

    p, table p, tr p, td p, td, tr, table{
      font-family: 'Roboto', sans-serif !important;
      font-size: 1em;
    }

    p > span {
      display: block;
    }

    span.signature{
      font-family: 'Great Vibes', cursive;
      font-size: 1.5em;
    }

    p.statement-to-sign {
      font-style: italic;
    }

    span.field{
      display: flex;
    }

    span.field-label{
      display: block;
      text-align: right;
      min-width: 10em;
    }

    span.field-data {
      display: flex;
      width: 12em;
      box-sizing: border-box;
      border-bottom: 1px solid black;
      margin: 0;
      padding: 0 1em;
    }
  }`;

  return `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${style}
          </style>
        </head>
          
        <body>
          <h1>Weekly Timesheet</h1>

          <header>
            <p>
              <span class='field'>

                <span class='field-label'>
                Employee Name:
                </span>

                <span class='field-data'>
                  ${reportData.fullName}
                </span>

              </span>
              <span class='field'>

                <span class='field-label'>
                Week Start Date:
                </span>

                <span class='field-data'>
                  ${reportData.weekStartDate}
                </span>

              </span>
              <span class='field'>
                <span class='field-label'>
                  Week End Date:
                </span>
                <span class='field-data'>
                  ${reportData.weekEndDate}
                </span>
              </span>
            </p>
          </header>

          <table>
            <tr class='table-header'>
              <td>Job name/address</td>
              <td>Job #</td>
              <td>Date/Day</td>
              <td>Start Time</td>
              <td>Break Out Time</td>
              <td>Break In Time</td>
              <td>End Time</td>
              <td>Total Hours</td>
            </tr>

            ${contents}

            <tr>
              <td colspan='4' width='55%'>
                <p class='statement-to-sign'>
                  By signing this timesheet, I certify that above is an accurate reflection of all hours worked and not worked
                  during the indicated time period.
                </p>
              </td>

              <td colspan='3' class='table-embedded'>
                <table>
                  <tr>
                    <td>
                      <p>Total regular hours:</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>Total OT hours:</p>
                    </td>
                  </tr>
                </table>
              </td>

              <td colspan='1' class='table-embedded'>
                <table>
                  <tr>
                    <td>
                      <p>
                        ${reportData.regularHours}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>
                        ${reportData.overTimeHours}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <footer>
            <p>
              <span class='field'>

                <span class='field-label'>
                  Employee Signature:
                </span>

                <span class='field-data signature'>
                  ${reportData.fullName}
                </span>
              </span>

              <span class='field'>

                <span class='field-label'>
                  Date:
                </span>
                <span class='field-data'>
                  ${reportData.currentDate}
                </span>
                
              </span>
            </p>
          </footer>

        </body>
      </html>
    `;
}

function TableRow(workBlock: FormattedWorkBlock) {
  return `
    <tr>
      <td> 
        ${workBlock.jobsiteDetails}
      </td>
      <td>
        ${workBlock.jobsiteId}
      </td>
      <td>
        ${workBlock.date}
      </td>
      <td>
        ${workBlock.workBlockStart}
      </td>
      <td>
        ${workBlock.breakStart}
      </td>
      <td>
        ${workBlock.breakEnd}
      </td>
      <td>
        ${workBlock.workBlockEnd}
      </td>
      <td>
        ${workBlock.hours}
      </td>
    </tr>
  `;
}
