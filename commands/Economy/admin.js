const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const Profile = require('../../models/economySchema')
const HouseProfile = require('../../models/houseEconomySchema')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('All Economy Admin Commands.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((subcommand) => 
    subcommand
        .setName('add')
        .setDescription('Add Money to either User or House Balance')
        .addUserOption((option) => 
            option
            .setName('user')
            .setDescription('The user to add money to')
            .setRequired(false)
        )
        .addRoleOption((option) => 
            option
                .setName('house')
                .setDescription('The house to add money to')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
            .setName('amount')
            .setDescription('The amount to add')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) => 
    subcommand
        .setName('subtract')
        .setDescription('Subtract Money from either User or House Balance')
        .addUserOption((option) => 
            option
            .setName('user')
            .setDescription('The user to subtract money from')
            .setRequired(false)
        )
        .addRoleOption((option) => 
            option
                .setName('house')
                .setDescription('The house to subtract money from')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
            .setName('amount')
            .setDescription('The amount to subtract')
            .setRequired(false)
        )
    ),
    async execute(interaction) {
       await interaction.deferReply()
       const subcommands = interaction.options.getSubcommand();
       const amount = interaction.options.getInteger('amount');
       const user = interaction.options.getUser('user');
       const house = interaction.options.getRole('house');

       if (subcommands === "add") {

        if (user) {
            await Profile.findOneAndUpdate(
                { UserID: user.id },
                { $inc: { Balance: amount } },
                { new: true }
            );
            console.log(`${interaction.user.username} ${interaction.user.id} has added ${amount} to ${user.username} (${user.id}) balance `)
            await interaction.editReply({ content: `Added ${amount} to ${user.username}'s balance `, ephemeral: true})
        }

        if (house) {
            await HouseProfile.findOneAndUpdate(
                { HouseID: house.id },
                { $inc: { HouseBalance: amount } },
                { new: true }
            );
            console.log(`${interaction.user.username} ${interaction.user.id} has added ${amount} to ${house.name}'s (${house.id}) balance`)
            await interaction.editReply({ content: `Added ${amount} to ${house.name}'s balance `, ephemeral: true})
        }
       }

       if (subcommands === "subtract") {

        if (user) {
            await Profile.findOneAndUpdate(
                { UserID: user.id },
                { $inc: { Balance: -amount } },
                { new: true }
            );
            console.log(`${interaction.user.username} ${interaction.user.id} has taken ${amount} from ${user.username}'s (${user.id}) balance `)
            await interaction.editReply({ content: `Removed ${amount} from ${user.username}'s balance `, ephemeral: true})
        }

        if (house) {
            await HouseProfile.findOneAndUpdate(
                { HouseID: house.id },
                { $inc: { HouseBalance: -amount } },
                { new: true }
            );
            console.log(`${interaction.user.username} ${interaction.user.id} has taken ${amount} from ${house.name}'s (${house.id}) balance `)
            await interaction.editReply({ content: `Removed ${amount} from ${house.name}'s balance `, ephemeral: true})
        }
       } 
    }
}