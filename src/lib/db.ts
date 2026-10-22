import { neon } from '@neondatabase/serverless';
import { PortfolioData, initialPortfolioData } from './data';

const DATABASE_URL = process.env.DATABASE_URL;

export async function getPortfolioData(): Promise<PortfolioData> {
  if (!DATABASE_URL) {
    return initialPortfolioData;
  }

  try {
    const sql = neon(DATABASE_URL);
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_content (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const rows = await sql`
      SELECT data FROM portfolio_content WHERE id = 'main' LIMIT 1;
    `;

    if (rows && rows.length > 0 && rows[0].data) {
      return rows[0].data as PortfolioData;
    }

    // Seed default data if empty
    await sql`
      INSERT INTO portfolio_content (id, data)
      VALUES ('main', ${JSON.stringify(initialPortfolioData)})
      ON CONFLICT (id) DO NOTHING;
    `;

    return initialPortfolioData;
  } catch (error) {
    console.warn('Neon Database connection warning, falling back to local dataset:', error);
    return initialPortfolioData;
  }
}

export async function savePortfolioData(newData: PortfolioData): Promise<{ success: boolean; message: string }> {
  if (!DATABASE_URL) {
    // In local-only mode, we can still simulate or notify that DATABASE_URL is required to persist permanently in Neon
    return {
      success: true,
      message: 'Perubahan tersimpan secara lokal sementara. Sambungkan DATABASE_URL di .env.local untuk persistensi permanen di Neon Database.'
    };
  }

  try {
    const sql = neon(DATABASE_URL);
    await sql`
      INSERT INTO portfolio_content (id, data, updated_at)
      VALUES ('main', ${JSON.stringify(newData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return {
      success: true,
      message: 'Data berhasil disimpan dan disinkronkan ke Neon Lakebase Postgres!'
    };
  } catch (error: any) {
    console.error('Failed to save to Neon DB:', error);
    return {
      success: false,
      message: error?.message || 'Gagal menyimpan ke Neon Database.'
    };
  }
}
