import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export async function sendInquiryEmail(data: {
  artistName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate?: string;
  eventType: string;
  message?: string;
}) {
  const toEmail = process.env.EMAIL_TO || "info@BlueEye.in";

  try {
    const { data: resData, error } = await resend.emails.send({
      from: "BlueEye <onboarding@resend.dev>", // Replace with verified domain in prod
      to: [toEmail],
      subject: `New Inquiry for ${data.artistName} from ${data.clientName}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #d4a017;">New Artist Inquiry</h2>
          <p><strong>Artist:</strong> ${data.artistName}</p>
          <hr />
          <p><strong>Client Name:</strong> ${data.clientName}</p>
          <p><strong>Email:</strong> ${data.clientEmail}</p>
          <p><strong>Phone:</strong> ${data.clientPhone}</p>
          <p><strong>Event Type:</strong> ${data.eventType}</p>
          <p><strong>Event Date:</strong> ${data.eventDate || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 1rem; border-radius: 5px;">
            ${data.message || "No message provided."}
          </div>
          <br />
          <p style="font-size: 0.8rem; color: #777;">This inquiry was sent from the BlueEye platform.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data: resData };
  } catch (err) {
    console.error("Email Service Error:", err);
    return { success: false, error: err };
  }
}
export async function sendVerificationEmail(email: string, code: string) {
  try {
    const { data: resData, error } = await resend.emails.send({
      from: "BlueEye <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your BlueEye Account",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 2rem; background: #0a0807; color: #fff;">
          <h2 style="color: #d4a017;">Verify Your Account</h2>
          <p>Thank you for joining BlueEye. Use the code below to verify your email address. This code will expire in 10 minutes.</p>
          <div style="font-size: 2.5rem; font-weight: bold; color: #d4a017; margin: 2rem 0; letter-spacing: 0.5rem; background: rgba(212,160,23,0.1); padding: 1rem; border-radius: 10px; border: 1px dashed #d4a017;">
            ${code}
          </div>
          <p style="color: #777; font-size: 0.8rem;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });
    if (error) throw error;
    return { success: true, data: resData };
  } catch (err) {
    console.error("Verification email fail:", err);
    return { success: false, error: err };
  }
}
