const fetch = require("node-fetch");

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `*Example:* .tiktok https://vm.tiktok.com/ZGJAmhSrp/`;
  }
  if (!args[0].match(/tiktok/gi)) {
    throw 'Pastikan linknya dari TikTok';
  }
  m.react('🕒')
  let start = new Date();
  try {
    const ress = await fetch(`https://api.tiklydown.eu.org/api/download?url=${args[0]}`);
 const res = await ress.json();
 const caption = `*乂 T I K T O K*
 
 • *Author* : ${res.author.name}
 • *Like* : ${res.stats.likeCount}
 • *Commad* : ${res.stats.commentCount}
 • *Share* : ${res.stats.shareCount}
 • *Viewer* : ${res.stats.playCount}
 • *Save* : ${res.stats.saveCount}
 • *Sound* : ${res.music.title}
 • *Duration* : ${res.video.durationFormatted}
 • *Quality* : ${res.video.ratio}
 • *Upload* : ${res.created_at}
 • *Title* : ${res.title}

${global.wm}`
    await conn.sendFile(m.chat, res.video.noWatermark, null, caption, m);

m.react('✅')
  } catch (error) {
m.react('❌')
  }
};

handler.help = ['tiktok'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|tt|tiktokdl|tiktoknowm)$/i;
handler.limit = true;
handler.group = false;

module.exports = handler;