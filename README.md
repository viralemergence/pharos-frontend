[![Pharos](https://github.com/viralemergence/pharos-frontend/blob/prod/diagrams/pharos-banner.png)](https://pharos.viralemergence.org/)

This repository is part of the [Pharos project](https://pharos.viralemergence.org/)
which is split into four repositories:

| Repository                                                                       | Purpose                                            |
| -------------------------------------------------------------------------------- | -------------------------------------------------- |
| [`pharos-frontend`](https://github.com/viralemergence/pharos-frontend)           | Frontend application and deployment infrastructure |
| [`pharos-api`](https://github.com/viralemergence/pharos-api)                     | API and deployment infrastructure                  |
| [`pharos-database`](https://github.com/viralemergence/pharos-database)           | SQL database and deployment infrastructure         |
| [`pharos-documentation`](https://github.com/viralemergence/pharos-documentation) | Markdown files used to generate about pages        |

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

1. Install packages:

```
yarn
```

2. Start dev server, passing arguments for the resources you want to connect to:

| Argument         | Description                                                          | Source                                                                                            |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--api`          | Cloudfront distribution url for the main API                         | "Outputs" section of cloudformation stack                                                         |
| `--mapping_api`  | Cloudfront distribution url for the mapping API                      | "Outputs" section of cloudformation stack                                                         |
| `--client_id`    | AWS Cognito client ID                                                | "Outputs" section of cloudformation stack                                                         |
| `--user_pool_id` | AWS Cognito user pool ID                                             | "Outputs" section of cloudformation stack                                                         |
| `--profile`      | AWS SSO Profile with developer-level credentials for Pharos Prod AWS | Configure AWS SSO using the [Pharos AWS Access Portal](https://viralemergence.awsapps.com/start/) |

| Argument         | Source                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `--api`          | "Outputs" section of cloudformation stack                                                         |
| `--mapping_api`  | "Outputs" section of cloudformation stack                                                         |
| `--client_id`    | "Outputs" section of cloudformation stack                                                         |
| `--user_pool_id` | "Outputs" section of cloudformation stack                                                         |
| `--profile`      | Configure AWS SSO using the [Pharos AWS Access Portal](https://viralemergence.awsapps.com/start/) |

Example `yarn start` command:

```
yarn start \
  --api [CF Distribution URL] \
  --mapping_api [CF Distribution URL] \
  --profile [AWS SSO Profile] \
  --client_id [AWS Cognito Client ID] \
  --user_pool_id [AWS Cognito User Pool ID]
```

```
yarn start \
  --api https://XXXXXXXXXXXXXX.cloudfront.net/prod \
  --mapping_api https://XXXXXXXXXXXXXX.cloudfront.net/prod \
  --profile verena-prod-dev \
  --client_id XXXXXXXXXXXXXXXXXXXXXXXXXX \
  --user_pool_id us-east-2_XXXXXXXXX
```

## 🖥 Deployment Infrastructuree

All PHAROS frontend Infrastructure is managed using the CloudFormation template within
the `/CloudFormation/` directory. All changes to hosting, domain names, alternate domain
names, and access control must be made in the template and deployed using the update command.

Infrastructure updates must be made with care as they can cause site downtime.

Remember to update site passwords before running deployment command.
