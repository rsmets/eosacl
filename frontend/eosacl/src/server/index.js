"use strict";

/* eslint-disable global-require */

process.on("SIGINT", () => {
  process.exit(0);
});

const electrodeConfippet = require("electrode-confippet");
const support = require("electrode-archetype-react-app/support");

//

const startServer = config => {
  //
  return require("./express-server")(config);
  //
};

module.exports = () =>
  support.load().then(() => {
    const config = electrodeConfippet.config;
    return startServer(config);
  });

if (require.main === module) {
  module.exports();
}
