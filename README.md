[![Pharos](https://github.com/viralemergence/pharos-frontend/blob/prod/diagrams/pharos-banner.png)](https://pharos.viralemergence.org/)

This repository is part of the [Pharos project](https://pharos.viralemergence.org/)
which is split into four repositories:

| Repository                                                                       | Purpose                                            |
| -------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`pharos-frontend`](https://github.com/viralemergence/pharos-frontend)           | Frontend application and deployment infrastructure |
| [`pharos-api`](https://github.com/viralemergence/pharos-api)                     | API and deployment infrastructure                  |
| [`pharos-database`](https://github.com/viralemergence/pharos-database)           | SQL database and deployment infrastructure         |
| [`pharos-documentation`](https://github.com/viralemergence/pharos-documentation) | Markdown files used to generate about pages        |

</br>
</br>
</br>
<h1 align="center">
  Pharos Frontend
</h1>

## 🚀 Deployment Status

| Branch  | CI/CD Status                                                                                                                                                                                                                                                 | Url                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Prod    | [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/prod.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/prod)       | [pharos.viralemergence.org/](https://pharos.viralemergence.org/)                 |
| Staging | [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/staging.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/staging) | [staging-pharos.viralemergence.org/](https://staging-pharos.viralemergence.org/) |
| Review  | [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/review.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/review)   | [dev-pharos.viralemergence.org/](https://review-pharos.viralemergence.org/)      |
| Dev     | [![CircleCI](https://dl.circleci.com/status-badge/img/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/dev.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/39PL8myokkHY7obZPJeFEC/VSEyuiVS42F6DmyCLZcbdW/tree/dev)         | [dev-pharos.viralemergence.org/](https://dev-pharos.viralemergence.org/)         |

Automated deployment schedule: Airtable data is ingested, "About" content is ingested from
[`pharos-documentation`](https://github.com/viralemergence/pharos-documentation), and full
site is built weekly on `Staging` site.

</br>

## 👩‍💻 Development Quick start

### 1. Create API Stack: [`pharos-api`](https://github.com/viralemergence/pharos-api).

### 2. Install packages:

```
yarn
```

### 3. Start dev server:

Run `yarn start`, passing arguments to connect the dev server to your dev API stack:

| Argument         | Source                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--api`          | "Api" in outputs of cloudformation stack                                                                                                         |
| `--client_id`    | "ClientId" in outputs of cloudformation stack                                                                                                    |
| `--user_pool_id` | "UserPoolId" in outputs of cloudformation stack                                                                                                  |
| `--mapping_api`  | Optional, only for troubleshooting. Defaults to match --api.                                                                                     |
| `--profile`      | Optional, if `[default]` profile is set. </br> Configure AWS SSO using the [Pharos AWS Access Portal](https://viralemergence.awsapps.com/start/) |

Example `yarn start` command:

```
yarn start \
  --api https://XXXXXXXXXXXXXX.cloudfront.net/prod \
  --client_id XXXXXXXXXXXXXXXXXXXXXXXXXX \
  --user_pool_id us-east-2_XXXXXXXXX
```

</br>

## 🏙️ Deployment Infrastructure

All `pharos-frontend` Infrastructure is managed using the CloudFormation template within
the `/CloudFormation/` directory. All changes to hosting, domain names, alternate domain
names, and access control must be made in the template and deployed using the update command
which can be found in the same directory. The template deploys all resources for all sites
(`dev`, `review`, `staging`, and `prod`), the template does not need to be deployed four times.

Infrastructure updates must be made with care as they can cause site downtime.

Remember to update site passwords before running deployment command.

### Simplified Infrastructure Diagram

This diagram is significantly simplified due to the diagram not supporting all CloudFormation
features used in the template.

![Overview diagram](https://github.com/viralemergence/pharos-frontend/blob/prod/diagram/pharos-database-highlevel.png)
