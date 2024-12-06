export const createUserInvitationMail = ({ companyName, username, token }: { companyName: string; username: string; token: string }) => {
  return `Welcome to ${companyName}!<br><br>

  Dear ${username},Your account has been successfully registered! <br>
  We warmly welcome you to ${companyName}!<br><br>
  
  Log in to ${companyName} by clicking the <a href='${process.env['FE_LINK']}?accessToken=${token}'>sign in</a><br><br>
  
  If you have any queries or require assistance during the setup process, <br>
  please do not hesitate to reply to this email. We are always available to assist you.<br><br>
  
  Best regards, ${companyName} team`;
};

export const createDriverInvitationMail = ({ companyName, username, otp }: { companyName: string; username: string; otp: string }) => {
  return `Welcome to ${companyName}!<br><br>

  Dear ${username},Your account has been successfully registered! <br>
  We warmly welcome you to ${companyName}!<br><br>
  
  Log in to ${companyName} by entering the verification code: ${otp}<br><br>
  
  If you have any queries or require assistance during the setup process, <br>
  please do not hesitate to reply to this email. We are always available to assist you.<br><br>
  
  Best regards, ${companyName} team`;
};

export const createCompanyInvitationMail = (companyName: string) => {
  return `Welcome to Smartporters! <br><br>

  Dear ${companyName}, Your company has been successfully registered! <br>
  We warmly welcome you to Smartporters!<br><br>
  
  If you have any queries or require assistance during the setup process, <br>
  please do not hesitate to reply to this email. We are always available to assist you.<br><br>
  
  Best regards, Smartporters team`;
};

export const createRouteNotificationMail = ({ username }: { username: string }) => {
  return `Dear ${username},<br><br>

  You have received a new route!<br>
  Start the route below:<br><br>

  <strong>Open in Google Maps</strong><br><br>

  Have a safe and comfortable journey! Drive carefully!<br><br>`;
};
