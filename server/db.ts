import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, PaymentRequest, ClassLesson, AcademySettings, StudentProgress, AuditLog } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'academy_db.json');
export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
export const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');
export const RECEIPTS_DIR = path.join(UPLOADS_DIR, 'receipts');
export const AVATARS_DIR = path.join(UPLOADS_DIR, 'avatars');

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  payments: PaymentRequest[];
  classes: ClassLesson[];
  settings: AcademySettings;
  progress: Record<string, StudentProgress>;
  auditLogs: AuditLog[];
}

const DEFAULT_SETTINGS: AcademySettings = {
  academyName: 'FOREX TRADING ACADEMY',
  tagline: 'Learn. Practice. Trade with Discipline.',
  originalPrice: 50000,
  discountedPrice: 15000,
  currency: 'PKR',
  easypaisaNumber: '03135279108',
  easypaisaAccountTitle: 'Forex Trading Academy',
  jazzcashNumber: '03430919084',
  jazzcashAccountTitle: 'Forex Trading Academy',
  contactEmail: 'ali0343091@gmail.com',
  contactPhone: '03430919084',
  whatsappNumber: '03430919084',
  instructorName: 'Forex Trading Academy Lead Instructor',
  instructorBio: 'Professional currency trader with over 8 years in the financial markets, focusing on pure Price Action, Liquidity Order Blocks, and uncompromising Risk Management.',
  instructorAvatar: '',
  announcement: 'Special Discount: Enroll now for only PKR 15,000 (Originally PKR 50,000). Limited seats per monthly batch.',
};

