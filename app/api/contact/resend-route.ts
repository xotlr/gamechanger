// Alternative implementation using Resend (modern email service)
// To use this instead of nodemailer:
// 1. npm install resend
// 2. Rename this file to route.ts (replacing the current one)
// 3. Set RESEND_API_KEY in .env.local

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'GAME:changer Website <noreply@yourdomain.com>', // You need to verify this domain with Resend
      to: ['verein.gamechanger@gmail.com'],
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff0057;">Neue Kontaktanfrage</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Nachricht:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 3px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            Diese Nachricht wurde über das Kontaktformular auf der GAME:changer Website gesendet.
          </p>
        </div>
      `,
      replyTo: email,
    })

    return NextResponse.json(
      { message: 'Nachricht erfolgreich gesendet', id: data.id },
      { status: 200 }
    )

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Nachricht' },
      { status: 500 }
    )
  }
}