const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Use to Check bot status!'),
        
    async execute(interaction){
        await interaction.reply('Pong! yoww UwU');
    },
};


