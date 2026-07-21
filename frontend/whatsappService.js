import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WhatsAppServiceInstance {
  constructor(displayName, folderName) {
    this.displayName = displayName; // e.g. 'Faculty/Admin Channel' or 'Student Channel'
    this.folderName = folderName;
    this.sock = null;
    this.status = 'disconnected'; // 'connecting', 'qr_ready', 'connected', 'disconnected'
    this.authDir = path.resolve(__dirname, folderName);
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.connect();
    return this.initPromise;
  }

  async connect() {
    try {
      console.log(`\n[WhatsApp - ${this.displayName}] 🔄 Initializing connection...`);
      this.status = 'connecting';
      
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.status = 'qr_ready';
          console.log('\n===========================================================');
          console.log(`[WhatsApp - ${this.displayName}] 📱 SCAN THIS QR CODE TO CONNECT:`);
          qrcode.generate(qr, { small: true });
          console.log(`[WhatsApp - ${this.displayName}] (Open WhatsApp -> Linked Devices -> Link a Device)`);
          console.log('===========================================================\n');
        }

        if (connection === 'close') {
          this.status = 'disconnected';
          const statusCode = lastDisconnect?.error?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          console.log(`[WhatsApp - ${this.displayName}] 🔌 Connection closed (Status Code: ${statusCode || 'N/A'}). Reconnecting: ${shouldReconnect}`);

          if (shouldReconnect) {
            setTimeout(() => this.connect(), 5000);
          } else {
            console.log(`[WhatsApp - ${this.displayName}] ❌ Logged out. Clearing session and starting fresh...`);
            try {
              fs.rmSync(this.authDir, { recursive: true, force: true });
            } catch (err) {
              console.error(`[WhatsApp - ${this.displayName}] Failed to clear authentication directory:`, err.message);
            }
            setTimeout(() => this.connect(), 2000);
          }
        } else if (connection === 'open') {
          this.status = 'connected';
          console.log('\n===========================================================');
          console.log(`[WhatsApp - ${this.displayName}] 🎉 Connected successfully and ready!`);
          console.log('===========================================================\n');
        }
      });

    } catch (err) {
      console.error(`[WhatsApp - ${this.displayName}] ❌ Connection error:`, err);
      this.status = 'disconnected';
      setTimeout(() => this.connect(), 5000);
    }
  }

  async sendMessage(to, text) {
    if (this.status !== 'connected' || !this.sock) {
      throw new Error(`WhatsApp ${this.displayName} is not connected. Current status: ${this.status}`);
    }

    let cleanNumber = to.replace(/[^+\d]/g, '');

    if (cleanNumber.length === 10 && !cleanNumber.startsWith('+')) {
      cleanNumber = '+91' + cleanNumber;
    } else if (!cleanNumber.startsWith('+') && cleanNumber.length > 0) {
      cleanNumber = '+' + cleanNumber;
    }

    const numericNumber = cleanNumber.replace('+', '');
    const jid = `${numericNumber}@s.whatsapp.net`;

    console.log(`[WhatsApp - ${this.displayName}] 📤 Sending message to ${jid}...`);
    const response = await this.sock.sendMessage(jid, { text: text });
    return response;
  }
}

// Router class to manage both services
class DualWhatsAppRouter {
  constructor() {
    this.facultyService = new WhatsAppServiceInstance('Faculty/Admin Channel (Personal)', 'baileys_auth_info_faculty');
    this.studentService = new WhatsAppServiceInstance('Student Channel (8866541102)', 'baileys_auth_info_student');
  }

  async initAll() {
    await Promise.all([
      this.facultyService.init(),
      this.studentService.init()
    ]);
  }

  async sendMessage(to, text, recipientType = 'faculty') {
    if (recipientType === 'student') {
      return this.studentService.sendMessage(to, text);
    } else {
      return this.facultyService.sendMessage(to, text);
    }
  }

  getStatus() {
    return {
      faculty: this.facultyService.status,
      student: this.studentService.status
    };
  }
}

if (!globalThis.__whatsappService__) {
  const router = new DualWhatsAppRouter();
  globalThis.__whatsappService__ = router;
}

export const whatsappService = globalThis.__whatsappService__;
