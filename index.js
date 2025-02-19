//lets create from the begining
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection ,Events, GatewayIntentBits , SlashCommandBuilder} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient =>{
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    
    const ping = new SlashCommandBuilder()
    .setName ('ping')
    .setDescription('This is a ping command! ');
    
    client.application.commands.create(ping);
    
    client.on('interactionCreate', (interaction) =>{
        if(!interaction.isChatInputCommand()) return;
    
        if(interaction.commandName==='ping'){
            interaction.reply('Pong! Yow');
        }
    
    });
});




// client.commands = new Collection();

// const func = fs.readdirSync('./functions').filter(file => file.endsWith(".js"));

// const commandfol = fs.readdirSync("./commands/utility");

// (async () => {
//     for (file of func){
//         require(`./functions/${file}`)(client);
//     }
//     client.handelCommands(commandfol, "./commands/utility");
// })();










// const commandsPath = path.join(__dirname, 'commands');


// // Ensure 'commands' directory exists before reading
// if (fs.existsSync(commandsPath) && fs.statSync(commandsPath).isDirectory()) {
//     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//     for (const file of commandFiles) {
//         const filePath = path.join(commandsPath, file);
//         const command = require(filePath);

//         if ('data' in command && 'execute' in command) {
//             client.commands.set(command.data.name, command);
//         } else {
//             console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//         }
//     }
// } else {
//     console.error(`[ERROR] The 'commands' folder is missing or is not a directory.`);
// }


// // Interaction Event for Slash Commands
// client.on(Events.InteractionCreate, async (interaction) => {
//     if (!interaction.isCommand()) return;

//     const command = client.commands.get(interaction.commandName);
//     if (!command) {
//         console.error(`❌ No command found for ${interaction.commandName}`);
//         return;
//     }

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({ content: '❌ An error occurred while executing this command!', ephemeral: true });
//     }
// });



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

