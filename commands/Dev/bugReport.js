const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Report a bug.')
        .addStringOption((option) => option
            .setName('description')
            .setDescription('Detailed report about the bug you\'re experiencing')
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName('tags')
            .setDescription('Select tags to categorize the bug')
            .setRequired(true)
            .addChoices(
                { name: 'Bot', value: 'Bot' },
                { name: 'Server', value: 'Server' },
                { name: 'Main Game', value: 'Main Game' }
            )
        ),
    async execute(interaction) {
        try {
            const description = interaction.options.getString('description');
            const tags = interaction.options.getString('tags');

            const reportEmbed = new EmbedBuilder()
            .setTitle('Bug Report!')
            .setDescription(`${interaction.user.username} (${interaction.user.id}) has submitted a bug report`)
            .addFields(
                { name: 'Bug Description', value: `${description}` },
                { name: `Type`, value: `${tags}`}
            )
            .setFooter({ text: `Please handle issues that corrospond your department.`})
            .setTimestamp();


            const channel = interaction.client.channels.cache.get('1211760666050953226')
            channel.send({ embeds: [reportEmbed] })
            await interaction.reply({ content: `Bug reported: ${description} (${tags})`, embeds: [reportEmbed], ephemeral: true });
        } catch (error) {
            console.error('Error handling bug report:', error);
            await interaction.reply('There was an error while reporting the bug.');
        }
    }
};
