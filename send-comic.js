const jsdom = require('jsdom');
const nodemailer = require('nodemailer');

const user = process.env.USER;
const pass = process.env.PASS;

jsdom.env({
    url: 'http://zitscomics.com/',
    done: (err, window) => {
        GLOBAL.window = window;
        GLOBAL.document = window.document;
        const emailString = parsePage();
        sendMail(emailString);
    }
})

function parsePage() {
    const img = document.getElementById('comicpanel')
        .getElementsByTagName('form')[0]
        .getElementsByTagName('img')[0].outerHTML;
    return "<html>" + img + "</html>";
}

function sendMail(emailString) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass }
    });

    const mailOptions = {
        from: '"Liam Dickson" <liam@songdickson.com>',
        to: 'liamsongdickson@gmail.com',
        subject: 'Zits Comic for ' + getDate(),
        text: 'View in HTML email viewer.',
        html: emailString
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent:', info.response);
    });
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    } 
    if (mm < 10) {
        mm = '0' + mm;
    } 
    return mm+'/'+dd+'/'+yyyy;
}
