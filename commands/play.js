const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from any supported source.')
    .addStringOption(option =>
      option
        .setName('search')
        .setDescription('The song to play')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    try {
      const search = interaction.options.getString('search');
      const { channel } = interaction.member.voice;


      if (!channel) {
        return interaction.reply({
          content: 'You need to be in a voice channel to play music!',
          ephemeral: true,
        });
      }

      await interaction.reply({ content: ' Searching for your song...' });

      
      const player = await client.manager.createPlayer({
        guildId: interaction.guildId,
        textId: interaction.channel.id,
        voiceId: channel.id,
        volume: 100,
      });

      
      const res = await player.search(search, { requester: interaction.user });


      if (!res.tracks.length) {
        return interaction.editReply({ content: '❌ No results found for your search.' });
      }

      // 📜 Playlist handling
      if (res.type === 'PLAYLIST') {
        res.tracks.forEach(track => player.queue.add(track));
        if (!player.playing && !player.paused) player.play();

        const embed = new EmbedBuilder()
          .setColor('#1DB954')
          .setTitle('🎵 Playlist added to the queue!')
          .setDescription(`**[${res.playlistName}](${search})**\nQueued ${res.tracks.length} tracks.`)
          .setFooter({ text: 'Enjoy your music! 🎶' });

        return interaction.editReply({ embeds: [embed] });
      } else {
        // 🎧 Single track handling
        player.queue.add(res.tracks[0]);
        if (!player.playing && !player.paused) player.play();

        const embed = new EmbedBuilder()
          .setColor('#90ee90')
          .setTitle('Now Playing')
          .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
          .setFooter({ text: 'Enjoy the music.' })
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        return interaction.editReply({ content: 'An error occurred while trying to play the song.' });
      } else {
        return interaction.reply({ content: 'An error occurred while trying to play the song.', ephemeral: true });
      }
    }
  },
};


