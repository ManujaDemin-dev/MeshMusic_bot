//lets create from the begining
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection ,Events, GatewayIntentBits } = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient =>{
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');


// Ensure 'commands' directory exists before reading
if (fs.existsSync(commandsPath) && fs.statSync(commandsPath).isDirectory()) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
} else {
    console.error(`[ERROR] The 'commands' folder is missing or is not a directory.`);
}

// Fixing events path
const eventsPath = path.join(__dirname, 'commands');

if (fs.existsSync(eventsPath) && fs.statSync(eventsPath).isDirectory()) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
} else {
    console.error(`[ERROR] The 'events' folder is missing or is not a directory.`);
}



// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		const command = require(filePath);
// 		// Set a new item in the Collection with the key as the command name and the value as the exported module
// 		if ('data' in command && 'execute' in command) {
// 			client.commands.set(command.data.name, command);
// 		} else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// const eventsPath = path.join(__dirname, 'commands');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }


client.login(token);

