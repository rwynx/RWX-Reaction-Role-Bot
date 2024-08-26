const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const clientId = process.env.CLIENT_ID; // do NOT forget to add your CLIENT id and check the syntax
const guildId = process.env.GUILD_ID; // do NOT forget to add your GUILD id and check the syntax

if (!clientId || !guildId) {
    console.error('CLIENT_ID or GUILD_ID is missing from .env file');
    process.exit(1);
}

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
