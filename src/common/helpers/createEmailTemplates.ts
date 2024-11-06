export const createUserInvitationMail = ({ companyName, username, token }: { companyName: string; username: string; token: string }) => {
  return `Welcome to ${companyName}!

  Dear ${username},Your account has been successfully registered! 
  We warmly welcome you to ${companyName}!
  
  Log in to ${companyName} by clicking the <a href='${process.env['FE_LINK']}?inviteToken=${token}'>link</a>
  
  If you have any queries or require assistance during the setup process, 
  please do not hesitate to reply to this email. We are always available to assist you.
  
  Best regards, ${companyName} team`;
};

export const createCompanyInvitationMail = (companyName: string) => {
  return `Welcome to Smartporters!

  Dear ${companyName}, Your company has been successfully registered! 
  We warmly welcome you to Smartporters!
  
  If you have any queries or require assistance during the setup process, 
  please do not hesitate to reply to this email. We are always available to assist you.
  
  Best regards, Smartporters team`;
};
