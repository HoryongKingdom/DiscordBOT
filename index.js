const dotenv = require('dotenv');
const Dokdo = require('dokdo');
dotenv.config();

const { Client, Collection, REST, Routes } = require('discord.js');
const client = (module.exports = new Client({ intents: [ 131071 ] }));
module.exports = client;
client.login(process.env['TOKEN']);

const fs = require('fs');

const DokdoHandler = new Dokdo.Client(client, {
	aliases: [ 'dokdo', 'debug', 'dok' ],
	prefix: '!',
});

client.on('messageCreate', async (message) => {
	await DokdoHandler.run(message);
});

const eventsPath = './events';
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = `./${ eventsPath }/${ file }`;
	const event = require(filePath);
	if (event.once == true) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const commands_json = [];

const commandsCategoryPath = './commands';
const commandsCategoryFiles = fs.readdirSync(commandsCategoryPath);

for (const category of commandsCategoryFiles) {
	const commandsPath = `./commands/${ category }`;
	const commandsFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandsFiles) {
		const command = require(`./commands/${ category }/${ file }`);
		client.commands.set(command.data.name, command);
		commands_json.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

rest
	.put(Routes.applicationCommands(process.env.ID), { body: commands_json })
	.then((command) => console.log(`${ command.length }개의 커맨드를 푸쉬했습니다`))
	.catch(console.error);
