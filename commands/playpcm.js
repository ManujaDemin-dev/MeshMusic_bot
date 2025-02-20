const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { createAudioResource: createFFmpegResource } = require('@discordjs/voice');
const { spawn } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playpcm')
        .setDescription('Plays the output.pcm file in the voice channel'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return await interaction.reply({ content: '❌ You need to be in a voice channel!', flags: 64 });
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();

            // ✅ Use FFmpeg to convert PCM to proper audio stream
            const ffmpeg = spawn('ffmpeg', [
                '-f', 's16le',          // PCM format
                '-ar', '48000',         // Audio sample rate (48kHz for Discord)
                '-ac', '2',             // 2 audio channels
                '-i', 'song.mp3',     // Input file
                '-f', 'yo.opus',           // Output format (Discord compatible)
                'pipe:1'                // Output to stdout
            ]);

            const resource = createAudioResource(ffmpeg.stdout);
            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log('🎵 The audio is now playing!');
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('✅ Finished playing.');
                connection.destroy();
            });

            await interaction.reply({ content: '🎶 Now playing output.pcm!', flags: 64 });
        } catch (error) {
            console.error('❌ Error while playing:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: '⚠️ An error occurred while playing the file.', flags: 64 });
            }
        }
    },
};
