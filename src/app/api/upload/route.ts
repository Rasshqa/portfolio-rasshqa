import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, isS3Configured } from '@/lib/s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'Tidak ada berkas yang diunggah.'
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique key
    const ext = path.extname(file.name) || '.png';
    const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanName}-${Date.now()}${ext}`;

    // 1. If S3 / Neon Object Storage is configured, upload to S3
    if (isS3Configured) {
      try {
        const s3Key = `portfolio/${filename}`;
        const s3Url = await uploadToS3({
          key: s3Key,
          buffer,
          contentType: file.type || 'image/png'
        });

        return NextResponse.json({
          success: true,
          url: s3Url,
          provider: 's3',
          message: 'Berkas berhasil diunggah ke S3 Object Storage!'
        });
      } catch (s3Err: any) {
        console.warn('S3 upload error, falling back to local storage:', s3Err);
      }
    }

    // 2. Local fallback storage in public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const localFilePath = path.join(uploadsDir, filename);
    await writeFile(localFilePath, buffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: 'local',
      message: 'Berkas berhasil disimpan secara lokal di /uploads/'
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({
      success: false,
      message: err?.message || 'Gagal mengunggah berkas.'
    }, { status: 500 });
  }
}
