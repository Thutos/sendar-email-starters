// Copy to app/sendar-demo/page.tsx in an existing Next.js App Router project.
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export default function SendarDemo(){
 if(process.env.NODE_ENV!=='development')notFound();
 async function send(){
  'use server';
  if(process.env.NODE_ENV!=='development')throw Error('Demo disabled in production');
  if(process.env.SENDAR_SEND!=='1')throw Error('Set SENDAR_SEND=1 to explicitly enable sending');
  const key=process.env.SENDAR_API_KEY,from=process.env.SENDAR_FROM,to=process.env.SENDAR_TO;
  if(!key||!from||!to)throw Error('Configure SENDAR_API_KEY, SENDAR_FROM and SENDAR_TO');
  const r=await fetch('https://sendar.app/api/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:'Your booking is confirmed',text:'Demo booking: 12 October, 10:00 UTC. Reference DEMO-123.'}),signal:AbortSignal.timeout(15000)});
  if(!r.ok)throw Error(`HTTP ${r.status}: inspect logs before retrying`);
  console.log('Sendar response',await r.json());
 }
 return <main><h1>Sendar local booking demo</h1><p>Uses only the sender and recipient configured on your server. Check your terminal for the response.</p><form action={send}><button>Send one demo booking confirmation</button></form></main>;
}
