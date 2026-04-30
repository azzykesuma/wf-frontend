import { NextResponse } from "next/server";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type BackendLoginResponse = {
  accessToken?: unknown;
  access_token?: unknown;
  token?: unknown;
  user?: unknown;
  message?: unknown;
  error?: unknown;
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API_BASE_URL is not configured");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

function getAccessToken(payload: BackendLoginResponse) {
  const token = payload.accessToken ?? payload.access_token ?? payload.token;

  return typeof token === "string" && token.length > 0 ? token : null;
}

function getErrorMessage(payload: BackendLoginResponse, fallback: string) {
  const message = payload.message ?? payload.error;

  return typeof message === "string" && message.length > 0 ? message : fallback;
}

export async function POST(request: Request) {
  let credentials: { email?: unknown; password?: unknown };

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const username = typeof credentials.email === "string" ? credentials.email.trim() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  let apiBaseUrl: string;

  try {
    apiBaseUrl = getApiBaseUrl();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Authentication service is not configured." },
      { status: 500 },
    );
  }

  try {
    const backendResponse = await fetch(`${apiBaseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    const payload = (await backendResponse.json().catch(() => ({}))) as BackendLoginResponse;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          message: getErrorMessage(
            payload,
            backendResponse.status === 401
              ? "Invalid email or password."
              : "Unable to sign in.",
          ),
        },
        { status: backendResponse.status },
      );
    }

    const accessToken = getAccessToken(payload);

    if (!accessToken) {
      return NextResponse.json(
        { message: "Authentication response did not include an access token." },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      authenticated: true,
      user: payload.user ?? null,
    });

    response.cookies.set(SESSION_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to reach authentication service." },
      { status: 502 },
    );
  }
}
