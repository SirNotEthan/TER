const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('New Update'),
    async execute(interaction) {
        
        if (interaction.user.id === "959555371385622590") {
            const embed = new EmbedBuilder()
            .setTitle(`** City Watch Update!!! **`)
            .setColor('DarkGreen')
            .setDescription('The time has come for the City Watch to recieve something awesome! CITY WATCH ON TOP!')
            .addFields(
                { name: 'AOS Command :)', value: '/aos create will create an AOS target that will be sent to a channel in the City Watch server!' },
                { name: 'AOS Remove', value: '/aos remove will take away any not needed or false AOS targets'},
                { name: 'Command Looks', value: 'I will show you all what this looks like because why not.'},
                { name: 'WARNING!', value: 'This is the beta phase of this command and updates will roll out soon.'}
            )
            .setTimestamp()
            .setFooter({ text: 'Created and Maintained by SirNotEthan!' });

        const channel = interaction.guild.channels.cache.find(ch => ch.name === '↳﹗development');
        channel.send({ embeds: [embed] });
        channel.send(`@here`)
        interaction.reply({ embeds: [embed], ephemeral: true })
        } else {
            interaction.reply("You cant use this command.")
        }
    }
}