const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const IncomeUpgrades = require('../../models/incomeUpgradesSchema.js')
const Profile = require('../../models/economySchema.js')
const HouseProfile = require('../../models/houseEconomySchema.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Economy  Shop.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const ShopEmbed = new EmbedBuilder()
                .setTitle('Server Shop!')
                .setColor('Yellow')
                .setThumbnail('https://tr.rbxcdn.com/56597a4a3fba09d68919591825773f39/150/150/Image/Png')
                .setDescription(`> Item's will list below \n > New Offers happen every week!`)

            const select = new StringSelectMenuBuilder()
                .setCustomId('Category')
                .setPlaceholder('Pick a Shop Category')
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Economy')
                        .setDescription('Economic Shop for upgrades and other bits')
                        .setValue('economy'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('House')
                        .setDescription('House Shop for house items.')
                        .setValue('house'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Personal')
                        .setDescription('Personal Shop for game items.')
                        .setValue('personal')
                );

            const mainRow = new ActionRowBuilder()
                .addComponents(select)

            const EconomyEmbed = new EmbedBuilder()
                .setTitle('Economy Shop')
                .setColor('Blue')
                .setThumbnail('https://tr.rbxcdn.com/56597a4a3fba09d68919591825773f39/150/150/Image/Png')
                .setDescription(`> Item's will list below \n > New Offers happen every week!`)
                .addFields(
                    { name: "Upgrade 1", value: "1000 Coins for 5000 coins income upgrade" },
                    { name: "Upgrade 2", value: "10000 Coins for 20000 coins income upgrade" },
                    { name: "Upgrade 3", value: "50000 Coins for 100000 coins income upgrade" }
                )
                
            const HouseEmbed = new EmbedBuilder()
                .setTitle('House Shop!')
                .setColor('Red')
                .setThumbnail('https://tr.rbxcdn.com/56597a4a3fba09d68919591825773f39/150/150/Image/Png')
                .setDescription(`> Item's will list below \n > New Offers happen every week!`)
                .addFields(
                    { name: "Item 1", value: "Coins" },
                    { name: "Item 2", value: "Coins" },
                    { name: "Item 3", value: "Coins" }
            )    

            const UpgradeOneButton = new ButtonBuilder()
                .setCustomId('PurchaseUpgradeOne')
                .setLabel('1. Upgrade One')
                .setStyle(ButtonStyle.Primary)

            const UpgradeTwoButton = new ButtonBuilder()
                .setCustomId('PurchaseUpgradeTwo')
                .setLabel('2. Upgrade Two')
                .setStyle(ButtonStyle.Primary)

            const UpgradeThreeButton = new ButtonBuilder()
                .setCustomId('PurchaseUpgradeThree')
                .setLabel('3. Upgrade Three')
                .setStyle(ButtonStyle.Primary)

            const economyRow = new ActionRowBuilder()
                .addComponents(UpgradeOneButton, UpgradeTwoButton, UpgradeThreeButton)

            const ConfirmPurchaseEmbed = new EmbedBuilder()
                .setTitle('Econonmic Purchase')
                .setDescription('Are you sure you want to purchase Income Upgrade 1?')
                .setTimestamp()

            const Upgrade1ConfirmButton = new ButtonBuilder()
                .setCustomId('ConfirmPurchaseUpgrade1')
                .setLabel('Confirm')
                .setStyle(ButtonStyle.Success)

            const Upgrade1PurchaseCancelButton = new ButtonBuilder()
                .setCustomId('CancelPurchaseUpgrade1')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)

            const Upgrade1PurchaseConfirmation = new ActionRowBuilder()
                .addComponents(Upgrade1ConfirmButton, Upgrade1PurchaseCancelButton)
            
            const PurchasedEmbed = new EmbedBuilder()
                .setTitle('Economy Purchase')
                .setColor('Green')
                .setDescription('Purchase Finalized! Enjoy!')
                .setTimestamp()

            const CancelledEmbed = new EmbedBuilder()
                .setTitle('Economic Purchase')
                .setColor('Red')
                .setDescription('Purchase Cancelled.')
                .setTimestamp()

            const TimedOutEmbed = new EmbedBuilder()
                .setTitle('Shop Timed Out')
                .setColor('Red')
                .setDescription('You ran out of time.')
                .setTimestamp()

            const mainFilter = (interaction) => {
                return interaction.customId === 'PurchaseUpgradeOne' || interaction.customId === 'PurchaseUpgradeTwo' || interaction.customId === "PurchaseUpgradeThree" || interaction.customId === "Category" || interaction.customId === 'ConfirmPurchaseUpgrade1' || interaction.customId === "CancelPurchaseUpgrade1"
            };
            const mainCollector = interaction.channel.createMessageComponentCollector({ filter: mainFilter, time: 15000 });
            mainCollector.on('collect', async (interaction) => {
                if (interaction.customId === 'Category') {
                    let choices = "";

                    await interaction.values.forEach(async value => {
                        choices += `${value}`
                    })

                    if (choices === "economy") {
                        await interaction.deferUpdate();
                        console.log('Sending Economy Embed');
                        return interaction.editReply({
                            embeds: [EconomyEmbed],
                            components: [mainRow, economyRow]
                        });
                    }

                    if (choices === "house") {
                        await interaction.deferUpdate();
                        console.log('Sending House Embed');
                        return interaction.editReply({
                            embeds: [HouseEmbed],
                            components: [mainRow]
                        });
                    }
                }

                if (interaction.customId === "PurchaseUpgradeOne") {
                    await interaction.deferUpdate();

                    return interaction.editReply({ embeds: [ConfirmPurchaseEmbed], components: [Upgrade1PurchaseConfirmation]})
                }

                if (interaction.customId === "ConfirmPurchaseUpgrade1") {
                    const existingProfile = await IncomeUpgrades.findOne({ UserID: interaction.user.id })
                    const existingEconomyProfile = await Profile.findOne({ UserID: interaction.user.id })
                    if (!existingProfile) {
                        IncomeUpgrades.create({
                            UserID: interaction.user.id,
                            UpgradeOne: 0,
                            UpgradeTwo: 0,
                            UpgradeThree: 0
                        })
                    }

                    if (existingProfile) {
                        if (existingEconomyProfile) {
                            await IncomeUpgrades.findOneAndUpdate(
                                { UserID: interaction.user.id },
                                { $inc: { UpgradeOne: 1 } },
                                { new: true } 
                            )
                            await Profile.findOneAndUpdate(
                                { UserID: interaction.user.id },
                                { $inc: { Balance: -1000} },
                                { new: true }
                            )
        
                            await interaction.deferUpdate();
        
                            return interaction.editReply({ embeds: [PurchasedEmbed], components: [] })
                        } else {
                            return interaction.editReply(`Create an economy before attempting to make purchases.`)
                        } 
                    }
                }

                if (interaction.customId === "CancelPurchaseUpgrade1") {
                    await interaction.deferUpdate();
                    return interaction.editReply({ embeds: [CancelledEmbed], components: [] })
                }
            }); 

            console.log(`Shop Embed sent.`);
            await interaction.editReply({ embeds: [ShopEmbed], components: [mainRow] });

            setTimeout(() => {
                interaction.editReply({ embeds: [TimedOutEmbed], components: [] })
              }, 25000)

        } catch (err) {
            console.log(`Error: ${err}`);
            await interaction.editReply(`Error submitting this request: ${err}`);
        }
    }
}