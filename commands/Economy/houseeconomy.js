const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Profile = require('../../models/houseEconomySchema.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('house-economy')
        .setDescription('House Economy')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Creates a Fresh Economy (Limit: 1)')
            .addRoleOption((option) => option
                .setName('target-role')
                .setDescription('The Target House Role')
                .setRequired(true)
            )
            .addUserOption((option) => option 
                .setName('target')
                .setDescription('The Lord of the House')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete your Economy')
            .addRoleOption((option) => option
                .setName('target-role')
                .setDescription('The Target House Role')
                .setRequired(true)
            )
        ),
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();
        const targetHouse = interaction.options.getRole('target-role')
        const targetUser = interaction.options.getUser('target')
        if (subcommand === 'create') {
            const existingProfile = await Profile.findOne({ HouseID: targetHouse.id });
            if (existingProfile) {
                return interaction.reply('Economy already exists.');
            }
            try {
                await Profile.create({
                    HouseID: targetHouse.id,
                    HouseBalance: 1000,
                    HouseLord: targetUser.id
                });
                interaction.reply({ content: 'Created an Economy.', ephemeral: false });
            } catch (error) {
                console.error('Error creating Economy:', error);
                interaction.reply('Failed to create an Economy.');
            }
        } else if (subcommand === 'delete') {
            const existingProfile = await Profile.findOne({ HouseID: targetHouse.id });
            if (existingProfile) {
                try {
                    await Profile.deleteOne({ HouseID: targetHouse.id });
                    return interaction.reply({ content: `<@${targetHouse.id}> Economy Deleted.`, ephemeral: false });
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
