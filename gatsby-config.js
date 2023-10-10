module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-garden`,
      options: {
        contentPath: `${__dirname}/content/garden`,
        rootNote: `/README`,
      },
    },
  ],
  siteMetadata: {
    title: `garden.haeramk.im`,
  },
}
