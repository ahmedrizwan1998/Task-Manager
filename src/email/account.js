// const emailjs = require("emailjs-com");

// const email = emailjs.sendForm('gmail', 'task-manager', 'L2UBjHSRVfJl0N0QY')
// .then((result) => {
//     console.log(result.text);
// }, (error) => {
//     console.log(error.text);
// });

// module.exports = email;

const sgMail = require("@sendgrid/mail");

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name)  => {
    sgMail.send({
        to: email,
        from: 'ahmedriz1998.ar@gmail.com',
        subject: 'Welcome to our APP',
        text: `Hello ${name}. Hope you enjoy your time here`
    });

};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ahmedriz1998.ar@gmail.com',
        subject: 'Sorry that you are leaving',
        text: `${name}, Let us know how can we be of help`
    });
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}