const { spawn } = require('child_process');

const ffmpeg = spawn('ffmpeg', ['-version']);

ffmpeg.stdout.on('data', (data) => {
  console.log(`FFmpeg output: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
  console.error(`FFmpeg error: ${data}`);
});

ffmpeg.on('close', (code) => {
  console.log(`FFmpeg process exited with code ${code}`);
});
