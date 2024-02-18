const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('dev')
    .setDescription('Bot Dev Only'),

    async execute(interaction) {
        if (interaction.user.id === "959555371385622590") {
            try {

            } catch (err) {

            }
        } else {
            interaction.reply('Bot Developer Only. No permission.')
        }
    }
}