```text
    _    ____   ____ ___ ___       ____ ____      _    __  __        ___   ___  _ 
   / \  / ___| / ___|_ _|_ _|     / ___|  _ \    / \  |  \/  |      / _ \ / _ \/ |
  / _ \ \___ \| |    | | | |_____| |  _| |_) |  / _ \ | |\/| |_____| | | | | | | |
 / ___ \ ___) | |___ | | | |_____| |_| |  _ <  / ___ \| |  | |_____| |_| | |_| | |
/_/   \_\____/ \____|___|___|     \____|_| \_\/_/   \_\_|  |_|      \___/ \___/|_|
 ╔════════════════════════════════════════════════════════════════╗
 ║                  Welcome to ASCII.SOCIAL v001.0                  ║
 ║  A retro-inspired social network where your art is text-based! ║
 ╚════════════════════════════════════════════════════════════════╝


 📜 **About**  
   ASCII.SOCIAL transforms every keystroke into pixel-perfect artistry.  
   Share your creativity, one character at a time.

 🚀 **Features**  
   • **Create & Publish** — Craft multiline ASCII art, from simple emoticons  
     to intricate illustrations, and post it for the world to admire.  
   • **Like & Comment** — React to others’ masterpieces with ❤️ or 💬,  
     and leave your thoughts directly in the thread.  
   • **Live Feed** — Dive into an ever-evolving stream of text-based art.  
   • **User Profiles** — Claim your unique handle (`@username`) and build  
     your ASCII identity.

 🛠 **Tech Stack**  
   • **Next.js** (App Router + Server Actions)  
   • **Prisma & NeonDB** for robust, lightning-fast storage  
   • **Date-fns** for human-friendly timestamps  
   • **Tailwind CSS** for sleek, neon-on-black terminal vibes

 🎮 **Getting Started**  
   1. **Clone** this repo  
   2. **Install** dependencies with `npm install`  
   3. **Configure** your `.env` with `DATABASE_URL` for NeonDB  
   4. **Run** `npx prisma migrate dev --name init`  
   5. **Launch** with `npm run dev` and surf ASCII.social!

 💡 **Tips & Tricks**  
   - Use monospace fonts to keep your art perfectly aligned.  
   - Explore the community feed for inspiration.  
   - Experiment with ASCII shading: `░▒▓█` for depth and drama.  

 📫 **Contribute & Feedback**  
   Pull requests, issues, and star ⭐ welcome!  
   Let’s build this ASCII universe together.  

   ## 📦 Tech Stack (in detail)

### 🚀 Frontend  
- **Next.js 15**  
  - App Router ( `/app` directory ), React Server & Client Components  
  - Server Actions (`"use server"`) for edge-efficient form handling  
  - `next/navigation`, `next/headers` & built-in fetch for data fetching & routing  
- **React 18**  
  - Hooks (`useState`, `useEffect`) for interactive state & effects  
  - Transition & streaming support under the hood  
- **TypeScript**  
  - Strict mode, path aliases (`@/lib`, `@/components`, etc.)  
  - Fully typed props, API responses & Prisma models  
- **Tailwind CSS v3**  
  - JIT engine for lightning-fast utility generation  
  - Custom terminal-style animations (typing, slide, blink)  
  - Dark, neon-green-on-black theme via utility classes  
- **PostCSS + Autoprefixer**  
  - CSS transformations & vendor prefixing  

### 🗄️ Backend & Data  
- **Prisma 6** (ORM)  
  - Schema-first modeling of `User`, `Post`, `Like`, `Comment`  
  - Migrations & type-safe client generated against NeonDB  
- **NeonDB (PostgreSQL)**  
  - Cloud-native, serverless Postgres  
  - Zero-downtime schema migrations & high-performance queries  
- **Next.js API Routes**  
  - Fully typed `route.ts` handlers under `app/api/...`  
  - Edge-compatible JSON and FormData parsing  
- **Cookie-based sessions** via `next/headers`  
  - `set-cookie` in Server Actions for `userId` session  
  - `cookies()` in routes & server components  

### 🔧 Utilities & Libraries  
- **date-fns**  
  - Human-friendly “time ago” formatting (`formatDistanceToNow`)  
  - Ukrainian locale support (`date-fns/locale/uk`)  
- **FormData API**  
  - Zero-JS-bundler overhead form submissions in Server Actions  
- **Math.random-based IDs**  
  - Lightweight unique IDs for mock data (fallback to real UUIDs possible)  

### 🛠️ Tooling & Workflow  
- **ESLint + Prettier** for consistent code style  
- **TypeScript** for end-to-end type safety  
- **Git + GitHub** for version control & collaboration  
- **VS Code** recommended, with official Next.js & Tailwind extensions  
- **npm / pnpm / yarn** (your choice) for package management  

---

🎉 This stack gives you the best of both worlds: **React interactivity** with **Next.js performance**, **Prisma reliability** with **NeonDB scale**, all wrapped in a **terminal-retro UX** powered by **Tailwind CSS**.  

---
Made with ☕ + 🖥️ + ❤️ by the ASCII.social team.
