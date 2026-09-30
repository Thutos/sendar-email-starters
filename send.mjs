// Node 20+. Preview by default. Server-side only.
export async function sendBooking(fetcher=fetch) {
 const payload={from:process.env.SENDAR_FROM||'bookings@example.com',to:[process.env.SENDAR_TO||'you@example.com'],subject:'Your booking is confirmed',text:'Demo booking: 12 October, 10:00 UTC. Reference DEMO-123.'};
 if(process.env.SENDAR_SEND!=='1')return {preview:true,payload};
 if(!process.env.SENDAR_API_KEY||!process.env.SENDAR_FROM||!process.env.SENDAR_TO)throw Error('Set SENDAR_API_KEY, SENDAR_FROM and SENDAR_TO');
 const r=await fetcher('https://sendar.app/api/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.SENDAR_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
 if(!r.ok)throw Error(`HTTP ${r.status}. Inspect email logs before retrying.`);
 return r.json();
}
if(process.argv[1]&&import.meta.url===new URL(`file://${process.argv[1]}`).href)sendBooking().then(console.log).catch(e=>{console.error(e.message);process.exitCode=1;});
