# ATTICARCH Website — Mobile OTP & Cloudinary Pricing Guide

> Prepared 11 June 2026. Currency conversions use ~₹85 per USD; check the live
> rate when budgeting. All prices are from the official Firebase / Google Cloud
> and Cloudinary pricing pages on this date.

---

## 1. Mobile OTP (Firebase Phone Authentication)

### Current status — tested live on 11 June 2026

The OTP code on the contact form is **fully built and deployed**, but sending
SMS is **blocked by the Firebase plan**, not by the code. A live test on
dist-woad-six-84.vercel.app returned:

```
FirebaseError: auth/billing-not-enabled
```

This means the Firebase project (`atticarch-b1994`) is on the free **Spark**
plan, and Google does not allow Phone Auth SMS on the free plan. The site
handles this gracefully today: the visitor sees *"SMS verification is
momentarily unavailable — tap Book Consultation; our team will call you back"*
and the lead is still saved (marked `verified: false`).

### What it takes to switch OTP on

1. Open [Firebase Console → atticarch-b1994 → Upgrade](https://console.firebase.google.com/project/atticarch-b1994/usage/details)
   and upgrade from **Spark** to **Blaze (pay-as-you-go)**. This needs a
   credit/debit card on a Google Cloud billing account.
2. In **Authentication → Sign-in method**, confirm the **Phone** provider is
   enabled.
3. That's it — **no code changes needed**. The form will immediately start
   sending real OTP SMS.

### What it costs

Blaze has **no monthly fee** — you pay only for what you use.

| Item | Price |
|---|---|
| SMS to **India** numbers | **~$0.01 per SMS** (~₹0.85) |
| Free allowance | First **10 SMS/day** are not billed |
| SMS to other countries | $0.02–$0.06 per SMS (only matters for NRI enquiries) |
| Everything else the site uses (Firestore reads/writes, Auth logins) | Stays within Blaze's free monthly quotas at current traffic — effectively ₹0 |

**Monthly cost estimates (India numbers, after the 10/day free allowance):**

| Verified leads per month | Approx. SMS sent* | Cost |
|---|---|---|
| 100 | ~150 | **~₹130 ($1.50)** |
| 300 | ~450 | **~₹380 ($4.50)** |
| 1,000 | ~1,500 | **~₹1,275 ($15)** |

\* assumes ~1.5 SMS per lead (some users tap "Resend"). With the 10-free-per-day
allowance, a typical month of 100–200 leads may cost **close to nothing**.

### Abuse protection already in place

- The form limits each phone number to **3 OTP requests per 24 hours**.
- Firebase enforces its own server-side rate limits per device/IP.
- Recommended later (free): enable **Firebase App Check** so only your website
  can trigger SMS — this prevents bots from running up your SMS bill.

### Bottom line

> Upgrading to Blaze costs nothing per month by itself; at your lead volume
> OTP will cost **roughly ₹100–₹400/month**. The risk of staying on Spark is
> zero functional loss today (the fallback works), but leads are unverified,
> so the sales team may waste calls on wrong numbers.

---

## 2. Cloudinary (image hosting/CDN)

### Current plan

The site uses Cloudinary cloud `dwuagshuj` on the **Free plan**.

### How Cloudinary billing works — "credits"

Every plan gives a monthly pool of **credits**. 1 credit =

- **1 GB of storage**, OR
- **1 GB of bandwidth** (images viewed by visitors), OR
- **1,000 transformations** (resizing/cropping operations), OR
- 500 seconds of SD video processing / 250 seconds of HD

Usage across all four is added together against your pool. Track it anytime at
**Cloudinary Console → Dashboard → Usage**.

### Plans & exact prices

| Plan | Price (monthly) | Price (paid yearly) | Credits/month | Users | Notable extras |
|---|---|---|---|---|---|
| **Free** (current) | $0 | $0 | **25** | 3 | Upload widget, API, transformations |
| **Plus** | **$99/mo** (~₹8,400) | $89/mo (~₹7,560) | **225** | 3 | S3 backup, auto-tagging, faster support, 2:1 video bandwidth boost |
| **Advanced** | **$249/mo** (~₹21,200) | $224/mo (~₹19,000) | **600** | 5 | Custom domain (images served from your own URL), SSL options |
| **Enterprise** | Custom quote | — | Custom | — | Multi-CDN, SSO, success manager |

### What 25 free credits actually means for ATTICARCH

The pool is shared, so for example the free plan covers any mix like:

- **10 GB stored images + 10 GB monthly visitor bandwidth + 5,000 transformations**, or
- 20 GB stored + 4 GB bandwidth + 1,000 transformations

A portfolio site like yours typically stores 1–3 GB of project photos. The real
variable is **bandwidth** — it grows with site traffic. Rough guide: every
~3,000 page views of image-heavy pages ≈ 5–8 GB bandwidth.

### When would you need to pay?

| Situation | Recommendation |
|---|---|
| Today (~10 projects, modest traffic) | **Free plan is enough** |
| Portfolio grows past ~15 GB of photos or traffic passes ~10k visits/month | Watch the dashboard; you'll start nearing 25 credits |
| Consistently over 25 credits | **Plus at $99/mo** (225 credits = ~9× headroom) |
| Want images served from `images.atticarch.com` | Advanced at $249/mo (custom domain is the main reason to go this high) |

> ⚠️ There is **no in-between plan**: the jump is $0 → $99. Before paying,
> reduce usage for free by uploading photos pre-compressed (the site already
> requests auto-format/auto-quality, which keeps bandwidth low).

### Bottom line

> **Stay on the Free plan for now.** Check Dashboard → Usage monthly; budget
> **$99/month (~₹8,400)** only when usage repeatedly crosses 25 credits.

---

## Quick summary

| Service | Today | To upgrade | Monthly cost after upgrade |
|---|---|---|---|
| Firebase OTP | Not working (free plan blocks SMS) | Upgrade project to Blaze, add card | ~₹100–₹400 at current lead volume (pay-per-SMS, ~₹0.85 each, 10/day free) |
| Cloudinary | Working, Free plan, 25 credits | Only if usage exceeds 25 credits | $99 (~₹8,400) for Plus / 225 credits |

**Sources:** [Firebase pricing](https://firebase.google.com/pricing) ·
[Identity Platform SMS rates](https://cloud.google.com/identity-platform/pricing) ·
[Cloudinary pricing](https://cloudinary.com/pricing) ·
[Cloudinary credit definition](https://cloudinary.com/documentation/developer_onboarding_faq_credits)
