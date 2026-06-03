#!/usr/bin/env node
/**
 * create-admin.js
 *
 * Creates a Firebase Authentication user (email + password) so you can log in
 * to the /admin panel. You choose the password — it is NEVER stored in code.
 *
 * Usage:
 *   node scripts/create-admin.js <email> <password>
 *
 * Example:
 *   node scripts/create-admin.js owner@atticarch.com "MyStr0ngPass!"
 *
 * After it succeeds, make sure the SAME email is listed in:
 *   - website/.env            → VITE_ADMIN_EMAILS=owner@atticarch.com
 *   - website/firestore.rules → bootstrapAdmins() returns ['owner@atticarch.com']
 *
 * Requires the Email/Password sign-in provider to be enabled in the Firebase
 * console (Authentication → Sign-in method → Email/Password → Enable).
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Args ──
const [, , email, password] = process.argv
if (!email || !password) {
  console.error('\n  Usage: node scripts/create-admin.js <email> <password>\n')
  process.exit(1)
}
if (password.length < 6) {
  console.error('\n  Password must be at least 6 characters.\n')
  process.exit(1)
}

// ── Load .env manually (no dotenv dependency) ──
const envFile = readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
const env = {}
envFile.split('\n').forEach((line) => {
  const t = line.trim()
  if (!t || t.startsWith('#')) return
  const i = t.indexOf('=')
  if (i === -1) return
  env[t.slice(0, i)] = t.slice(i + 1)
})

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

console.log(`\n  Creating admin user on project: ${firebaseConfig.projectId}`)
console.log(`  Email: ${email}\n`)

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

try {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  console.log(`  ✅ Admin user created successfully (uid: ${cred.user.uid}).`)
  console.log(`\n  You can now log in at /admin with this email + password.`)
  console.log(`  Make sure this email is in VITE_ADMIN_EMAILS and firestore.rules bootstrapAdmins().\n`)
  process.exit(0)
} catch (err) {
  const code = err?.code || ''
  if (code === 'auth/email-already-in-use') {
    console.error(`  ⚠️  An account with ${email} already exists. Use the Firebase console to reset its password instead.`)
  } else if (code === 'auth/operation-not-allowed') {
    console.error(`  ⚠️  Email/Password sign-in is disabled. Enable it: Firebase console → Authentication → Sign-in method → Email/Password.`)
  } else if (code === 'auth/weak-password') {
    console.error(`  ⚠️  Password too weak — use at least 6 characters.`)
  } else {
    console.error(`  ❌ Failed: ${err?.message || err}`)
  }
  process.exit(1)
}
