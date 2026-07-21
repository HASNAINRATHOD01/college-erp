import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'
import { whatsappService } from './whatsappService.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Helper to parse POST request JSON body
const getRequestBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
};

export default defineConfig(({ mode }) => {
  // Load environment variables from system environment + .env files
  const env = loadEnv(mode, process.cwd(), '');


  const smtpService = env.SMTP_SERVICE || env.EMAIL_SERVICE || process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE;
  const smtpHost = env.SMTP_HOST || process.env.SMTP_HOST;
  const smtpPort = env.SMTP_PORT || process.env.SMTP_PORT;
  const smtpUser = env.SMTP_USER || env.EMAIL_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = env.SMTP_PASS || env.EMAIL_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS;

  return {
    plugins: [
      react(),
      {
        name: 'api-server',
        configureServer(server) {
          whatsappService.initAll();
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/send-email' && req.method === 'POST') {
              try {
                const body = await getRequestBody(req);
                const { to = 'akshatthoriya1@gmail.com', subject = 'Campuzz Academic Alert', text = '' } = body;
                
                console.log(`\n[Email] ─── SEND ATTEMPT ───`);
                console.log(`[Email]   To:       "${to}"`);
                console.log(`[Email]   Subject:  "${subject}"`);
                console.log(`[Email]   Message:  "${text.substring(0, 80)}..."`);

                let transporter;
                let isTestAccount = false;

                if (smtpService && smtpUser && smtpPass) {
                  // Service-based transport (e.g. 'gmail')
                  transporter = nodemailer.createTransport({
                    service: smtpService,
                    auth: {
                      user: smtpUser,
                      pass: smtpPass
                    }
                  });
                } else if (smtpHost && smtpUser && smtpPass) {
                  // Host-based SMTP transport
                  transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: parseInt(smtpPort) || 587,
                    secure: smtpPort === '465',
                    auth: {
                      user: smtpUser,
                      pass: smtpPass
                    }
                  });
                } else {
                  // Generate a temporary Ethereal SMTP test account for preview links
                  isTestAccount = true;
                  const testAccount = await nodemailer.createTestAccount();
                  transporter = nodemailer.createTransport({
                    host: testAccount.smtp.host,
                    port: testAccount.smtp.port,
                    secure: testAccount.smtp.secure,
                    auth: {
                      user: testAccount.user,
                      pass: testAccount.pass
                    }
                  });
                }

                const mailOptions = {
                  from: smtpUser ? `"Campuzz App" <${smtpUser}>` : '"Campuzz Admin Notification" <no-reply@lju.edu.in>',
                  to,
                  subject: subject || 'Hello from Node.js! 🚀',
                  text: text,
                  html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                      <h2 style="color: #2f4156;">${subject || 'Campuzz Academic Alert'}</h2>
                      <p style="color: #2f4156; line-height: 1.6;">${text.replace(/\\n/g, '<br>')}</p>
                      <br />
                      <p style="color: #7a8a94; font-size: 12px;">Automated message from your App.</p>
                    </div>
                  `
                };

                const info = await transporter.sendMail(mailOptions);

                let previewUrl = '';
                if (isTestAccount) {
                  previewUrl = nodemailer.getTestMessageUrl(info);
                  console.log(`[Email]   📝 TEST MODE - Ethereal Preview: ${previewUrl}`);
                } else {
                  console.log(`[Email]   ✅ SENT! Message ID: ${info.messageId}`);
                  console.log(`[Email]   Note: Gmail SMTP accepted delivery to "${to}".`);
                  if (!to.includes('gmail.com') && !to.includes('yahoo.') && !to.includes('outlook.')) {
                    console.log(`[Email]   ⚠️  "${to}" may not be a real mailbox. Gmail will accept the send but the email will BOUNCE at the receiving server if the address doesn't exist.`);
                  }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  success: true, 
                  message: 'Email delivered successfully', 
                  messageId: info.messageId,
                  previewUrl 
                }));
              } catch (err) {
                console.error(`[Email]   ❌ FAILED! Error: ${err.message}`);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            }
            else if (req.url === '/api/send-whatsapp' && req.method === 'POST') {
              try {
                const body = await getRequestBody(req);
                const { to = '+917990056685', text = '', recipientType = 'faculty' } = body;

                console.log(`\n[WhatsApp] ─── SEND ATTEMPT ───`);
                console.log(`[WhatsApp]   To:            "${to}"`);
                console.log(`[WhatsApp]   RecipientType: "${recipientType}"`);
                console.log(`[WhatsApp]   Message:       "${text.substring(0, 80)}..."`);

                try {
                  const response = await whatsappService.sendMessage(to, text, recipientType);
                  console.log(`[WhatsApp]   ✅ DELIVERED!`);
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, data: response }));
                } catch (err) {
                  console.error(`[WhatsApp]   ❌ FAILED: ${err.message}`);
                  const currentStatus = whatsappService.getStatus();
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    success: false, 
                    error: err.message,
                    status: currentStatus,
                    fix: `Ensure the selected channel (${recipientType}) is properly authenticated. Check server terminal for QR code.`
                  }));
                }
              } catch (err) {
                console.error('[WhatsApp] UNEXPECTED ERROR:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            } 
            else {
              next();
            }
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.url.startsWith('/api/send-email') || req.url.startsWith('/api/send-whatsapp')) {
              return req.url;
            }
          }
        }
      }
    }
  };
});
