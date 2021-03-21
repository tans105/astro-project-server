const parseUtil = require('../utils/parse.util');

module.exports = {
    getTemplate: (data) => {
        const type = data['emailType'];
        if (type) {
            return (type === 'feedback') ? getFeedbackTemplate(data) : getQueryTemplate(data)
        } else {
            return null;
        }
    }
}

function getQueryTemplate(data) {
    const {
        email,
        primary,
        secondary,
        sob,
        dob,
        pob,
        tob,
        fname,
        questions,
        amount,
        service
    } = parseUtil.parse(data);

    let quesTpl = '';
    questions.forEach((question) => {
        quesTpl += `<li>${JSON.stringify(question)}</li>`
    });

    let subject = `MangalamBhav - New Query - ${fname}`;
    let body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
    </head>
    <body>
      
      <h2>Query</h2>
      <br>
      
      <table>
        <tr>
          <td>Service</td>
          <td>${service}</td>
        </tr>
        <tr>
          <td>Full Name</td>
          <td>${fname}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Primary Contact</td>
          <td>${primary}</td>
        </tr>
        <tr>
          <td>Secondary Contact</td>
          <td>${secondary}</td>
        </tr>
        <tr>
          <td>City of Birth</td>
          <td>${pob}</td>
        </tr>
        <tr>
          <td>State of Birth</td>
          <td>${sob}</td>
        </tr>
        <tr>
          <td>Date of Birth</td>
          <td>${dob}</td>
        </tr>
        <tr>
          <td>Time of Birth</td>
          <td>${tob}</td>
        </tr>
        <tr>
          <td>Questions</td>
          <td><ul>${quesTpl}</ul></td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>${amount}</td>
        </tr>
      </table>
      
    </body>
    </html>
    `;

    return {subject, body};
}

function getFeedbackTemplate(data) {
    const email = data['email'],
        name = data['name'],
        feedback = data['feedback'];

    let subject = 'Feedback Recieved !'
    let body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
    </head>
    <body>
      
      <h2>Query</h2>
      <br>
      
      <table>
        <tr>
          <td>Full Name</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Feedback</td>
          <td>${feedback}</td>
        </tr>
      </table>
      
    </body>
    </html>
    `;

    return {subject, body};
}