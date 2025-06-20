// index.js const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys'); const P = require('pino'); const fs = require('fs'); const path = require('path'); const { commandHandler } = require('./lib/commandHandler'); const { state, saveState } = useSingleFileAuthState('./config.json');

async function startBot() { const { version, isLatest } = await fetchLatestBaileysVersion();

const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true
});

sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (!messages || !messages[0]) return;
    const msg = messages[0];
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return;
    if (!msg.message) return;

    await commandHandler(sock, msg);
});

sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
            startBot();
        } else {
            console.log('Connection closed. Logged out.');
        }
    }
});

sock.ev.on('creds.update', saveState);

}

startBot();

