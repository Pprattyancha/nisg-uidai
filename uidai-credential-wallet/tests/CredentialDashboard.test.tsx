import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import CredentialDashboard from "../src/components/CredentialDashboard";
import credentialReducer from "../src/store/credentialSlice";

const mockCredentials = [
  {
    id: "cred-001",
    type: "Identity Credential",
    issuer: "UIDAI Sandbox Demo",
    issuedAt: "2026-01-15",
    status: "Active",
    credentialNumber: "XXXXXXXXXX9012",
  },
  {
    id: "cred-002",
    type: "Address Credential",
    issuer: "Demo Verification Authority",
    issuedAt: "2026-03-10",
    status: "Active",
    credentialNumber: "XXXXXXXXXX9012",
  },
];

function renderDashboard(preloadedState?: Record<string, any>) {
  const store = configureStore({
    reducer: {
      credentials: credentialReducer,
    } as any,
    preloadedState: preloadedState as any,
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <CredentialDashboard />
      </Provider>
    ),
  };
}

describe("CredentialDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("displays loading while credentials are fetched", () => {
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>(() => {})
    );

    renderDashboard();

    expect(
      screen.getByRole("status").textContent ?? ""
    ).toMatch(/loading credentials/i);
  });

  it("displays credential cards when the API succeeds", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockCredentials,
    } as Response);

    renderDashboard();

    expect(
      await screen.findByRole("heading", {
        name: "Identity Credential",
      })
    ).toBeTruthy();

    expect(
      screen.getByRole("heading", {
        name: "Address Credential",
      })
    ).toBeTruthy();

    expect(
      screen.getByText(/2\s*credentials/i)
    ).toBeTruthy();

    expect(
      screen.getAllByRole("button", {
        name: /reveal credential number/i,
      })
    ).toHaveLength(2);
  });

  it("displays the empty state when no credentials are returned", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    } as Response);

    renderDashboard();

    await waitFor(() => {
      const status = screen.getByRole("status");

      expect(status.textContent ?? "").toContain(
        "No credentials are available yet."
      );
    });
  });

  it("displays an error when the API request fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(
      new Error("Network unavailable")
    );

    renderDashboard();

    const alert = await screen.findByRole("alert");

    expect(alert.textContent ?? "").toContain(
      "Network unavailable"
    );

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      })
    ).toBeTruthy();
  });

  it("retries the API request when Try again is clicked", async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(
        new Error("Network unavailable")
      )
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCredentials,
      } as Response);

    renderDashboard();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent ?? "").toContain("Network unavailable");

    const tryAgainButton = screen.getByRole("button", {
      name: /try again/i,
    });
    fireEvent.click(tryAgainButton);

    expect(
      await screen.findByRole("heading", {
        name: "Identity Credential",
      })
    ).toBeTruthy();

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("fetches credentials from the API when the dashboard mounts", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockCredentials,
    } as Response);

    renderDashboard();

    await screen.findByRole("heading", {
      name: "Identity Credential",
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/credentials",
        expect.objectContaining({
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })
      );
    });
  });
});