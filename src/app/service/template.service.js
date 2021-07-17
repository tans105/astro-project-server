const parseUtil = require('../utils/parse.util');

module.exports = {
    getTemplate: (data) => {
        const type = data['emailType'];

        switch (type) {
            case 'feedback':
                return getFeedbackTemplate(data)
            case 'query':
                return getQueryTemplate(data)
            case 'receipt':
                return getReceiptTemplate(data)
            default:
                return null
        }
    }
}

function getReceiptTemplate(data) {
    const subject = 'MangalamBhav:: Query posted successfully!'
    let body = `
    <!DOCTYPE html>
    <html>
    <body>
      <p>Thank you for posting to us. We will get back to you as soon as possible.</p>
      <br>
      <p>Here is your reference number for any future communications from us</p> 
      <pre>${data.uuid}</pre>
    </body>
    </html>
    `;
    return {subject, body}
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
        service,
        sob_girl,
        dob_girl,
        pob_girl,
        tob_girl,
        fname_girl,
    } = parseUtil.parse(data);

    let quesTpl = '';
    questions.forEach((question) => {
        quesTpl += `<li>${JSON.stringify(question)}</li>`
    });

    const subject = `MangalamBhav - New Query - ${service} - ${email} - ${primary}`;
    let body = `
    <!DOCTYPE html>
    <html>
       <head>
          <style>
             table {
               font-family: arial, sans-serif;
               border-collapse: collapse;
               width: 100%;
               margin: 20px 0;
             }
    
             td, th {
               border: 1px solid #dddddd;
               text-align: left;
               padding: 8px;
               width: 50%
             }
    
             .data-table tr {
               background-color: #dddddd;
               border-top: 2px solid white;
               border-bottom: 2px solid white;
             }
    
             .data-table td {
               border: 2px solid white;
               padding: 8px;
             }
    
             ul {
               padding: 0;
               margin: 0;
             }
          </style>
       </head>
       <body>
          <h2>Query</h2>
          <br>
          <table>
             <tr>
                <td>UUID</td>
                <td>${data.uuid}</td>
             </tr>
             <tr>
                <td>Service</td>
                <td>${service}</td>
             </tr>
             <tr>
                <td>Amount</td>
                <td>${amount}</td>
             </tr>
          </table>
          <table class="data-table">
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
          </table>
          
          <h3>Person 1 Details</h3>
          <table class="data-table">
            <tr>
                <td>Full Name</td>
                <td>${fname}</td>
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
          </table>
    `;

    if (service === 'kundli') {
        body += `
      <h3>Person 2 Details</h3>
      <table class="data-table">
        <tr>
            <td>Full Name</td>
            <td>${fname_girl}</td>
         </tr>
         <tr>
            <td>City of Birth</td>
            <td>${pob_girl}</td>
         </tr>
         <tr>
            <td>State of Birth</td>
            <td>${sob_girl}</td>
         </tr>
         <tr>
            <td>Date of Birth</td>
            <td>${dob_girl}</td>
         </tr>
         <tr>
            <td>Time of Birth</td>
            <td>${tob_girl}</td>
         </tr>
      </table>   `
    }

    if (service === 'custom') {
        body += `
      <h3>Custom Query</h3>
      <table class="data-table">
         <tr>
            <td>Questions</td>
            <td>
               <ul>${quesTpl}</ul>
            </td>
         </tr>
      </table>
        `
    }

    body += `
    </body>
    </html>
    `

    return {subject, body};
}

function getFeedbackTemplate(data) {
    const email = data['email'],
        name = data['name'],
        feedback = data['feedback'];

    const subject = 'Feedback Recieved !'
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