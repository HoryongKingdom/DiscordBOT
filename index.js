const { Client, Collection, REST, Routes } = require('discord.js');
const client = (module.exports = new Client({ intents: [ 131071 ] }));
module.exports = client;

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const mongoose = require('mongoose');
const mongoURL = process.env.MONGOURL;

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

if (!mongoURL) return;
mongoose.connect(mongoURL || '', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
if (mongoose.connect) {
	console.log('DB 연결 완료!');
} else {
	console.log('DB 연결 실패.');
}

client.login(process.env.TOKEN);
