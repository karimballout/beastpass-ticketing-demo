# BEASTPass (MDLBEAST Ticketing Demo)

## Live links
- **GitHub (source):** https://github.com/karimballout/beastpass-ticketing-demo
- **Web demo (React):** https://2e943849-f0f7-4a3d-8b79-bc3d9b8caa3d-00-26hp68dcdm788.sisko.replit.dev:5173
- **Storybook (UI components):** https://2e943849-f0f7-4a3d-8b79-bc3d9b8caa3d-00-26hp68dcdm788.sisko.replit.dev:6007

> Note: Replit demo links may sleep when inactive — I can wake them up quickly or screen-share.



Mini full-stack ticketing demo built to showcase:
- Node.js backend (Fastify, TypeScript)
- React web (Vite + TS)
- React Native mobile (Expo + TS)
- Atomic design + Storybook
- Automated testing (Jest)
- Ticket issuance + validation flow (scanner-ready)

## Architecture (AWS-ready)
Business logic lives in **handlers** (Lambda-style) and is called by:
- `server.ts` (Fastify routes) for local/Replit demo
- (Future) SST Lambdas for AWS deployment

Storage is an in-memory adapter today:
- `src/store.ts` (replace with DynamoDB adapter later)

Async/event architecture is the next step:
- emit `TicketIssued` / `TicketScanned` to an EventBus (EventBridge later)
- enqueue notifications to a Queue (SQS later)

---

## Run on Replit

### 1) API
In one shell:
```bash
cd ~/workspace
PORT=3001 npm run dev


---

## Web E2E (Playwright)
A Playwright E2E test exists in `web/e2e/buy-ticket.spec.ts`.

Note: Replit containers may lack some system libraries required by Chromium (e.g. `libglib-2.0.so.0`), so Playwright browser runs are best executed on:
- your local machine, or
- CI (GitHub Actions), or
- a Docker image with the required dependencies

Install and run locally:
```bash
cd web
npm i
npx playwright install chromium
npx playwright test


---

## Web E2E (Playwright)
A Playwright E2E test exists in `web/e2e/buy-ticket.spec.ts`.

Note: Replit containers may lack some system libraries required by Chromium (e.g. `libglib-2.0.so.0`), so Playwright browser runs are best executed on:
- your local machine, or
- CI (GitHub Actions), or
- a Docker image with the required dependencies

Install and run locally:
```bash
cd web
npm i
npx playwright install chromium
npx playwright test

```
