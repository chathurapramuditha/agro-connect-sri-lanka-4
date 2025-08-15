import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientType, customPhone, message } = await req.json();
    
    console.log("SMS request:", { recipientType, customPhone, message });

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }

    let recipients: string[] = [];

    if (recipientType === "custom" && customPhone) {
      // Ensure Sri Lankan number format
      let phoneNumber = customPhone;
      if (phoneNumber.startsWith("+94")) {
        recipients = [phoneNumber];
      } else if (phoneNumber.startsWith("94")) {
        recipients = [`+${phoneNumber}`];
      } else if (phoneNumber.startsWith("0")) {
        recipients = [`+94${phoneNumber.substring(1)}`];
      } else {
        recipients = [`+94${phoneNumber}`];
      }
    } else {
      // For group SMS, you would fetch phone numbers from database
      recipients = [customPhone || "+94701234567"];
    }

    const results = [];
    
    for (const recipient of recipients) {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: recipient,
          From: "+12345678901", // Replace with your Twilio phone number
          Body: message,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error("Twilio error:", result);
        throw new Error(result.message || "Failed to send SMS");
      }
      
      results.push(result);
      console.log("SMS sent successfully to:", recipient, result.sid);
    }

    return new Response(JSON.stringify({ success: true, data: results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);