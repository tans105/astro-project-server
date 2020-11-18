const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: function (data) {
        const transporter = nodemailer.createTransport({
                service: 'yahoo',
                auth: {
                    user: 'tanmayawasthi105@yahoo.com',
                    pass: 'kictppfrqtlrfjwi'
                }
            }),
            email = data['email'],
            primary = data['primary'],
            secondary = data['secondary'],
            latitude = data['latitude'],
            longitude = data['longitude'],
            dob = JSON.stringify(data['dob']),
            pob = data['pob'],
            tob = JSON.stringify(data['tob']),
            fname = data['fname'],
            template = `
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
            </table>
            
            </body>
            </html>

            `;


        const mailOptions = {
            from: 'tanmayawasthi105@yahoo.com',
            to: 'tanmayawasthi105@yahoo.com',
            // cc: 'tanmayawasthi105@yahoo.com',
            subject: `AstroPundit - New Query - ${fname}`,
            html: template
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.status(201).send({message: 'Updated successfully ' + info.message});
            }
        });
    }
};