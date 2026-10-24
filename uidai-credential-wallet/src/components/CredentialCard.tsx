import SecureDataMask from "./SecureDataMask";
import type { Credential } from "../types/credential";

interface CredentialCardProps {
  credential: Credential;
}

export default function CredentialCard({ credential }: CredentialCardProps) {
  const statusClass = credential.status.toLowerCase().replace(/\s+/g, "-");
  console.log("credential:", credential)
  return (
    <article className="credential-card">
      <div className="credential-card-header">
        <h3>{credential.type}</h3>

        <span
          className={`credential-status status-${statusClass}`}
          aria-label={`Credential status: ${credential.status}`}
        >
          <span className="status-indicator" aria-hidden="true" />
          {credential.status}
        </span>
      </div>

      <div className="credential-card-details">
        <p>
          <strong>Issuer:</strong> {credential.issuer}
        </p>
        <p>
          <strong>Issued on:</strong> {credential.issuedAt}
        </p>
      </div>

      <div className="credential-card-security">
        <SecureDataMask
          value={credential.credentialNumber}
          label="Credential number"
          revealDuration={10_000}
        />
      </div>
    </article>
  );
}