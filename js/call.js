(()=>{const MC=window.MC,$=s=>document.querySelector(s);let pc,ms,peer;
const done=p=>new Promise(r=>{if(p.iceGatheringState==='complete')return r();p.onicegatheringstatechange=()=>p.iceGatheringState==='complete'&&r();setTimeout(r,4000)});
const sig=(type,sdp)=>MC.api('POST','/api/signal',{to:peer,data:{type,sdp}});
async function open(){pc=new RTCPeerConnection({iceServers:MC.ICE||[{urls:'stun:stun.l.google.com:19302'}]});
 ms=await navigator.mediaDevices.getUserMedia({video:true,audio:true});$('#lv').srcObject=ms;ms.getTracks().forEach(t=>pc.addTrack(t,ms));
 pc.ontrack=e=>{$('#rv').srcObject=e.streams[0];$('#call').classList.add('show')};
 pc.onconnectionstatechange=()=>['failed','closed'].includes(pc?.connectionState)&&MC.hang(true)}
// Panggilan tersambung otomatis lewat server: tidak perlu salin-tempel kode.
MC.callStart=async to=>{peer=to;await open();await pc.setLocalDescription(await pc.createOffer());await done(pc);const r=await sig('offer',pc.localDescription);if(!r.delivered){MC.hang(true);throw Error('Lawan bicara sedang offline')}};
MC.callAccept=async(from,offer)=>{peer=from;await open();await pc.setRemoteDescription(offer);await pc.setLocalDescription(await pc.createAnswer());await done(pc);await sig('answer',pc.localDescription)};
MC.callAnswered=sdp=>pc?.setRemoteDescription(sdp);
MC.callReject=from=>{peer=from;return sig('bye')};
MC.hang=quiet=>{if(peer&&!quiet)sig('bye').catch(()=>{});ms?.getTracks().forEach(t=>t.stop());pc?.close();pc=ms=peer=null;$('#call').classList.remove('show')};
})();
