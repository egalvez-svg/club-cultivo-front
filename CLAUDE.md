# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Next.js 16, hot reload)
npm run build     # Production build (also runs type checking)
npm run lint      # ESLint (flat config, eslint-config-next)
npm start         # Start production server
```

No test runner is configured.

## Architecture

**Next.js 16 App Router** application for a cannabis club management platform (Club Cultivo). Multi-tenant with per-organization RBAC.

### Stack
- Next.js 16 + React 19 + React Compiler (babel-plugin-react-compiler)
- Tailwind CSS v4 (PostCSS plugin, not legacy config file)
- TanStack React Query v5 for server state
- Framer Motion for animations
- Lucide React for icons
- Sileo for toast notifications
- `clsx` + `tailwind-merge` for class composition

### Path Alias
`@/*` maps to project root (e.g., `@/lib/services/auth`).

### Route Protection
`proxy.ts` (Next.js 16 replacement for middleware.ts) handles auth redirects:
- Unauthenticated users → `/auth/login`
- Authenticated users on auth pages → `/dashboard`
- Exception: `/auth/select-role` is accessible when authenticated

### Authentication
- JWT tokens stored in cookies: `auth_token` (access) + `refresh_token`
- User profile cached in `localStorage` as `auth_user`, active role as `active_role`
- `context/auth-context.tsx` manages auth state, session timers, token refresh
- Session warning with countdown before auto-logout

### API Communication Pattern
Three-layer pattern used consistently:

1. **Service** (`lib/services/*.ts`): Raw fetch calls with Bearer token
2. **Hook** (`lib/hooks/use*.ts`): React Query wrapper around the service
3. **Page/Component**: Consumes the hook

```
Page → useHook() → service.method(token) → fetch(API_URL/endpoint)
```

API base URL: `process.env.NEXT_PUBLIC_API_URL`

Services: auth, user, role, organization, product, strain, lot, patient, dispensation, dashboard, report, cash-register.

### RBAC System
- Users can have multiple roles across organizations
- Roles: ADMIN, OPERARIO, BUDTENDER, CULTIVATOR, PATIENT, DOCTOR
- Per-organization role management at `/organizations/[id]/roles`
- Superadmin users see org-first selection flow at `/auth/select-role`
- Role enum translations in `lib/utils/mappers.ts`

### Code Organization
```
app/                    # Next.js App Router pages
  auth/                 # Login, register, forgot/reset password, role selection
  dashboard/            # Main dashboard with KPI metrics
  organizations/        # Multi-tenant org management
  users/, products/, strains/, lots/, patients/
  dispensations/, finance/, reports/
components/             # Shared UI (header, sidebar, providers, session-warning)
modules/                # Feature modules, each with components/ subdirectory
  dashboard/, organizations/, users/, products/, strains/
  lots/, patients/, dispensations/, finance/, roles/, reports/
context/                # React contexts (auth-context, ui-context)
lib/
  services/             # API service functions (fetch-based)
  hooks/                # React Query hooks wrapping services
  utils/                # Mappers, helpers
.agents/rules/          # Next.js best practices reference docs
```

### State Management
- **Server state**: React Query (staleTime: 60s, retry: 1, no retry on 403)
- **Auth state**: AuthContext (user, token, activeRole, session timers)
- **UI state**: UIContext (sidebar collapse, mobile menu)

### Key Conventions
- Spanish-language UI with enum translations via mappers
- React Query keys follow `["resource"]` or `["resource", id]` pattern
- All API mutations invalidate related query keys
- 403 errors get special handling (permission denied toasts, no retry)
- Root layout wraps app with AuthProvider → Providers (QueryClient + UIContext) → Sidebar + Header + content
