// Simple in-memory storage (can be replaced with database)
export interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  alias?: string;
  createdAt: string;
  clicks: number;
  clickHistory: Array<{
    timestamp: string;
    ip?: string;
    userAgent?: string;
  }>;
}

class LinkStorage {
  private links: Map<string, LinkData> = new Map();
  private aliasMap: Map<string, string> = new Map(); // alias -> shortCode

  createLink(originalUrl: string, alias?: string): LinkData {
    const shortCode = alias || this.generateShortCode();
    
    // Check if alias already exists
    if (alias && this.aliasMap.has(alias)) {
      throw new Error('Alias already exists');
    }

    const linkData: LinkData = {
      id: Date.now().toString(),
      originalUrl,
      shortCode,
      alias,
      createdAt: new Date().toISOString(),
      clicks: 0,
      clickHistory: [],
    };

    this.links.set(shortCode, linkData);
    if (alias) {
      this.aliasMap.set(alias, shortCode);
    }

    return linkData;
  }

  getLink(shortCode: string): LinkData | undefined {
    return this.links.get(shortCode);
  }

  getAllLinks(): LinkData[] {
    return Array.from(this.links.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  trackClick(shortCode: string, ip?: string, userAgent?: string): void {
    const link = this.links.get(shortCode);
    if (link) {
      link.clicks++;
      link.clickHistory.push({
        timestamp: new Date().toISOString(),
        ip,
        userAgent,
      });
    }
  }

  deleteLink(shortCode: string): boolean {
    const link = this.links.get(shortCode);
    if (link) {
      if (link.alias) {
        this.aliasMap.delete(link.alias);
      }
      return this.links.delete(shortCode);
    }
    return false;
  }

  private generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure uniqueness
    if (this.links.has(result)) {
      return this.generateShortCode();
    }
    
    return result;
  }
}

export const linkStorage = new LinkStorage();

