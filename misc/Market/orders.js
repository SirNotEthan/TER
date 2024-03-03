const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MarketData = require('../../models/marketSchema.js')

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
    data: new SlashCommandBuilder()
        .setName('orders')
        .setDescription('View, Delete or Mark Done Current Orders')
        .addSubcommand((subcommand) => subcommand 
            .setName('view')
            .setDescription('View Current Orders')
        )
        .addSubcommand((subcommand) => subcommand
            .setName('delete')
            .setDescription('Delete an order')
            .addStringOption((option) => option
                .setName('order-id')
                .setDescription('Order ID to delete')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('done')
            .setDescription('Mark Order as Completed')
            .addStringOption((option) => option
                .setName('order-id')
                .setDescription('Order ID to delete')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        await interaction.deferReply()

        if (!interaction.member.roles.cache.some(role => role.id === '1180473978586931300')) {
            return interaction.reply({ content: 'You do not have permission to execute this command.', ephemeral: true });
        }

        const subcommands = interaction.options.getSubcommand()

        if (subcommands === "view") {
            try {
                const allOrders = await MarketData.find();
    
                if (!allOrders || allOrders.length === 0) {
                    return interaction.editReply({ content: 'No orders found.', ephemeral: true });
                }
    
                const ordersList = allOrders.map(order => {
                    return `**Order ID:** ${order.OrderID}\n**UserID:** ${order.UserID}\n**Order:** ${order.Order}\n**Payment Type:** ${order.PaymentType}\n`;
                }).join('\n');
    
                const ordersEmbed = new EmbedBuilder()
                    .setTitle('Market Orders')
                    .setColor('Blue')
                    .setDescription(ordersList)
                    .setTimestamp();
    
                return interaction.editReply({ embeds: [ordersEmbed] });
            } catch (error) {
                console.error('Error fetching orders:', error);
                return interaction.editReply({ content: 'There was an error while fetching orders.', ephemeral: true });
            }
        }

        if (subcommands === "delete") {
            try {
                const order_id = interaction.options.getString('order-id')

                const existingOrder = await MarketData.findOne({ OrderID: order_id });
                if (existingOrder) {
                    await MarketData.findOneAndDelete({ OrderID: order_id });
                    delete activeMarketOrder[order_id];
                    return interaction.editReply(`Removed Order: ${order_id}`);
                } else {
                    return interaction.editReply(`Order: ${order_id} does not exist.`);
                }
            } catch(err) {
                console.error(err);
            }
        }

        if (subcommands === "done") {
            try {
                const order_id = interaction.options.getString('order-id')

                const OrderCompleteEmbed = new EmbedBuilder()
                .setTitle('Order Completed')
                .setDescription(`Order Number ${order_id} has been completed, your new perks!`)
                .setFooter({ text: `Order Completed by ${interaction.user.username} (${interaction.user.id})` })
                .setTimestamp()

                const existingOrder = await MarketData.findOne({ OrderID: order_id });
                if (existingOrder) {
                    interaction.client.users.fetch(`${existingOrder.UserID}`, false). then((user) => {
                        user.send({ embeds: [OrderCompleteEmbed] })
                    })
                    await MarketData.findOneAndDelete({ OrderID: order_id });
                    delete activeMarketOrder[order_id];
                    return interaction.editReply(`Completed Order: ${order_id}`);
                } else {
                    return interaction.editReply(`Order: ${order_id} does not exist.`);
                }
            } catch(err) {
                console.error(err);
            }
        }
    }
};