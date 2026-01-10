// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to,cc, subject, html } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: 'mail.artisticbuz.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@artisticbuz.com',
        pass: 'ArtB@#2025',
      },
    });

    // Configure email options
    const mailOptions = {
      from: '"Hair Graft Calculator Support" <support@artisticbuz.com>',
      to: to,
      cc: cc,
      subject: subject,
      html: html,
      // Note: File attachments would need to be handled differently
      // For now, we're only sending the HTML email
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error: any) {
    console.error('Error sending email:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your email credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection to email server failed.';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: 500 }
    );
  }
}