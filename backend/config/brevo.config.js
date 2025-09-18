const nodemailer = require("nodemailer");
const emailTemplate = require("../utils/emailTemplate");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // hôte SMTP Brevo
  port: 587, // port TLS
  secure: false, // TLS sur STARTTLS
  auth: {
    user: process.env.BREVO_EMAIL, // ton adresse email
    pass: process.env.BREVO_TOKEN, // ton mot de passe ou app password
  },
});

exports.sendVerificationEmail = async (recipient, verificationToken) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "Verify you email",
    html: emailTemplate.VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    await transporter.sendMail(msg);
    console.log("verifcation email sent successfully");
  } catch (error) {
    throw new Error(`Error sending verify email : ${error.message}`);
  }
};

exports.welcomeEmail = async (fullName, loginURL, recipient) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "Welcome email",
    html: emailTemplate.WELCOME_EMAIL_TEMPLATE.replace(
      "{fullName}",
      fullName
    ).replace("{loginURL}", loginURL),
  };

  try {
    await transporter.sendMail(msg);
    console.log("Welcome email sent successfully");
  } catch (error) {
    throw new Error(`Error sending welcome email : ${error.message}`);
  }
};

exports.sendResetPasswordEmail = async (recipient, resetURL) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "Reset your password",
    html: emailTemplate.PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      resetURL
    ),
  };

  try {
    await transporter.sendMail(msg);
    console.log("Reset password email sent successfully");
  } catch (error) {
    throw new Error(`Error sending reset password email : ${error.message}`);
  }
};

exports.sendResetSuccesEmail = async (recipient) => {
  const msg = {
    to: recipient, // destinataire
    from: process.env.EMAIL_USER, // email vérifié sur SendGrid
    subject: "Sucessful reset of your password",
    html: emailTemplate.PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await transporter.sendMail(msg);
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
    await transporter.sendMail(msg);
    console.log("Verification code sent again successfully");
  } catch (error) {
    throw new Error(
      `Error sending successful reset password : ${error.message}`
    );
  }
};

exports.OrderReciept = async (recipient) => {
  const msg = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: "Thank you for your order! 🌟",
    html: emailTemplate.RECEIPT.replace(
      "{orderLink}",
      `${process.env.FRONTEND_URL}/orders`
    ),
  };

  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending successful order : ${error.message}`);
  }
};

exports.ProductRejected = async (
  recipient,
  sellerName,
  productName,
  reason
) => {
  const msg = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: "Product rejcted! ",
    html: emailTemplate.PRODUCT_REJECTION_EMAIL_TEMPLATE.replace(
      "{userName}",
      sellerName
    )
      .replace("{productName}", productName)
      .replace("{rejectionReason}", reason),
  };

  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending product rejection order : ${error.message}`);
  }
};

exports.VendorDesactivated = async (
  recipient,
  sellerName,
  reason,
  deactivationDate
) => {
  const msg = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: "Your are desactivated! ",
    html: emailTemplate.DESACTIVATED_EMAIL_TEMPLATE.replace(
      /{vendorName}/g,
      sellerName
    )
      .replace(/{deactivationReason}/g, reason)
      .replace(/{deactivationDate}/g, deactivationDate)
      .replace(
        /{policyLink}/g,
        "https://yourmarketplace.com/vendor-guidelines"
      ),
  };

  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending product rejection order : ${error.message}`);
  }
};

exports.ReturnRequestRejected = async (
  recipient,
  clientName,
  orderNumber,
  reuqestDate,
  product,
  productName,
  reason,
  rejectionReason
) => {
  const msg = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: "Return request rejected! ",
    html: emailTemplate.RETURN_REQUEST_REJECTED.replace(
      /{clientName}/g,
      clientName
    )
      .replace(/{orderNumber}/g, orderNumber)
      .replace(/{reuqestDate}/g, reuqestDate)
      .replace(/{productName}/g, productName)
      .replace(/{productColor}/g, product.colorTitle)
      .replace(/{productSize}/g, product.size)
      .replace(/{returnReason}/g, reason)
      .replace(/{rejectionReason}/g, rejectionReason),
  };

  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending product rejection order : ${error.message}`);
  }
};

exports.ReturnRequestApproved = async (
  recipient,
  clientName,
  orderNumber,
  reuqestDate,
  product,
  productName,
  reason
) => {
  const msg = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: "Return request approved ",
    html: emailTemplate.RETURN_REQUEST_APPROVED.replace(
      /{clientName}/g,
      clientName
    )
      .replace(/{orderNumber}/g, orderNumber)
      .replace(/{reuqestDate}/g, reuqestDate)
      .replace(/{productName}/g, productName)
      .replace(/{productColor}/g, product.colorTitle)
      .replace(/{productSize}/g, product.size)
      .replace(/{returnReason}/g, reason)
      .replace(/{productPrice}/g, product.priceAtPurchase.toFixed(2)),
  };

  try {
    await transporter.sendMail(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending product rejection order : ${error.message}`);
  }
};
