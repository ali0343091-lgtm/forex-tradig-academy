import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db, UPLOADS_DIR, VIDEOS_DIR, RECEIPTS_DIR, AVATARS_DIR } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'forex-academy-jwt-secret-key-2026-prod';

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure Multer Storage for Receipts
const receiptStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, RECEIPTS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});
const uploadReceipt = multer({
  storage: receiptStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max for receipt image
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|pdf)$/i;
    if (file.originalname.match(allowed) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) or PDFs are allowed for receipts'));
    }
  }
});

// Configure Multer Storage for Video Uploads
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, VIDEOS_DIR);
  },
  filename: (_req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(cleanName).toLowerCase() || '.mp4';
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(mp4|webm|mov|mkv|avi|m4v)$/i;
    if (file.originalname.match(allowed) || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, WebM, MOV, MKV) are allowed'));
    }
  }
});

// Configure Multer Storage for Avatar Uploads
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, AVATARS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `instructor-${Date.now()}${ext}`);
  }
});
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Auth Helper
interface AuthPayload {
  userId: string;
  email: string;
  role: 'student' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }
};

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
      return;
    }
    next();
  });
};

// Check if user is eligible to stream paid course classes
const canAccessPaidClasses = (userId: string, role: string): boolean => {
  if (role === 'admin') return true;
  const user = db.findUserById(userId);
  if (!user || user.status !== 'approved') return false;

  const payments = db.getPaymentsByUserId(userId);
  const hasApprovedPayment = payments.some(p => p.status === 'approved');
  return hasApprovedPayment;
};

// ==================== AUTH ROUTES ====================

// Public Registration
app.post('/api/auth/register', (req: Request, res: Response): void => {
  const { name, email, password, confirmPassword, phone } = req.body;

  if (!name || !name.trim()) {
    res.status(400).json({ error: 'Full name is required.' });
    return;
  }
  if (!email || !email.trim() || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }
  if (!password || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' });
    return;
  }
  if (confirmPassword && password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  const existing = db.findUserByEmail(email.trim());
  if (existing) {
    res.status(409).json({ error: 'An account with this email address already exists. Please log in instead.' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = {
    id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
    role: 'student' as const,
    status: 'pending' as const, // Pending until admin approval
    createdAt: new Date().toISOString()
  };

  const created = db.createUser(newUser, passwordHash);

  db.addAuditLog({
    actorId: created.id,
    actorEmail: created.email,
    action: 'STUDENT_REGISTERED',
    targetId: created.id,
    details: `Student registered: ${created.name} (${created.email}). Account status set to Pending.`
  });

  // Issue token so student can track their registration & submit payment
  const token = jwt.sign(
    { userId: created.id, email: created.email, role: created.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'Registration successful! Your account is currently pending administrator approval.',
    user: created,
    token
  });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const userRecord = db.findUserByEmail(email.trim());
  if (!userRecord) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isMatch = bcrypt.compareSync(password, userRecord.passwordHash);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (userRecord.status === 'blocked') {
    res.status(403).json({ error: 'This account has been suspended by the administrator. Please contact support.' });
    return;
  }

  const { passwordHash: _, ...safeUser } = userRecord;
  const token = jwt.sign(
    { userId: safeUser.id, email: safeUser.email, role: safeUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful.',
    user: safeUser,
    token
  });
});

// Current User Profile
app.get('/api/auth/me', authenticate, (req: Request, res: Response): void => {
  const user = db.findUserById(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  const payments = db.getPaymentsByUserId(user.id);
  const hasApprovedPayment = payments.some(p => p.status === 'approved');
  const hasPendingPayment = payments.some(p => p.status === 'pending');

  res.json({
    user,
    paymentStatus: hasApprovedPayment ? 'approved' : hasPendingPayment ? 'pending' : 'none',
    canAccessClasses: canAccessPaidClasses(user.id, user.role),
    latestPayment: payments[0] || null
  });
});

// Change Password
app.post('/api/auth/change-password', authenticate, (req: Request, res: Response): void => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Both current password and new password are required.' });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters.' });
    return;
  }

  const userRecord = db.findUserByEmail(req.user!.email);
  if (!userRecord) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const isMatch = bcrypt.compareSync(currentPassword, userRecord.passwordHash);
  if (!isMatch) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.updateUserPassword(userRecord.id, newHash);

  db.addAuditLog({
    actorId: userRecord.id,
    actorEmail: userRecord.email,
    action: 'PASSWORD_CHANGED',
    details: 'User successfully updated their password.'
  });

  res.json({ message: 'Password updated successfully.' });
});

// ==================== SETTINGS ROUTES ====================

app.get('/api/settings', (_req: Request, res: Response): void => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response): void => {
  const updates = req.body;
  const updated = db.updateSettings(updates);
  db.addAuditLog({
    actorId: req.user!.userId,
    actorEmail: req.user!.email,
    action: 'SETTINGS_UPDATED',
    details: 'Administrator updated academy settings & pricing details.'
  });
  res.json({ message: 'Academy settings updated successfully.', settings: updated });
});

