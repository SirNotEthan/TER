const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('arrest')
    .setDescription('Log the user you have arrested.')
    .addStringOption((option) => option 
        .setName('username')
        .setDescription('The roblox username of whom you arrested.')
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName('duration')
        .setDescription('Duration of the arrest')
        .setRequired(true)
    )
    .addStringOption((option) => option 
        .setName('reason')
        .setDescription('Reason of the arrest')
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName('evidence')
        .setDescription('Evidence to be included of the arrest')
        .setRequired(false)
    ),

    async execute(interaction) {
        await interaction.deferReply()

        if (!interaction.member.roles.cache.some(role => role.name === 'City Watch')) {
            return interaction.editReply('You do not have permission to use this command.');
        }

        const username = interaction.options.getString('username');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getString('duration');
        const evidence = interaction.options.getString('evidence');

        const LogsEmbed = new EmbedBuilder()
        .setTitle('Arrest Command was ran.')
        .addFields(
            { name: 'User', value: `${interaction.user.username}` },
            { name: 'UserID', value: `${interaction.user.id}` }
        )
        .setTimestamp()

        const Loggingchannel = interaction.client.channels.cache.get('1200946142498799667'); 
        Loggingchannel.send({ embeds: [LogsEmbed] });

        const ArrestEmbed = new EmbedBuilder()
            .setTitle('Arrested')
            .setColor('Blurple')
            .addFields(
                { name: "Officer", value: `<@${interaction.user.id}> (${interaction.user.id})` },
                { name: "Suspect's Username", value: `${username}` },
                { name: "Duration", value: `${duration}` },
                { name: "Evidence", value: `${evidence}` },
                { name: "Reason", value: `${reason}` }
            )
            .setTimestamp()

        const ArrestLogChannel1 = interaction.client.channels.cache.get('1205608242353541180')
        const ArrestLogChannel2 = interaction.client.channels.cache.get('1208798374950604912')
        ArrestLogChannel1.send({ embeds: [ArrestEmbed] })
        ArrestLogChannel2.send({ embeds: [ArrestEmbed] })
        return interaction.editReply({ content: 'Your arrest was logged!', epehermal: true })
    }
}