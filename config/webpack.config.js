const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function getEntryConfig(ctx) {
  const entry = ctx.getConfig("entry");
  if (typeof entry === "string") {
    return {
      index: [entry],
    };
  }

  return entry;
}

module.exports = (ctx) => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css",
    }),
  ];

  // Load copy plug-in if we have a static directory
  const staticDir = ctx.getConfig("static", "./static");
  if (fs.existsSync(staticDir)) {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [{ from: staticDir }],
      })
    );
  }

  // Check if we are building a library
  const library = ctx.getConfig("library", null);
  const libraryOutput = {};
  if (library) {
    libraryOutput.libraryTarget = "umd";

    if (typeof library === "string") {
      libraryOutput.library = library;
    } else {
      Object.assign(libraryOutput, {
        library: libraryOutput.name,
        libraryTarget: libraryOutput.target || "umd",
      });
    }

    // If DLL Support is enabled, emit a DLL
    if (ctx.getConfig("emitDll", false)) {
      plugins.push(
        new webpack.DllPlugin({
          context: ctx.getDirectory("project"),
          path: path.join(ctx.getDirectory("dist"), "[name]-manifest.json"),
          name: library,
          entryOnly: true,
          format: true,
          type: libraryOutput.target || "umd",
        })
      );
    }
  }

  // Enable typescript optimisations if we are not building a library. That's a
  // limitation of the `ts-loader` plugin, since when we set `transpileOnly: true`
  // the generator won't emit type files.
  const tsLoaderOptions = {};
  if (!library) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          context: ctx.getDirectory("project"),
          configFile: ctx.getConfigFilePath("tsconfig.json"),
          sourceType: "umd"
        },
      })
    );
    Object.assign(tsLoaderOptions, {
      happyPackMode: true,
      transpileOnly: true,
    });
  }

  // If we have external references, build the webpack configuration for them
  const externalModules = ctx.getConfig("externals", []);
  const externals = {};
  if (externalModules && externalModules.length) {
    externalModules.forEach((extern) => {
      externals[extern] = `commonjs2 ${extern}`;
    });
  }

  // If we have DLLs, build the webpack configuration for them
  const dlls = ctx.getConfig("dlls", []);
  if (dlls && dlls.length) {
    dlls.forEach((dll) => {
      const externJs = ctx.resolveProjectPackage(dll);
      if (externJs) {
        // Strip .js extension and replace with `-manifest.json` and check if
        // we can still find it
        const externManifest = externJs.replace(/\.js$/, "-manifest.json");
        if (fs.existsSync(externManifest)) {
          const baseDir = ctx.resolvePackagePath(dll);
          resolved = true;
          plugins.push(
            new webpack.DllReferencePlugin({
              context: baseDir,
              manifest: require(externManifest)
            }),
          );
        }
      }
    });
  }

  return {
    entry: getEntryConfig(ctx),
    context: ctx.getDirectory("project"),
    mode: ctx.getMode(),
    target: "node",
    node: {
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.react\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                icon: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          exclude: /node_modules|\.react\.svg$/,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.([tj]sx?|json)$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: Object.assign(
                {
                  context: ctx.getDirectory("project"),
                  configFile: ctx.getConfigFilePath("tsconfig.json"),
                },
                tsLoaderOptions
              ),
            },
          ],
        },
      ],
    },
    plugins: plugins,
    externals,
    resolve: {
      extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
    },
    output: Object.assign(
      {
        path: ctx.getDirectory("dist"),
        publicPath: "/",
        filename: "[name].js",
      },
      libraryOutput
    ),
  };
};