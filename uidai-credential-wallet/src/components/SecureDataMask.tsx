import { useEffect, useRef, useState } from "react";

interface SecureDataMaskProps {
    value: string;
    revealDuration?: number;
    label?: string;
}

function maskValue(value: string): string {
    console.log("value:", value)
    if (!value) return "";
    const visible = Math.min(4, value.length);
    return `${"X".repeat(value.length - visible)}${value.slice(-visible)}`;
}

export default function SecureDataMask({
    value,
    revealDuration = 10_000,
    label = "Credential number",
}: SecureDataMaskProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [announcement, setAnnouncement] = useState("");

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimers = () => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Re-mask if the underlying value changes
    useEffect(() => {
        clearTimers();
        setIsRevealed(false);
        setSecondsLeft(0);
        setAnnouncement("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Cleanup on unmount
    useEffect(() => () => clearTimers(), []);

    const handleToggle = () => {
        if (isRevealed) {
            clearTimers();
            setIsRevealed(false);
            setSecondsLeft(0);
            setAnnouncement(`${label} hidden.`);
            return;
        }

        if (!value || revealDuration <= 0) {
            setAnnouncement(`${label} cannot be revealed.`);
            return;
        }

        clearTimers();
        setIsRevealed(true);
        setSecondsLeft(Math.ceil(revealDuration / 1000));
        setAnnouncement(`${label} revealed.`);

        const endAt = Date.now() + revealDuration;

        intervalRef.current = setInterval(() => {
            const remaining = Math.max(0, endAt - Date.now());
            setSecondsLeft(Math.ceil(remaining / 1000));
        }, 250);

        timeoutRef.current = setTimeout(() => {
            clearTimers();
            setIsRevealed(false);
            setSecondsLeft(0);
            setAnnouncement(`${label} hidden automatically.`);
        }, revealDuration);
    };

    const displayText = isRevealed ? value : maskValue(value);

    return (
        <div className="secure-data-mask">
            <div className="secure-data-value">
                <span className="secure-data-label">{label}:</span>{" "}
                <output aria-label={`${label} value`}>{displayText}</output>
            </div>

            {isRevealed && (
                <span
                    aria-label={`${secondsLeft} seconds remaining`}
                    title="Time remaining before the credential is hidden automatically"
                >
                    <span aria-hidden="true">⏱</span> {secondsLeft}s
                </span>
            )}

            <div className="secure-data-actions">
                <button
                    type="button"
                    className="secure-data-button"
                    onClick={handleToggle}
                    aria-pressed={isRevealed}
                    aria-label={
                        isRevealed
                            ? `Hide ${label.toLowerCase()}`
                            : `Reveal ${label.toLowerCase()}`
                    }
                >
                    {isRevealed ? "Hide" : "Tap to Reveal"}
                </button>
            </div>

            <span
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {announcement}
            </span>
        </div>
    );
}