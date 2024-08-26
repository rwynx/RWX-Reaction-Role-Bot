const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

// make sure you set it up in a channel where members and also the bot can interact with

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Set up a reaction role')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to add the reaction role to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign when the reaction is added')
                .setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('message_id'); // message id here - make sure the message in a channel where bot can interact with
        const emoji = interaction.options.getString('emoji');
        const role = interaction.options.getRole('role');

        const message = await interaction.channel.messages.fetch(messageId);
        if (!message) {
            return interaction.reply({ content: 'Message not found.', ephemeral: true });
        }

        try {
            await message.react(emoji);
            interaction.client.reactionRoles.set(`${messageId}-${emoji}`, role.id);
            return interaction.reply({ content: 'Reaction role set up successfully.', ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error setting up the reaction role.', ephemeral: true });
        }
    },
};
