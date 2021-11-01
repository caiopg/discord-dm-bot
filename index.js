require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    console.log('Received a command for bot.');
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

    console.log(`Command name: ${commandName}`);
	if (commandName === 'deliver') {
        const ctxRole = interaction.options.get('role');
        const ctxMessage = interaction.options.get('message');

        console.log(`Role: ${ctxRole.value}`);
        console.log(`Message: ${ctxMessage.value}`);

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const memberList = await guild.members.list({ limit: 1000 });
        memberList.forEach(member => {
            member.roles.cache.forEach(async (role) => {
                if (role.id === ctxRole.value) {
                    const memberName = member.displayName;
                    console.log(`Trying to send message to ${memberName}...`);
                    await member.send(ctxMessage.value);
                    console.log(`SUCCESS`);
                }
            });
        });

        await interaction.reply('Delivered the mail!');
	} else {
        await interaction.reply('Huh?');
    }
});

const token = process.env.TOKEN;
client.login(token);