const path = require("path");

module.exports = (ctx) => {
  // Find the base dir from the entry point(s)
  const entryPoint = ctx.getConfig("entry");
  let includeDirs;
  if (typeof entryPoint !== "string") {
    includeDirs = Object.keys(entryPoint).map((key) => {
      return path.dirname(entryPoint[key]) + "/**/*";
    });
  } else {
    includeDirs = [path.dirname(entryPoint) + "/**/*"];
  }

  return {
    compilerOptions: {
      allowJs: true,
      allowSyntheticDefaultImports: true,
      baseUrl: ctx.getDirectory("project"),
      declaration: true,
      declaration: true,
      declarationDir: ctx.getDirectory("dist"),
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      importsNotUsedAsValues: "preserve",
      jsx: "react",
      lib: ["dom", "es2018"],
      module: "es6",
      moduleResolution: "node",
      noImplicitAny: true,
      outDir: ctx.getDirectory("dist"),
      resolveJsonModule: true,
      sourceMap: true,
      strict: true,
      target: "es6",
    },
    include: [
      ...new Set(includeDirs),
      path.join(ctx.getConfigFilePath("@types"), "*"),
    ],
    exclude: ["node_modules", "**/*.spec.ts"],
  };
};
