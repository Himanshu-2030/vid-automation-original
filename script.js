const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths (adjust these paths as needed)
const quoteFile = "quotes.txt";
const audioFolder = "audio_files";
const fontPath = "Livvic-ExtraLightItalic.ttf";
const outputFolder = "output_videos";

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Read quotes from file
const quotes = fs
  .readFileSync(quoteFile, "utf-8")
  .split("\n")
  .map((line) => line.trim());

// Function to create a video with a quote
function createVideoWithQuote(quote, author, audioFile, outputFile) {
  const command1 =
    `ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=10 -vf ` +
    `"drawtext=fontfile=${fontPath}:text='${quote}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h)/2,` +
    `drawtext=fontfile=${fontPath}:text='- ${author}':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+60" ` +
    `-c:v libx264 -pix_fmt yuv420p -t 10 intermediate.mp4`;

  execSync(command1);

  const command2 = `ffmpeg -i intermediate.mp4 -i "${audioFile}" -c:v copy -c:a aac -shortest "${outputFile}"`;

  execSync(command2);

  fs.unlinkSync("intermediate.mp4");
}

// Loop through quotes and generate videos
quotes.forEach((line, index) => {
  const [quote, author] = line.split(" - "); // Assuming the format "Quote - Author"
  const audioFiles = fs.readdirSync(audioFolder);
  const audioFile = path.join(
    audioFolder,
    audioFiles[Math.floor(Math.random() * audioFiles.length)]
  );
  const outputFile = path.join(outputFolder, `video_${index + 1}.mp4`);
  createVideoWithQuote(quote, author, audioFile, outputFile);
});

console.log("Videos have been successfully generated.");
