const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, MenuOptionBuilder, ButtonStyle, ActionRowBuilder, RoleSelectMenuBuilder, SelectMenuBuilder } = require('discord.js');
const Profile = require('../../models/economySchema.js')
const HouseProfile = require('../../models/houseEconomySchema.js')
const Cooldowns = require('../../models/cooldownsSchema.js')
const IncomeUpgrades = require('../../models/incomeUpgradesSchema.js')
const houses = [
    "1180145573047840808",
    "1181368763493400606",
    "1181368764424523817",
    "1181368765636681799",
    "1181368766379085825",
    "1181368767708667964",
    "1181368768883077120",
    "1181368770011349052",
    "1181368771147989082",
    "1181369095036354561",
    "1181369096118485042",
    "1181369097116712991",
    "1181369098001719426",
    "1181369099243241602",
    "1181369100174360698",
    "1181369101025824879",
    "1181369101881458890",
    "1181369102791622799",
    "1181369106423881758",
    "1181369574600486932",
    "1181369575271567401",
    "1181369576961888426",
    "1181369578044002425",
    "1181369579323265084",
    "1181369580321509508",
    "1181369581349130381",
    "1181369582657745027",
    "1181369583744065597",
    "1181369584712953986",
    "1181369585547620432",
    "1181369586696859699",
    "1181369587904819391",
    "1181369588831764500",
    "1181369635321417768",
    "1182454899804491937"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('income')
        .setDescription('Weekly Income for You or Your House.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const mainEmbed = new EmbedBuilder()
                .setTitle('Income Payout')
                .setColor('Blue')
                .setDescription('Please choose where to payout your weekly income.');

            const houseButton = new ButtonBuilder()
                .setCustomId('payoutHouse')
                .setLabel('House')
                .setStyle(ButtonStyle.Primary);

            const userButton = new ButtonBuilder()
                .setCustomId('payoutUser')
                .setLabel('User')
                .setStyle(ButtonStyle.Secondary);

            const mainRow = new ActionRowBuilder()
                .addComponents(houseButton, userButton);

            const mainFilter = (interaction) => {
                return interaction.customId === 'payoutHouse' || interaction.customId === 'payoutUser';
            };

            const getNextWeekDate = () => {
                const currentDate = new Date();
                const nextWeekDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                return nextWeekDate.toDateString();
            };
            
            let income = 1000;

            const mainCollector = interaction.channel.createMessageComponentCollector({ filter: mainFilter, time: 15000 });
            mainCollector.on('collect', async (interaction) => {
                if (interaction.customId === 'payoutHouse') {
                    await interaction.deferUpdate();
                    const existingHouseProfile = await HouseProfile.findOne({ HouseLord: interaction.user.id })   
                    const existingIncomeUpgrades = await IncomeUpgrades.findOne({ UserID: interaction.user.id })        
                    const cooldowns = await Cooldowns.findOne({ UserID: interaction.user.id })

                    if (cooldowns) {
                        const lastIncomeDate = cooldowns.Income.toDateString();
                        const currentDate = new Date().toDateString();
        
                        if (lastIncomeDate === getNextWeekDate()) {
                            const cooldownEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Red')
                            .setDescription(`You have already collected your weekly income. Come back next week!`)
        
                            return interaction.editReply({ embeds: [cooldownEmbed], components: [], ephemeral: true })
                        }
                    } else {
                        if (existingIncomeUpgrades) {
                            if (existingIncomeUpgrades.UpgradeOne >= 1) {
                                income += 5000 * existingIncomeUpgrades.UpgradeOne
                            }
                            if (existingIncomeUpgrades.UpgradeTwo >= 1) {
                                income += 20000 * existingIncomeUpgrades.UpgradeTwo
                                // or income *= 20000 ** IncomeUpgrades.UpgradeTwo;
                            }
                            if (existingIncomeUpgrades.UpgradeThree >= 1) {
                                income += 100000 * existingIncomeUpgrades.UpgradeTwo
                                // or income *= 100000 ** IncomeUpgrades.UpgradeThree;
                            }
                        }

                        if (existingHouseProfile) {
                            await HouseProfile.findOneAndUpdate(
                                { HouseLord: interaction.user.id },
                                { $inc: { HouseBalance: income } },
                                { new: true } 
                            )
                            Cooldowns.create({
                                UserID: interaction.user.id,
                                Income: getNextWeekDate()
                            })

                            const payoutEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Green')
                            .setDescription(`Paid out income of ${income} to <@${interaction.user.id}> house.`);
    
                            return interaction.editReply({ embeds: [payoutEmbed], components: [] })
                        } else {
                            const ErrPayoutEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Red')
                            .setDescription(`You don't have an existing house economy or you dont have the sufficient permission for this task.`);
                            return interaction.editReply({ embeds: [ErrPayoutEmbed], components: [] })
                        }
                    }
                } else if (interaction.customId === 'payoutUser') {
                    await interaction.deferUpdate();
                    const existingProfile = await Profile.findOne({ UserID: interaction.user.id })
                    const cooldowns = await Cooldowns.findOne({ UserID: interaction.user.id })
                    const existingIncomeUpgrades = await IncomeUpgrades.findOne({ UserID: interaction.user.id })   
                    const nextWeekDate = getNextWeekDate();

                    if (cooldowns) {
                        const lastIncomeDate = cooldowns.Income.toDateString();
        
                        if (lastIncomeDate === nextWeekDate) {
                            const cooldownEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Red')
                            .setDescription(`You have already collected your weekly income. Come back next week!`)
        
                            return interaction.editReply({ embeds: [cooldownEmbed], components: [], ephemeral: true })
                        }
                    } else {

                        if (existingIncomeUpgrades) {
                            if (existingIncomeUpgrades.UpgradeOne >= 1) {
                                income += 5000 * existingIncomeUpgrades.UpgradeOne
                            }
                            if (existingIncomeUpgrades.UpgradeTwo >= 1) {
                                income += 20000 * existingIncomeUpgrades.UpgradeTwo
                                // or income *= 20000 ** IncomeUpgrades.UpgradeTwo;
                            }
                            if (existingIncomeUpgrades.UpgradeThree >= 1) {
                                income += 100000 * existingIncomeUpgrades.UpgradeTwo
                                // or income *= 100000 ** IncomeUpgrades.UpgradeThree;
                            }
                        }

                        if (existingProfile) {
                            await Profile.findOneAndUpdate(
                                { UserID: interaction.user.id },
                                { $inc: { Balance: income } },
                                { new: true } 
                            )
                            Cooldowns.create({
                                UserID: interaction.user.id,
                                Income: getNextWeekDate()
                            })
                            const payoutEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Green')
                            .setDescription(`Paid out income of ${income} to <@${interaction.user.id}>.`);
    
                            return interaction.editReply({ embeds: [payoutEmbed], components: []})
                        } else {
                            const ErrPayoutEmbed = new EmbedBuilder()
                            .setTitle('Income Payout')
                            .setColor('Red')
                            .setDescription(`You don't have an existing economy`);
                            return interaction.editReply({ embeds: [ErrPayoutEmbed], components: [] })
                        }
                    }
                }
            });
            mainCollector.on('end', collected => {
                if (collected.size === 0) {
                    // No interaction collected
                    // Put your logic here if needed
                }
            });

            console.log(IncomeUpgrades.UpgradeOne)
            await interaction.editReply({
                embeds: [mainEmbed],
                components: [mainRow],
            });
        } catch (error) {
            console.error('Error Collecting Income:', error);
            interaction.followUp({ content: 'Failed to Collect Income.', ephemeral: true });
        }
    }
};