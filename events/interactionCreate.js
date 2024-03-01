const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Profile = require('../models/economySchema');
const HouseProfile = require('../models/houseEconomySchema');
const MarketData = require('../models/marketSchema.js');

const activeMarketOrder = {};
MarketData.find().then(targets => {
    targets.forEach(target => {
        MarketData[target.OrderID] = {
            UserID: target.UserID,
            Order: target.Order,
            PaymentType: target.PaymentType
        };
    });
}).catch(error => {
    console.error('Error loading active Orders:', error);
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, interaction.client); 
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }   
        } else if (interaction.isButton()) {
            console.log('Button Pressed')
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'CreateCrimeReportModal') {
                const reasonValue = interaction.fields.getTextInputValue('reasonInput');
                const usernameValue = interaction.fields.getTextInputValue('usernameInput');
                const evidenceValue = interaction.fields.getTextInputValue('evidenceInput');


                const ReportEmbed = new EmbedBuilder()
                    .setTitle('Crime Reported!')
                    .setColor('Orange')
                    .setDescription('The following information has been submitted.')
                    .addFields(
                        { name: 'Author:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
                        { name: 'Suspect:', value: `${usernameValue}` },
                        { name: 'Evidence:', value: `${evidenceValue}`},
                        { name: 'Reason:', value: `${reasonValue}`}
                    )
                    .setTimestamp();

                const CrimeReportChannel = interaction.client.channels.cache.get('1205608307822297209'); 
                await CrimeReportChannel.send({ embeds: [ReportEmbed] });
                return interaction.reply({ embeds: [ReportEmbed], ephemeral: true })
            }

            if (interaction.customId === "CreateOrderModal") {
                const usernameValue = interaction.fields.getTextInputValue('usernameInput')
                const orderValue = interaction.fields.getTextInputValue('orderInput')
                const paymentTypeValue = interaction.fields.getTextInputValue('paymentTypeInput')

                let NewOrderID;
                do {
                    NewOrderID = Math.floor(Math.random() * 10000000000);
                } while (activeMarketOrder[NewOrderID])

                activeMarketOrder[NewOrderID] = { username: usernameValue, order: orderValue, paymentType: paymentTypeValue };

                 await MarketData.create({
                    OrderID: NewOrderID,
                    UserID: usernameValue,
                    Order: orderValue,
                    PaymentType: paymentTypeValue
                });

                const OrderConfirmedEmbed = new EmbedBuilder()
                .setTitle('Order Confirmed!')
                .setColor('Green')
                .setDescription(`Order Number: ${NewOrderID} has been submitted`)
                .addFields(
                    {name: `UserID`, value: `${usernameValue}`},
                    {name: `Items`, value: `${orderValue}`},
                    {name: `Payment Type`, value: `${paymentTypeValue}`}
                )
                .setFooter({text: `Order Confirmed by ${interaction.user.username} (${interaction.user.id})`})
                .setTimestamp();

                const MarketLogChannel = interaction.client.channels.cache.get('1213166597905191033')
                await MarketLogChannel.send({ embeds: [OrderConfirmedEmbed] })
                return interaction.reply({ embeds: [OrderConfirmedEmbed] })
            }
        }
    }
};