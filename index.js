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

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued! This one is good OwO`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue finished!");
});

client.on("messageCreate" , async (message) {
    if(message.author.bot || !message.guild) return;
    if(!client.application?.owner) await client.application?.fetch();

    if(message.content === "!deploy" && message.author.id === client.application.owner?.id) {
        await message.guild.commands.set([
            {
            name: "play",
            description: "Plays a Song from YT or ...",
            Option:[{
                name:"query",
                type: "STRING",
                description: "The song you want to play :)",
                required:true
            }]
        },
        
        {
            name:"skip",
            description: "Skip to the new song"
        },
        
        {
            name:"stop",
            description: "Stop the player"
        },
    ]);

    await message.reply("Deployed!");

    }
});