// Seed curriculum lessons for Forex Trading Academy
const DEFAULT_CLASSES: ClassLesson[] = [
  {
    id: 'lesson-1',
    title: 'Lesson 1: Anatomy of Global Forex Markets & Broker Selection',
    description: 'Learn how the $7.5 Trillion daily currency market operates, how tier-1 liquidity providers quote prices, and how to choose a reliable ECN broker without conflict of interest.',
    moduleTitle: 'Module 1: Market Foundations & Mechanics',
    orderIndex: 1,
    durationMinutes: 45,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-2',
    title: 'Lesson 2: Calculating Pips, Lot Sizes, Leverage & True Margin',
    description: 'Stop blowing accounts on bad sizing. Master the mathematical calculation of standard, mini, and micro lots, pip value across major/minor pairs, and real margin utilization.',
    moduleTitle: 'Module 1: Market Foundations & Mechanics',
    orderIndex: 2,
    durationMinutes: 52,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-3',
    title: 'Lesson 3: The 4 Global Trading Sessions & High-Volume Overlaps',
    description: 'When to enter and when to stay in cash. Detailed breakdown of Sydney, Tokyo, London, and New York sessions, plus the golden London-New York overlap.',
    moduleTitle: 'Module 1: Market Foundations & Mechanics',
    orderIndex: 3,
    durationMinutes: 38,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-4',
    title: 'Lesson 4: Price Action & High-Probability Candlestick Patterns',
    description: 'Read the raw chart without lagging indicators. Learn bullish & bearish engulfing wicks, pin bars at institutional levels, rejection candles, and momentum continuation.',
    moduleTitle: 'Module 2: Institutional Price Action & Candlesticks',
    orderIndex: 4,
    durationMinutes: 64,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-5',
    title: 'Lesson 5: Institutional Market Structure, Order Blocks & FVG',
    description: 'Understand how market makers manipulate liquidity. Identifying institutional Order Blocks (OB), Fair Value Gaps (FVG), Break of Structure (BOS), and Change of Character (CHoCH).',
    moduleTitle: 'Module 2: Institutional Price Action & Candlesticks',
    orderIndex: 5,
    durationMinutes: 72,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-6',
    title: 'Lesson 6: High Liquidity Sweeps, Asian Range Raids & Inducements',
    description: 'Why your stop loss gets hit right before the market moves your way. How to identify liquidity pools above equal highs and below equal lows, and trade the institutional sweep.',
    moduleTitle: 'Module 2: Institutional Price Action & Candlesticks',
    orderIndex: 6,
    durationMinutes: 58,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-7',
    title: 'Lesson 7: The Ironclad 1% Rule & 1:3 Risk-to-Reward Blueprints',
    description: 'The mathematical edge that guarantees survival and long-term compounding. Even with a 40% win rate, why strict 1:3 risk-to-reward creates consistently profitable traders.',
    moduleTitle: 'Module 3: Risk Management & Trading Psychology',
    orderIndex: 7,
    durationMinutes: 50,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-8',
    title: 'Lesson 8: Mastering Psychology: Eliminating FOMO, Revenge Trading & Greed',
    description: 'Trading is 80% psychology and 20% technicals. Developing cognitive stamina, embracing losses as operational expenses, and following an unshakeable trade routine.',
    moduleTitle: 'Module 3: Risk Management & Trading Psychology',
    orderIndex: 8,
    durationMinutes: 44,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'lesson-9',
    title: 'Lesson 9: Complete Trading Plan, Execution Journal & Live Checklist',
    description: 'Putting it all together. The pre-market routine, economic calendar risk filter, live trade checklist, and the step-by-step spreadsheet journaling process to track your edge.',
    moduleTitle: 'Module 3: Risk Management & Trading Psychology',
    orderIndex: 9,
    durationMinutes: 60,
    sampleVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectories();
    this.data = this.loadDatabase();
  }

  private ensureDirectories() {
    [DATA_DIR, UPLOADS_DIR, VIDEOS_DIR, RECEIPTS_DIR, AVATARS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          payments: parsed.payments || [],
          classes: parsed.classes || DEFAULT_CLASSES,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          progress: parsed.progress || {},
          auditLogs: parsed.auditLogs || []
        };
      } catch (err) {
        console.error('Failed to parse database file, reinitializing', err);
      }
    }

    // Default Seed Data
    const seedAdminEmail = process.env.ADMIN_EMAIL || 'ali0343091@gmail.com';
    const seedAdminPassword = process.env.ADMIN_PASSWORD || 'ForexAdmin2026!';
    const adminPasswordHash = bcrypt.hashSync(seedAdminPassword, 10);
    const initialUsers: (User & { passwordHash: string })[] = [
      {
        id: 'admin-1',
        name: 'Academy Administrator',
        email: seedAdminEmail,
        phone: '03430919084',
        role: 'admin',
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        passwordHash: adminPasswordHash
      }
    ];

    const initialSchema: DatabaseSchema = {
      users: initialUsers,
      payments: [],
      classes: DEFAULT_CLASSES,
      settings: DEFAULT_SETTINGS,
      progress: {},
      auditLogs: [
        {
          id: 'log-seed',
          timestamp: new Date().toISOString(),
          actorId: 'system',
          actorEmail: 'system',
          action: 'ACADEMY_INITIALIZED',
          details: 'Forex Trading Academy database initialized with secure admin account and structured curriculum.'
        }
      ]
    };

    this.saveDataDirect(initialSchema);
    return initialSchema;
  }

  private saveDataDirect(dataToSave: DatabaseSchema) {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  private save() {
    this.saveDataDirect(this.data);
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  public findUserById(id: string): User | undefined {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  public findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User, passwordHash: string): User {
    const record = { ...user, passwordHash };
    this.data.users.push(record);
    this.save();
    const { passwordHash: _, ...safeUser } = record;
    return safeUser;
  }

  public updateUser(id: string, updates: Partial<User> & { passwordHash?: string }): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;

    this.data.users[index] = {
      ...this.data.users[index],
      ...updates
    };
    this.save();
    const { passwordHash: _, ...safeUser } = this.data.users[index];
    return safeUser;
  }

  public updateUserPassword(id: string, newPasswordHash: string): boolean {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.data.users[index].passwordHash = newPasswordHash;
    this.save();
    return true;
  }

  // --- Payments ---
  public getPayments(): PaymentRequest[] {
    return [...this.data.payments].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getPaymentsByUserId(userId: string): PaymentRequest[] {
    return this.data.payments
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  public getPaymentById(id: string): PaymentRequest | undefined {
    return this.data.payments.find(p => p.id === id);
  }

  public createPayment(payment: PaymentRequest): PaymentRequest {
    this.data.payments.push(payment);
    this.save();
    return payment;
  }

  public updatePaymentStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    rejectionReason?: string
  ): PaymentRequest | undefined {
    const index = this.data.payments.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.data.payments[index].status = status;
    this.data.payments[index].reviewedAt = new Date().toISOString();
    this.data.payments[index].reviewedBy = reviewedBy;
    if (rejectionReason) {
      this.data.payments[index].rejectionReason = rejectionReason;
    }
    this.save();
    return this.data.payments[index];
  }

  // --- Classes / Lessons ---
  public getClasses(includeUnpublished = false): ClassLesson[] {
    const list = includeUnpublished 
      ? this.data.classes 
      : this.data.classes.filter(c => c.isPublished);
    return [...list].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  public getClassById(id: string): ClassLesson | undefined {
    return this.data.classes.find(c => c.id === id);
  }

  public createClass(classLesson: ClassLesson): ClassLesson {
    this.data.classes.push(classLesson);
    this.save();
    return classLesson;
  }

  public updateClass(id: string, updates: Partial<ClassLesson>): ClassLesson | undefined {
    const index = this.data.classes.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.data.classes[index] = {
      ...this.data.classes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.classes[index];
  }

  public deleteClass(id: string): boolean {
    const index = this.data.classes.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.classes.splice(index, 1);
    this.save();
    return true;
  }

  // --- Settings ---
  public getSettings(): AcademySettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<AcademySettings>): AcademySettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.save();
    return { ...this.data.settings };
  }

  // --- Progress ---
  public getProgress(userId: string): StudentProgress {
    return this.data.progress[userId] || {
      userId,
      completedLessonIds: []
    };
  }

  public toggleLessonProgress(userId: string, lessonId: string): StudentProgress {
    const current = this.getProgress(userId);
    const set = new Set(current.completedLessonIds);
    if (set.has(lessonId)) {
      set.delete(lessonId);
    } else {
      set.add(lessonId);
    }
    const updated: StudentProgress = {
      ...current,
      completedLessonIds: Array.from(set),
      lastWatchedLessonId: lessonId,
      lastWatchedAt: new Date().toISOString()
    };
    this.data.progress[userId] = updated;
    this.save();
    return updated;
  }

  // --- Audit Logs ---
  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const fullLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(fullLog);
    // Keep max 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
    return fullLog;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }
}

export const db = new Database();
