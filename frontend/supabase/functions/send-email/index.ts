import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientType, customEmail, subject, message } = await req.json();
    
    console.log("Email request:", { recipientType, customEmail, subject });

    let recipients: string[] = [];

    if (recipientType === "custom" && customEmail) {
      recipients = [customEmail];
    } else {
      // For group emails, you would fetch emails from database
      // For now, we'll use a default email
      recipients = [customEmail || "admin@agrolink.lk"];
    }

    const emailResponse = await resend.emails.send({
      from: "AgroLink <onboarding@resend.dev>",
      to: recipients,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">AgroLink Communication</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This email was sent from AgroLink platform.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
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