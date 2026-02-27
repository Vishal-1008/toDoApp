import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `${title}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 10px 20px; background-color: #dbdbdb; border-radius: 10px;">
        <h4>You got a feedback from one of your <span style="color:#89ac46;">task</span><span style="color:#ffa955;">pilot</span> user!</h4>
        <p style="padding-bottom: 10px;">${message}</p>
        <p style="font-size: 12px; color: gray; border-top: 1px solid gray; padding-top: 10px;">This email was sent from Taskpilot's feedback form</p>
      </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Email failed" });
  }
}