# UIDAI Verifiable Credential Wallet PWA

A React + TypeScript demo for the UIDAI Frontend Developer assignment. It demonstrates a credential dashboard, Redux Toolkit state management, an accessible secure-reveal component, offline API caching, and automated tests. All identity data is fictional.

## Requirements
- Node.js 20+
- npm

## Install and run locally
```bash
npm install
npx vitest run
npm run dev
```

## Tests and production build (if needed)
```bash
npm test
npm run build
npm run preview
```

## Mock API
The dashboard calls `GET /api/credentials`. For Vercel, `api/credentials.ts` provides a serverless mock endpoint. For local Vite development, `vite.config.ts` includes a small development middleware for the same endpoint.

## Project structure
```text
api/credentials.ts
public/manifest.json
public/service-worker.js
src/components/CredentialCard.tsx
src/components/CredentialDashboard.tsx
src/components/SecureDataMask.tsx
src/data/mockCredentials.ts
src/services/credentialService.ts
src/store/credentialSlice.ts
src/store/hooks.ts
src/store/store.ts
src/test/setup.ts
src/types/credential.ts
src/main.tsx
tests/CredentialDashboard.test.tsx
tests/SecureDataMask.test.tsx
```

## Offline behavior
The service worker caches successful `GET /api/credentials` responses in Cache Storage and serves the cached response when the network is unavailable. The first successful online request is required to populate the cache. Do not put real Aadhaar numbers or production identity data in this demo.

## Accessibility and security notes
- Sensitive values are masked by default.
- A native button supports keyboard activation.
- An `aria-live="polite"` region announces reveal/hide changes.
- The revealed value is held in component state only while visible and is cleared when the timeout expires or the user hides it.
- This is a demonstration, not a production identity wallet or security certification.

## Assignment deliverables
1. `FrontendDev_Prattyancha_Patharkar_Assignment.pdf`
2. Public GitHub repository containing the project source.

## Git commands
```bash
git init
git add .
git commit -m "UIDAI Verifiable Credential Wallet PWA"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/uidai-credential-wallet.git
git push -u origin main
```
Create the GitHub repository first, replace `YOUR_GITHUB_USERNAME`, and never commit secrets or real identity data.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs).
- [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/).

## React Compiler

The React Compiler is not enabled in this template because of its impact on development and build performance. To add it, see the [React Compiler installation documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

For a production application, consider enabling type-aware lint rules. For example, in an ESLint flat config, you can use `typescript-eslint`'s `recommendedTypeChecked`, `strictTypeChecked`, or `stylisticTypeChecked` configurations and set `parserOptions.project` to your TypeScript configuration files.

You can also install [`eslint-plugin-react-x`](https://npmx.dev/package/eslint-plugin-react-x) and [`eslint-plugin-react-dom`](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules. Consult their documentation for the current recommended configuration.

The original Vite template documentation is available at:
- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
