# Deal Drop – Smart Price Tracker
✨ **Live Demo → [🔗 https://deal-drop-rho.vercel.app](https://deal-drop-rho.vercel.app)** ✨

Deal Drop is a full-stack web application that tracks product prices from any e-commerce website and automatically notifies users via email when prices drop. It includes secure authentication, automated background price monitoring, and price history visualization.

---

## 🚀 Features

- Track prices from any e-commerce product URL  
- Automatic price drop detection  
- Email alerts on price decreases  
- Interactive price history charts  
- Google authentication  
- Secure, user-specific data access (RLS)  
- Automated scheduled price checks  

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- shadCN UI

**Backend**
- Supabase (PostgreSQL, Authentication, Row-Level Security)

**Scraping**
- Firecrawl API

**Email Notifications**
- Resend API

**Charts**
- Recharts

**Deployment**
- Vercel

---

## 🧠 How It Works

1. User signs in using Google authentication.
2. A product URL is submitted for tracking.
3. Product details (price, name, image, currency) are extracted using Firecrawl.
4. Data is stored securely in Supabase.
5. A scheduled job periodically checks prices.
6. If a price drop is detected:
   - Price history is updated.
   - An email alert is sent to the user.
7. Users can view price trends via interactive charts.

---

## 🗄 Database Schema

### Products
- `id`
- `user_id`
- `url`
- `name`
- `current_price`
- `currency`
- `image_url`
- `created_at`

### Price History
- `id`
- `product_id`
- `price`
- `currency`
- `checked_at`

Row-Level Security ensures users can only access their own data.

---

## 🔐 Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

FIRECRAWL_API_KEY=

RESEND_API_KEY=

CRON_SECRET=
