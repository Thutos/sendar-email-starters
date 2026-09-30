"""Python 3.10+. No dependencies. Preview by default."""
import json,os,urllib.request

def booking_message(sender,recipient):
 return {"from":sender,"to":[recipient],"subject":"Your booking is confirmed","text":"Demo booking: 12 October, 10:00 UTC. Reference DEMO-123."}

def main():
 payload=booking_message(os.getenv("SENDAR_FROM","bookings@example.com"),os.getenv("SENDAR_TO","you@example.com"))
 if os.getenv("SENDAR_SEND")!="1":
  print(json.dumps({"preview":True,"payload":payload},indent=2));return
 if not all(os.getenv(x) for x in ["SENDAR_API_KEY","SENDAR_FROM","SENDAR_TO"]):raise ValueError("Configure the three SENDAR variables first")
 req=urllib.request.Request("https://sendar.app/api/emails",data=json.dumps(payload).encode(),headers={"Authorization":"Bearer "+os.environ["SENDAR_API_KEY"],"Content-Type":"application/json"},method="POST")
 with urllib.request.urlopen(req,timeout=15) as response:print(response.read().decode())
if __name__=="__main__":main()
