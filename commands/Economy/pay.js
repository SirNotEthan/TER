const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const HouseProfile = require('../../models/houseEconomySchema')
const Profile = require('../../models/economySchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Pay a House or User.')
    .addSubcommand((subcommand) => subcommand 
        .setName('house')
        .setDescription('Pay a house a certain amount of money.')
        .addRoleOption((option) => option
            .setName('your-house')
            .setDescription('The house sending the money')
            .setRequired(true)
        )
        .addRoleOption((option) => option
            .setName('target-house')
            .setDescription('The house to pay')
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName('amount')
            .setDescription('Amount to pay the House')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName('user')
        .setDescription('The user to pay')
        .addUserOption((option) => option
            .setName('target')
            .setDescription('The user to pay')
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName('amount')
            .setDescription('The amount to pay user')
            .setRequired(true)
        )
    ),

    async execute(interaction) {
        await interaction.deferReply()

        const subcommand = interaction.options.getSubcommands();
        const house = interaction.options.getRole('house')
        const user = interaction.options.getUser('user')
        const amount = interaction.options.getInteger('amount')

        try {
            if (subcommand === "house") {
                if (interaction.user.id === HouseProfile.findOne({ HouseLord: interaction.user.id })) {
                    await HouseProfile.findOneAndUpdate(
                        { HouseLord: interaction.user.id },
                        { $inc: { Balance: -amount } }, 
                        { new: true }
                    )
    
                    await HouseProfile.findOneAndUpdate(
                        { HouseID: house.id },
                        { $inc: { Balance: amount } },
                        { new: true }
                    )
                    await interaction.editReply({ content: `${house.name} has been paid ${amount} `, epehermal: true } )
                }
            }
    
            if (subcommand === "user") {
                await Profile.findOneAndUpdate(
                    { UserID: interaction.user.id },
                    { $inc: { Balance: -amount} },
                    { new: true }
                );
                await Profile.findOneAndUpdate(
                    { UserID: user.id },
                    { $inc: { Balance: amount } },
                    { new: true }
                );
                console.log(`${interaction.user.username} (${interaction.user.id}) has paid ${user.username} (${user.id}) ${amount}`)
                await interaction.editReply({ content: `${interaction.user.username} (${interaction.user.id}) has paid ${user.username} (${user.id}) ${amount}`, ephemeral: true })
            }
        } catch(err) {
            console.log(`Error: ${err}`)
            return interaction.editReply({ content: `Error Occured: ${err}`, epehermal: true })
        }
    }
}