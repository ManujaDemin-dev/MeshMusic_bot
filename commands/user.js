const {SlashCommandBuilder} = require("discord.js");
const { execute } = require("./ping");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides infomation about the user.'),
    async execute(interaction){
        await interaction.reply(`This command was run by ${interaction.user.username}, Who joined on ${interaction.member.joinedAt}.`);

    },

};

