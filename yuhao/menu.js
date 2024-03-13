const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
process.env.TZ = 'Asia/Jakarta'
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let tags = {
'main': 'Main',
'ai': 'Openai',
'internet': 'Internet',
'fun': 'Fun',
'kerang': 'Kerang Ajaib',
'tools': 'Tools',
'info': 'Info',
'xp': 'Exp',
'game': 'Game',
'anime': 'Anime',
'downloader': 'Downloader',
'group': 'Group',
'owner': 'Creator',
'sticker': 'Sticker',
'advanced': 'Advanced',
'': 'No Catagory'
}
const defaultMenu = {
  before: `
❐    *INFO USER*
┆ *Name* : %name
┆ *Tag* : %tag
┆ *Tersisa* : %limit Limit
┆ *Role* : %role
┆ *Level* : %level 
┆ *Exp* : %totalexp XP 
❐─────────────────⬣
┆   *TODAY*
┆ *Hari* : %week %weton
┆ *Tanggal* : %date
┆ *Tanggal Islam* : %dateIslamic
┆ *Waktu* : %wib
┗─────────────────⬣
%readmore`.trim(),
  header: '┌  ◦ *%category*',
  body: '│  ◦ %cmd %islimit %isPremium',
  footer: '└\n',
  after: ``,
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = m.name
    let tag = `@${m.sender.split('@')[0]}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
    const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.yuhao).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      ucapan: ucapan(),
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, tag, weton, week, date, dateIslamic, wib, wit, wita, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let audio = `https://raw.githubusercontent.com/aisyah-rest/mangkane/main/Mangkanenya/mangkane1.mp3`
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co/gS0XrNc/avatar-contact.png')
    let urls = pickRandom(['https://telegra.ph/file/035e524939ab0294ba91f.jpg', 'https://telegra.ph/file/96b2275d3b14d071290bc.jpg', 'https://telegra.ph/file/2c6b7660bc6126404a9bb.jpg', 'https://telegra.ph/file/c635bf577bb9d59a3e00b.jpg', 'https://telegra.ph/file/be8dd52f6363f9e9f5a60.jpg', 'https://telegra.ph/file/02e53361b9dc946f63c8d.jpg', 'https://telegra.ph/file/298ed2f1bba17aeb64ca8.jpg', 'https://telegra.ph/file/be2a18221974147f66ea0.jpg'])
    //------------------ DOCUMENT
    let d1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    let d2 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    let d3  = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    let d4 = 'application/pdf'
    let d5 = 'application/vnd.android.package-archive'
    let d6 = 'application/zip'
    let td = `${pickRandom([d1,d2,d3,d4,d5,d6])}`
    
    const hariRaya = new Date('February 10, 2024 23:59:59')
    const sekarang = new Date().getTime()
    const Selisih = hariRaya - sekarang
    const jhari = Math.floor( Selisih / (1000 * 60 * 60 * 24));
    const jjam = Math.floor( Selisih % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    const mmmenit = Math.floor( Selisih % (1000 * 60 * 60) / (1000 * 60))
    const ddetik = Math.floor( Selisih % (1000 * 60) / 1000)

    const fdoc = {
   key : {
   remoteJid: 'status@broadcast',
   participant : '0@s.whatsapp.net'
   },
   message: {
   documentMessage: {
   title: 'hai kak ' + m.name + ' ' + ucapan (), 
   }
   }
   }

/* await conn.reply(m.chat, text, m, { contextInfo: {
    mentionedJid: [m.sender],
externalAdReply: {
            title: "Menuju Tahun baru Imlek || 迈向中国新年",
            body: `${jhari} Hari ${jjam} Jam ${mmmenit} Menit ${ddetik} Detik`,
            description: wm,
            mediaType: 1,
            thumbnailUrl: pp,
            renderLargerThumbnail: true,
sourceUrl: sig
        }
     }
    })*/
    
    const _0x3dcef3=_0x53a1;function _0x5800(){const _0x5b5a1b=['45897mqxjAp','141168ubEtAw','titlebot','chat','40DxJuxL','66094QoIqlt','406660TakglC','80wsaYRi','294LPmSAY','489231MvbzAx','fsizedoc','56OKuurm','sender','1594582EiBWMk','sendMessage','./yuhao.jpeg','209045fvuIUy'];_0x5800=function(){return _0x5b5a1b;};return _0x5800();}function _0x53a1(_0x1f5185,_0x33bf4d){const _0x5800e3=_0x5800();return _0x53a1=function(_0x53a197,_0x282b39){_0x53a197=_0x53a197-0x1a2;let _0x285e72=_0x5800e3[_0x53a197];return _0x285e72;},_0x53a1(_0x1f5185,_0x33bf4d);}(function(_0xb7a1c6,_0x5973ab){const _0x1a3311=_0x53a1,_0x45cb09=_0xb7a1c6();while(!![]){try{const _0x14663e=-parseInt(_0x1a3311(0x1ad))/0x1+-parseInt(_0x1a3311(0x1a8))/0x2+parseInt(_0x1a3311(0x1a7))/0x3+parseInt(_0x1a3311(0x1b2))/0x4*(-parseInt(_0x1a3311(0x1a6))/0x5)+parseInt(_0x1a3311(0x1af))/0x6*(parseInt(_0x1a3311(0x1ac))/0x7)+-parseInt(_0x1a3311(0x1ab))/0x8*(parseInt(_0x1a3311(0x1b0))/0x9)+parseInt(_0x1a3311(0x1ae))/0xa*(parseInt(_0x1a3311(0x1a3))/0xb);if(_0x14663e===_0x5973ab)break;else _0x45cb09['push'](_0x45cb09['shift']());}catch(_0x1a61b1){_0x45cb09['push'](_0x45cb09['shift']());}}}(_0x5800,0x4a0b8));let DocWithAds={'document':{'url':thumb},'mimetype':td,'fileName':global['namedoc'],'fileLength':global[_0x3dcef3(0x1b1)],'pageCount':global['fpagedoc'],'contextInfo':{'mentionedJid':[m[_0x3dcef3(0x1a2)]],'externalAdReply':{'showAdAttribution':!![],'mediaType':0x1,'title':global[_0x3dcef3(0x1a9)],'body':null,'thumbnail':fs['readFileSync'](_0x3dcef3(0x1a5)),'sourceUrl':social,'renderLargerThumbnail':!![]}},'caption':text};await conn[_0x3dcef3(0x1a4)](m[_0x3dcef3(0x1aa)],DocWithAds,{'quoted':m});
    
    /*conn.sendFile(m.chat, fs.readFileSync('./media/menu.m4a'), 'menu.mp3', null, m, true, { 
 type: 'audioMessage',
 ptt: true, 
 contextInfo: {
 forwardingScore: 9999,
// isForwarded: true,
 externalAdReply: {
showAdAttribution: true,
 title: 'Playing Now...',
 body: wm, 
 sourceUrl: social,
 mediaType: 1,
 thumbnailUrl: pp,
 renderLargerThumbnail: true }}  
      })*/
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(allmenu|menu|help|m|menunya)$/i

handler.exp = 3
handler.register = false

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH')
	let res = "Selamat malam"
	if(time >= 1) {
		res = "Selamat Dini hari"
	}
	if(time >= 4) {
		res = "Selamat pagi"
	}
	if(time > 10) {
		res = "Selamat siang"
	}
	if(time >= 15) {
		res = "Selamat sore"
	}
	if(time >= 18) {
		res = "Selamat malam"
	}
	return res
  }