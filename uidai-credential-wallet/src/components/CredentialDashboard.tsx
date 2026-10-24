import { useEffect } from "react";
import { loadCredentials } from "../store/credentialSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CredentialCard from "./CredentialCard";

export default function CredentialDashboard() {
    const dispatch = useAppDispatch();
    const { credentials, loading, error } = useAppSelector(
        (state) => state.credentials,
    );

    useEffect(() => {
        void dispatch(loadCredentials());
    }, [dispatch]);
    console.log("first credentials:", credentials);
    return (
        <main className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">DIGITAL IDENTITY · DEMO</p>
                    <h1>Credential Wallet</h1>
                    <p className="page-description">
                        View your credentials and reveal sensitive details only when needed.
                    </p>
                </div>

                <button
                    type="button"
                    className="refresh-button"
                    onClick={() => void dispatch(loadCredentials())}
                    disabled={loading}
                >
                    {loading ? "Refreshing…" : "Refresh"}
                </button>
            </header>

            <section aria-labelledby="credentials-heading">
                <div className="section-heading">
                    <div>
                        <h2 id="credentials-heading">My credentials</h2>
                        <p>
                            {credentials.length}{" "}
                            {credentials.length === 1 ? "credential" : "credentials"}
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="message-panel" role="status" aria-live="polite">
                        Loading credentials…
                    </div>
                )}

                {!loading && error && (
                    <div className="message-panel error-panel" role="alert">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="retry-button"
                            onClick={() => void dispatch(loadCredentials())}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && credentials.length === 0 && (
                    <div className="message-panel" role="status">
                        No credentials are available yet.
                    </div>
                )}

                {!loading && !error && credentials.length > 0 && (
                    <div className="credential-grid">
                        {credentials.map((credential: any) => (
                            <CredentialCard key={credential.id} credential={credential} />
                        ))}
                    </div>
                )}
            </section>

            <footer className="app-footer">
                <p>
                    Demonstration only. Do not enter or store real identity numbers in
                    this prototype.
                </p>
            </footer>
        </main>
    );
}