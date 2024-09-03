import { useEffect, useState } from 'react';
import {jwtDecode}  from 'jwt-decode';

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  return { user };
}
