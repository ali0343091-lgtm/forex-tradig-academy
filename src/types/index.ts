export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  method: 'Easypaisa' | 'JazzCash';
  amount: number;
  transactionRef: string;
  receiptFilename: string;
  receiptOriginalName: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ClassLesson {
  id: string;
  title: string;
  description: string;
  moduleTitle: string;
  orderIndex: number;
  videoFilename?: string;
  sampleVideoUrl?: string; // Fallback demo video for initial lessons
  durationMinutes: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademySettings {
  academyName: string;
  tagline: string;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  easypaisaNumber: string;
  easypaisaAccountTitle: string;
  jazzcashNumber: string;
  jazzcashAccountTitle: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  instructorName: string;
  instructorBio: string;
  instructorAvatar?: string;
  announcement: string;
}

export interface StudentProgress {
  userId: string;
  completedLessonIds: string[];
  lastWatchedLessonId?: string;
  lastWatchedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetId?: string;
  details: string;
}

export interface ForexQuote {
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}
