import { useCallback, useState } from "react";
import {
  loginApi,
  type LoginPayload,
  type AuthSession,
} from "../api/authApi";
import useAuthStore, {
  type AuthUser,
  type AuthTokens,
} from "../../../app/store/authStore";

type UseLoginOptions = {
  onSuccess?: (session: AuthSession) => void;
  onError?: (message: string) => void;
};

type UseLoginResult = {
  login: (payload: LoginPayload) => Promise<AuthSession | null>;
  isLoading: boolean;
  error: string;
  clearError: () => void;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Login failed. Please try again.";
}

export default function useLogin(
  options?: UseLoginOptions,
): UseLoginResult {
  const loginToStore = useAuthStore((state) => state.login);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<AuthSession | null> => {
      setIsLoading(true);
      setError("");

      try {
        const session = await loginApi(payload);

        const safeUser: AuthUser = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          phone: session.user.phone,
          avatar: session.user.avatar,
          role: session.user.role,
        };

        const safeTokens: AuthTokens | null = session.tokens
          ? {
              accessToken: session.tokens.accessToken,
              refreshToken: session.tokens.refreshToken,
            }
          : null;

        const normalizedSession: AuthSession = {
          user: safeUser,
          tokens: safeTokens,
        };

        loginToStore({
          user: normalizedSession.user,
          tokens: normalizedSession.tokens,
        });

        options?.onSuccess?.(normalizedSession);
        return normalizedSession;
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        setError(message);
        options?.onError?.(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loginToStore, options],
  );

  return {
    login,
    isLoading,
    error,
    clearError,
  };
}