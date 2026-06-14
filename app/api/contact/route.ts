import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_ADDRESS = 'contact@tiffanyvoixoff.fr'

export async function POST(req: Request) {
  try {
    const { name, email, projectType, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service email non configuré.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: `Tiffany Voix Off <${CONTACT_ADDRESS}>`,
      to: [CONTACT_ADDRESS],
      replyTo: email,
      subject: `Nouveau message — ${projectType || 'Contact'} · ${name}`,
      text: [
        `Nom : ${name}`,
        `Email : ${email}`,
        `Type de projet : ${projectType || '—'}`,
        '',
        message,
      ].join('\n'),
    })

    if (error) {
      return NextResponse.json({ error: 'Envoi impossible.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
