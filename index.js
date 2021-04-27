module.exports = {
  _actions: {
    build: require("./actions/build"),
    test: require("./actions/test"),
    lint: require("./actions/lint"),
  },

  entry: "./src/index.ts",
  library: false,
  output: "[id].js",

  webpack: {},
  tsconfig: {},
  jest: {},
};
