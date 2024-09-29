import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async ( email:string, token:string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token} </p>`
  })
} 

export const sentPasswordResetEmail = async (email:string, token:string) => {
  const resetLink = `https://lolelaboutique.ro/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
  });
};

export const sentVerificationEmail = async (email:string, token:string) => {
  const confirmLink = `https://lolelaboutique.ro/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};