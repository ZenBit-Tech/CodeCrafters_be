import { EmailTemplateProps } from 'common/types/interfaces';

export const createEmailTemplate = ({ content, footerEmail, isAdmin, isSuperAdmin, otp, token }: EmailTemplateProps): string => {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f0fe; padding: 32px; font-family: Inter, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

            <tr>
              <td style="padding: 32px; background-color: #f1f0fe; text-align: left; font-family: Inter, Arial, sans-serif;">
                <img src="cid:mainLogo" alt="Logo" style="height: 26px; width: 36px; margin-right: 24px;  vertical-align: middle;"/>
                <span style="font-size: 24px; font-weight: 600; color: #1d1b20;  vertical-align: middle;">Codecrafters</span>
              </td>
            </tr>

            <tr>
              <td style="padding: 32px; margin: 0 0 16px; background-color: #ffffff; font-family: Inter, Arial, sans-serif; font-size: 16px; font-weight: 400; color: #1d1b20;">
                ${isSuperAdmin ? '' : `<p style="">Welcome to ${content.companyName}!</p>`}           
                <p style="margin: 0;">Dear ${content.fullName}, Your account has been successfully registered!</p>
                ${isSuperAdmin ? '' : `<p style="margin: 0;">We warmly welcome you to ${content.companyName}!</p>`} 
                <p style="margin: 0 0 16px;">${content.additionalInfo}</p>

                ${
                  otp
                    ? `<table width="10%" cellpadding="0" cellspacing="0" style="margin: 16px 0; background-color: #f5eff7; border-radius: 8px;">
                      <tr>
                        <td style="padding: 4px 8px; text-align: center; font-size: 18px; font-weight: bold; color: #333;">${otp}</td>
                      </tr>
                    </table>`
                    : ''
                }
                ${
                  isAdmin
                    ? `<a href="${process.env['FE_LINK']}?accessToken=${token}" style="display: inline-block; background-color: #7367f0; color: #ffffff; text-decoration: none; padding: 8px 14px; border-radius: 8px; font-size: 16px;">Go to the application</a>`
                    : ''
                }
                <p>If you have any queries or require assistance during the setup process, please do not hesitate to reply to this email. We are always available to assist you.</p>
                <p style="margin: 0 0 16px;">Best regards,</p>
                <p style="margin: 0;">Codecrafters team</p>
              </td>
            </tr>

            <tr>
              <td style="padding: 24px; background-color: #f8f7ff; font-family: Inter, Arial, sans-serif; font-size: 14px; color: #333333;">
                <p style="margin: 0 0 48px;">
                  This email was sent to 
                  <a href="mailto:${footerEmail}" style="color: #7367f0; text-decoration: underline;">${footerEmail}</a>.
                  If you'd rather not receive this kind of email, you can 
                  <a href="#" style="color: #7367f0; text-decoration: none;">unsubscribe or manage your email preferences</a>.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                  <tr>
                    <td align="left" style="font-size: 20px; font-weight: 600; color: #1d1b20;">
                      Codecrafters
                    </td>
                    <td align="right">
                      <a href="https://twitter.com" style="margin-right: 20px; text-decoration: none;">
                        <img src="cid:twitterIcon" alt="Twitter" style="width: 24px; height: 24px; vertical-align: middle;" />
                      </a>
                      <a href="https://facebook.com" style="margin-right: 20px; text-decoration: none;">
                        <img src="cid:facebookIcon" alt="Facebook" style="width: 24px; height: 24px; vertical-align: middle;" />
                      </a>
                      <a href="https://linkedin.com">
                        <img src="cid:linkedinIcon" alt="LinkedIn" style="width: 24px; height: 24px; vertical-align: middle;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
};

export const createCompanyInvitationMail = (companyName: string) => {
  return `Welcome to Codecrafters! <br><br>

  Dear ${companyName}, Your company has been successfully registered! <br>
  We warmly welcome you to Codecrafters!<br><br>
  
  If you have any queries or require assistance during the setup process, <br>
  please do not hesitate to reply to this email. We are always available to assist you.<br><br>
  
  Best regards, Codecrafters team`;
};

export const createRouteNotificationMail = ({ username }: { username: string }) => {
  return `Dear ${username},<br><br>

  You have received a new route!<br>
  Start the route below:<br><br>

  <strong>Open in Google Maps</strong><br><br>

  Have a safe and comfortable journey! Drive carefully!<br><br>`;
};
