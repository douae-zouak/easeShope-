const sgMail = require("@sendgrid/mail");
const emailTemplate = require("../utils/emailTemplate");

sgMail.setApiKey(
  "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"
);

exports.sendResetSuccesEmail = async (recipient) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "Sucessful reset of your password",
    html: emailTemplate.PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await sgMail.send(msg);
    console.log("susseccful reset password ");
  } catch (error) {
    throw new Error(
      `Error sending successful reset password : ${error.message}`
    );
  }
};

exports.sendVerficationCodeAgain = async (recipient, verificationToken) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "New Verification Code",
    html: emailTemplate.VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    await sgMail.send(msg);
    console.log("Verification code sent again successfully");
  } catch (error) {
    throw new Error(
      `Error sending successful reset password : ${error.message}`
    );
  }
};
