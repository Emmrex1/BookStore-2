export const registerSuccessTemplate = (username) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f8; padding: 40px 0; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://res.cloudinary.com/dwhx6woy3/image/upload/v1753202544/iu7bg4g8aby5ifs94xow.png" alt="Emmrex Bookstore" style="max-width: 140px;" />
      </div>

      <h2 style="color: #4f46e5; text-align: center;">Welcome aboard, ${username}! 🎉</h2>
      <p style="font-size: 16px; line-height: 1.6; text-align: center;">
        We're thrilled to have you at <strong>Emmrex Bookstore</strong>. Dive into a world of curated books, special offers, and exciting discoveries tailored just for you.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/login" 
           style="background-color: #4f46e5; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Login to Your Account
        </a>
      </div>

      <p style="font-size: 14px; text-align: center; color: #666;">
        Need help or have questions? Feel free to reply to this email — we're here for you.
      </p>

      <p style="text-align: center; margin-top: 40px; font-size: 14px; color: #999;">
        — Warm regards, <br />
        <strong>The Emmrex Team</strong>
      </p>
    </div>
  </div>
`;
