import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { PortfolioData, initialPortfolioData, ProjectItem, AchievementItem, TechStackGroup } from './data';

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

    // Also populate relational tables (Project, Achievement, Skill)
    await syncProjectsToNeonTable(sql, initialPortfolioData.projects);
    await syncAchievementsToNeonTable(sql, initialPortfolioData.achievements);
    await syncSkillsToNeonTable(sql, initialPortfolioData.techStacks);

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

    // 3. Keep relational tables in sync
    if (newData.projects && Array.isArray(newData.projects)) {
      await syncProjectsToNeonTable(sql, newData.projects);
    }
    if (newData.achievements && Array.isArray(newData.achievements)) {
      await syncAchievementsToNeonTable(sql, newData.achievements);
    }
    if (newData.techStacks && Array.isArray(newData.techStacks)) {
      await syncSkillsToNeonTable(sql, newData.techStacks);
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

/**
 * Synchronize achievements to Neon's native "Achievement" table
 */
async function syncAchievementsToNeonTable(sql: any, achievements: AchievementItem[]) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "Achievement" (
        id TEXT PRIMARY KEY,
        year TEXT,
        title TEXT NOT NULL,
        issuer TEXT,
        category TEXT NOT NULL,
        description TEXT,
        badge TEXT,
        accent TEXT,
        "imageUrl" TEXT,
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    for (const a of achievements) {
      await sql`
        INSERT INTO "Achievement" (
          id, year, title, issuer, category, description, badge, accent, "imageUrl", "updatedAt"
        )
        VALUES (
          ${a.id},
          ${a.year},
          ${a.title},
          ${a.issuer},
          ${a.category},
          ${a.description},
          ${a.badge},
          ${a.accent},
          ${a.imageUrl || ''},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          year = EXCLUDED.year,
          title = EXCLUDED.title,
          issuer = EXCLUDED.issuer,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          badge = EXCLUDED.badge,
          accent = EXCLUDED.accent,
          "imageUrl" = EXCLUDED."imageUrl",
          "updatedAt" = CURRENT_TIMESTAMP;
      `;
    }
  } catch (err) {
    console.warn('Note: Achievement table sync skipped:', err);
  }
}

/**
 * Synchronize skills to Neon's native "Skill" table
 */
async function syncSkillsToNeonTable(sql: any, techStacks: TechStackGroup[]) {
  try {
    let order = 1;
    for (const group of techStacks) {
      for (const s of group.skills) {
        const cleanId = 'skill_' + s.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`
          INSERT INTO "Skill" (id, name, category, icon, "order", "createdAt", "updatedAt")
          VALUES (${cleanId}, ${s.name}, ${group.category}, ${s.icon}, ${order++}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            icon = EXCLUDED.icon,
            "order" = EXCLUDED."order",
            "updatedAt" = CURRENT_TIMESTAMP;
        `;
      }
    }
  } catch (err) {
    console.warn('Note: Skill table sync skipped:', err);
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
