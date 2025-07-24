import nodemailer from "nodemailer";

// Fixed 1: Accept options object instead of individual parameters
// const sendEmail = async (options) => {
//   // Fixed 2: Add proper email validation
//   if (!options?.to?.trim()) {
//     console.error("❌ Error sending email: No valid recipients defined");
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: `"Bookstore Admin" <${process.env.EMAIL_USER}>`,
//     to: options.to,
//     subject: options.subject,
//     text: options.text,
//     html: options.html,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${options.to}`);
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//   }
// };

//  export default sendEmail;


// const sendEmail = async (options) => {
//   if (!options?.to?.trim()) {
//     console.error("❌ Error: No recipient email address provided.");
//     return { success: false, message: "Recipient email is required" };
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Bookstore Admin" <${process.env.EMAIL_USER}>`,
//       to: options.to,
//       subject: options.subject || "Bookstore Notification",
//       text: options.text || "You have a message from Bookstore Admin.",
//       html: options.html || "", // Optional HTML content
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log(`✅ Email sent to ${options.to}: ${info.messageId}`);
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("❌ Email send error:", error.message);
//     return { success: false, message: error.message };
//   }
// };

// export default sendEmail;

// Send email utility
const sendEmail = async ({ to, subject, html, text }) => {
  if (!to?.trim()) {
    console.error("❌ No recipient email provided.");
    return { success: false, message: "Recipient email is required." };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"📚 Emmrex Bookstore" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "Notification from Emmrex Bookstore",
      text: text || "You have a new notification from Emmrex Bookstore.",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} — ID: ${info.messageId}`);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    return { success: false, message: error.message };
  }
};

export default sendEmail;
