const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection , StreamType } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const { createReadStream } = require('node:fs');
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');
const { join } = require('node:path');

const player = createAudioPlayer();


const streamPipeline = promisify(pipeline);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwu')
        .setDescription('Play a song from YouTube'),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply('❌ You need to be in a voice channel to play music!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        await interaction.reply(`🎵 Playing:`);


        let resource = createAudioResource(createReadStream(join(__dirname, 'output.opus'), {
            inputType: StreamType.OggOpus,
        }));

        console.log(resource);

        player.play(resource);


        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.on('error', error => {
            console.error(`Error: ${error.message}`);
        });
    },
};