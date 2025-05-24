# WebdriverIO BDD Automation Framework

Welcome to this **Behavior-Driven Development (BDD)** test automation framework built using **WebdriverIO** and **CucumberJS**. This project automates complex **OTP-based login flows**, validates profile information, and generates detailed reports — all with clean, readable code!

---

# Key Highlights

1. Automates **login flow using OTP** sent to email (OTP is fetched from Gmail via Gmail API)
2. Validates user **profile details after login**
3. Covers both **positive and negative scenarios**
4. Generates **detailed HTML reports** for easy analysis

---

# Tech Stack & Tooling

| Tool/Tech                         | Purpose                             |
| --------------------------------- | ----------------------------------- |
| **JavaScript (Node.js)**          | Core language                       |
| **WebdriverIO**                   | UI automation                       |
| **CucumberJS**                    | BDD-style test cases                |
| **Gmail API**                     | Fetch OTP from email                |
| **node-fetch**                    | API testing and backend validations |
| **VS Code**                       | Development environment             |
| **cucumber-html-reporter**        | Beautiful HTML test reports         |
| **wdio-cucumberjs-json-reporter** | JSON reports for HTML conversion    |

---

## Project Structure

WDIO-CucumberJS/
│
├── .vscode/                  → VS Code launch & debug settings
├── CommonUtils/              → Helper utilities (browser, date, email, logs)
├── reports/                  → JSON and HTML reports
├── SampleProject/
│   ├── Configs/              → Test data and credentials
│   ├── Features/             → Cucumber feature files (Gherkin)
│   ├── PageObjects/          → UI elements and page actions
│   ├── StepDefs/             → Step definitions (glue between feature and code)
│   └── TestData/             → Login and validation data
├── tempDownloads/            → Temporary downloads
├── package.json              → NPM dependencies
├── .gitignore                → Git ignore rules
└── wdio.conf.js              → WebdriverIO config with hooks and reporting

**Why this structure?**
It's clean, modular, and easy to maintain! Each folder has a specific responsibility to keep the code DRY (Don’t Repeat Yourself) and the tests organized.

---

# What’s Tested?

| Scenario     | Test Flow                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| **Positive** | Login with valid mobile number → Fetch OTP from Gmail → Successful login → Correct profile validated     |
| **Negative** | Login with valid mobile number → Profile email is incorrect/outdated → Validation fails → Error reported |

---

## Important Packages Used

* `@wdio/cli` & `@wdio/cucumber-framework` – Core WebdriverIO + Cucumber setup
* `wdio-cucumberjs-json-reporter` – Generates JSON report data
* `wdio-cucumber-parallel-execution` – Run tests in parallel to save time
* `cucumber-html-reporter` – Converts JSON to clean HTML reports
* `googleapis` & `@google-cloud/local-auth` – Secure Gmail API integration
* `node-fetch` – Used for custom API requests and backend validations
* `moment` & `colors` – Console beautification and date formatting
* `fs-extra` – File operations

---

## Reporting Workflow

1. JSON reports are saved in `reports/json/tmp/`.
2. After test execution, a post-hook in `wdio.conf.js` triggers report conversion.
3. Final HTML reports are available at `reports/html/`.

These reports show passed/failed steps, screenshots, and are great to share with teams.

---

## Final Notes

* This framework is a great base to scale UI + API testing needs.
* OTP-based login is fully automated — no manual input required.
* Easy to maintain, extend, and integrate with CI/CD pipelines.
