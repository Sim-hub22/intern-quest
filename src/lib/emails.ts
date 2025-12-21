import { resend } from "@/lib/resend";

interface SendVerificationEmailParams {
  email: string;
  otp: string;
}

interface SendPasswordResetEmailParams {
  email: string;
  otp: string;
}

export async function sendVerificationEmail({
  email,
  otp,
}: SendVerificationEmailParams) {
  await resend.emails.send({
    from: "InternQuest <onboarding@internquest.tech>",
    to: [email],
    subject: "Verify your InternQuest account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your InternQuest account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">InternQuest</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">Thank you for signing up! Please use the verification code below to verify your email address and complete your registration.</p>
                      
                      <!-- OTP Box -->
                      <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                        <div style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Your Verification Code</div>
                        <div style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                      </div>
                      
                      <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>.</p>
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">If you didn't request this code, please ignore this email.</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                        &copy; ${new Date().getFullYear()} InternQuest. All rights reserved.<br>
                        Connecting talent with opportunity.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail({
  email,
  otp,
}: SendPasswordResetEmailParams) {
  await resend.emails.send({
    from: "InternQuest <onboarding@internquest.tech>",
    to: [email],
    subject: "Reset your InternQuest password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your InternQuest password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">InternQuest</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Use the code below to create a new password for your account.</p>
                      
                      <!-- OTP Box -->
                      <div style="background-color: #fff5f5; border: 2px dashed #f56565; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                        <div style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Password Reset Code</div>
                        <div style="font-size: 36px; font-weight: 700; color: #f56565; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                      </div>
                      
                      <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>.</p>
                      <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                      
                      <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
                        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                          <strong>Security tip:</strong> Never share this code with anyone. InternQuest will never ask for this code.
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                        &copy; ${new Date().getFullYear()} InternQuest. All rights reserved.<br>
                        Connecting talent with opportunity.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