// Instructor Avatar Upload
app.post('/api/settings/avatar', requireAdmin, uploadAvatar.single('avatar'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded.' });
    return;
  }
  const avatarUrl = `/api/avatars/${req.file.filename}`;
  db.updateSettings({ instructorAvatar: avatarUrl });
  res.json({ message: 'Instructor profile image updated successfully.', avatarUrl });
});

app.get('/api/avatars/:filename', (req: Request, res: Response): void => {
  const filePath = path.join(AVATARS_DIR, path.basename(req.params.filename));
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Avatar not found' });
  }
});

// ==================== PAYMENT ROUTES ====================

// Submit manual payment with receipt upload
app.post('/api/payments/submit', authenticate, uploadReceipt.single('receipt'), (req: Request, res: Response): void => {
  const user = db.findUserById(req.user!.userId);
  if (!user) {
    res.status(404).json({ error: 'Student account not found.' });
    return;
  }

  const { method, amount, transactionRef } = req.body;

  if (!method || (method !== 'Easypaisa' && method !== 'JazzCash')) {
    res.status(400).json({ error: 'Please select a valid payment method (Easypaisa or JazzCash).' });
    return;
  }

  if (!transactionRef || !transactionRef.trim()) {
    res.status(400).json({ error: 'Transaction ID or Reference number is required.' });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'Please upload a screenshot or image of your payment receipt.' });
    return;
  }

  const settings = db.getSettings();
  const paymentAmount = Number(amount) || settings.discountedPrice || 15000;

  const paymentRecord = db.createPayment({
    id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    studentName: user.name,
    studentEmail: user.email,
    method: method as 'Easypaisa' | 'JazzCash',
    amount: paymentAmount,
    transactionRef: transactionRef.trim(),
    receiptFilename: req.file.filename,
    receiptOriginalName: req.file.originalname,
    status: 'pending',
    submittedAt: new Date().toISOString()
  });

  db.addAuditLog({
    actorId: user.id,
    actorEmail: user.email,
    action: 'PAYMENT_SUBMITTED',
    targetId: paymentRecord.id,
    details: `Submitted ${method} payment of PKR ${paymentAmount} (Ref: ${transactionRef.trim()}).`
  });

  res.status(201).json({
    message: 'Payment receipt submitted successfully! Your payment is now pending verification by our academy administrator.',
    payment: paymentRecord
  });
});

// Student's own payments
app.get('/api/payments/my-status', authenticate, (req: Request, res: Response): void => {
  const payments = db.getPaymentsByUserId(req.user!.userId);
  res.json({ payments });
});

// View payment receipt image (Only student owner or admin!)
app.get('/api/receipts/:filename', authenticate, (req: Request, res: Response): void => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(RECEIPTS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Receipt file not found.' });
    return;
  }

  // Authorization check
  if (req.user!.role !== 'admin') {
    const userPayments = db.getPaymentsByUserId(req.user!.userId);
    const ownsFile = userPayments.some(p => p.receiptFilename === filename);
    if (!ownsFile) {
      res.status(403).json({ error: 'Access denied. You can only view your own receipts.' });
      return;
    }
  }

  res.sendFile(filePath);
});

