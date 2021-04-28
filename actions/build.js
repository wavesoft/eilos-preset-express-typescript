const configWebpackBase = require("../config/webpack.config");
const configTs = require("../config/tsconfig");
const tsTypings = require("../config/tstypings");

module.exports = {
  files: {
    "webpack.config.js": (ctx) => {
      const { merge } = ctx.util;
      const userConfig = ctx.getConfig("webpack", {});

      let config = configWebpackBase(ctx);
      return merge(config, userConfig);
    },
    "tsconfig.json": (ctx) => {
      const { merge } = ctx.util;
      const userConfig = ctx.getConfig("tsconfig", {});

      return merge(configTs(ctx), userConfig);
    },
    "@types/typings.d.ts": tsTypings,
  },

  run: (ctx) => {
    const cfgFile = ctx.getConfigFilePath("webpack.config.js");
    const argv = ctx.getConfig("argv", []);

    return ctx.exec("webpack", [].concat(["--config", cfgFile], argv));
  },
};
