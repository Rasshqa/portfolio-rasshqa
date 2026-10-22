import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/db';
import { initialPortfolioData, PortfolioData } from '@/lib/data';

const ADMIN_SECRET_PIN = process.env.ADMIN_SECRET_PIN || '020709';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({
      success: true,
      data,
      isNeonConnected: !!process.env.DATABASE_URL
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      data: initialPortfolioData,
      isNeonConnected: false,
      error: error?.message
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, data } = body;

    if (!pin || pin !== ADMIN_SECRET_PIN) {
      return NextResponse.json({
        success: false,
        message: 'Akses ditolak: Master PIN Admin tidak valid.'
      }, { status: 401 });
    }

    if (!data) {
      return NextResponse.json({
        success: false,
        message: 'Payload data kosong.'
      }, { status: 400 });
    }

    const result = await savePortfolioData(data as PortfolioData);
    return NextResponse.json({
      success: result.success,
      message: result.message,
      isNeonConnected: !!process.env.DATABASE_URL
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Terjadi kesalahan pada server.'
    }, { status: 500 });
  }
}
