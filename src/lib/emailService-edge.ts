export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

function getFromAddress(): string {
  return (
    process.env.FROM_EMAIL || 'Pacha of London <admin@pachaoflondon.com>'
  );
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable is required');
      return false;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return false;
  }
}

export async function sendOTPEmail(
  email: string,
  otp: string,
): Promise<boolean> {
  const subject = 'Pacha of London Admin - OTP Doğrulama Kodu';

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Doğrulama</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #1a365d;
          margin-bottom: 10px;
        }
        .otp-code {
          background-color: #f7fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .otp-number {
          font-size: 32px;
          font-weight: bold;
          color: #2d3748;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .warning {
          background-color: #fff5f5;
          border-left: 4px solid #f56565;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #718096;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Pacha of London</div>
          <p>Admin Paneli Doğrulama</p>
        </div>
        
        <h2>Merhaba,</h2>
        <p>Admin paneline giriş yapmak için aşağıdaki 6 haneli doğrulama kodunu kullanın:</p>
        
        <div class="otp-code">
          <div class="otp-number">${otp}</div>
        </div>
        
        <div class="warning">
          <strong>Önemli:</strong>
          <ul>
            <li>Bu kod 10 dakika geçerlidir</li>
            <li>Kodu kimseyle paylaşmayın</li>
            <li>Bu kodu siz talep etmediyseniz, bu e-postayı görmezden gelin</li>
          </ul>
        </div>
        
        <p>Eğer bu işlemi siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.</p>
        
        <div class="footer">
          <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
          <p>&copy; 2024 Pacha of London. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Pacha of London Admin - OTP Doğrulama Kodu
    
    Merhaba,
    
    Admin paneline giriş yapmak için aşağıdaki 6 haneli doğrulama kodunu kullanın:
    
    ${otp}
    
    ÖNEMLİ:
    - Bu kod 10 dakika geçerlidir
    - Kodu kimseyle paylaşmayın
    - Bu kodu siz talep etmediyseniz, bu e-postayı görmezden gelin
    
    Eğer bu işlemi siz yapmadıysanız, lütfen hemen bizimle iletişime geçin.
    
    Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
    
    © 2024 Pacha of London. Tüm hakları saklıdır.
  `;

  // Resend API ile email gönder
  return await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendSellWatchEmail(form: any): Promise<boolean> {
  const adminEmail = 'pachaoflondon@gmail.com';

  const subjectUser = 'Pacha of London - Watch Submission Received';
  const subjectAdmin = 'New Watch Submission - Pacha of London';

  const htmlUser = `
    <h2>Thank you for your submission</h2>
    <p>Dear ${form.firstName} ${form.lastName},</p>
    <p>We have received your watch submission. Our team will review it and contact you shortly.</p>
    <hr />
    <h3>Your Watch Details</h3>
    <ul>
      <li><strong>Brand:</strong> ${form.brand}</li>
      <li><strong>Model:</strong> ${form.model}</li>
      <li><strong>Year:</strong> ${form.year}</li>
      <li><strong>Expected Price:</strong> ${form.priceCurrency} ${form.expectedPrice}</li>
    </ul>
    <p>Best regards,<br/>Pacha of London</p>
  `;

  const htmlAdmin = `
    <h2>New Watch Submission</h2>
    <h3>Customer Information</h3>
    <ul>
      <li><strong>Name:</strong> ${form.firstName} ${form.lastName}</li>
      <li><strong>Email:</strong> ${form.email}</li>
      <li><strong>Phone:</strong> ${form.phone}</li>
      <li><strong>Country:</strong> ${form.country}</li>
      <li><strong>City:</strong> ${form.city}</li>
    </ul>

    <h3>Watch Information</h3>
    <ul>
      <li><strong>Brand:</strong> ${form.brand}</li>
      <li><strong>Model:</strong> ${form.model}</li>
      <li><strong>Year:</strong> ${form.year}</li>
      <li><strong>Condition:</strong> ${form.condition}</li>
      <li><strong>Expected Price:</strong> ${form.priceCurrency} ${form.expectedPrice}</li>
      <li><strong>Description:</strong> ${form.description}</li>
    </ul>

    <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
  `;

  const userMail = await sendEmail({
    to: form.email,
    subject: subjectUser,
    html: htmlUser,
  });

  const adminMail = await sendEmail({
    to: adminEmail,
    subject: subjectAdmin,
    html: htmlAdmin,
  });

  return userMail && adminMail;
}

// Test Resend API konfigürasyonu
export async function testEmailConnection(): Promise<boolean> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is required');
      return false;
    }

    console.log('Resend API configuration found');
    return true;
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
}
