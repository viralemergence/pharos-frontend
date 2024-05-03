[![Pharos](https://github.com/viralemergence/pharos-database/blob/prod/diagrams/pharos-banner.png)](https://pharos.viralemergence.org/)

This repository is part of the [Pharos project](https://pharos.viralemergence.org/)
which is split into three repositories:

| Repository                                                                       | Purpose                                               |
| ---------------------------------------------------------------------------------| ------------------------------------------------------|
| [`pharos-frontend`](https://github.com/viralemergence/pharos-frontend)           | Frontend application and deployment infrastructure    |
| [`pharos-api`](https://github.com/viralemergence/pharos-api)                     | API and deployment infrastructure                     |
| [`pharos-database`](https://github.com/viralemergence/pharos-database)           | SQL database and deployment infrastructure            |
| [`pharos-documentation`](https://github.com/viralemergence/pharos-documentation) | Markdown files used to generate about pages           |

<br>
<br>
<br>
<h1 align="center">
  Pharos Frontend
</h1>

## 🚀 Deployment Status

| Branch  | CI/CD Status                                                                                                                                                                                                                                                                       | Url                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Prod    | [![CircleCI](https://dl.circleci.com/status-badge/img/gh/talus-analytics-bus/pharos-frontend/tree/prod.svg?style=svg&circle-token=3adbf3c5aa0bc15ad4f90f724a9c4b7b52bbb6b7)](https://dl.circleci.com/status-badge/redirect/gh/talus-analytics-bus/pharos-frontend/tree/prod)       | [prod-pharos-frontend.talusanalytics.com/](https://prod-pharos-frontend.talusanalytics.com/)       |
| Staging | [![CircleCI](https://dl.circleci.com/status-badge/img/gh/talus-analytics-bus/pharos-frontend/tree/staging.svg?style=svg&circle-token=3adbf3c5aa0bc15ad4f90f724a9c4b7b52bbb6b7)](https://dl.circleci.com/status-badge/redirect/gh/talus-analytics-bus/pharos-frontend/tree/staging) | [staging-pharos-frontend.talusanalytics.com/](https://staging-pharos-frontend.talusanalytics.com/) |
| Review  | [![CircleCI](https://dl.circleci.com/status-badge/img/gh/talus-analytics-bus/pharos-frontend/tree/review.svg?style=svg&circle-token=3adbf3c5aa0bc15ad4f90f724a9c4b7b52bbb6b7)](https://dl.circleci.com/status-badge/redirect/gh/talus-analytics-bus/pharos-frontend/tree/review)   | [review-pharos-frontend.talusanalytics.com/](https://review-pharos-frontend.talusanalytics.com/)   |
| Dev     | [![CircleCI](https://dl.circleci.com/status-badge/img/gh/talus-analytics-bus/pharos-frontend/tree/dev.svg?style=svg&circle-token=3adbf3c5aa0bc15ad4f90f724a9c4b7b52bbb6b7)](https://dl.circleci.com/status-badge/redirect/gh/talus-analytics-bus/pharos-frontend/tree/dev)         | [dev-pharos-frontend.talusanalytics.com/](https://dev-pharos-frontend.talusanalytics.com/)         |

Automated deployment schedule: Airtable data is ingested, "About" content is ingested, and full site is built weekly on `Staging` site.

## 👩‍💻 Local Development Quick start

This project requires you to have bit set up on your computer (one-time setup, works across projects):

1. [Make a bit.cloud account](https://bit.cloud/signup)

2. [Install Bit using these instructions](https://bit.dev/docs/getting-started/installing-bit/installing-bit)

3. Run `bit login` in your terminal

4. Make sure you have permissions as a developer on `@talus-analytics/@library` (ask Ryan)

5. Configure repository by running:

```
  npm config set '@talus-analytics:registry' https://node.bit.cloud
```

1. Install packages:

```
yarn
```

2. Start dev server:

```
yarn start
```

By default, the app will try to connect to the api at `http://localhost:3000`.

However, you should pass the API URL output from the `sam sync` command for your
development stack.

```
yarn start --api https://[api url from cloudformation]
```

## 🖥 Deployment Infrastructure

All PHAROS frontend Infrastructure is managed using the CloudFormation template within
the `/CloudFormation/` directory. All changes to hosting, domain names, alternate domain
names, and access control must be made in the template and deployed using the update command.

Infrastructure updates must be made with care as they can cause site downtime.

Remember to update site passwords before running deployment command.
