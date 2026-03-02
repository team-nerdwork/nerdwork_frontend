/**
 * Utility to handle server action responses and check for 401 errors
 * Use this in client components when calling server actions
 */

import { signOut } from "next-auth/react";

type ActionResponse<T = unknown> = {
  success: boolean;
  status?: number;
  data?: T;
  message?: string;
};

/**
 * Check if a server action response indicates unauthorized access (401)
 * @param response - The response from a server action
 * @returns true if the response is a 401 error
 */
export function isUnauthorized<T = unknown>(
  response: ActionResponse<T>,
): boolean {
  return !response?.success && response?.status === 401;
}

/**
 * Handle server action response and redirect to signin if unauthorized
 * @param response - The response from a server action
 * @param onUnauthorized - Optional callback to execute before redirect
 * @returns true if unauthorized (and redirect initiated), false otherwise
 */
export function handleUnauthorized<T = unknown>(
  response: ActionResponse<T>,
  onUnauthorized?: () => void,
): boolean {
  if (isUnauthorized(response)) {
    console.log(
      "Unauthorized access detected, signing out and redirecting to signin",
    );

    // Execute callback if provided
    if (onUnauthorized) {
      onUnauthorized();
    }

    // Sign out to clear the session, then redirect to signin
    if (typeof window !== "undefined") {
      signOut({ callbackUrl: "/signin", redirect: true });
    }

    return true;
  }

  return false;
}
