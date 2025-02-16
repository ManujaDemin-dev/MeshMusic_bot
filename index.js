const { Client, GuildMember, Intents } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const client = new Client({
    intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});
client.login(config.token);


client.once('ready', () => {
    console.log('Ready!');
   });
   
   client.on("error", console.error);
   client.on("warn", console.warn);

const player = new Player(client);

player.on("error:0", (queue, error) => {
    console.log(`[${queue.guild.name}] Error from the queue : ${error.message}`);
});

player.on("connectionError 501" , (queue,error) =>{
    console.log(`[${queue.guild.name}] ERROR FROM connection: ${error.message}`);

});

