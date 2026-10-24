export type CredentialStatus = "Active" | "Expired";

export interface Credential {
  id: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: CredentialStatus;
  credentialNumber: string;
}