import { logout } from "../store/slices/authSlice";
import { type TokenPayload } from "../types";

interface Store {
  getState: () => {
    auth: {
      token: string | null;
    };
  };
  dispatch: (action: unknown) => void;
}

class TokenService {
  private logoutCallbacks: (() => void)[] = [];
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  // Add callback for logout events
  onLogout(callback: () => void): void {
    this.logoutCallbacks.push(callback);
  }

  // Remove callback
  removeOnLogout(callback: () => void): void {
    this.logoutCallbacks = this.logoutCallbacks.filter((cb) => cb !== callback);
  }

  // Trigger all logout callbacks
  triggerLogout(): void {
    this.logoutCallbacks.forEach((callback) => callback());
  }

  // Start token expiration monitoring
  startTokenMonitoring(store: Store): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check token every minute
    this.checkInterval = setInterval(() => {
      const state = store.getState();
      const token = state.auth.token;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
          const currentTime = Date.now() / 1000;

          // If token expires in less than 5 minutes, warn user
          if (payload.exp - currentTime < 300) {
            console.warn("Token will expire soon");
            this.showTokenExpiryWarning(payload.exp - currentTime);
          }

          // If token is expired, logout
          if (payload.exp < currentTime) {
            console.warn("Token expired, logging out...");
            store.dispatch(logout());
            this.triggerLogout();
          }
        } catch (error) {
          console.error("Error checking token expiration:", error);
        }
      }
    }, 60000);
  }

  // Stop token monitoring
  stopTokenMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Show warning to user about token expiry
  private showTokenExpiryWarning(secondsUntilExpiry: number): void {
    const minutes = Math.ceil(secondsUntilExpiry / 60);

    console.warn(`Your session will expire in ${minutes} minutes`);

    // Example: Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Session Expiry Warning", {
        body: `Your session will expire in ${minutes} minutes. Please save your work.`,
        icon: "/favicon.ico",
      });
    }
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem("token");
    sessionStorage.clear();
    this.triggerLogout();
  }

  // Check if token is valid
  isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // Get token payload
  getTokenPayload(token: string): TokenPayload | null {
    try {
      return JSON.parse(atob(token.split(".")[1])) as TokenPayload;
    } catch {
      return null;
    }
  }
}

export const tokenService = new TokenService();
