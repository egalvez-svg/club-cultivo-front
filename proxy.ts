import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy
 * Replaces middleware.ts to act as a network boundary and routing layer.
 */
export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isSelectRolePage = request.nextUrl.pathname === "/auth/select-role";
    const isChangePasswordPage = request.nextUrl.pathname === "/auth/change-password";

    // Si no hay token y no es una página de auth, redirigir al login
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Si hay token e intenta entrar al login/register (pero NO a select-role ni change-password), redirigir al dashboard
    if (token && isAuthPage && !isSelectRolePage && !isChangePasswordPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

// Configurar qué rutas deben activar el proxy
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - logo.png (public images)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)",
    ],
};
