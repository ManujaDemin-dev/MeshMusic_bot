const {SlashCommandBuilder} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('hii')
        .setDescription('Welcome user'),
    async execute(interaction){
        await interaction.reply(`Hello ${interaction.user.username} nice to meet you `);

    },
};

