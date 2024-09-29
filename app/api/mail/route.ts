import { Resend } from 'resend';
import KoalaWelcomeEmail from '../../../emails/index';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:Request, res:Response) {
  const { email, userFirstName } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "Acme <noreply@lolelaboutique.ro>",
    to: [email],
    subject: "Thank You",
    html: `<p>Click <a href="dsds">here</a> to confirm email.</p>`
  })

  if ( error ) {
    return Response.json(error);
  }

  return Response.json({message: "Email sent successfully"})
}