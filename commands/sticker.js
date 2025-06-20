// commands/sticker.js
const { writeFileSync, unlinkSync } = require('fs');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const path = require('path');

module.exports = {
    name: 'sticker',
    description: 'Make sticker from image/video',
    run: async (sock, msg) => {
        const jid = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) {
            await sock.sendMessage(jid, { text: 'Please reply to an image or short video.' }, { quoted: msg });
            return;
        }

        const buffer = await downloadMediaMessage(
            { message: quoted },
            'buffer',
            {},
            { logger: console, reuploadRequest: sock.updateMediaMessage }
        );

        const tempPath = './media/temp.' + (quoted.videoMessage ? 'mp4' : 'jpg');
        writeFileSync(tempPath, buffer);

        await sock.sendMessage(jid, {
            sticker: { url: tempPath }
        }, { quoted: msg });

        unlinkSync(tempPath);
    }
};
