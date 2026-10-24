import type { Credential } from "../types/credential";

const mockCredentials: Credential[] = [
  {
    id: "cred-001",
    type: "Identity Credential",
    issuer: "UIDAI Sandbox Demo",
    issuedAt: "2026-01-15",
    status: "Active",
    credentialNumber: "1234-5678-9012",
  },
  {
    id: "cred-002",
    type: "Address Credential",
    issuer: "Demo Verification Authority",
    issuedAt: "2026-03-10",
    status: "Active",
    credentialNumber: "9876-5432-1098",
  },
  {
    id: "cred-003",
    type: "Digital Verification Credential",
    issuer: "Demo Verification Authority",
    issuedAt: "2026-05-20",
    status: "Expired",
    credentialNumber: "1122-3344-5566",
  },
];

export default mockCredentials;