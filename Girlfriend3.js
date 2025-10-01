// girlfriend3.js — Couple Frame (Auto-delete 2 min)
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "girlfriend3",
    version: "2.0",
    author: "Rahat Premium",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Couple frame (girlfriend auto-delete 2 min)" },
    category: "GENERATOR",
    guide: { en: "{pn} @mention" }
  },

  onStart: async function ({ api, event }) {
    try {
      const mention = Object.keys(event.mentions || {})[0];
      if (!mention)
        return api.sendMessage(
          "❌ কাকে ভালোবাসা দিতে চাও তাকে mention করো🐸",
          event.threadID,
          event.messageID
        );

      const mentionName = event.mentions[mention];
      const senderID = event.senderID;

      // Frame link (Google Drive direct)
      const FILE_ID = "1r3347CEz7KRbNsz-gw5gvfnSgfUYq6B2";
      const frameUrl = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;

      // Profile URLs
      const mentionUrl = `https://graph.facebook.com/${mention}/picture?width=1024&height=1024&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      const senderUrl = `https://graph.facebook.com/${senderID}/picture?width=1024&height=1024&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

      // Load images
      const [frameImg, mentionImg, senderImg] = await Promise.all([
        loadImage(frameUrl),
        loadImage(mentionUrl),
        loadImage(senderUrl)
      ]);

      const W = frameImg.width,
        H = frameImg.height;
      const canvas = createCanvas(W, H);
      const ctx = canvas.getContext("2d");

      // Draw frame
      ctx.drawImage(frameImg, 0, 0, W, H);

      // Boy (sender) circle — updated position
      const sizeSender = 340;
      const rSender = sizeSender / 2;
      const boyCenter = { x: 580, y: 364 }; // updated

      ctx.save();
      ctx.beginPath();
      ctx.arc(boyCenter.x, boyCenter.y, rSender, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        senderImg,
        boyCenter.x - rSender,
        boyCenter.y - rSender,
        sizeSender,
        sizeSender
      );
      ctx.restore();

      // Girl (mention) circle — updated position
      const sizeMention = 310;
      const rMention = sizeMention / 2;
      const girlCenter = { x: 1203, y: 167 }; // updated

      ctx.save();
      ctx.beginPath();
      ctx.arc(girlCenter.x, girlCenter.y, rMention, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        mentionImg,
        girlCenter.x - rMention,
        girlCenter.y - rMention,
        sizeMention,
        sizeMention
      );
      ctx.restore();

      // Save image
      const outPath = path.join(__dirname, `girlfriend3_${Date.now()}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

      // Send image
      const messageInfo = await api.sendMessage(
        {
          body: `${mentionName} ➕ You = স্কুল জীবনে না পাওয়া আরেকটা দৃশ্য🐸🙂`,
          mentions: [{ tag: mentionName, id: mention }],
          attachment: fs.createReadStream(outPath)
        },
        event.threadID,
        event.messageID
      );

      // Auto delete after 2 minutes
      setTimeout(async () => {
        try {
          await api.unsendMessage(messageInfo.messageID);
          fs.unlinkSync(outPath);
        } catch (err) {
          console.error("Error deleting message or file:", err);
        }
      }, 120000);
    } catch (e) {
      console.error(e);
      return api.sendMessage(
        "⚠️ Error generating girlfriend3 frame.",
        event.threadID,
        event.messageID
      );
    }
  }
};
