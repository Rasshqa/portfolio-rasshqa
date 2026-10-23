import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { PortfolioData, initialPortfolioData, ProjectItem } from './data';

function getDatabaseUrl(): string | undefined {
  return process.env.DATABASE_URL;
}

export function isNeonConnected(): boolean {
  return Boolean(getDatabaseUrl());
}

/**
 * Fetch portfolio data from Neon Lakebase Postgres (table: portfolio_content)
 * Falls back to initialPortfolioData if database is unreachable or unset
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return initialPortfolioData;
  }

  try {
    const sql = neon(dbUrl);
    
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

    // Seed initial dataset into portfolio_content
    await sql`
      INSERT INTO portfolio_content (id, data, updated_at)
      VALUES ('main', ${JSON.stringify(initialPortfolioData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING;
    `;

    // Also populate Project table if empty
    await syncProjectsToNeonTable(sql, initialPortfolioData.projects);

    return initialPortfolioData;
  } catch (error) {
    console.warn('Neon Database connection warning, falling back to local dataset:', error);
    return initialPortfolioData;
  }
}

/**
 * Save and synchronize portfolio data into Neon Lakebase Postgres
 */
export async function savePortfolioData(newData: PortfolioData): Promise<{ success: boolean; message: string }> {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return {
      success: true,
      message: 'Perubahan tersimpan secara lokal. Sambungkan DATABASE_URL di .env.local untuk persistensi permanen di Neon Database.'
    };
  }

  try {
    const sql = neon(dbUrl);
    
    // 1. Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_content (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Upsert portfolio_content
    await sql`
      INSERT INTO portfolio_content (id, data, updated_at)
      VALUES ('main', ${JSON.stringify(newData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // 3. Keep Project table in sync
    if (newData.projects && Array.isArray(newData.projects)) {
      await syncProjectsToNeonTable(sql, newData.projects);
    }

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

/**
 * Synchronize projects to Neon's native "Project" table
 */
async function syncProjectsToNeonTable(sql: any, projects: ProjectItem[]) {
  try {
    for (let index = 0; index < projects.length; index++) {
      const p = projects[index];
      const tagsArray = (p as any).tags || ((p as any).tag ? (p as any).tag.split('•').map((t: string) => t.trim()) : []);
      const description = p.desc || (p as any).description || '';
      await sql`
        INSERT INTO "Project" (
          id, title, description, tags, "imageUrl", "githubUrl", "projectUrl", "order", "createdAt", "updatedAt"
        )
        VALUES (
          ${p.id},
          ${p.title},
          ${description},
          ${tagsArray},
          ${p.imageUrl || ''},
          ${p.githubUrl || ''},
          ${p.liveUrl || ''},
          ${index + 1},
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          tags = EXCLUDED.tags,
          "imageUrl" = EXCLUDED."imageUrl",
          "githubUrl" = EXCLUDED."githubUrl",
          "projectUrl" = EXCLUDED."projectUrl",
          "order" = EXCLUDED."order",
          "updatedAt" = CURRENT_TIMESTAMP;
      `;
    }
  } catch (err) {
    console.warn('Note: Project table sync skipped or already up to date:', err);
  }
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

/**
 * Save incoming message from visitor to Neon's "Message" table
 */
export async function saveContactMessage(name: string, email: string, message: string): Promise<{ success: boolean; message: string }> {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return { success: true, message: 'Pesan berhasil dikirim (simulasi lokal).' };
  }

  try {
    const sql = neon(dbUrl);
    
    // Ensure table exists if not yet present
    await sql`
      CREATE TABLE IF NOT EXISTS "Message" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    await sql`
      INSERT INTO "Message" (id, name, email, message, "createdAt")
      VALUES (${id}, ${name}, ${email}, ${message}, CURRENT_TIMESTAMP);
    `;

    return {
      success: true,
      message: 'Pesan berhasil dikirim dan tersimpan di Neon Database!'
    };
  } catch (error: any) {
    console.error('Failed to save message to Neon:', error);
    return {
      success: false,
      message: error?.message || 'Gagal menyimpan pesan ke database.'
    };
  }
}

/**
 * Fetch visitor messages for Admin Panel
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return [];
  }

  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT id, name, email, message, "createdAt" 
      FROM "Message" 
      ORDER BY "createdAt" DESC;
    `;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Failed to load messages from Neon:', err);
    return [];
  }
}

/**
 * Delete a message from Neon
 */
export async function deleteContactMessage(id: string): Promise<boolean> {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) return false;

  try {
    const sql = neon(dbUrl);
    await sql`DELETE FROM "Message" WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Failed to delete message:', err);
    return false;
  }
}
