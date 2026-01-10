// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns/promises';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max per file
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp'
];

// Set global DNS timeout (optional)
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Only in development or if you control the server
  require('dns').setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
}

export async function POST(request: NextRequest) {
  try {
    // Add timeout for the entire request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      // Parse form data (not JSON!)
      const formData = await request.formData();

      // Extract text fields
      const to = formData.get('to') as string;
      const cc = formData.get('cc') as string;
      const subject = formData.get('subject') as string;
      const html = formData.get('html') as string;
      const formDataJson = formData.get('formData') as string;
      const selectedType = formData.get('selectedType') as string;
      const estimatedGrafts = formData.get('estimatedGrafts') as string;
      const estimatedPrice = formData.get('estimatedPrice') as string;

      // Validate required fields
      if (!to || !subject || !html) {
        return NextResponse.json(
          { error: 'Missing required fields: to, subject, or html' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        return NextResponse.json(
          { error: 'Invalid recipient email address' },
          { status: 400 }
        );
      }

      // Parse form data JSON if provided
      let parsedFormData = null;
      if (formDataJson) {
        try {
          parsedFormData = JSON.parse(formDataJson);
        } catch (error) {
          console.warn('Failed to parse formData JSON');
        }
      }

      // Process attachments
      const attachments: any[] = [];
      const imageFiles: string[] = [];

      // Process hair style image
      const hairStyleImage = formData.get('hairStyleImage') as File | null;
      if (hairStyleImage && hairStyleImage.size > 0) {
        try {
          await processAndAddAttachment(
            hairStyleImage,
            attachments,
            'desired_hairstyle',
            imageFiles
          );
        } catch (error: any) {
          return NextResponse.json(
            { error: `Hair style image: ${error.message}` },
            { status: 400 }
          );
        }
      }

      // Process current hair image
      const currentHairImage = formData.get('currentHairImage') as File | null;
      if (currentHairImage && currentHairImage.size > 0) {
        try {
          await processAndAddAttachment(
            currentHairImage,
            attachments,
            'current_hair',
            imageFiles
          );
        } catch (error: any) {
          return NextResponse.json(
            { error: `Current hair image: ${error.message}` },
            { status: 400 }
          );
        }
      }

      // Create a transporter with DNS configuration
      const transporter = nodemailer.createTransport({
        host: 'mail.artisticbuz.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: 'support@artisticbuz.com',
          pass: 'ArtB@#2025',
        },
        // DNS and timeout configurations
        connectionTimeout: 10000, // 10 seconds for initial connection
        greetingTimeout: 10000,   // 10 seconds for SMTP greeting
        socketTimeout: 30000,     // 30 seconds for socket inactivity
        dnsTimeout: 10000,        // 10 seconds for DNS lookup
        // Optional: Configure specific DNS servers
        // dns: {
        //   servers: ['8.8.8.8', '8.8.4.4', '1.1.1.1'],
        //   timeout: 10000
        // },
        // Optional: Disable DNS lookup and use IP directly if known
        // tls: {
        //   servername: 'artisticbuz.com' // SNI if needed
        // },
        logger: process.env.NODE_ENV === 'development',
        debug: process.env.NODE_ENV === 'development',
      });

      // Pre-resolve DNS before connecting (optional but helpful)
      let resolvedHost = process.env.SMTP_HOST || 'mail.artisticbuz.com';
      try {
        // Try to resolve the hostname first
        const addresses = await dns.resolve4(resolvedHost);
        console.log(`Resolved ${resolvedHost} to:`, addresses);
        // You could use the first IP address directly
        // resolvedHost = addresses[0];
      } catch (dnsError) {
        console.warn(`DNS resolution warning for ${resolvedHost}:`, dnsError);
        // Continue anyway, Nodemailer will try its own resolution
      }

      // Verify SMTP connection with timeout
      const verifyPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP verification timeout')), 15000)
      );
      
      try {
        await Promise.race([verifyPromise, timeoutPromise]);
      } catch (smtpError: any) {
        console.error('SMTP Connection Error:', smtpError);
        
        // Specific handling for DNS errors
        if (smtpError.code === 'EDNS' || smtpError.syscall === 'queryA') {
          return NextResponse.json(
            { 
              error: 'Email service temporarily unavailable',
              details: 'DNS resolution failed. Please try again later.',
              suggestion: 'Contact support if issue persists'
            },
            { status: 503 }
          );
        }
        
        return NextResponse.json(
          { 
            error: 'Email service is temporarily unavailable',
            details: process.env.NODE_ENV === 'development' ? smtpError.message : undefined
          },
          { status: 503 }
        );
      }

      // Configure email options with attachments
      const mailOptions = {
        from: '"Hair Graft Calculator Support" <support@artisticbuz.com>',
        to: to,
        cc: cc ? cc : undefined,
        subject: subject,
        html: html,
        attachments: attachments,
        // Add headers for better email deliverability
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'HairGraftCalculator/1.0'
        },
        // Optional text alternative for email clients that don't support HTML
        text: generateTextAlternative(parsedFormData, selectedType, estimatedGrafts, estimatedPrice, imageFiles),
        // Timeout for sending the actual email
        timeout: 30000 // 30 seconds
      };

      // Send mail with timeout
      const sendPromise = transporter.sendMail(mailOptions);
      const sendTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      );
      
      const info = await Promise.race([sendPromise, sendTimeoutPromise]) as any;

      console.log('Message sent: %s', info.messageId);
      console.log('Attachments sent:', imageFiles.length);

      clearTimeout(timeoutId);
      
      return NextResponse.json({
        success: true,
        messageId: info.messageId,
        attachmentsCount: attachments.length,
        files: imageFiles,
        message: `Email sent successfully with ${attachments.length} attachment(s)`
      });

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      console.error('Error sending email:', error);
      
      let errorMessage = 'Failed to send email';
      let statusCode = 500;
      let details = process.env.NODE_ENV === 'development' ? error.message : undefined;
      let suggestion = '';
      
      // Handle specific error types
      if (error.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Please check email credentials.';
        statusCode = 500;
      } else if (error.code === 'ECONNECTION' || error.code === 'EDNS') {
        errorMessage = 'Connection to email server failed.';
        statusCode = 503;
        suggestion = 'Please try again in a few minutes.';
      } else if (error.code === 'EENVELOPE') {
        errorMessage = 'Invalid email address or recipient.';
        statusCode = 400;
      } else if (error.code === 'EMESSAGE') {
        errorMessage = 'Invalid message format or content.';
        statusCode = 400;
      } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Email service may be slow.';
        statusCode = 503;
        suggestion = 'Please try again or contact support.';
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: details,
          suggestion: suggestion
        },
        { status: statusCode }
      );
    }
  } catch (outerError: any) {
    console.error('Outer error:', outerError);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to process and add attachments
async function processAndAddAttachment(
  file: File,
  attachments: any[],
  prefix: string,
  imageFiles: string[]
): Promise<void> {
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
  }

  // Convert to buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Generate safe filename with timestamp
  const timestamp = Date.now();
  const originalName = file.name;
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const extension = getFileExtension(file.type, originalName);
  const filename = `${prefix}_${timestamp}_${safeName}`;
  
  // Add to attachments array
  attachments.push({
    filename: filename,
    content: buffer,
    contentType: file.type,
    contentDisposition: 'attachment', // 'inline' if you want to embed in email
  });
  
  // Track the file for logging
  imageFiles.push(`${originalName} (${(file.size / 1024).toFixed(2)}KB)`);
}

