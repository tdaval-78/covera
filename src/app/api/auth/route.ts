import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { ConfirmationEmail, ResetPasswordEmail, WelcomeEmail } from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { type, email, name, url } = await req.json();

    if (!type || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const from = 'Covera <noreply@covera.app>';
    let result;

    switch (type) {
      case 'confirmation': {
        const template = ConfirmationEmail({ name: name || '', email, confirmationUrl: url });
        result = await resend.emails.send({
          from,
          to: email,
          subject: template.subject,
          html: template.html,
        });
        break;
      }
      case 'reset_password': {
        const template = ResetPasswordEmail({ name: name || '', email, resetUrl: url });
        result = await resend.emails.send({
          from,
          to: email,
          subject: template.subject,
          html: template.html,
        });
        break;
      }
      case 'welcome': {
        const template = WelcomeEmail({ name: name || '', email });
        result = await resend.emails.send({
          from,
          to: email,
          subject: template.subject,
          html: template.html,
        });
        break;
      }
      default:
        return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
    }

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Auth email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
