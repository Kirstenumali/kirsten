# Team workspace setup

The dashboard is at `/bugbountycompany/users/`. It uses the existing Express server on port 8000. There is no frontend build step and no new dependency.

## Local use

From `server`, run `npm run dashboard`, then open `http://localhost:8000/bugbountycompany/users/`. Do not open the HTML file directly or through a separate static preview server. On first use, create an admin password in the setup screen, then sign in as `admin`. The password is stored as a salted scrypt hash alongside the private dashboard data. This local server binds only to the local computer. It does not require `.env` and does not run the production integrations.

## Ubuntu deployment steps

After committing/pushing these files, pull the changes on your Ubuntu server. Add the following to `server/.env`, choosing a long unique password:

```dotenv
WORK_DASHBOARD_ADMIN_PASSWORD=replace-with-a-long-unique-password
```

Restart the existing process:

```bash
PM2_HOME=/home/ubuntu/.pm2 pm2 restart portfolio --update-env
```

Open `https://kirstenumali.online/bugbountycompany/users/` and sign in as `admin` with that password. Use HTTPS for sign-ins. Share the dashboard URL with your six workers. Each person selects Create your account, chooses their own username and password, and enters their personal dashboard. Registration closes when all six team places are filled. Each worker receives fixed monthly pay of $13 USD. Payment is handled separately; the dashboard does not transfer money.

Create a task with the source information, expected output, assignee, and optional deadline. Workers sign in, read their tasks, and submit written work and an optional document/repository link. Refresh the board to see submissions. Approve work or request changes with feedback. Every submission remains in the task history.

## Data and access

Data is stored in `~/.bugbountycompany/work.json` for the user running Node, outside the publicly served repository. Back up this directory. An optional `WORK_DASHBOARD_DATA_DIR` must also point outside the website folder. Use one server process for this JSON-backed workspace; concurrent clustered processes are not supported.

Worker passwords are salted and hashed with scrypt. Sessions expire after eight hours and are cleared on a server restart. The admin password is read from the environment. There are no default worker accounts, password-reset emails, file uploads, LinkedIn integration, or external notifications. Workers register their own credentials. Signed-in members can publish text posts to the shared team feed and delete their own posts; the admin can also delete posts. Task assignments remain private to their assignee and the admin. Posts stay inside this platform and are not published to LinkedIn. Forgotten worker passwords currently require owner-assisted maintenance of the account data; a self-service reset flow is not included.

If the page loads but login says the API is unavailable, check that Nginx forwards `/api/work-dashboard/` to the existing Node process on port 8000. Do not configure Nginx to serve the private data directory.

## Verification

From the repository root:

```bash
node --test server/work-dashboard.test.js
```

## Start work and identity review

After registration, workers select Start work, enter the email account they intend to use for work, and upload a passport or identity document (PDF/JPEG/PNG, up to 10 MB). This collects an existing address; it does not provision a mailbox or verify email ownership. The owner manually reviews identity; no passport authenticity service is integrated.

Documents are encrypted using AES-256-GCM in the private data directory. The encryption key is stored separately as documents.key in that directory. Only authenticated admins can download documents. After approval or a request for changes, the uploaded server copy is deleted. Downloaded copies and external backups are not deleted by the platform. Workers may resubmit after a request for changes. Approval unlocks publishing to the shared feed, enforced on the server. Names, work email addresses, and verification status remain in the private account record.

## Research support and leaving the team

`/newhireintroduction/` is linked from both dashboards and the first-time user welcome. Private messages, company bounty reports, and resignation requests persist in the same private `work.json` as accounts. Each user can see only their own records; admins see and reply to all members. Bounties progress from Submitted to Approved to Paid, with a 5% researcher share of the company reward in USD. These are bookkeeping records, not money transfers. Team Lead Researcher support is listed at $20 USD; no checkout or charge is implemented. Confirm the reward-share interpretation and service pricing terms before using them for actual payouts.

Users may submit and withdraw pending resignations. The displayed review target is seven days after submission, not an automatic approval or account lock. Approval records the decision and preserves account access.

CVs and bank details are encrypted in `work.json`; identity files are encrypted separately. `documents.key` in the private data directory is required to decrypt them. Messages and other ordinary records are not encrypted by the app. Back up records and the key securely, with restricted access. Locally the default directory is `C:\Users\kirst\.bugbountycompany`; on Ubuntu it is the home directory of the Node service user, followed by `.bugbountycompany`. This is server disk storage, not a cloud database. Use durable server storage and one Node process. CV server copies are removed shortly after the admin confirms downloading them; externally downloaded copies remain with the admin.

Scope helper: `/aiaskhack/` is linked from `/bigbountyapis/`. Signed-in workers, admins, and approved leads can paste a scope and receive a local checklist. Set `OPENROUTER_API_KEY` in `server/.env` and optionally `OPENROUTER_MODEL` to enable AI suggestions, then restart the server. The browser shows the provider disclosure before submitting. Scope text is not persisted by this application. The helper does not fetch target URLs or run scans. AI requests are limited to 10 per account per hour per server process. Provider request format: https://github.com/OpenRouterTeam/docs/blob/main/api_reference/overview.mdx

Public website: /bugbountycompany/. User/admin sign-in and dashboard: /bugbountycompany/users/. Public Join the team buttons open /bugbountycompany/users/?view=register. The dashboard HTML keeps shared CSS and JavaScript at absolute /bugbountycompany/ asset paths. Account data and API routes remain unchanged.
