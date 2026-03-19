import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { ConfirmationEmail } from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 409 });
    }

    // Sign up with manual confirmation (no auto-confirm needed)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${req.headers.get('origin') || 'https://covera-app-navy.vercel.app'}/auth/callback`,
        data: { full_name: fullName },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send confirmation via Resend (more reliable than Supabase SMTP)
    if (data.user && !data.session) {
      try {
        // Get the confirmation URL from the user metadata
        const confirmUrl = data.user.confirmation_sent_at
          ? `${req.headers.get('origin') || 'https://covera-app-navy.vercel.app'}/auth/callback?code=pending`
          : null;

        // Send via Resend with our custom template
        const emailResult = await resend.emails.send({
          from: 'Covera <noreply@covera.app>',
          to: email,
          subject: 'Confirmez votre adresse email — Covera',
          html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre email — Covera</title>
</head>
<body style="margin:0;padding:0;background:#FAFBFD;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFBFD;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#5B4CF5,#7C5CF5);padding:48px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;margin-bottom:16px;">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L24 9V18C24 25 16 29 16 29C16 29 8 25 8 18V9L16 4Z" fill="white" opacity="0.95"/>
                  <path d="M13 16L15.5 18.5L20 13" stroke="#5B4CF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;letter-spacing:-0.5px;">Covera</h1>
              <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Tes assurances, clarifiées.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px 40px;">
              <p style="font-size:16px;color:#334155;margin:0 0 8px;">Bonjour${fullName ? ` ${fullName}` : ''},</p>
              <p style="font-size:15px;color:#475569;margin:0 0 32px;line-height:1.7;">
                Bienvenue sur Covera ! Cliquez sur le bouton ci-dessous pour confirmer votre adresse email.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background:linear-gradient(135deg,#5B4CF5,#7C5CF5);border-radius:14px;text-align:center;box-shadow:0 4px 20px rgba(91,76,245,0.3);">
                    <a href="${req.headers.get('origin') || 'https://covera-app-navy.vercel.app'}/auth/callback?confirmation_token=${data.user.id}" style="display:block;padding:16px 48px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                      Confirmer mon email
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:13px;color:#94a3b8;margin:32px 0 0;text-align:center;line-height:1.7;">
                Ce lien expire dans 1 heure.<br>
                Si vous n'avez pas créé de compte Covera, ignorez ce message.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#FAFBFD;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="font-size:12px;color:#94a3b8;margin:0;">© 2026 Covera · <a href="https://covera.app" style="color:#5B4CF5;text-decoration:none;">covera.app</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });

        console.log('Resend email result:', emailResult);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the signup if email fails
      }
    }

    return NextResponse.json({
      success: true,
      needsConfirmation: !data.session,
      userId: data.user?.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
