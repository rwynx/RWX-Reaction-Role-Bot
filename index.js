const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
    ],
});

client.reactionRoles = new Map();

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.error(`Command in file ${file} is missing a "data.name" property.`);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Error while executing the command', ephemeral: true });
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return; // to ignore bot reactions prevents rwyns other bots going thru

    const roleId = client.reactionRoles.get(`${reaction.message.id}-${reaction.emoji.toString()}`);
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (member) {
        try {
            await member.roles.add(roleId);
        } catch (error) {
            console.error(`Failed to add role: ${error}`);
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot) return; // to ignore bot reactions prevents rwyns other bots going thru

    const roleId = client.reactionRoles.get(`${reaction.message.id}-${reaction.emoji.toString()}`);
    if (!roleId) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (member) {
        try {
            await member.roles.remove(roleId);
        } catch (error) {
            console.error(`Failed to remove role: ${error}`);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
