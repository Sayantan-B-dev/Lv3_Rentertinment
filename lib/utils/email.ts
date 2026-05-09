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
  const toEmail = process.env.EMAIL_TO || "info@rentertinment.in";

  try {
    const { data: resData, error } = await resend.emails.send({
      from: "Rentertinment <onboarding@resend.dev>", // Replace with verified domain in prod
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
          <p style="font-size: 0.8rem; color: #777;">This inquiry was sent from the Rentertinment platform.</p>
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