// ==================== CLASSES & SECURE VIDEO STREAMING ====================

// Public curriculum overview (lesson titles, duration, modules)
app.get('/api/classes', (_req: Request, res: Response): void => {
  const classes = db.getClasses(false).map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    moduleTitle: c.moduleTitle,
    orderIndex: c.orderIndex,
    durationMinutes: c.durationMinutes,
    hasVideo: Boolean(c.videoFilename || c.sampleVideoUrl),
    createdAt: c.createdAt
  }));
  res.json({ classes });
});

// Single class details (metadata)
app.get('/api/classes/:id', (req: Request, res: Response): void => {
  const classLesson = db.getClassById(req.params.id);
  if (!classLesson || !classLesson.isPublished) {
    res.status(404).json({ error: 'Class not found.' });
    return;
  }
  res.json({
    id: classLesson.id,
    title: classLesson.title,
    description: classLesson.description,
    moduleTitle: classLesson.moduleTitle,
    orderIndex: classLesson.orderIndex,
    durationMinutes: classLesson.durationMinutes,
    createdAt: classLesson.createdAt
  });
});

// Authenticated Video Stream with HTTP 206 Partial Content
app.get('/api/classes/:id/stream', (req: Request, res: Response): void => {
  // Support both token in Authorization header AND ?token= query parameter (for standard HTML5 <video> tags)
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in to watch classes.' });
    return;
  }

  let userPayload: AuthPayload;
  try {
    userPayload = jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
    return;
  }

  // Enforce access control: Admin OR (approved student + approved payment)
  const isAllowed = canAccessPaidClasses(userPayload.userId, userPayload.role);
  if (!isAllowed) {
    res.status(403).json({
      error: 'Restricted content. Access to private classes requires an approved student account and verified payment.'
    });
    return;
  }

  const lesson = db.getClassById(req.params.id);
  if (!lesson) {
    res.status(404).json({ error: 'Class not found.' });
    return;
  }

  // Check if uploaded custom video exists on disk
  if (lesson.videoFilename) {
    const videoFilePath = path.join(VIDEOS_DIR, lesson.videoFilename);
    if (fs.existsSync(videoFilePath)) {
      const stat = fs.statSync(videoFilePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        const fileStream = fs.createReadStream(videoFilePath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
          'Content-Disposition': 'inline',
          'X-Content-Type-Options': 'nosniff'
        };
        res.writeHead(206, head);
        fileStream.pipe(res);
        return;
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Content-Disposition': 'inline',
          'X-Content-Type-Options': 'nosniff'
        };
        res.writeHead(200, head);
        fs.createReadStream(videoFilePath).pipe(res);
        return;
      }
    }
  }

  // Fallback to sample streaming video if available
  if (lesson.sampleVideoUrl) {
    res.redirect(lesson.sampleVideoUrl);
    return;
  }

  res.status(404).json({ error: 'Video file not available for this lesson.' });
});

// ==================== ADMIN ROUTES ====================

// Admin: Get all students
app.get('/api/admin/students', requireAdmin, (req: Request, res: Response): void => {
  const students = db.getUsers().filter(u => u.role === 'student');
  const payments = db.getPayments();

  // Combine student with payment info
  const enriched = students.map(s => {
    const studentPayments = payments.filter(p => p.userId === s.id);
    const hasApprovedPayment = studentPayments.some(p => p.status === 'approved');
    const hasPendingPayment = studentPayments.some(p => p.status === 'pending');
    return {
      ...s,
      paymentStatus: hasApprovedPayment ? 'approved' : hasPendingPayment ? 'pending' : 'none',
      paymentsCount: studentPayments.length,
      latestPayment: studentPayments[0] || null
    };
  });

  res.json({ students: enriched });
});

