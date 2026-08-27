"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.expireUnclaimedBookings = exports.onSopSubmissionCreate = exports.onBookingCreate = exports.onWithdrawalCreate = exports.onTransactionCreate = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
/**
 * Trigger: Otomatis isi createdAt jika belum ada saat transaksi baru dibuat
 */
exports.onTransactionCreate = functions.firestore
    .document('transactions/{txId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    const txId = context.params.txId;
    // Jika sudah ada createdAt, tidak perlu update
    if (data.createdAt) {
        return null;
    }
    // Update dengan timestamp sekarang
    return db.collection('transactions').doc(txId).update({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
});
/**
 * Trigger: Auto-fill createdAt untuk withdrawals
 */
exports.onWithdrawalCreate = functions.firestore
    .document('withdrawals/{wId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    const wId = context.params.wId;
    if (data.createdAt) {
        return null;
    }
    return db.collection('withdrawals').doc(wId).update({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
});
/**
 * Trigger: Auto-fill createdAt untuk bookings
 */
exports.onBookingCreate = functions.firestore
    .document('bookings/{bookingId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    const bookingId = context.params.bookingId;
    if (data.createdAt) {
        return null;
    }
    return db.collection('bookings').doc(bookingId).update({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
});
/**
 * Trigger: Auto-fill createdAt untuk mitra/sop submissions
 */
exports.onSopSubmissionCreate = functions.firestore
    .document('sop_submissions/{submissionId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    const submissionId = context.params.submissionId;
    if (data.createdAt) {
        return null;
    }
    return db.collection('sop_submissions').doc(submissionId).update({
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
});
/**
 * Schedule Trigger: Auto-expire paid bookings yang belum diklaim setelah 24 jam
 * Jalankan setiap jam untuk mencari booking paid yang berusia > 24 jam
 */
exports.expireUnclaimedBookings = functions.pubsub
    .schedule('every 1 hours')
    .timeZone('Asia/Jakarta')
    .onRun(async (context) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const snapshot = await db.collection('bookings')
        .where('status', '==', 'paid')
        .get();
    const batch = db.batch();
    let expiredCount = 0;
    for (const doc of snapshot.docs) {
        const data = doc.data();
        const paidAt = data.paidAt;
        // Cek apakah booking sudah lebih dari 24 jam dalam status paid
        if (paidAt && paidAt.toMillis && paidAt.toMillis() < oneDayAgo) {
            batch.update(doc.ref, {
                status: 'cancelled',
                cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
                cancellationReason: 'Booking otomatis dibatalkan karena tidak diklaim dalam 24 jam'
            });
            expiredCount++;
            // Update juga transaksi terkait menjadi cancelled
            if (data.transactionId) {
                const txRef = db.collection('transactions').doc(data.transactionId);
                batch.update(txRef, {
                    status: 'cancelled',
                    cancelledAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }
    }
    if (expiredCount > 0) {
        await batch.commit();
        functions.logger.info(`Expired ${expiredCount} unclaimed bookings`);
    }
    return null;
});
//# sourceMappingURL=index.js.map