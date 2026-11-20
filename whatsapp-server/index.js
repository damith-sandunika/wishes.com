const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

let qrCodeData = null;
let clientStatus = 'INITIALIZING'; // INITIALIZING, QR_READY, AUTHENTICATED, READY, DISCONNECTED

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true, 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ] 
    }
});

client.on('qr', async (qr) => {
    console.log('QR RECEIVED');
    qrCodeData = await qrcode.toDataURL(qr, { errorCorrectionLevel: 'M', margin: 4, scale: 8 });
    clientStatus = 'QR_READY';
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
    clientStatus = 'AUTHENTICATED';
    qrCodeData = null;
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
    clientStatus = 'ERROR';
});

client.on('ready', () => {
    console.log('CLIENT IS READY');
    clientStatus = 'READY';
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
    clientStatus = 'DISCONNECTED';
    qrCodeData = null;
    
    // Re-initialize
    client.initialize().catch(err => {
        console.error('Re-initialization error:', err);
        clientStatus = 'ERROR';
    });
});

client.initialize().catch(err => {
    console.error('Initialization error:', err);
    clientStatus = 'ERROR';
});

// Routes
app.get('/status', (req, res) => {
    res.json({
        status: clientStatus,
        qr: qrCodeData
    });
});

app.post('/logout', async (req, res) => {
    if (clientStatus === 'READY' || clientStatus === 'AUTHENTICATED') {
        await client.logout();
        clientStatus = 'DISCONNECTED';
        res.json({ success: true, message: 'Logged out successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Not logged in' });
    }
});

app.post('/send', async (req, res) => {
    if (clientStatus !== 'READY') {
        return res.status(400).json({ success: false, message: 'WhatsApp client is not ready' });
    }

    const { number, message } = req.body;
    
    if (!number || !message) {
        return res.status(400).json({ success: false, message: 'Number and message are required' });
    }

    // Format number: remove +, replace leading 0 with 94 (for Sri Lanka), append @c.us
    let formattedNumber = number.toString().replace(/\D/g, '');
    if (formattedNumber.startsWith('0')) {
        formattedNumber = '94' + formattedNumber.substring(1);
    }
    formattedNumber = formattedNumber + '@c.us';

    try {
        await client.sendMessage(formattedNumber, message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.toString() });
    }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`WhatsApp Service running on port ${PORT}`);
});
