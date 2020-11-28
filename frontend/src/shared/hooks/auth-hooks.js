import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  const login = useCallback((uid, token, expiration) => {
    const tokenExpiration =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setUserId(uid);
    setToken(token);
    setTokenExpiration(tokenExpiration);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpiration(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpiration, logout]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    } else {
      logout();
    }
  }, [login, logout]);

  return { userId, token, login, logout };
};
