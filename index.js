module.exports = {
  _actions: {
    build: require("./actions/build"),
    test: require("./actions/test"),
    lint: require("./actions/lint"),
  },

  //////////////////////////////////////////////////////////////////////
  // Common configuration options
  //////////////////////////////////////////////////////////////////////

  /**
   * The entry point(s) to the project sources
   *
   * ---
   * entry: "path/to/file.js";      // Build a single-target project
   * ---
   * entry: {                       // Build multiple targets
   *  build_a: "path/to/a.js",
   *  build_b: "path/to/b.js",
   * }
   * ---
   */
  entry: "./src/index.ts",

  /**
   * Defines weather to build a library
   *
   * ---
   * library: null;                 // Do not build a library
   * ---
   * library: "name";               // Build a library with the given name
   * ---
   */
  library: null,

  //////////////////////////////////////////////////////////////////////
  // Custom component configuration
  //////////////////////////////////////////////////////////////////////

  /**
   * Indicates that DLL resolution/definition is required
   *
   * ---
   * dll: false                     // Do not emit DLL manifest for libraries
   * ---
   * dll: true                      // Emit DLL manifest for the libraries built
   * ---
   */
  dll: true,

  /**
   * Indicates the resources that are external to the project and must be
   * referred to using require() and/or DLL
   */
  externals: [],

  //////////////////////////////////////////////////////////////////////
  // Custom component configuration
  //////////////////////////////////////////////////////////////////////

  /**
   * Custom webpack configuration
   */
  webpack: {},

  /**
   * Custom tsconfig configuration
   */
  tsconfig: {},

  /**
   * Custom jest configuration
   */
  jest: {},
};
