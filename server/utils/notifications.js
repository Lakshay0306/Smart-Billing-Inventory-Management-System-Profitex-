import Twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

export const sendWhatsAppNotification = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:${to}`,
    });
    console.log("WhatsApp message sent to", to);
  } catch (error) {
    console.error("WhatsApp notification failed:", error.message);
  }
};