// Helper function to get file extension
function getFileExtension(mimeType: string, fileName: string): string {
  const mimeToExt: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
  };
  
  return mimeToExt[mimeType] || fileName.split('.').pop() || 'jpg';
}

// Helper function to generate text alternative for email
function generateTextAlternative(
  formData: any,
  selectedType: string,
  estimatedGrafts: string,
  estimatedPrice: string | null,
  imageFiles: string[]
): string {
  let text = 'New Hair Consultation Request\n\n';
  text += '================================\n\n';
  
  if (formData?.clientsName) {
    text += `Client: ${formData.clientsName.first} ${formData.clientsName.last}\n`;
    text += `Email: ${formData.clientsEmail || 'Not provided'}\n`;
    text += `Phone: ${formData.clientsPhone || 'Not provided'}\n\n`;
  }
  
  text += `Selected Hair Loss Pattern: ${selectedType}\n`;
  text += `Estimated Grafts Required: ${estimatedGrafts}\n`;
  if (estimatedPrice) {
    text += `Estimated Cost: ${estimatedPrice}\n`;
  }
  
  if (imageFiles.length > 0) {
    text += `\nImages Attached (${imageFiles.length}):\n`;
    imageFiles.forEach((file, index) => {
      text += `  ${index + 1}. ${file}\n`;
    });
  }
  
  text += '\n--------------------------------\n';
  text += 'Please view the HTML version of this email for complete details.\n';
  text += 'Images are attached as files to this email.\n\n';
  
  return text;
}

// Optional: Add GET method for testing
export async function GET() {
  // Test DNS resolution
  const dnsTest = {
    host: process.env.SMTP_HOST || 'mail.artisticbuz.com',
    status: 'unknown'
  };
  
  try {
    const addresses = await dns.resolve4(dnsTest.host);
    dnsTest.status = `resolved to ${addresses.join(', ')}`;
  } catch (error: any) {
    dnsTest.status = `failed: ${error.message}`;
  }
  
  return NextResponse.json({
    message: 'Email API is running',
    supports: ['POST'],
    features: ['FormData parsing', 'File attachments', 'Image validation'],
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    allowedTypes: ALLOWED_MIME_TYPES,
    dnsTest: dnsTest,
    config: {
      host: process.env.SMTP_HOST || 'mail.artisticbuz.com',
      port: process.env.SMTP_PORT || '465',
      user: process.env.SMTP_USER ? 'configured' : 'not configured'
    }
  });
}