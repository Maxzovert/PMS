import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'parkar_session_token';

export async function getSessionToken() {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

export async function setSessionToken(token) {
  if (!token) {
    await clearSessionToken();
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function clearSessionToken() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {
    // ignore missing key
  }
}
