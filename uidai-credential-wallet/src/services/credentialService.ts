import type { Credential } from "../types/credential";
import mockCredentials from "../data/mockCredentials";

export async function fetchCredentials(): Promise<Credential[]> {
  try {
    const response = await fetch("/api/credentials", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load credentials. Server returned ${response.status}.`,
      );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("The credentials API returned invalid data.");
    }

    return data as Credential[];
  } catch (error: unknown) {
    console.error("API request failed:", error);

    // Re-throw so Redux can set error and show role="alert"
    // Do NOT: return mockCredentials;
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to load credentials");
  }
}

/** Optional helper for Storybook / local demos only — not used by the thunk */
export function getMockCredentials(): Credential[] {
  return mockCredentials;
}