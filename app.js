const { Client, GatewayIntentBits, RPCCloseEventCodes } = require("discord.js");
const RPC = require("discord-rpc");
const WOK = require("wokcommands");
const path = require("path");

const dotenv = require("dotenv");
const { timeStamp } = require("console");
dotenv.config();

const client = new RPC.Client({ transport: "ipc" });

async function setActivity() {
	if (!RPC) return;
	RPC.setActivity({
		
		details: "Text Based Roleplay",
		state: "Playing Grand Theft Auto: RP",
		startTimeStamp: "1507665886",
		largeImageKey: "rpc_icon",
		largeImageText: "Carl Johnson",
		buttons:
			[ {
				label: "YouTube",
				url: "https://www.youtube.com",
			}, {
				label: "Google",
				url: "https://www.google.ca",
			} ],
	});
}


console.log("RPC is Running");


client.on("ready", (c) => {
	console.log(` ${ c.user.tag } is Online!`);
	
	setActivity();
	
	new WOK({
		client,
		commandsDir: path.join(__dirname, "commands"),
		featuresDir: path.join(__dirname, "features"),
		testServers: "1087164983055499315",
		botOwners: "1071740521497763900",
	});
});
client.login(process.env.TOKEN, process.env.clientID);