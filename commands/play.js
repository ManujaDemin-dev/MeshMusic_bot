const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { spawn } = require('child_process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a YouTube video in a voice channel')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The URL of the YouTube video')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply('❌ You need to be in a voice channel to use this command!');
    }

    // Check if the bot has the necessary permissions in the voice channel
    const botMember = interaction.guild.members.me; // Get the bot's member object
    if (!botMember || !botMember.permissions.has('CONNECT') || !botMember.permissions.has('SPEAK')) {
      return interaction.reply('❌ I need permission to join and speak in the voice channel!');
    }

    await interaction.deferReply();

    try {
      console.log('🔌 Joining voice channel...');
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      console.log('✅ Voice connection ready.');

      console.log('🔗 Attempting to stream YouTube audio...');
      const youtubeStream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });

      youtubeStream.on('error', (err) => console.error(`❗ YTDL Error: ${err.message}`));

      const ffmpeg = spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-f', 's16le',
        '-ar', '48000',
        '-ac', '2',
        'pipe:1'
      ]);

      ffmpeg.stderr.on('data', (data) => console.error(`⚠️ FFmpeg Error: ${data}`));
      ffmpeg.on('close', (code) => console.log(`📦 FFmpeg exited with code ${code}`));

      youtubeStream.pipe(ffmpeg.stdin);

      const resource = createAudioResource(ffmpeg.stdout, {
        inputType: undefined, // Adjust if needed
      });

      const player = createAudioPlayer();
      console.log('🎛️ Audio player created.');

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log(`🎵 Now playing: ${url}`);
        interaction.followUp(`🎧 Now playing: ${url}`);
      });

      player.on('error', error => {
        console.error(`❗ Player Error: ${error.message}`);
        interaction.followUp(`⚡ Player error: ${error.message}`);
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('🛑 Audio player idle. Disconnecting.');
        connection.destroy();
      });

    } catch (error) {
      console.error(`💥 Critical Error: ${error.stack}`);
      await interaction.followUp('🚨 Error occurred while trying to play audio. Check console for details.');
    }
  }
};
