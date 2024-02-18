const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Profile = require('../../models/economySchema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('economy')
        .setDescription('User Economy')
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Creates a Fresh Economy (Limit: 1)')
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete your Economy')
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'create') {
            const existingProfile = await Profile.findOne({ UserID: interaction.user.id });
            if (existingProfile) {
                return interaction.reply('Economy already exists.');
            }
            try {
                await Profile.create({
                    UserID: interaction.user.id,
                    Balance: 1000
                });
                console.log(`${interaction.user.username} (${interaction.user.id}) created their economy.`)
                interaction.reply({ content: 'Created an Economy.', ephemeral: true });
            } catch (error) {
                console.error('Error creating Economy:', error);
                interaction.reply('Failed to create an Economy.');
            }
        } else if (subcommand === 'delete') {
            const existingProfile = await Profile.findOne({ UserID: interaction.user.id });
            if (existingProfile) {
                try {
                    await Profile.deleteOne({ UserID: interaction.user.id });
                    console.log(`${interaction.user.username} (${interaction.user.id}) deleted their economy.`)
                    return interaction.reply({ content: 'Economy Deleted.', ephemeral: true });
                } catch (error) {
                    console.error('Error deleting Economy:', error);
                    return interaction.reply('Failed to delete the Economy.');
                }
            } else {
                return interaction.reply('Economy does not exist.');
            }
        }
    }
};
