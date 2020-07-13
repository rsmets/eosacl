module.exports = {
  extends: "electrode-archetype-react-app-dev/config/babel/babelrc-client.js",
  "plugins": [
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ]
  ]
};
