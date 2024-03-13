let fetch = require('node-fetch');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    if (!text) return m.reply("Masukan pertanyaan. Yang ini di tanyakan")
    await m.react("🕒");
    try {
        const result = await openaii(text);
        await m.reply(result);
        m.react("✅");
    } catch (error) {
        await m.react(" ❌");
    }

}
handler.help =  ['gpt', 'ai', 'openai'];
handler.tags = ["ai"];
handler.command = /^(gpt|ai|openai)$/i
handler.limit = true;
module.exports = handler;

function _0x2691(_0x4b60d6,_0x1bacfd){const _0x21b0b5=_0x21b0();return _0x2691=function(_0x2691c6,_0x15c11e){_0x2691c6=_0x2691c6-0x13c;let _0x4cef69=_0x21b0b5[_0x2691c6];return _0x4cef69;},_0x2691(_0x4b60d6,_0x1bacfd);}(function(_0x38a8d6,_0xb74f71){const _0x549840=_0x2691,_0x4b56a9=_0x38a8d6();while(!![]){try{const _0x4d2626=-parseInt(_0x549840(0x14c))/0x1*(-parseInt(_0x549840(0x13e))/0x2)+-parseInt(_0x549840(0x149))/0x3+parseInt(_0x549840(0x140))/0x4+parseInt(_0x549840(0x143))/0x5+parseInt(_0x549840(0x144))/0x6+parseInt(_0x549840(0x13d))/0x7+-parseInt(_0x549840(0x13c))/0x8*(parseInt(_0x549840(0x14b))/0x9);if(_0x4d2626===_0xb74f71)break;else _0x4b56a9['push'](_0x4b56a9['shift']());}catch(_0x392fe2){_0x4b56a9['push'](_0x4b56a9['shift']());}}}(_0x21b0,0x5fdb2));function _0x21b0(){const _0x19d669=['choices','Bearer\x20sk-pu4PasDkEf284PIbVr1r5jn9rlvbAJESZGpPbK7OFYYR6m9g','gpt-3.5-turbo','21968WSoFiE','4209408JXqLUy','12rFINyc','https://api.chatanywhere.com.cn/v1/chat/completions','915104rZrvza','user','stringify','110400oazSho','2008182iHCqRw','POST','Kamu\x20adalah\x20AI.','message','system','1410927LRPNPE','content','1467wTxccx','20606QJcLbG'];_0x21b0=function(){return _0x19d669;};return _0x21b0();}async function openaii(_0x6662fb){const _0x3f9934=_0x2691;try{const _0x4c0ba3=_0x3f9934(0x13f),_0x27bc4b=await fetch(_0x4c0ba3,{'method':_0x3f9934(0x145),'headers':{'Authorization':_0x3f9934(0x14e),'Content-Type':'application/json;charset=UTF-8'},'body':JSON[_0x3f9934(0x142)]({'model':_0x3f9934(0x14f),'messages':[{'role':_0x3f9934(0x148),'content':_0x3f9934(0x146)},{'role':_0x3f9934(0x141),'content':_0x6662fb}]})}),_0x229c1e=await _0x27bc4b['json']();return _0x229c1e[_0x3f9934(0x14d)][0x0][_0x3f9934(0x147)][_0x3f9934(0x14a)];}catch(_0x22f2c5){throw _0x22f2c5;}}