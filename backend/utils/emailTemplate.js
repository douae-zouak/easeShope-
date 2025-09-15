exports.VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

exports.WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Community!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to E-commmerce!</h1>
  </div>


  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {fullName},</p>
    
    <p>We're thrilled to have you on board! 🎉</p>
    
    <p>Here's what you can do next to start your shopping journey:</p>
    <ul style="padding-left: 20px;">
      <li>🎁 <strong>Explore trending products</strong></li>
      <li>🛒 <strong>Complete your first order</strong> </li>
      <li>⭐ <strong>Save your favorites</strong> - Create a wishlist for later</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{loginURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
    </div>

    
    <p>Welcome aboard,<br>
    <strong>The E-commerce Team</strong></p>
  </div>


  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

exports.PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

exports.PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 30 minutes for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

exports.RECEIPT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 40px 30px;
    }
    .thank-you {
      text-align: center;
      margin-bottom: 30px;
    }
    .cta-button {
      display: block;
      width: 200px;
      margin: 30px auto;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 14px;
      background: #f8f9fa;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Your Order! 💫</h1>
    </div>
    
    <div class="content">
      <div class="thank-you">
        <h2>Your Trust Means Everything to Us</h2>
        <p>Dear valued customer,</p>
        <p>We're truly grateful for your purchase and the confidence you've placed in us. Your order has been successfully received and is now being processed with care.</p>
      </div>
      
      <p style="text-align: center;">You can track your order status anytime by clicking the button below:</p>
      
      <a href="{orderLink}" class="cta-button">Track My Order</a>
      
      <p style="text-align: center; color: #666;">
        Should you have any questions, our support team is always here to help you.
      </p>
    </div>
    
    <div class="footer">
      <p>With gratitude,<br><strong>The EaseShop Team</strong></p>
      <p>© 2025 EaseShop. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

exports.PRODUCT_REJECTION_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Rejection</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #ff4b4b, #ff7b7b); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Product Rejection</h1>
  </div>
  
  <div style="background-color: #f9f9f9; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
    <p>Dear {userName},</p>
    
    <p>Thank you for submitting your product "<strong style="color: #ff4b4b;">{productName}</strong>" to our marketplace.</p>
    
    <p>After careful review, we regret to inform you that your product listing has <strong>not been approved</strong> at this time.</p>
    
    <div style="background-color: #fff4f4; border-left: 4px solid #ff4b4b; padding: 15px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #ff4b4b;">Reason for Rejection:</h3>
      <p style="margin-bottom: 0; font-style: italic;">{rejectionReason}</p>
    </div>
    
    <p>To get your product approved, please address the issue mentioned above and resubmit your listing.</p>

    
    <p>If you have any questions or need further clarification, please don't hesitate to contact our support team.</p>
    
    <p>Best regards,<br>
    <strong>The Marketplace Team</strong></p>
  </div>
  
  <div style="text-align: center; margin-top: 25px; color: #888; font-size: 0.8em; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>Need help? Contact our support team at <a href="mailto:support@marketplace.com" style="color: #4CAF50;">support@marketplace.com</a></p>
    <p>© 2023 Marketplace Name. All rights reserved.</p>
  </div>
</body>
</html>`;

exports.DESACTIVATED_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Deactivation Notice</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    body {
      background-color: #f7f7f7;
      color: #333333;
      line-height: 1.6;
      padding: 20px;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    .email-header {
      background: linear-gradient(to right, #ff4b4b, #ff7b7b);
      padding: 25px;
      text-align: center;
    }
    
    .email-header h1 {
      color: white;
      font-size: 24px;
      margin: 0;
    }
    
    .email-body {
      padding: 30px;
    }
    
    .alert-box {
      background-color: #fff4f4;
      border-left: 4px solid #ff4b4b;
      padding: 20px;
      margin-bottom: 25px;
      border-radius: 4px;
    }
    
    .alert-box h3 {
      color: #ff4b4b;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .reason-box {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    
    .reason-box h4 {
      color: #495057;
      margin-bottom: 10px;
    }
    
    .next-steps {
      background-color: #e8f4fd;
      border-left: 4px solid #2196F3;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    
    .next-steps h3 {
      color: #2196F3;
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    .contact-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      margin: 25px 0;
      text-align: center;
    }
    
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin: 15px 0;
    }
    
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    
    ul {
      padding-left: 20px;
      margin: 15px 0;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    @media (max-width: 600px) {
      .email-body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Account blocked</h1>
    </div>
    
    <div class="email-body">
      <p>Dear {vendorName},</p>
      
      <p>We hope this message finds you well. We're writing to inform you about an important change to your vendor account status.</p>
      
      <div class="alert-box">
        <h3>Account Deactivated</h3>
        <p>Your shop account has been deactivated by our administration team.</p>
      </div>
      
      <p>After careful review, we've determined that your account does not currently comply with our marketplace policies and guidelines.</p>
      
      <div class="reason-box">
        <h4>Reason for Deactivation:</h4>
        <p>{deactivationReason}</p>
        <p><strong>Date of Deactivation:</strong> {deactivationDate}</p>
      </div>
      
      <h3>What This Means:</h3>
      <ul>
        <li>Your products are no longer visible to customers</li>
        <li>You cannot process new orders</li>
        <li>You cannot access your vendor dashboard</li>
        <li>Pending orders will be handled according to our policies</li>
      </ul>
      
      <div class="next-steps">
        <h3>Next Steps</h3>
        <p>If you believe this deactivation was made in error, or if you'd like to appeal this decision:</p>
        
        <ol>
          <li>Review our <a href="{policyLink}">Vendor Guidelines</a></li>
          <li>Address the issues mentioned above</li>
          <li>Submit an appeal through our vendor support portal</li>
        </ol>
        
        <center>
          <a href="{appealLink}" class="button">Submit Appeal</a>
        </center>
      </div>
      
      <div class="contact-info">
        <h3>Need Help?</h3>
        <p>Our support team is here to assist you with any questions:</p>
        <p>Email: <a href="mailto:support@marketplace.com">support@marketplace.com</a></p>
        <p>Phone: +1 (800) 123-4567</p>
        <p>Hours: Monday-Friday, 9AM-5PM EST</p>
      </div>
      
      <p>We value your participation in our marketplace and hope to assist you in resolving this matter.</p>
      
      <p>Best regards,<br>
      <strong>The Marketplace Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
      <p>© 2023 Marketplace Name. All rights reserved.</p>
      <p><a href="{unsubscribeLink}">Unsubscribe</a> from these notifications</p>
    </div>
  </div>
</body>
</html>`;