// Admin: Update student status (approve, reject, block, restore)
app.post('/api/admin/students/:id/status', requireAdmin, (req: Request, res: Response): void => {
  const { status, reason } = req.body;
  if (!['approved', 'rejected', 'blocked', 'pending'].includes(status)) {
    res.status(400).json({ error: 'Invalid status value.' });
    return;
  }

  const student = db.findUserById(req.params.id);
  if (!student) {
    res.status(404).json({ error: 'Student not found.' });
    return;
  }

  const updated = db.updateUser(student.id, {
    status: status as any,
    approvedAt: status === 'approved' ? new Date().toISOString() : student.approvedAt,
    rejectionReason: reason || undefined
  });

  db.addAuditLog({
    actorId: req.user!.userId,
    actorEmail: req.user!.email,
    action: `STUDENT_STATUS_${status.toUpperCase()}`,
    targetId: student.id,
    details: `Changed student ${student.name} (${student.email}) status to ${status}. ${reason ? 'Reason: ' + reason : ''}`
  });

  res.json({ message: `Student status updated to ${status}.`, student: updated });
});

// Admin: Get all payments
app.get('/api/admin/payments', requireAdmin, (_req: Request, res: Response): void => {
  const payments = db.getPayments();
  res.json({ payments });
});

// Admin: Review payment (Approve / Reject)
app.post('/api/admin/payments/:id/review', requireAdmin, (req: Request, res: Response): void => {
  const { status, rejectionReason } = req.body;
  if (status !== 'approved' && status !== 'rejected') {
    res.status(400).json({ error: 'Status must be either approved or rejected.' });
    return;
  }

  const payment = db.getPaymentById(req.params.id);
  if (!payment) {
    res.status(404).json({ error: 'Payment request not found.' });
    return;
  }

  const updated = db.updatePaymentStatus(
    payment.id,
    status,
    req.user!.email,
    rejectionReason
  );

  // If approved, also ensure student's account status is approved so they get immediate access
  if (status === 'approved') {
    const student = db.findUserById(payment.userId);
    if (student && student.status !== 'approved') {
      db.updateUser(student.id, {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });
    }
  }

  db.addAuditLog({
    actorId: req.user!.userId,
    actorEmail: req.user!.email,
    action: `PAYMENT_${status.toUpperCase()}`,
    targetId: payment.id,
    details: `Admin reviewed payment #${payment.id} for ${payment.studentEmail}: marked ${status}. ${rejectionReason ? 'Reason: ' + rejectionReason : ''}`
  });

  res.json({ message: `Payment marked as ${status}.`, payment: updated });
});

// Admin: Get all classes (including unpublished)
app.get('/api/admin/classes', requireAdmin, (_req: Request, res: Response): void => {
  const classes = db.getClasses(true);
  res.json({ classes });
});

// Admin: Upload video file
app.post('/api/admin/classes/upload-video', requireAdmin, uploadVideo.single('video'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No video file provided.' });
    return;
  }

  res.json({
    message: 'Video file uploaded successfully.',
    filename: req.file.filename,
    originalName: req.file.originalname,
    sizeBytes: req.file.size
  });
});

// Admin: Create new class
app.post('/api/admin/classes', requireAdmin, (req: Request, res: Response): void => {
  const { title, description, moduleTitle, orderIndex, videoFilename, durationMinutes, isPublished } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ error: 'Class title is required.' });
    return;
  }

  const newClass = db.createClass({
    id: `class-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: description ? description.trim() : 'Institutional forex class covering actionable trading setups.',
    moduleTitle: moduleTitle ? moduleTitle.trim() : 'Advanced Trading Strategies',
    orderIndex: Number(orderIndex) || db.getClasses(true).length + 1,
    videoFilename: videoFilename || undefined,
    durationMinutes: Number(durationMinutes) || 45,
    isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  db.addAuditLog({
    actorId: req.user!.userId,
    actorEmail: req.user!.email,
    action: 'CLASS_CREATED',
    targetId: newClass.id,
    details: `Created new class: "${newClass.title}".`
  });

  res.status(201).json({ message: 'Class created successfully.', class: newClass });
});

// Admin: Update class
app.put('/api/admin/classes/:id', requireAdmin, (req: Request, res: Response): void => {
  const updated = db.updateClass(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Class not found.' });
    return;
  }
  res.json({ message: 'Class updated successfully.', class: updated });
});

// Admin: Delete class
app.delete('/api/admin/classes/:id', requireAdmin, (req: Request, res: Response): void => {
  const lesson = db.getClassById(req.params.id);
  const success = db.deleteClass(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Class not found.' });
    return;
  }
  // If there was an uploaded video file, delete it
  if (lesson?.videoFilename) {
    const videoPath = path.join(VIDEOS_DIR, lesson.videoFilename);
    if (fs.existsSync(videoPath)) {
      try { fs.unlinkSync(videoPath); } catch (e) {}
    }
  }

  db.addAuditLog({
    actorId: req.user!.userId,
    actorEmail: req.user!.email,
    action: 'CLASS_DELETED',
    targetId: req.params.id,
    details: `Deleted class #${req.params.id}`
  });

  res.json({ message: 'Class deleted successfully.' });
});

