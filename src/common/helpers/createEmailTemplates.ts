export const createUserInvitationMail = ({ companyName, username, token }: { companyName: string; username: string; token: string }) => {
  return `Welcome to ${companyName}!<br><br>

  Dear ${username},Your account has been successfully registered! <br>
  We warmly welcome you to ${companyName}!<br><br>
  
  Log in to ${companyName} by clicking the <a href='${process.env['FE_LINK']}?inviteToken=${token}'>link</a><br><br>
  
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
