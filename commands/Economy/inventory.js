const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js')
const IncomeUpgradesProfile = require('../../models/incomeUpgradesSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('User Inventory'),
    async execute(interaction) {
        await interaction.deferReply()
        try {
            const existingProfile = await IncomeUpgradesProfile.findOne({ UserID: interaction.user.id })

            if (!existingProfile) {
                return interaction.editReply(`No IncomeUpgradesProfile.`)
            }

            const InventoryEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag}'s・Inventory`)
            .setDescription(' ')
            .setColor('Red')
            .addFields(
                { name: 'Upgrade One:', value: `> ${existingProfile.UpgradeOne}`},
                { name: 'Upgrade Two:', value: `> ${existingProfile.UpgradeTwo}`},
                { name: 'Upgrade Three:', value: `> ${existingProfile.UpgradeThree}`}
            )

            await  interaction.editReply({ embeds: [InventoryEmbed]})
        } catch (err) {
            console.log(`Error: ${err}`)
            interaction.editReply(`Error While Processing Command: ${err}`)
        }
    }
}