/**
 * Configuração do painel administrativo
 */

// Hash da rota admin (configurável via env)
export const ADMIN_ROUTE_HASH =
  process.env.ADMIN_ROUTE_HASH || "admin-dashboard-2026";

// Credenciais de admin (em produção, use banco de dados)
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  // Senha em produção deve vir do .env (hash bcrypt)
  passwordHash:
    process.env.ADMIN_PASSWORD_HASH ||
    "$2a$10$rQZ0qJxZxZxZxZxZxZxZxuKqJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0qJ0q", // senha: admin123
};

// Cookie de autenticação
export const AUTH_COOKIE_NAME = "cacau_admin_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24; // 24 horas
