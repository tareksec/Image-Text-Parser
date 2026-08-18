import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/adminApi";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authApi.me();
      setUser(data.user);
      setError(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const data = await authApi.login(email, password);
      setUser(data.user);
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };
}
