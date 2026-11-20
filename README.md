# Kirsten Website

Portfolio and workspace tools for Kirsten Umali.

Repository: [Kirstenumali/kirsten](https://github.com/Kirstenumali/kirsten)

## Website routes

Base URL: **https://kirstenumali.online**

The routes below come from the Express configuration in `MyWebsite/server/server.js` and `MyWebsite/server/menu-routes.js`. They describe page routes, rather than API endpoints. Availability on the live website depends on deploying this repository and configuring the web server to forward requests to the Node app.

### Main pages

| Page | Route | Alternative route |
| --- | --- | --- |
| Portfolio | `/` | `/MyWebsite/` |
| Main menu | `/mainmenu` | `/Menu/` |
| Profile | `/profile` | — |
| Bug Bounty Company | `/BugBountyCompany/` | — |
| Jobs hub | `/Jobs/` | — |
| Alternative portfolio page | `/index1.html` | `/MyWebsite/index1.html` |

### Bug bounty tools

| Page | Short route | Full route |
| --- | --- | --- |
| AI Ask Hack | `/aiaskhack/` | `/BugBountyCompany/aiaskhack/` |
| Bank details | `/bankdetails/` | `/BugBountyCompany/bankdetails/` |
| Bounty APIs | `/bigbountyapis/` | `/BugBountyCompany/bigbountyapis/` |
| Bounty rooms | `/bigbountyrooms/` | `/BugBountyCompany/bigbountyrooms/` |
| Easy Bugs | `/easybugs/` | `/BugBountyCompany/easybugs/` |
| My account | `/myaccount/` | `/BugBountyCompany/myaccount/` |
| Payment details | `/myaccount/payment-details/` | `/BugBountyCompany/myaccount/payment-details/` |
| New hire introduction | `/newhireintroduction/` | `/BugBountyCompany/newhireintroduction/` |
| Resigning | `/resigning/` | `/BugBountyCompany/resigning/` |
| Team | `/team/` | `/BugBountyCompany/team/` |
| Users | `/users/` | `/BugBountyCompany/users/` |
| Waitlist | `/waitlist/` | `/BugBountyCompany/waitlist/` |
| Waitlist admin | `/waitlistadmin/` | `/BugBountyCompany/waitlistadmin/` |

`/salary/` is another alias for the bank details page.

### Job tools

| Page | Short route | Full route |
| --- | --- | --- |
| Big companies | `/bigcompanies/` | `/Jobs/bigcompanies/` |
| Big companies UAE | `/bigcompaniesuae/` | `/Jobs/bigcompaniesuae/` |
| Bigger salary | `/biggersalary/` | `/Jobs/biggersalary/` |
| International companies | `/internationalcompanies/` | `/Jobs/internationalcompanies/` |
| Job leads | `/jobleads/` | `/Jobs/jobleads/` |
| Job applier Indeed | `/jobapplierindeed/` | `/Jobs/jobapplierindeed/` |
| Spain jobs | `/spainjob/` | `/Jobs/spainjob/` |
| Lead cybersecurity | `/leadcybersecurity/` | `/Jobs/jobleads/leadcybersecurity/` |
| Job applier | `/jobapplier/` | `/Jobs/jobapplierindeed/jobapplier/` |
| Cybersecurity jobs | `/cybersecurityjobs/` | `/Jobs/jobapplierindeed/cybersecurityjobs/` |
| Freelance | `/freelance/` | `/Jobs/jobapplierindeed/freelance/` |
| International Europe jobs | `/internationeuropejobs/` | `/Jobs/jobapplierindeed/internationeuropejobs/` |

Nested pages are also accessible under their short parent paths, such as `/jobleads/leadcybersecurity/` and `/jobapplierindeed/freelance/`.

### Content creator

| Page | Short route | Full route |
| --- | --- | --- |
| Content creator builder | `/contentcreatorbuilder/` | `/ContentCreator/contentcreatorbuilder/` |

### Portfolio section links

These links scroll to sections within the portfolio; they are not separate pages.

| Section | Link |
| --- | --- |
| Introduction | `/#top` |
| Skills | `/#skills` |
| Work snapshots | `/#snapshots` |
| Tools | `/#tools` |
| Security | `/#security` |
| Selected work | `/#work` |
| Experience | `/#experience` |
| Contact | `/#contact` |

### Shared assets

`/bounty-shared/` and `/BugBountyCompany/bounty-shared/` serve shared styles and scripts. They do not have a landing page. `/ContentCreator/` is also a static directory without its own index page.

Use the capitalization shown in the full routes, particularly when requesting static files on Linux.
