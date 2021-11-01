require('dotenv').config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
	new SlashCommandBuilder()
		.setName('deliver')
		.setDescription('Send a private message to a particular role of people')
		.addRoleOption(
			option =>
				option.setName('role')
				.setDescription('The role to send private message to.')
				.setRequired(true))
		.addStringOption(
			option =>
				option.setName('message')
				.setDescription('The message which you want to send.')
				.setRequired(true))
].map(command => command.toJSON());

const token = process.env.TOKEN;
const rest = new REST({ version: '9' }).setToken(token);

const clientId =  process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);