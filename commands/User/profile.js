const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Profile = require('../../models/profileSchema.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('User Profile')
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Creates a Fresh Profile (Limit: 1)')
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete your profile')
        )
        .addSubcommand(subcommand => subcommand
            .setName('edit')
            .setDescription('Edit your profile')
            .addStringOption(option => option
                .setName('title')
                .setDescription('Your character title.')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('house')
                .setDescription('Your current house')
                .setRequired(false)
            )
            .addNumberOption(option => option
                .setName('age')
                .setDescription('Your character age.')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('View a profile')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to view')
                .setRequired(true)
            )
        ),

    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const existingProfile = await Profile.findOne({ UserID: interaction.user.id });
            if (existingProfile) {
                return interaction.reply('Profile already exists.');
            }

            try {
                await Profile.create({
                    UserID: interaction.user.id,
                    Title: interaction.user.username,
                    House: 'Kingdom of Jerusalem',
                    Age: 0
                });
                interaction.reply({ content: 'Created a Profile.', ephemeral: true });
            } catch (error) {
                console.error('Error creating profile:', error);
                interaction.reply('Failed to create a profile.');
            }
        } else if (subcommand === 'delete') {
            const existingProfile = await Profile.findOne({ UserID: interaction.user.id });
            if (existingProfile) {
                try {
                    await Profile.deleteOne({ UserID: interaction.user.id });
                    return interaction.reply({ content: 'Profile Deleted.', ephemeral: true });
                } catch (error) {
                    console.error('Error deleting profile:', error);
                    return interaction.reply('Failed to delete the profile.');
                }
            } else {
                return interaction.reply('Profile does not exist.');
            }
        } else if (subcommand === 'edit') {
            const titleOption = interaction.options.getString('title');
            const houseOption = interaction.options.getString('house');
            const ageOption = interaction.options.getNumber('age');

            const existingProfile = await Profile.findOne({ UserID: interaction.user.id });

            if (existingProfile) {
                try {
                    if (isNaN(ageOption)) return interaction.reply({ content: 'No Valid Number Provided', ephemeral: true });
                    existingProfile.Age = ageOption;
                    existingProfile.Title = titleOption;
                    existingProfile.House = houseOption;
                    await existingProfile.save();

                    return interaction.reply('Updated Profile.')
                } catch (error) {
                    console.log('Error editing profile:', error)
                    return interaction.reply('Failed to Edit Profile.')
                }
            }

        } else if (subcommand === 'view') {
            const targetUser = interaction.options.getUser('user');

            try {
                const existingProfile = await Profile.findOne({ UserID: targetUser.id });

                if (existingProfile) {
                    const profileEmbed = new EmbedBuilder()
                        .setTitle(`${targetUser.tag}・Profile`)
                        .setDescription(' ')
                        .setThumbnail(targetUser.avatarURL({ dynamic: true }))
                        .addFields(
                            { name: 'User', value: `${targetUser.tag}` },
                            { name: 'Title', value: `${existingProfile.Title}` },
                            { name: 'House', value: `${existingProfile.House}` },
                            { name: 'Age', value: `${existingProfile.Age}` }
                        )
                        .setTimestamp();

                    return interaction.reply({ embeds: [profileEmbed] });
                } else {
                    return interaction.reply('Profile does not exist.');
                }
            } catch (error) {
                console.error('Error Viewing Profile:', error);
                return interaction.reply('Failed to view the profile.');
            }
        }
    }
};
