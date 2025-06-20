// lib/commandHandler.js
const fs = require('fs');
const path = require('path');

const commands = new Map();

// Load all command files from /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const cmd = require(path.join(__dirname, '../commands', file));
    if (cmd.name) {
        commands.set(cmd.name, cmd);
    }
}

module.exports.commandHandler = async (sock, msg) => {
    try {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
        if (!text.startsWith('.')) return;

        const cmdName = text.split(' ')[0].slice(1).toLowerCase();
        const command = commands.get(cmdName);
        if (command) {
            await command.run(sock, msg);
        }
    } catch (e) {
        console.error('Command error:', e);
    }
};