// Admin: Get Audit Logs
app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response): void => {
  res.json({ logs: db.getAuditLogs() });
});

// ==================== STUDENT PROGRESS ====================

app.get('/api/progress', authenticate, (req: Request, res: Response): void => {
  const progress = db.getProgress(req.user!.userId);
  res.json({ progress });
});

app.post('/api/progress/toggle', authenticate, (req: Request, res: Response): void => {
  const { lessonId } = req.body;
  if (!lessonId) {
    res.status(400).json({ error: 'Lesson ID is required.' });
    return;
  }
  const updated = db.toggleLessonProgress(req.user!.userId, lessonId);
  res.json({ progress: updated });
});

// ==================== LIVE MARKET RATES API ====================

app.get('/api/market-rates', (_req: Request, res: Response): void => {
  const baseRates = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', bid: 1.0842, ask: 1.0844, change: 0.0028, changePercent: 0.26, high: 1.0875, low: 1.0812 },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', bid: 1.2985, ask: 1.2988, change: -0.0041, changePercent: -0.31, high: 1.3040, low: 1.2960 },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', bid: 153.24, ask: 153.27, change: 0.65, changePercent: 0.43, high: 153.80, low: 152.40 },
    { symbol: 'XAU/USD', name: 'Spot Gold / US Dollar', bid: 2742.80, ask: 2743.30, change: 18.50, changePercent: 0.68, high: 2755.00, low: 2724.10 },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', bid: 1.3892, ask: 1.3895, change: -0.0014, changePercent: -0.10, high: 1.3930, low: 1.3875 },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', bid: 0.6582, ask: 0.6585, change: 0.0019, changePercent: 0.29, high: 0.6610, low: 0.6560 },
    { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', bid: 0.8665, ask: 0.8668, change: 0.0008, changePercent: 0.09, high: 0.8690, low: 0.8640 },
  ];

  // Add realistic micro-variations to make it lively
  const rates = baseRates.map(rate => {
    const jitter = (Math.random() - 0.5) * 0.0004 * (rate.bid > 100 ? 50 : 1);
    const newBid = Number((rate.bid + jitter).toFixed(rate.bid > 100 ? 2 : 4));
    const spread = rate.bid > 100 ? 0.03 : 0.0002;
    return {
      ...rate,
      bid: newBid,
      ask: Number((newBid + spread).toFixed(rate.bid > 100 ? 2 : 4))
    };
  });

  res.json({ rates, updatedAt: new Date().toISOString() });
});

// ==================== SEO: SITEMAP & ROBOTS ====================

app.get('/sitemap.xml', (_req: Request, res: Response): void => {
  const baseUrl = process.env.APP_URL || 'https://forextradingacademy.pk';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/fees</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/register</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/payment-instructions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (_req: Request, res: Response): void => {
  const baseUrl = process.env.APP_URL || 'https://forextradingacademy.pk';
  const txt = `User-agent: *
Allow: /
Allow: /about
Allow: /fees
Allow: /register
Allow: /login
Allow: /payment-instructions
Allow: /contact
Allow: /privacy
Allow: /terms
Disallow: /admin*
Disallow: /student-dashboard*
Disallow: /classes/*
Disallow: /status*
Disallow: /api/*

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// ==================== SERVE FRONTEND ====================

const isProduction = process.env.NODE_ENV === 'production';

async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FOREX TRADING ACADEMY server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
