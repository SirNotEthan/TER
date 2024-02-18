const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js')
const Profile = require('../../models/economySchema.js')
const HouseProfile = require('../../models/houseEconomySchema.js')
const banners = require('../../assets/house-banners.json')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('View the House or User Balance.')
        .addSubcommand((subcommand) => subcommand
            .setName('user')
            .setDescription('User Balance')
            .addUserOption((option) => option
                .setName('target')
                .setDescription('target user')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('house')
            .setDescription('House Balance')
            .addRoleOption((option) => option
                .setName('role')
                .setDescription('target house')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('target')
        if (subcommand === "user") {
            const existingProfile = await Profile.findOne({ UserID: targetUser.id });
            if (!existingProfile) {
                return interaction.reply('No Economy Profile Exists')
            }
            try {
                const BalanceEmbed = new EmbedBuilder()
                    .setTitle(`${targetUser.tag}・Balance`)
                    .setDescription(' ')
                    .setThumbnail(targetUser.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Balance', value: `${existingProfile.Balance}`}
                    )
                    .setTimestamp();
                console.log(`${interaction.user.id} checked ${targetUser.username}'s (${targetUser.id}) balance`)
                return interaction.reply({ embeds: [BalanceEmbed] })
            } catch (error) {
                console.error('Error Viewing User Balance:', error)
                interaction.reply({ content: 'Failed to View User Balance.', ephemeral: true });
            }
        } else if (subcommand === "house") {
            const targetHouse = interaction.options.getRole('role')
            const existingProfile = await HouseProfile.findOne({ HouseID: targetHouse.id });
            if (!existingProfile) {
                return interaction.reply('No Economy Profile Exists')
            }
            try {
                const BalanceEmbed = new EmbedBuilder()
                    .setTitle(`${targetHouse.name}・Balance`)
                    .setDescription(' ')
                    .setThumbnail(`${banners[existingProfile.HouseID].Banner}`)
                    .addFields(
                        { name: 'Balance', value: `${existingProfile.HouseBalance}`},
                        { name: 'Lord / Lady', value: `<@${existingProfile.HouseLord}>`}
                    )
                    .setTimestamp();
                console.log(`${interaction.user.id} checked ${targetHouse.name}'s (${targetHouse.id}) balance`)
                return interaction.reply({ embeds: [BalanceEmbed]})
            } catch (error) {
                console.error('Error Viewing House Balance:', error)
                interaction.reply({ content: 'Failed to View House Balance.', ephemeral: true });
            }
        }
    }
}
