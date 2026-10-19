import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
        const { to, subject, html } = await request.json()

        const { data, error } = await resend.emails.send({
            from: 'Courses <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html,
        })

        if (error) {
            return NextResponse.json({ error }, { status: 400 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
