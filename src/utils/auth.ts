export const storeTokens = (accessToken: string, refreshToken: string) => {
    const expiration = Date.now() + 3600 * 1000;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("access_token_expiration", expiration.toString());
  };
  
  export const getAccessToken = async (): Promise<string | null> => {
    const accessToken = localStorage.getItem("access_token");
    const expiration = localStorage.getItem("access_token_expiration");
    const refreshToken = localStorage.getItem("refresh_token");
  
    const isExpired = !expiration || Date.now() > parseInt(expiration);
  
    if (accessToken && !isExpired) {
      return accessToken;
    }
  
    if (refreshToken) {
      try {
        const res = await fetch(`http://127.0.0.1:8888/refresh_token?refresh_token=${refreshToken}`);
        const data = await res.json();
        if (data.access_token) {
          storeTokens(data.access_token, refreshToken);
          return data.access_token;
        }
      } catch (err) {
        console.error("❌ Error al refrescar token:", err);
      }
    }
  
    return null;
  };
  