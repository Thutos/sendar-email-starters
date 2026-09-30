/** Node.js 20+. Local mock by default. No dependencies, no automatic retries. */
import {pathToFileURL} from 'node:url';
export function message(kind,{from='Sendar demo <demo@example.com>',to='recipient@example.net',resetUrl='https://example.com/reset?token=LOCAL_DEMO',paymentUrl='https://example.com/invoices/INV-100',date='2030-01-15 10:00 UTC',reference='BOOK-100'}={}){
 for(const url of [resetUrl,paymentUrl])if(new URL(url).protocol!=='https:')throw Error('Use HTTPS application links');
 const content={welcome:['Welcome aboard','Your account is ready. Sign in to get started.'],booking:['Your booking confirmation',`Your booking is confirmed for ${date}. Reference: ${reference}.`],'password-reset':['Reset your password',`Use your application’s single-use reset link: ${resetUrl}. If you did not request this, ignore this email.`],invoice:['Your invoice is ready',`View your invoice securely: ${paymentUrl}`],migration:['Integration test','This workflow now uses Sendar. Confirm the old sender is disabled before live cutover.']}[kind];
 if(!content)throw Error('Choose welcome, booking, password-reset, invoice or migration');
 return {from,to:[to],subject:content[0],text:content[1]};
}
export async function deliver(payload,{live=false,key,eventId,fetcher=globalThis.fetch}={}){
 if(!live)return {mock:true,sent:false,request:{method:'POST',url:'https://sendar.app/api/emails',body:payload}};
 if(!key||!/^[-A-Za-z0-9_:]{16,128}$/.test(eventId||''))throw Error('Provide a private key and stable 16–128 character event identifier.');
 const response=await fetcher('https://sendar.app/api/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':eventId},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
 const body=await response.json();if(!response.ok)throw Error(`HTTP ${response.status}: inspect message history before any retry. ${body.error||'Request failed'}`);
 return body;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const live=process.env.SENDAR_LIVE==='1',kind=process.argv[2]||'welcome';
 if(live&&(!process.env.SENDAR_FROM||!process.env.SENDAR_TO||kind==='password-reset'&&!process.env.SENDAR_RESET_URL||kind==='invoice'&&!process.env.SENDAR_PAYMENT_URL))throw Error('Live mode requires your verified sender, authorized recipient and real application URL for reset/invoice recipes.');
 const payload=message(kind,{from:process.env.SENDAR_FROM,to:process.env.SENDAR_TO,resetUrl:process.env.SENDAR_RESET_URL,paymentUrl:process.env.SENDAR_PAYMENT_URL,date:process.env.SENDAR_BOOKING_DATE,reference:process.env.SENDAR_BOOKING_REFERENCE});
 console.log(JSON.stringify(await deliver(payload,{live,key:process.env.SENDAR_API_KEY,eventId:process.env.SENDAR_EVENT_ID}),null,2));
}
