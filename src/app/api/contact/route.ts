import { NextRequest, NextResponse } from 'next/server';
import { saveContactMessage, getContactMessages, deleteContactMessage } from '@/lib/db';

const ADMIN_SECRET_PIN = process.env.ADMIN_SECRET_PIN || '020709';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Mohon isi nama, email, dan pesan Anda.'
      }, { status: 400 });
    }

    const result = await saveContactMessage(name, email, message);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.message || 'Gagal mengirim pesan.'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get('pin');

    if (!pin || pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({
        success: false,
        message: 'Akses ditolak.'
      }, { status: 401 });
    }

    const messages = await getContactMessages();
    return NextResponse.json({
      success: true,
      messages
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      messages: [],
      error: err?.message
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, id } = body;

    if (!pin || pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({
        success: false,
        message: 'Akses ditolak.'
      }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID pesan tidak disertakan.'
      }, { status: 400 });
    }

    const ok = await deleteContactMessage(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message
    }, { status: 500 });
  }
}
