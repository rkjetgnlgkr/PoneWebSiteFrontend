# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Build for production (static SPA)
npm run generate   # Generate static files
```

## Architecture

**Tech stack**: Nuxt 2 SPA (ssr: false, target: static) · Vue 2 · Element UI · @nuxtjs/axios · Vuex

**Routes**:
- `/login` — uses `login` layout (full-screen gradient background)
- `/portfolio` — uses `default` layout (collapsible sidebar + header)
- `/` — empty index page, immediately redirected by auth middleware

**Auth flow**: `middleware/auth.js` fires on every route change → restores Vuex state from localStorage via `RESTORE_AUTH` → redirects unauthenticated users to `/login`, or authenticated users away from `/login` to `/portfolio`. Axios interceptor in `plugins/axios.js` attaches `Authorization: Bearer <token>` to every request and handles 401 by calling `CLEAR_AUTH` and redirecting to login.

**Vuex store** (`store/index.js`): holds `token` and `username`. Persisted to localStorage via `SET_AUTH`/`CLEAR_AUTH` mutations. `nuxtClientInit` action restores state on app boot.

**PortfolioModal** (`components/PortfolioModal.vue`): shared for both create and edit. Controlled via `value` prop (v-model for visibility) and `editData` prop (null = create mode, object = edit mode). Image upload uses `el-upload` with `auto-upload: false` — files are held locally and only uploaded to `POST /files` at save time, then paths are included in the portfolio payload.

**Image URLs** (`pages/portfolio/index.vue` → `getImageUrl()`): handles both relative paths returned by the backend (`/api/files/...`) by prepending `http://localhost:8080`, and absolute URLs left as-is.

## Key Configuration

`nuxt.config.js`:
- `axios.baseURL`: `http://localhost:8080/api` — change this for different environments
- `router.middleware: ['auth']` — auth guard is global, applied to all routes
- Element UI registered via `plugins/element-ui.js` with default size `medium`

## API Contract

The frontend expects these backend endpoints at the configured baseURL:

| Method | Path | Usage |
|--------|------|-------|
| POST | `/auth/login` | Returns `{ data: { token, username } }` |
| POST | `/auth/register` | Register new user |
| GET | `/portfolios` | Returns `{ data: [...] }` array |
| POST | `/portfolios` | Create portfolio |
| PUT | `/portfolios/{id}` | Update portfolio |
| DELETE | `/portfolios/{id}` | Delete portfolio |
| POST | `/files` | Multipart upload, returns `{ data: ['/api/files/uuid.ext', ...] }` |

All responses follow the `Result<T>` wrapper: `{ code, message, data }`.
