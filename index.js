const fs = require('fs')
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
let db = {}

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }), browser: ["RINZZ ATR","Chrome","1.0"] })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', u=>{
    if(u.connection==='open') console.log('RINZZ ATR ON! BOT SIAP!')
    if(u.connection==='close') console.log('KONEKSI PUTUS!')
  })
  sock.ev.on('messages.upsert', async m=>{
    const msg=m.messages[0]; if(!msg.message) return
    const body=msg.message.conversation||msg.message.extendedTextMessage?.text||""
    const from=msg.key.remoteJid
    const sender=msg.key.participant||from
    console.log('PESAN MASUK:', from, '>', body)
    if(!body.startsWith('.')) return
    const args=body.slice(1).trim().split(/ +/)
    const cmd=args[0].toLowerCase()
    const text=args.slice(1).join(' ')

    if(cmd==='p' || cmd==='menu'){
      await sock.sendMessage(from,{text:`RINZZ ATR - ALL MENU

UTAMA
.p - Liat menu

MEDIA
.hd - Reply foto biar HD
.stiker - Reply foto jadi stiker
.brat - Teks jadi stiker
.tiktok - Download tiktok

GRUP
.absen - Absen grup
.afk - Afk
.blok /.kick - Kick member
.tutupgrup - Tutup grup
.bukagrup - Buka grup
.info - Info grup
.linkgrup - Link grup

TOOLS
.verif - Verif |.verif nama|umur
.intro - Intro template
.lirik - Cari lirik |.lirik senja
.hapus - Hapus pesan bot
.level - Cek level
.jam - Cek jam
.tanggal - Cek tanggal

BOT AKTIF`})
    }
    if(cmd==='verif'){
      if(!text) return sock.sendMessage(from,{text:'Format:.verif nama|umur\nContoh:.verif Rinz|17'})
      const [nama,umur]=text.split('|')
      db[sender]={nama,umur,level:1,verified:true}
      await sock.sendMessage(from,{text:`VERIF BERHASIL\nNama: ${nama}\nUmur: ${umur}\nLevel: 1`})
    }
    if(cmd==='intro'){
      await sock.sendMessage(from,{text:`INTRO TEMPLATE\n\nNama:\nUmur:\nHobi:\nAsal:\nStatus:\nTujuan Join:`})
    }
    if(cmd==='lirik'){
      if(!text) return sock.sendMessage(from,{text:'Mau cari lirik apa?.lirik melukis senja'})
      await sock.sendMessage(from,{text:`LIRIK: ${text}\n\n(Masih dummy, nanti gue sambungin API)`})
    }
    if(cmd==='level'){
      let user=db[sender]||{level:1,verified:false}
      await sock.sendMessage(from,{text:`LEVEL CHECK\nID: ${sender.split('@')[0]}\nLevel: ${user.level}\nVerified: ${user.verified?'Ya':'Belum'}`})
    }
    if(cmd==='jam'){
      await sock.sendMessage(from,{text:`JAM SEKARANG: ${new Date().toLocaleTimeString('id-ID')}`})
    }
    if(cmd==='tanggal'){
      await sock.sendMessage(from,{text:`TANGGAL: ${new Date().toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}`})
    }
    if(cmd==='hapus'){
      await sock.sendMessage(from,{text:'Fitur hapus ok'})
    }
    if(cmd==='absen'){
      await sock.sendMessage(from,{text:'ABSEN GRUP\nKetik hadir cuy!'})
    }
    if(cmd==='afk'){
      await sock.sendMessage(from,{text:`AFK: ${text || 'Tanpa alasan'} - noted!`})
    }
  })
}
startBot()
