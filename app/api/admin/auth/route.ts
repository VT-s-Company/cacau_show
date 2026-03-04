import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CREDENTIALS,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
} from "@/lib/admin-config";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e senha são obrigatórios" },
        { status: 400 },
      );
    }

    // Verificar credenciais
    if (username !== ADMIN_CREDENTIALS.username) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Em produção, verificar hash bcrypt
    // const isValidPassword = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);

    // Para desenvolvimento, aceitar senha simples
    const isValidPassword = password === "admin1cacau123";

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // Criar token de sessão (em produção, use JWT ou session store)
    const sessionToken = Buffer.from(
      `${username}:${Date.now()}:${Math.random()}`,
    ).toString("base64");

    // Criar resposta com cookie
    const response = NextResponse.json(
      { success: true, message: "Login realizado com sucesso" },
      { status: 200 },
    );

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 },
    );
  }
}

// Endpoint para logout
export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Logout realizado" },
    { status: 200 },
  );

  response.cookies.delete(AUTH_COOKIE_NAME);

  return response;
}

// Endpoint para verificar sessão
export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get(AUTH_COOKIE_NAME);

  if (!sessionToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}
