// commands/play.js
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');

module.exports = {
    name: 'play',
    description: 'Download song audio from YouTube',
    run: async (sock, msg) => {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
        const query = text?.split(' ').slice(1).join(' ');
        if (!query) {
            return sock.sendMessage(msg.key.remoteJid, { text: 'Please provide a song name.' }, { quoted: msg });
        }

        const result = await yts(query);
        const video = result.videos[0];
        if (!video) return sock.sendMessage(msg.key.remoteJid, { text: 'No video found.' }, { quoted: msg });

        const stream = ytdl(video.url, { filter: 'audioonly' });
        const filePath = './media/song.mp3';
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        writeStream.on('finish', async () => {
            await sock.sendMessage(msg.key.remoteJid, {
                audio: { url: filePath },
                mimetype: 'audio/mp4'
            }, { quoted: msg });
            fs.unlinkSync(filePath);
        });
    }
};
