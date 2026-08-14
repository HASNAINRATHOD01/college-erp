import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'

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
      } catch {
        resolve({});
      }
    });
  });
};

export default defineConfig(() => {
  const smtpService = '';
  const smtpHost = '';
  const smtpPort = '';
  const smtpUser = '';
  const smtpPass = '';

  return {
    plugins: [
      react(),
      {
        name: 'api-server',
        configureServer(server) {
          const initializeWhatsApp = async () => {
            try {
              const { whatsappService } = await import('./whatsappService.js');
              await whatsappService.initAll();
            } catch (err) {
              console.warn('[WhatsApp] Startup skipped or failed:', err?.message || err);
            }
          };

          void initializeWhatsApp();

          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/send-email' && req.method === 'POST') {
              try {
                const body = await getRequestBody(req);
                const { to = 'akshatthoriya1@gmail.com', subject = 'Campuzz Academic Alert', text = '' } = body;
                
                console.log(`\n[Email] ─── SEND ATTEMPT ───`);
                console.log(`[Email]   To:       "${to}"`);
                console.log(`[Email]   Subject:  "${subject}"`);
                console.log(`[Email]   Message:  "${text.substring(0, 80)}..."`);

                // Direct Gmail Transporter with user app password
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'akshatthoriya1@gmail.com',
                    pass: 'helwquxwjpfkhgzt'
                  }
                });

                const mailOptions = {
                  from: 'akshatthoriya1@gmail.com',
                  to: 'akshatthoriya1@gmail.com',
                  subject: subject || 'Campuzz Academic Notice Alert',
                  text: text,
                  html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                      <h2 style="color: #0284c7;">${subject || 'Campuzz Academic Alert'}</h2>
                      <p style="color: #334155; line-height: 1.6;">${text.replace(/\n/g, '<br>')}</p>
                      <br />
                      <p style="color: #64748b; font-size: 12px;">Sent from LJ University Campuzz ERP System.</p>
                    </div>
                  `
                };

                const info = await transporter.sendMail(mailOptions);
                console.log(`[Email] ✅ EMAIL SENT DIRECTLY TO GMAIL INBOX! Message ID: ${info.messageId}`);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  success: true, 
                  message: 'Email delivered successfully to akshatthoriya1@gmail.com', 
                  messageId: info.messageId 
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
                const { to = '+917990056685', text = '' } = body;

                console.log(`\n[WhatsApp] ─── SEND ATTEMPT ───`);
                console.log(`[WhatsApp]   To:            "${to}"`);
                console.log(`[WhatsApp]   Message:       "${text.substring(0, 80)}..."`);

                try {
                  const { whatsappService } = await import('./whatsappService.js');
                  const response = await whatsappService.sendMessage(to, text);
                  console.log(`[WhatsApp]   ✅ DELIVERED!`);
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, data: response }));
                } catch (err) {
                  console.error(`[WhatsApp]   ❌ FAILED: ${err.message}`);
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    success: false, 
                    error: err.message,
                    status: 'error',
                    fix: 'Replace the hardcoded WhatsApp credentials in frontend/whatsappService.js with your Meta access token and phone number ID.'
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
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.url.startsWith('/api/send-email') || req.url.startsWith('/api/send-whatsapp')) {
              return req.url;
            }
          }
        },
        '/media': {
          target: 'http://localhost:8000',
          changeOrigin: true
        }
      }
    }
  };
});
