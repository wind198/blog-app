import Dexie, { Table } from "dexie";

interface IBlogPost {
  id?: number;
  content: any;
  createdAt: string;
}

class BlogAppDb extends Dexie {
  blogPosts!: Table<IBlogPost>;

  constructor() {
    super("BlogAppDb");
    this.version(2).stores({
      blogPosts: `
        ++id,
        content
        `,
    });
  }
}

export const db = new BlogAppDb();
