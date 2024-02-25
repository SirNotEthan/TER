const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const fs = require('fs')

function formatUptime(uptime) {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function Version(version) { 
    fs.readFile('package.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading package.json:', err);
            return;
        }
        const packageJson = JSON.parse(data);
        version = packageJson.version;
    });
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('bot-info')
    .setDescription('All the info you need to know about the bot.'),
    async execute(interaction) {
        await interaction.deferReply()

        const uptime = interaction.client.uptime
        let version

        const InformationEmbed = new EmbedBuilder()
        .setTitle('Information | The Realm Watcher')
        .setColor('Blurple')
        .addFields(
            { name: 'Latency:', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
            { name: 'API Latency:', value: `${interaction.client.ws.ping}ms`, inline: true },
            { name: 'Uptime:', value: `${formatUptime(uptime)}`, inline: true },
            { name: 'Version:', value: `1.0.2`, inline: true },
            { name: 'MongoDB:', value: 'Operational', inline: true },
            { name: 'Creator:', value: 'SirNotEthan', inline: true }
        )
        .setTimestamp()

        return interaction.editReply({ embeds: [InformationEmbed], epehermal: true });
    }
}