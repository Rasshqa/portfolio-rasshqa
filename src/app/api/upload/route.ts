import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, isS3Configured } from '@/lib/s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

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
    const originalBuffer = Buffer.from(bytes);
    const originalSize = originalBuffer.length;

    let processedBuffer = originalBuffer;
    let ext = path.extname(file.name) || '.png';
    let contentType = file.type || 'image/png';
    let isWebp = false;
    let savings = '0%';

    // Detect raster image for compression
    const isRasterImage = 
      file.type.startsWith('image/') && 
      file.type !== 'image/svg+xml' && 
      !file.name.toLowerCase().endsWith('.svg');

    if (isRasterImage) {
      try {
        // High fidelity WebP conversion:
        // - .rotate() automatically fixes orientation from mobile cameras / EXIF
        // - .resize() caps ultra-large images to max 2400px (retina / 4k ready without multi-megabyte bloat)
        // - .webp({ quality: 88, effort: 5 }) achieves near-lossless clarity with 70-85% size reduction
        processedBuffer = await sharp(originalBuffer)
          .rotate()
          .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 88, effort: 5 })
          .toBuffer();

        ext = '.webp';
        contentType = 'image/webp';
        isWebp = true;

        if (originalSize > 0) {
          const savedBytes = originalSize - processedBuffer.length;
          if (savedBytes > 0) {
            savings = `${((savedBytes / originalSize) * 100).toFixed(1)}%`;
          }
        }
      } catch (sharpErr) {
        console.warn('Sharp optimization fallback (using original):', sharpErr);
        processedBuffer = originalBuffer;
      }
    }

    // Sanitize filename and create unique key
    const rawClean = path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${rawClean}-${Date.now()}${ext}`;

    // 1. If S3 / Neon Object Storage is configured, upload to S3
    if (isS3Configured) {
      try {
        const s3Key = `portfolio/${filename}`;
        const s3Url = await uploadToS3({
          key: s3Key,
          buffer: processedBuffer,
          contentType: contentType
        });

        return NextResponse.json({
          success: true,
          url: s3Url,
          provider: 's3',
          filename,
          isWebp,
          savings,
          originalSize,
          compressedSize: processedBuffer.length,
          message: isWebp 
            ? `Berkas berhasil dikonversi ke WebP & dikompres (-${savings}) dan diunggah ke S3!` 
            : 'Berkas berhasil diunggah ke S3 Object Storage!'
        });
      } catch (s3Err: any) {
        console.warn('S3 upload error, falling back to local storage:', s3Err);
      }
    }

    // 2. Local fallback storage in public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const localFilePath = path.join(uploadsDir, filename);
    await writeFile(localFilePath, processedBuffer);

    const localUrl = `/uploads/${filename}`;
    return NextResponse.json({
      success: true,
      url: localUrl,
      provider: 'local',
      filename,
      isWebp,
      savings,
      originalSize,
      compressedSize: processedBuffer.length,
      message: isWebp 
        ? `Berkas berhasil dikonversi ke WebP & dikompres (-${savings}) dan disimpan di /uploads/` 
        : 'Berkas berhasil disimpan secara lokal di /uploads/'
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({
      success: false,
      message: err?.message || 'Gagal mengunggah berkas.'
    }, { status: 500 });
  }
}
