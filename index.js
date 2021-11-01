require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    console.log('Received a command for bot.');

    const authorizedMembers = process.env.AUTHORIZED_MEMBERS.split(',');
    const currentMemberId = interaction.member.id;
    if(!authorizedMembers.includes(currentMemberId)) {
        console.log(`NOT AUTHORIZED MEMBER ID: ${currentMemberId}`);
        return;
    }

	if (!interaction.isCommand()) {
        console.log(`Not a command`);
        return;
    }

	const { commandName } = interaction;

    console.log(`Command name: ${commandName}`);
	if (commandName === 'deliver') {
        const ctxRole = interaction.options.get('role');
        const ctxMessage = interaction.options.get('message');

        console.log(`Role: ${ctxRole.value}`);
        console.log(`Message: ${ctxMessage.value}`);

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const memberList = await guild.members.list({ limit: 1000 });
        memberList.forEach(async member => {
            member.roles.cache.forEach(async (role) => {
                if (role.id === ctxRole.value) {
                    const memberName = member.displayName;
                    console.log(`Trying to send message to ${memberName}...`);
                    await member.send(ctxMessage.value);
                    console.log(`SUCCESS ${memberName}`);
                }
            });
        });

        await interaction.reply('Delivered the mail!');
	} else {
        await interaction.reply('Huh?');
    }
});

client.on('messageCreate', async message => {
    if(message.author.bot) {
        return;
    }
    console.log('Received a message in channel.');

    const authorizedMembers = process.env.AUTHORIZED_MEMBERS.split(',');
    const currentMemberId = message.member.id;
    if(!authorizedMembers.includes(currentMemberId)) {
        console.log(`NOT AUTHORIZED MEMBER ID: ${currentMemberId}`);
        return;
    }

    const messageContent = message.content;
    console.log(`Message: ${messageContent}`);
	if (messageContent.startsWith('!')) {

        const splitMessage = messageContent.split(' ');
        const messageToSend = messageContent.replace(`${splitMessage[0]} `,'');
        const messageRole = splitMessage[0].replace('!', '');

        console.log(`Role: ${messageRole}`);
        console.log(`Message: ${messageToSend}`);

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const memberList = await guild.members.list({ limit: 1000 });

        memberList.forEach(member => {
            member.roles.cache.forEach(async (role) => {
                if (role.name === messageRole) {
                    const memberName = member.displayName;
                    console.log(`Trying to send message to ${memberName}...`);
                    await member.send(messageToSend);
                    console.log(`SUCCESS ${memberName}`);
                }
            });
        });

	} else {
        console.log("Nothing was done with message");
    }
});

const token = process.env.TOKEN;
client.login(token);