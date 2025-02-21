const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const { createReadStream } = require('node:fs');
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');
const ffmpeg = require('ffmpeg-static');
const { spawn } = require('child_process');

const streamPipeline = promisify(pipeline);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnew')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL')
                .setRequired(true)),
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

        await interaction.reply(`🎵 Playing: ${url}`);

        const ffmpeg = spawn('ffmpeg', [
            '-i', 'pipe:0',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            'pipe:1'
          ]);

        youtubedl(url, {
            output: '-',
            format: 'bestaudio',
        }).stdout.pipe(ffmpeg.stdin);

        const resource = createAudioResource(ffmpeg.stdout);
        const player = createAudioPlayer();

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