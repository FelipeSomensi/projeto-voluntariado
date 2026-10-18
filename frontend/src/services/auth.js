const TOKEN_KEY = 'token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Lê o payload do token (email, role, exp).
 * Só decodifica: quem valida a assinatura é o back-end.
 */
export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    if (payload.exp * 1000 < Date.now()) {
      logout();
      return null;
    }
    return payload;
  } catch {
    logout();
    return null;
  }
}

export function isAdmin() {
  return getUser()?.role === 'admin';
}