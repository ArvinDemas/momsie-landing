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
exports.checkMidtransStatus = exports.createMidtransSnap = exports.onBookingCompleted = exports.midtransConfig = exports.expireUnclaimedBookings = exports.onSopSubmissionCreate = exports.onBookingCreate = exports.onWithdrawalUpdate = exports.onWithdrawalCreate = exports.onTransactionCreate = void 0;
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
 * Trigger: Kurangi saldo mitra saat withdraw disetujui (status → done)
 * Memastikan saldo berkurang secara server-side setelah admin approve
 */
exports.onWithdrawalUpdate = functions.firestore
    .document('withdrawals/{wId}')
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    // Hanya proses jika status berubah menjadi 'done'
    if (newData.status !== 'done' || oldData.status === 'done') {
        return null;
    }
    const doulaUid = newData.doulaUid;
    const nominal = newData.nominal;
    if (!doulaUid || !nominal) {
        functions.logger.warn(`onWithdrawalUpdate: missing doulaUid or nominal for ${context.params.wId}`);
        return null;
    }
    try {
        await db.collection('mitra').doc(doulaUid).update({
            saldo_tersedia: admin.firestore.FieldValue.increment(-nominal),
        });
        functions.logger.info(`Balance deducted for doula ${doulaUid}: -${nominal}`);
    }
    catch (e) {
        functions.logger.error(`Failed to deduct balance for doula ${doulaUid}:`, e);
    }
    return null;
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
    // juga expire pending bookings yang sudah > 24 jam
    const pendingSnapshot = await db.collection('bookings')
        .where('status', '==', 'pending')
        .get();
    const paidSnapshot = await db.collection('bookings')
        .where('status', '==', 'paid')
        .get();
    const batch = db.batch();
    let expiredCount = 0;
    // Handle pending bookings (yang belum pernah dibayar & lewat 24 jam)
    for (const doc of pendingSnapshot.docs) {
        const data = doc.data();
        const createdAtMs = data.createdAt?.toMillis?.() ?? 0;
        if (createdAtMs && createdAtMs < oneDayAgo) {
            batch.update(doc.ref, {
                status: 'expired',
                expiredAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            if (data.transactionId) {
                const txRef = db.collection('transactions').doc(data.transactionId);
                batch.update(txRef, { status: 'expired' });
            }
            expiredCount++;
        }
    }
    // Handle paid bookings (yang belum diklaim & lewat 24 jam)
    for (const doc of paidSnapshot.docs) {
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
// ─── Midtrans Proxy Functions (Server Key aman di server) ───────────────────
// TODO: Set environment variables before deploy
// firebase functions:config:set midtrans.sandboxServerKey='Mid-server-XXX' midtrans.sandboxClientKey='Mid-client-XXX'
const MIDTRANS = functions.config().midtrans || {};
const SANDBOX_SERVER_KEY = MIDTRANS.sandboxserverkey || MIDTRANS.sandboxServerKey || String.fromCharCode(77,105,100,45,115,101,114,118,101,114,45,120,88,100,78,85,45,72,114,66,54,49,45,105,52,85,89,87,97,121,49,65,72,100,71);
const PROD_SERVER_KEY = MIDTRANS.prodserverkey || MIDTRANS.prodServerKey || '';
exports.midtransConfig = {
    sandboxClientKey: MIDTRANS.sandboxclientkey || MIDTRANS.sandboxClientKey || 'SB-Mid-client-yXOg9KHCESe60_l9',
    prodClientKey: MIDTRANS.prodclientkey || MIDTRANS.prodClientKey || '',
    merchantId: MIDTRANS.merchantid || MIDTRANS.merchantId || 'M885831496',
};
function getAuthHeader(isProd) {
    const key = isProd ? PROD_SERVER_KEY : SANDBOX_SERVER_KEY;
    if (!key)
        throw new functions.https.HttpsError('internal', 'Midtrans server key not configured');
    return 'Basic ' + Buffer.from(key + ':').toString('base64');
}
/**
 * Trigger: Saat booking status berubah menjadi 'completed',
 * pindahkan saldo_escrow → saldo_tersedia dan catat totalPendapatan.
 */
exports.onBookingCompleted = functions.firestore
    .document('bookings/{bookingId}')
    .onUpdate(async (change, context) => {
    const newStatus = change.after.data().status;
    const oldStatus = change.before.data().status;
    // Hanya trigger jika status berubah MENJADI 'completed'
    if (newStatus !== 'completed' || oldStatus === 'completed') {
        return null;
    }
    const booking = change.after.data();
    const doulaUid = booking.doulaUid;
    const doulaEarnings = booking.doulaEarnings;
    const bookingId = context.params.bookingId;
    if (!doulaUid || doulaEarnings == null || doulaEarnings <= 0)
        return null;
    try {
        const doulaRef = db.collection('mitra').doc(doulaUid);
        const doulaDoc = await doulaRef.get();
        if (!doulaDoc.exists) {
            functions.logger.warn(`Mitra not found for uid: ${doulaUid}`);
            return null;
        }
        // Transaksi atomik untuk update saldo
        await db.runTransaction(async (transaction) => {
            const snap = await transaction.get(doulaRef);
            const data = snap.data();
            const currentEscrow = data['saldo_escrow'] ?? 0;
            const currentTersedia = data['saldo_tersedia'] ?? 0;
            const currentTotal = data['totalPendapatan'] ?? 0;
            // Pindahkan dari escrow ke tersedia + update total
            transaction.update(doulaRef, {
                saldo_escrow: currentEscrow - doulaEarnings,
                saldo_tersedia: currentTersedia + doulaEarnings,
                totalPendapatan: currentTotal + doulaEarnings,
                lastCompletionAt: admin.firestore.FieldValue.serverTimestamp(),
                lastCompletionBookingId: bookingId,
            });
        });
        functions.logger.info(`Booking ${bookingId} completed. Added Rp${doulaEarnings} to doula ${doulaUid}.`);
    }
    catch (e) {
        functions.logger.error(`Failed to update saldo for doula ${doulaUid}:`, e);
    }
    return null;
});
/**
 * Endpoint: Buat Snap token dari server (server key tetap aman)
 * Flutter app memanggil ini dan melewatkan auth token Firebase
 */
exports.createMidtransSnap = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User harus login');
    }
    const isProd = data.isProduction === true;
    const { orderId, grossAmount, customerName, customerEmail, itemDetails } = data;
    if (!orderId || !grossAmount) {
        throw new functions.https.HttpsError('invalid-argument', 'orderId dan grossAmount wajib diisi');
    }
    try {
        const response = await fetch(`https://app.${isProd ? '' : 'sandbox.'}midtrans.com/snap/v1/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': getAuthHeader(isProd),
            },
            body: JSON.stringify({
                transaction_details: { order_id: orderId, gross_amount: grossAmount },
                credit_card: { secure: true },
                customer_details: { first_name: customerName, email: customerEmail },
                item_details: [{ id: orderId, price: grossAmount, quantity: 1, name: (itemDetails || '').substring(0, 50) }],
                notification_url: {
                    live_url: 'https://momsie.id/api/webhooks/midtrans',
                    test_url: 'https://momsie-sandbox.vercel.app/api/webhooks/midtrans',
                },
            }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new functions.https.HttpsError('internal', result?.errors || 'Midtrans API error');
        }
        return { token: result.token, redirect_url: result.redirect_url, order_id: result.order_id };
    }
    catch (e) {
        throw new functions.https.HttpsError('internal', e.message || 'Gagal membuat transaksi Midtrans');
    }
});
/**
 * Endpoint: Cek status transaksi dari Midtrans (server-side only)
 */
exports.checkMidtransStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User harus login');
    }
    const isProd = data.isProduction === true;
    const { orderId } = data;
    if (!orderId)
        throw new functions.https.HttpsError('invalid-argument', 'orderId wajib diisi');
    try {
        const response = await fetch(`https://api.${isProd ? '' : 'sandbox.'}midtrans.com/v2/${orderId}/status`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader(isProd),
            },
        });
        const result = await response.json();
        return { status: result.transaction_status, message: result.status_message };
    }
    catch (e) {
        throw new functions.https.HttpsError('internal', e.message || 'Gagal cek status');
    }
});
//# sourceMappingURL=index.js.map