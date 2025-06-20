const makeWASocket = require('@whiskeysockets/baileys').default;
const pino = require('pino');
const fs = require('fs');
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { commandHandler } = require('./lib/commandHandler');

const { state, saveState } = useSingleFileAuthState('./config.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['NK_NISAR', 'Chrome', '1.0.0'],
    });

    sock.ev.on('creds.update', saveState);

    sock.ev.on('messages.upsert', async (msg) => {
        if (!msg.messages || !msg.messages[0]) return;
        const m = msg.messages[0];
        if (m.key && m.key.remoteJid === 'status@broadcast') return;
        if (m.key.fromMe) return;

        await commandHandler(sock, m);
    });
}

startBot().catch(err => console.error('❌ Bot Error:', err));

process.on('uncaughtException', err => {
    console.error('UNCAUGHT ERROR:', err);
});
