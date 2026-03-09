# FlowDesk 🚀

A modern, full-stack SaaS productivity dashboard built with **Nuxt 4**, 
**Supabase**, and **Tailwind CSS**. Users can manage projects, track tasks, 
view analytics, and manage their workspace.

> 🔗 **Live Demo:** [flowdesk.vercel.app](https://flowdesk.vercel.app) *(coming soon)*

---

## Screenshots

> *(coming soon)*

| Dashboard | Projects | Tasks |
|-----------|----------|-------|
| ![Dashboard](public/images/screenshot-dashboard.png) | ![Projects](public/images/screenshot-projects.png) | ![Tasks](public/images/screenshot-tasks.png) |

---

## Features

- 🔐 **Authentication** — Secure login and signup with Supabase Auth
- 📊 **Dashboard** — KPI cards, activity feed, weekly progress
- 📁 **Project Manager** — Create and manage projects with color labels
- ✅ **Task Manager** — Create, update, and complete tasks with priorities
- 📈 **Analytics** — Visual charts for productivity tracking
- ⚙️ **Settings** — Profile management and subscription status
- 🌙 **Dark Theme** — Fully dark, modern UI design
- 📱 **Responsive** — Works on desktop and mobile

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Nuxt 3](https://nuxt.com) | Full-stack Vue framework (SSR + routing) |
| [Supabase](https://supabase.com) | Authentication + PostgreSQL database |
| [Nuxt UI](https://ui.nuxt.com) | Component library built on Tailwind CSS |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Pinia](https://pinia.vuejs.org) | State management |
| [Vue Chart.js](https://vue-chartjs.org) | Analytics charts |
| [Vercel](https://vercel.com) | Deployment and hosting |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- A free [Supabase](https://supabase.com) account

### Installation
```bash
# Clone the repository
git clone https://github.com/YOURUSERNAME/flowdesk.git
cd flowdesk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key to .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the project root:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

---

## Project Structure
```
flowdesk/
├── pages/                  # File-based routing
│   ├── index.vue           # Redirects to dashboard
│   ├── login.vue           # Authentication
│   ├── signup.vue
│   └── dashboard/
│       ├── index.vue       # Main dashboard
│       ├── projects.vue
│       ├── tasks.vue
│       ├── analytics.vue
│       └── settings.vue
├── components/             # Reusable UI components
│   ├── AppSidebar.vue
│   └── AppTopbar.vue
├── layouts/                # Page layout wrappers
│   └── dashboard.vue
├── composables/            # Reusable logic
├── stores/                 # Pinia state management
├── server/api/             # Backend API routes
└── types/                  # TypeScript definitions
```

---

## Deployment

This project is deployed on Vercel. To deploy your own instance:
```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## License

MIT License — feel free to use this project as a reference or template.

---

## Author

**Johnnyngare** — (https://github.com/Johnnyngare)