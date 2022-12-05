/* eslint-disable */
/* tslint:disable */
module.exports = {
  siteMetadata: {
    siteUrl: 'https://example.talusanalytics.com/',
    title: 'Talus Analytics',
    cookieConsent: {
      cookieMessage:
        'Talus sites use cookies to ensure you get the best experience possible.',
      buttonColor: 'rgb(15, 35, 75)',
      backgroundColor: '#edf2f2',
    },
  },
  plugins: [
    {
      // site will not build without a valid
      // airtable api key; delete this plugin
      // if airtable isn't going to be used.
      resolve: `gatsby-source-airtable`,
      options: {
        // eslint-disable-next-line
        apiKey: process.env.AIRTABLE_API_KEY,
        concurrency: 5,
        tables: [
          {
            baseId: `app09hICSniDr45hj`,
            tableName: `Landing Page`,
            tableView: `CMS`,
            mapping: { Image: `fileNode` },
          },
          {
            baseId: `app09hICSniDr45hj`,
            tableName: `Sign In`,
            tableView: `CMS`,
            mapping: { Image: `fileNode` },
          },
          {
            baseId: `app09hICSniDr45hj`,
            tableName: `Site metadata`,
            tableView: `CMS`,
            mapping: { Image: `fileNode` },
          },
          {
            baseId: `app09hICSniDr45hj`,
            tableName: `Icons`,
            tableView: `CMS`,
            mapping: { SVG: `fileNode` },
          },
        ],
      },
    },
    {
      // filling in the gtag here
      // will set up both the gatsby
      // google analytics plugin and
      // the cookieconsent opt-in system.
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: `G-XXXXXXXXXX`,
        anonymize: true,
        head: false,
      },
    },
    {
      // filesystem plugin for documentation pages,
      // pulling from the pharos-documentation
      // repository git submodule.
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'documentation',
        path: `${__dirname}/src/pharos-documentation`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    'talus-gatsby-transformer-svg',
    'gatsby-plugin-styled-components',
    'talus-gatsby-transformer-svg',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-root-import',
    'gatsby-transformer-remark',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-image',
    'gatsby-plugin-sass',
    'gatsby-plugin-mdx',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `PHAROS`,
        short_name: `PHAROS`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#050A37`,
        display: `standalone`,
        icon: `icon.png`,
        crossOrigin: `use-credentials`,
      },
    },
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        // precachePages: [`/about/*`, `/user-guide/*`, `/app/*`],
      },
    },
  ],
}
