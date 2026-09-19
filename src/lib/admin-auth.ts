import { getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

export const OWNER_ADMIN_EMAIL = "homespanaz@gmail.com";

const SESSION_KEY = "spanaz-admin-session-v1";

export type AdminSession = {
  email: string;
  localId: string;
  idToken: string;
  refreshToken: string;
  expiresAt: number;
};

type SignInResponse = {
  email?: string;
  localId?: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  error?: { message?: string };
};

type LookupResponse = {
  users?: Array<{ email?: string; emailVerified?: boolean; localId?: string }>;
  error?: { message?: string };
};

type RefreshResponse = {
  id_token?: string;
  refresh_token?: string;
  user_id?: string;
  expires_in?: string;
  error?: { message?: string };
};

const FIREBASE_MANAGED_REFRESH_TOKEN = "firebase-managed";

function getApiKey() {
  const apiKey = import.meta.env["VITE_FIREBASE_API_KEY"]?.trim();
  if (!apiKey) throw new Error("Firebase authentication is not configured.");
  return apiKey;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function authUrl(path: string) {
  return (
    "https://identitytoolkit.googleapis.com/v1/" +
    path +
    "?key=" +
    encodeURIComponent(getApiKey())
  );
}

function friendlyAuthError(code: string | undefined) {
  switch (code) {
    case "INVALID_LOGIN_CREDENTIALS":
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
      return "Email or password is incorrect.";
    case "USER_DISABLED":
      return "This owner account has been disabled.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many login attempts. Please try again later.";
    case "OPERATION_NOT_ALLOWED":
      return "Email/password login is not enabled in Firebase Authentication.";
    default:
      return code ? code.replaceAll("_", " ").toLowerCase() : "Authentication failed.";
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T;
  if (!response.ok) {
    const code = (payload as { error?: { message?: string } }).error?.message;
    throw new Error(friendlyAuthError(code));
  }
  return payload;
}

function saveSession(session: AdminSession) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

async function getFirebaseOwnerSession(): Promise<AdminSession | null> {
  if (typeof window === "undefined" || getApps().length === 0) return null;

  const user = getAuth(getApp()).currentUser;
  if (!user) return null;

  await user.reload();
  if (normalizeEmail(user.email ?? "") !== OWNER_ADMIN_EMAIL || !user.emailVerified) {
    return null;
  }

  const tokenResult = await user.getIdTokenResult();
  const session: AdminSession = {
    email: OWNER_ADMIN_EMAIL,
    localId: user.uid,
    idToken: tokenResult.token,
    refreshToken: FIREBASE_MANAGED_REFRESH_TOKEN,
    expiresAt: new Date(tokenResult.expirationTime).getTime(),
  };
  saveSession(session);
  return session;
}

export function clearAdminSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (
      typeof parsed.email !== "string" ||
      typeof parsed.localId !== "string" ||
      typeof parsed.idToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.expiresAt !== "number"
    ) {
      clearAdminSession();
      return null;
    }
    return parsed as AdminSession;
  } catch {
    clearAdminSession();
    return null;
  }
}

async function lookupAccount(idToken: string) {
  const response = await fetch(authUrl("accounts:lookup"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return readJson<LookupResponse>(response);
}

export async function sendVerificationEmail(idToken: string) {
  const response = await fetch(authUrl("accounts:sendOobCode"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ requestType: "VERIFY_EMAIL", idToken }),
  });
  await readJson<Record<string, unknown>>(response);
}

export async function sendOwnerPasswordReset(email: string) {
  const normalized = normalizeEmail(email);
  if (normalized !== OWNER_ADMIN_EMAIL) {
    throw new Error("This email is not configured as the SpaNaz owner account.");
  }

  const response = await fetch(authUrl("accounts:sendOobCode"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ requestType: "PASSWORD_RESET", email: normalized }),
  });
  await readJson<Record<string, unknown>>(response);
}

export async function signInOwner(email: string, password: string): Promise<AdminSession> {
  const normalized = normalizeEmail(email);
  if (normalized !== OWNER_ADMIN_EMAIL) {
    throw new Error("This email is not configured as the SpaNaz owner account.");
  }

  const response = await fetch(authUrl("accounts:signInWithPassword"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: normalized,
      password,
      returnSecureToken: true,
    }),
  });
  const payload = await readJson<SignInResponse>(response);

  if (!payload.idToken || !payload.refreshToken || !payload.localId) {
    throw new Error("Firebase did not return a complete owner session.");
  }

  const lookup = await lookupAccount(payload.idToken);
  const account = lookup.users?.[0];
  const accountEmail = normalizeEmail(account?.email ?? "");

  if (accountEmail !== OWNER_ADMIN_EMAIL) {
    throw new Error("This Firebase account is not authorized for SpaNaz administration.");
  }

  if (!account?.emailVerified) {
    await sendVerificationEmail(payload.idToken).catch(() => undefined);
    throw new Error(
      "Verify the owner email first. A new verification email has been requested.",
    );
  }

  const expiresIn = Number(payload.expiresIn ?? "3600");
  const session: AdminSession = {
    email: accountEmail,
    localId: payload.localId,
    idToken: payload.idToken,
    refreshToken: payload.refreshToken,
    expiresAt: Date.now() + Math.max(60, expiresIn) * 1000,
  };

  saveSession(session);
  return session;
}

async function refreshAdminSession(session: AdminSession): Promise<AdminSession> {
  const response = await fetch(
    "https://securetoken.googleapis.com/v1/token?key=" + encodeURIComponent(getApiKey()),
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
      }),
    },
  );

  const payload = await readJson<RefreshResponse>(response);
  if (!payload.id_token || !payload.refresh_token) {
    throw new Error("Could not refresh the owner session.");
  }

  const expiresIn = Number(payload.expires_in ?? "3600");
  const refreshed: AdminSession = {
    ...session,
    localId: payload.user_id ?? session.localId,
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Math.max(60, expiresIn) * 1000,
  };
  saveSession(refreshed);
  return refreshed;
}

export async function getValidAdminSession(): Promise<AdminSession | null> {
  const session = getStoredAdminSession();
  if (!session || normalizeEmail(session.email) !== OWNER_ADMIN_EMAIL) {
    clearAdminSession();
    return getFirebaseOwnerSession().catch(() => null);
  }

  if (session.expiresAt - Date.now() > 2 * 60 * 1000) return session;

  try {
    if (session.refreshToken === FIREBASE_MANAGED_REFRESH_TOKEN) {
      return await getFirebaseOwnerSession();
    }
    return await refreshAdminSession(session);
  } catch {
    clearAdminSession();
    return getFirebaseOwnerSession().catch(() => null);
  }
}
