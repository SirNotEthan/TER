const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { inspect } = require('util')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates given code. [ETHAN ONLY]')
    .addStringOption((option) => option
        .setName('input')
        .setDescription('Code Input')
        .setRequired(true)
    ),
    async execute(interaction) {
        if (!interaction.user.id === '959555371385622590') return;

        const code = interaction.options.getString('input')
        if (!code) return interaction.reply('Please provide some code to evaluate.')

        try {
            const result = await eval(code);
            let output = result;

            if (typeof result !== 'string') {
                output = inspect(result)
            }

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle('200 : Success')
                    .setDescription(`Result\n\`\`\`yml\n${output}\n\`\`\``)
                    .setFooter({ test: `Evaluated by: ${interaction.user.username}`})
                   .setTimestamp()
                ],
            });
        } catch (err) {
            console.log(err)
            interaction.reply({ 
                embeds: [
                    new EmbedBuilder()
                    .setTitle('808 : Evaluated content to long to display.')
                    .setDescription(`Result\n\`\`\`yml\n${error}\n\`\`\``)
                    .setFooter({ test: `Evaluated by: ${interaction.user.username}`})
                    .setTimestamp()
                ],
            })
        }
    }
}