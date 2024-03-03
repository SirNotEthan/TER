const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const notes = require('../../models/ReleaseNotesSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('release-notes')
    .setDescription('Release Notes')
    .addSubcommand((subcommand) => subcommand
        .setName('publish')
        .setDescription('Add new release notes (developers only)')
        .addStringOption((option) => option
            .setName('updated-notes')
            .setDescription('The notes to publish')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => subcommand
        .setName('view')
        .setDescription('View the most recent release notes.')
    ),
    async execute(interaction) {
        const subcommands = interaction.options.getSubcommand()
        var data = await notes.find();

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message)

            await interaction.reply({ embeds: [embed], ephemeral: true })
        }

        async function updateNotes(update, version) {
            await notes.create({
                Updates: update,
                Date: Date.now(),
                Developer: interaction.user.username,
                Version: version
            });

            await sendMessage('Release Notes Updated!')
        }

        switch (subcommands) {
            case 'publish':
                if (interaction.user.id !== "959555371385622590") {
                    await sendMessage(`Sorry! Looks like only developers can use this!`)
                } else {
                    const update = interaction.options.getString('updated-notes');
                    if (data.length > 0 ) {
                        await notes.deleteMany();

                        var version = 0;
                        await data.forEach(async value => {
                            version += value.Version;
                        })

                        await updateNotes( update, version+0.1);
                    } else {
                        await updateNotes( update, 1.0);
                    }
                }
            break;
            case 'view':
                if (data.length == 0) {
                    await sendMessage(`There is no public release notes..`)
                } else {
                    var string = ''
                    await data.forEach(async value => {
                        string += `\`${value.Version}\` \n\n**Update Information:**\n\`\`\`${value.Updates}\`\`\`\n\n**Updating Developer:** ${value.Developer}\n**Update Date:** <t:${Math.floor(value.Date / 1000)}:R>`
                    })

                    await sendMessage(` **Release Notes** ${string}`)
                }
        }
    }
}