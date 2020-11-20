const nodemailer = require('nodemailer');

function getTemplate(data) {
    const email = data['email'],
        primary = data['primary'],
        secondary = data['secondary'],
        latitude = data['latitude'],
        longitude = data['longitude'],
        dob = JSON.stringify(data['dob']),
        pob = data['pob'],
        tob = JSON.stringify(data['tob']),
        fname = data['fname'],
        questions = data['questions'];

    let quesTpl = '';
    questions.forEach((question) => {
        quesTpl += `<li>${JSON.stringify(question)}</li>`
    });

    return `
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
          <td>Place of Birth</td>
          <td>${pob}</td>
        </tr>
        <tr>
          <td>Latitude</td>
          <td>${latitude}</td>
        </tr>
        <tr>
          <td>Longitude</td>
          <td>${longitude}</td>
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
      </table>
      
    </body>
    </html>
    `;
}

module.exports = {
    sendEmail: function (req, res, cb) {
        const transporter = nodemailer.createTransport({
                service: 'yahoo',
                auth: {
                    user: 'tanmayawasthi105@yahoo.com',
                    pass: 'kictppfrqtlrfjwi'
                }
            }),
            data = req.body,
            template = getTemplate(data);

        const mailOptions = {
            from: 'tanmayawasthi105@yahoo.com',
            to: 'sandhya_awasthi2005@yahoo.co.in',
            cc: 'tanmayawasthi105@yahoo.com',
            subject: `AstroPundit - New Query - ${data['fname']}`,
            html: template
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                cb({success: false, msg: 'Failed to send email ' + error}, res);
            } else {
                cb({success: true, msg: 'Updated successfully ' + info.message}, res);
            }
        });
    }
};
