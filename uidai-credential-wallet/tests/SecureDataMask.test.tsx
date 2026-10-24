
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    act,
    cleanup,
    fireEvent,
    render,
    screen,
} from "@testing-library/react";

import SecureDataMask from "../src/components/SecureDataMask";

describe("SecureDataMask", () => {
    const credentialNumber = "1234-5678-9012";
    const maskedNumber = "XXXXXXXXXX9012";

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("masks the credential by default", () => {
        render(
            <SecureDataMask
                value={credentialNumber}
                revealDuration={10_000}
                label="Credential number"
            />
        );

        const output = screen.getByLabelText(
            "Credential number value"
        );

        expect(output.textContent).toBe(maskedNumber);
        expect(output.textContent).not.toBe(credentialNumber);

        expect(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        ).toBeTruthy();
    });

    it("reveals the credential when the button is clicked", () => {
        render(
            <SecureDataMask
                value={credentialNumber}
                label="Credential number"
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        );

        const output = screen.getByLabelText(
            "Credential number value"
        );

        const hideButton = screen.getByRole("button", {
            name: /hide credential number/i,
        });

        expect(output.textContent).toBe(credentialNumber);
        expect(hideButton.getAttribute("aria-pressed")).toBe("true");
    });

    it("re-masks the credential after 10 seconds", () => {
        vi.useFakeTimers();

        render(
            <SecureDataMask
                value={credentialNumber}
                label="Credential number"
                revealDuration={10_000}
            />
        );

        const output = screen.getByLabelText(
            "Credential number value"
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        );

        expect(output.textContent).toBe(credentialNumber);

        act(() => {
            vi.advanceTimersByTime(9_999);
        });

        expect(output.textContent).toBe(credentialNumber);

        act(() => {
            vi.advanceTimersByTime(1);
        });

        expect(output.textContent).toBe(maskedNumber);

        expect(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        ).toBeTruthy();
    });

    it("hides the credential immediately when Hide is clicked", () => {
        render(
            <SecureDataMask
                value={credentialNumber}
                label="Credential number"
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        );

        expect(
            screen.getByLabelText("Credential number value").textContent
        ).toBe(credentialNumber);

        fireEvent.click(
            screen.getByRole("button", {
                name: /hide credential number/i,
            })
        );

        expect(
            screen.getByLabelText("Credential number value").textContent
        ).toBe(maskedNumber);
    });

    it("announces reveal and hide state changes", () => {
        const { container } = render(
            <SecureDataMask
                value={credentialNumber}
                label="Credential number"
            />
        );

        const status = container.querySelector(
            '[aria-live="polite"]'
        );

        expect(status).not.toBeNull();

        fireEvent.click(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        );

        expect(status?.textContent).toContain(
            "Credential number revealed."
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /hide credential number/i,
            })
        );

        expect(status?.textContent).toContain(
            "Credential number hidden."
        );
    });

    it("cleans up timers when the component unmounts", () => {
        vi.useFakeTimers();

        const clearIntervalSpy = vi.spyOn(
            window,
            "clearInterval"
        );

        const clearTimeoutSpy = vi.spyOn(
            window,
            "clearTimeout"
        );

        const { unmount } = render(
            <SecureDataMask
                value={credentialNumber}
                label="Credential number"
                revealDuration={10_000}
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /reveal credential number/i,
            })
        );

        unmount();

        // Supports either a countdown interval or a timeout implementation.
        expect(
            clearIntervalSpy.mock.calls.length +
            clearTimeoutSpy.mock.calls.length
        ).toBeGreaterThan(0);
    });
});
