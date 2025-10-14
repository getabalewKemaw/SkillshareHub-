import { NextRequest, NextResponse } from 'next/server'

// Dev-only mock upload that echoes a fake URL
export async function POST(request: NextRequest) {
  try {
    // In real impl, verify auth and accept a file or signed url request
    const { filename, type } = await request.json()
    const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/uploads/${Date.now()}-${encodeURIComponent(filename || 'file')}`
    return NextResponse.json({ url, type })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
