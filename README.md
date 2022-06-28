<h1 align="center">
  Talus-Gatsby-Starter
</h1>

## 🚀 Quick start

1.  **COMING SOON: Build AWS Stack & Update CCI config**

    Use the `build-stack` repo to set up all AWS resources for this project:

    ```shell
    aws cloudformation deploy --stack-name [project-name] --template-file build-stack.yaml --capabilities CAPABILITY_NAMED_IAM
    ```

    The "Outputs" tab of the CloudFormation stack will contain the distribution IDs which should be used in `/.circleci/config.yml`.

2.  **Check Gatsby CLI configuration**

    To be compatible with our CCI build scripts, Gatsby CLI should use `yarn`:

    `~/.config/gatsby/config.json` should include:

    ```json
    "cli": {
      "packageManager": "yarn"
    }
    ```

3.  **Create a Gatsby site.**

    Clone this repository into the same directory (folder) where you want your new site to be.

    In that same directory, use the Gatsby CLI to create a new site, using this command:

    ```shell
    # create a new Gatsby site using the talus starter
    gatsby new [project-name] ./talus-gatsby-starter
    ```

    If you want to put your new site in a different directory from where you cloned `talus-gatsby-starter`, you will need to give the `gatsby new` command the path to `talus-gatsby-starter`.

4.  **Set AIRTABLE_API_KEY env var**

    The easiest way to do this locally is in a script in the `sh/` directory, which is included in the starter but all contents are gitignored.

    ```shell
    export AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX;
    gatsby develop;
    ```

5.  **Set up Git**

    First, create a new empty repository for your project in Github. Make sure to copy the remote origin url (should be something like `https://github.com/talus-analytics-bus/awesome-repo-name.git`).

    Then, execute the included `setup-repo.sh` script to initialize a git repo with the continuous integration and deployment branches configured to match the CCI config. When prompted for the `Github URL for remote origin:`, provide the remote origin url for your repo that you copied.

    ```shell
    ./setup-repo.sh
    ```

6.  **Clone the example airtable**

    Clone the [example airtable base](https://airtable.com/apptYPkeoCz0lSn19/tblJV3LL08O5wNAHP/viwDPkxCqsqCF0nVi?blocks=hide) at this link or the one on the starter page, and update the `baseId` in `gatsby-config.js` to the new, project-specific airtable base. You may get warnings about missing content because of the content used for the starter home page.

7.  **Update `gatsby-config.js`.**

    `gatsby-config.js` will automatically configure opt-in analytics, cookieconsent, and airtable connections based on the values provided.
