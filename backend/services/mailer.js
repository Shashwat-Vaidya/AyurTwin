/**
 * Nodemailer client + templated family-invite email.
 * Driven by SMTP_* env vars (see config/env.js). If SMTP_PASS is missing,
 * sendMail() no-ops and logs a warning so dev without creds still works.
 */
const nodemailer = require('nodemailer');
const env = require('../config/env');
const { createLogger } = require('../utils/logger');

const log = createLogger('mailer');

let transporter = null;
function getTransporter() {
    if (transporter) return transporter;
    if (!env.SMTP_PASS) return null;
    transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
    return transporter;
}

async function sendMail({ to, subject, html, text }) {
    const t = getTransporter();
    if (!t) {
        log.warn(`SMTP not configured - would send "${subject}" to ${to}`);
        return { skipped: true };
    }
    const info = await t.sendMail({ from: env.SMTP_FROM, to, subject, html, text });
    log.info(`sent ${info.messageId} to ${to}`);
    return info;
}

function familyInviteEmail({ patientName, familyEmail, familyName, familyRole }) {
    const greeting = familyName ? `Hi ${familyName},` : 'Hello,';
    const role = familyRole ? ` as their <b>${familyRole}</b>` : '';
    const html = `
        <div style="font-family: -apple-system, Segoe UI, Arial, sans-serif; max-width:560px; margin:auto; padding:24px; color:#222;">
            <h2 style="color:#D97706; margin:0 0 8px;">${env.APP_NAME} — Family Invitation</h2>
            <p>${greeting}</p>
            <p><b>${patientName}</b> has invited you${role} on ${env.APP_NAME}.</p>
            <p>Accepting lets you monitor their health metrics, prakriti, and disease-risk trends in real time.</p>
            <p style="margin:24px 0;">
                <a href="${env.APP_WEB_URL}" style="background:#D97706;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;">Open ${env.APP_NAME} →</a>
            </p>
            <ol>
                <li>Open the app.</li>
                <li>Register as a <b>Family Member</b> using this email (${familyEmail}).</li>
                <li>Open the Family Dashboard - you'll see the pending invite from ${patientName}.</li>
                <li>Tap <b>Approve</b> to start monitoring.</li>
            </ol>
            <p style="color:#666; font-size:12px; margin-top:24px;">If you weren't expecting this, ignore this email.</p>
        </div>`;
    const text = `${env.APP_NAME} — Family Invitation\n\n${greeting}\n\n${patientName} has invited you${role ? ` as their ${familyRole}` : ''} on ${env.APP_NAME}.\n\nOpen the app → Register as Family Member using ${familyEmail} → Approve the invite.`;
    return { html, text };
}

module.exports = { sendMail, familyInviteEmail };
