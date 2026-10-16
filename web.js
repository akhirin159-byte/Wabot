const express = require('express');
const app = express();

app.get('/', (req,res)=>{
res.send(`
<h1 style="font-family:sans-serif;text-align:center;color:green">🟢 RINZZ BOT ON</h1>
<p style="text-align:center">Web panel jalan! Buka Termux udah gak perlu.</p>
<p style="text-align:center">Lokasi: Pekanbaru - ${new Date().toLocaleString()}</p>
<hr>
<p><b>Status:</b> Bot siap nerima PESAN MASUK</p>
<p>Jika ini muncul di Chrome, berarti web ke-2 berhasil wak!</p>
`);
});

app.listen(3000, ()=> console.log('WEB JALAN DI http://localhost:3000'));
