let levelling = require('../lib/levelling')
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
const defaultMenu = {
  before: `
❐  *「 INFO USER 」*
┆ *Name* : %name
┆ *Limit* : %limit Limit
┆ *Role* : %role
┆ *Level* : %level 
┆ *Exp* : %totalexp XP 
┗┬────────────────┈ꕥ
┌┤   *「 TODAY 」*
┆┗────────────⳹
┆ *Hari* : %week %weton
┆ *Tanggal* : %date
┆ *Tanggal Islam* : %dateIslamic
┆ *Waktu* : %wib
┗────────────────┈ꕥ
%readmore`.trim(),
  header: '❐   *「 %category 」*',
  body: '│ ✾ %cmd %islimit %isPremium',
  footer: '└────────┈ꕥ\n',
  after: `
*%npmname@^%version*
${'```%npmdesc```'}
`,
}
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

  let tags
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'game', 'xp', 'stiker', 'kerangajaib', 'quotes', 'admin', 'grup', 'premium', 'internet', 'anonymous', 'nulis', 'downloader', 'tools', 'fun', 'database', 'quran', 'audio', 'jadibot', 'info', 'tanpakategori', 'owner']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == 'all') tags = {
    'main': 'UTAMA',
    'game': 'Game',
    'rpg': 'RPG',
    'xp': 'Exp & Limit',
    'sticker': 'Stiker',
    'kerang': 'Kerang Ajaib',
    'quotes': 'Quotes',
    'group': 'Grup',
    'premium': 'Premium',
    'internet': 'Internet',
    'anonymous': 'Anonymous Chat',
    'nulis': 'MagerNulis & Logo',
    'downloader': 'Downloader',
    'tools': 'Tools',
    'fun': 'Fun',
    'database': 'Database',
    'vote': 'Voting',
    'absen': 'Absen',
    'quran': 'Al Qur\'an',
    'audio': 'Pengubah Suara',
    'jadibot': 'Jadi Bot',
    'info': 'Info',
    '': 'Tanpa Kategori',
  }
  if (teks == 'game') tags = {
    'game': 'Game',
    'rpg': 'RPG'
  }
  if (teks == 'xp') tags = {
    'xp': 'Exp & Limit'
  }
  if (teks == 'stiker') tags = {
    'sticker': 'Stiker'
  }
  if (teks == 'kerangajaib') tags = {
    'kerang': 'Kerang Ajaib'
  }
  if (teks == 'quotes') tags = {
    'quotes': 'Quotes'
  }
  if (teks == 'grup') tags = {
    'group': 'Grup'
  }
  if (teks == 'premium') tags = {
    'premium': 'Premium'
  }
  if (teks == 'internet') tags = {
    'internet': 'Internet'
  }
  if (teks == 'anonymous') tags = {
    'anonymous': 'Anonymous Chat'
  }
  if (teks == 'nulis') tags = {
    'nulis': 'MagerNulis & Logo'
  }
  if (teks == 'downloader') tags = {
    'downloader': 'Downloader'
  }
  if (teks == 'tools') tags = {
    'tools': 'Tools'
  }
  if (teks == 'fun') tags = {
    'fun': 'Fun'
  }
  if (teks == 'database') tags = {
    'database': 'Database'
  }
  if (teks == 'vote') tags = {
    'vote': 'Voting',
    'absen': 'Absen'
  }
  if (teks == 'quran') tags = {
    'quran': 'Al Qur\'an'
  }
  if (teks == 'audio') tags = {
    'audio': 'Pengubah Suara'
  }
  if (teks == 'jadibot') tags = {
    'jadibot': 'Jadi Bot'
  }
  if (teks == 'info') tags = {
    'info': 'Info'
  }
  if (teks == 'tanpakategori') tags = {
    '': 'Tanpa Kategori'
  }
  if (teks == 'owner') tags = {
    'owner': 'Owner',
    'host': 'Host',
    'advanced': 'Advanced'
  }



  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, age, money, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let umur = `*${age == '-1' ? 'Belum Daftar*' : age + '* Thn'}`
    let name = registered ? global.db.data.users[m.sender].name : m.name
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
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
    const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
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
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    if (teks == '404') {
      let judul = `✧────···[ Dashboard ]···────✧
*${ucapan()} ${m.name}*
╭━━━━━━━━━━━━━━━━┈─✧
┴
│⬡ Aktif selama ${uptime}
│⬡ Prefix : [ ${_p} ]
│⬡ *${Object.keys(global.db.data.users).length}* Pengguna
│⬡ *${Object.entries(global.db.data.chats).filter(chat => chat[1].isBanned).length}* Chat Terbanned
│⬡ *${Object.entries(global.db.data.users).filter(user => user[1].banned).length}* Pengguna Terbanned
┬
├━━━━━━━━━━━━━━━━┈─⋆
│ ▸ *ᴀᴜᴛʜᴏʀ :* ʙᴇᴛᴀʙᴏᴛᴢ-ᴍᴅ
┴ ▸ *ᴏᴡɴᴇʀ :* ɴᴀʏʟᴀ-ʜᴀɴɪꜰᴀʜ
✧
┬ 📌 𝗣𝗶𝗻𝗻𝗲𝗱 :
│ ʙᴇʀɪ ᴊᴇᴅᴀ ʏᴀʜ ᴋᴀᴋ ^ω^
╰━━━━━━━━━━━━━━━━┈─◂`
      
    const _0x4eb99f=_0x4d45;(function(_0x410a60,_0x619b1f){const _0x26313b=_0x4d45,_0x57449=_0x410a60();while(!![]){try{const _0x377c39=parseInt(_0x26313b(0x12d))/0x1*(-parseInt(_0x26313b(0x139))/0x2)+parseInt(_0x26313b(0x117))/0x3+parseInt(_0x26313b(0x129))/0x4*(-parseInt(_0x26313b(0x12b))/0x5)+parseInt(_0x26313b(0x122))/0x6+-parseInt(_0x26313b(0x108))/0x7+parseInt(_0x26313b(0x11c))/0x8*(-parseInt(_0x26313b(0x11e))/0x9)+-parseInt(_0x26313b(0x114))/0xa*(-parseInt(_0x26313b(0x123))/0xb);if(_0x377c39===_0x619b1f)break;else _0x57449['push'](_0x57449['shift']());}catch(_0x4a86f4){_0x57449['push'](_0x57449['shift']());}}}(_0x3e7d,0x5fc1a));let msg={'viewOnceMessage':{'message':{'messageContextInfo':{'deviceListMetadata':{},'deviceListMetadataVersion':0x2},'interactiveMessage':{'body':{'text':judul},'footer':{'text':wm},'header':{'title':'','subtitle':'','hasMediaAttachment':![]},'nativeFlowMessage':{'buttons':[{'name':_0x4eb99f(0x135),'buttonParamsJson':JSON[_0x4eb99f(0x12c)]({'title':_0x4eb99f(0x128),'sections':[{'title':_0x4eb99f(0x115),'rows':[{'header':'','title':_0x4eb99f(0x137),'description':'','id':_p+command+_0x4eb99f(0x12f)},{'header':'','title':'Game','description':'','id':_p+command+_0x4eb99f(0x11b)},{'header':'','title':'Rpg','description':'','id':_p+command+_0x4eb99f(0x126)},{'header':'','title':'XP','description':'','id':_p+command+'\x20xp'},{'header':'','title':_0x4eb99f(0x109),'description':'','id':_p+command+_0x4eb99f(0x11a)},{'header':'','title':_0x4eb99f(0x12a),'description':'','id':_p+command+_0x4eb99f(0x125)},{'header':'','title':_0x4eb99f(0x11d),'description':'','id':_p+command+'\x20quotes'},{'header':'','title':_0x4eb99f(0x121),'description':'','id':_p+command+'\x20grup'},{'header':'','title':_0x4eb99f(0x136),'description':'','id':_p+command+'\x20premium'},{'header':'','title':_0x4eb99f(0x111),'description':'','id':_p+command+_0x4eb99f(0x132)},{'header':'','title':_0x4eb99f(0x138),'description':'','id':_p+command+_0x4eb99f(0x124)},{'header':'','title':'Nulis\x20&\x20Logo','description':'','id':_p+command+_0x4eb99f(0x10e)},{'header':'','title':'Downloader','description':'','id':_p+command+_0x4eb99f(0x134)},{'header':'','title':_0x4eb99f(0x12e),'description':'','id':_p+command+_0x4eb99f(0x116)},{'header':'','title':_0x4eb99f(0x10a),'description':'','id':_p+command+'\x20fun'},{'header':'','title':_0x4eb99f(0x113),'description':'','id':_p+command+_0x4eb99f(0x10b)},{'header':'','title':_0x4eb99f(0x112),'description':'','id':_p+command+_0x4eb99f(0x110)},{'header':'','title':'Al-Qur\x27an','description':'','id':_p+command+'\x20quran'},{'header':'','title':_0x4eb99f(0x130),'description':'','id':_p+command+_0x4eb99f(0x131)},{'header':'','title':_0x4eb99f(0x10d),'description':'','id':_p+command+_0x4eb99f(0x10f)},{'header':'','title':'Info','description':'','id':_p+command+_0x4eb99f(0x11f)},{'header':'','title':_0x4eb99f(0x133),'description':'','id':_p+command+_0x4eb99f(0x120)},{'header':'','title':'Owner','description':'','id':_p+command+_0x4eb99f(0x10c)}]}]})}]},'contextInfo':{'quotedMessage':m['message'],'participant':m[_0x4eb99f(0x118)],...m[_0x4eb99f(0x127)]}}}}};function _0x3e7d(){const _0x20af38=['\x20jadibot','\x20vote','Internet','Vote\x20&\x20Absen','Database','10mkHxiI','List\x20Menu\x20','\x20tools','2325729KbsiIm','sender','chat','\x20stiker','\x20game','24NsbIAI','Quotes','595566ujQvMo','\x20info','\x20tanpakategori','Grup','1237026QaLcfK','4529525kIVDkc','\x20anonymous','\x20kerangajaib','\x20rpg','key','Klik\x20Disini\x20⎙','4972lCQKBk','Kerang\x20Ajaib','1315qRbvIH','stringify','61wdHayF','Tools','\x20all','Pengubah\x20Suara','\x20audio','\x20internet','Tanpa\x20Kategori','\x20downloader','single_select','Premium','Semua\x20Perintah','Anonymous','9626LFhSKl','1273629IReWAE','Stiker','Fun','\x20database','\x20owner','Jadi\x20Bot','\x20nulis'];_0x3e7d=function(){return _0x20af38;};return _0x3e7d();}function _0x4d45(_0x31690a,_0x2e84e8){const _0x3e7de7=_0x3e7d();return _0x4d45=function(_0x4d455d,_0x34130a){_0x4d455d=_0x4d455d-0x108;let _0x324a43=_0x3e7de7[_0x4d455d];return _0x324a43;},_0x4d45(_0x31690a,_0x2e84e8);}return conn['relayMessage'](m[_0x4eb99f(0x119)],msg,{});;
    
    }

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
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
      ucapan: global.ucapan,
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp <= 0 ? `Siap untuk *${_p}levelup*` : `${max - exp} XP lagi untuk levelup`,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, umur, money, age, weton, week, date, dateIslamic, time, wib, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    conn.relayMessage(m.chat, 
{ liveLocationMessage: {
  degreesLatitude: 35.685506276233525,
  degreesLongitude: 139.75270667105852,
  accuracyInMeters: 0,
degreesClockwiseFromMagneticNorth: 2,
caption: text,
sequenceNumber: 2,
timeOffset: 3,
contextInfo: {
						quotedMessage: m.message,
						participant: m.sender,
						...m.key
}}}, {}).catch(_ => _)
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(m(enu)?|help|\?)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

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
  res = "Selamat dinihari"
  if (time >= 4) {
    res = "Selamat pagi"
  }
  if (time > 10) {
    res = "Selamat siang"
  }
  if (time >= 15) {
    res = "Selamat sore"
  }
  if (time >= 18) {
    res = "Selamat malam"
  }
  return res
}  res = "Selamat malam"
  }
  return res
	  
