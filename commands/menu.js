// commands/menu.js
module.exports = {
    name: 'menu',
    description: 'Show all commands',
    run: async (sock, msg) => {
        const jid = msg.key.remoteJid;
        const menuText = `
👋 *NK_NISAR Bot* Online!
Here are my commands:

📁 General:
.menu
.ping
.owner

🖼️ Media:
.sticker (reply image/video)
.attp text
.toimg
.tovideo

🎵 YouTube:
.play song name
.ytmp3 link
.ytmp4 link

🔍 Tools:
.github username
.gimage query
.qr text
.weather city
        `;

        await sock.sendMessage(jid, { text: menuText }, { quoted: msg });
    }
};
