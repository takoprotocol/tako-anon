import webpack from "webpack";
import CopyPlugin from "copy-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/**/*",
      "./node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/barretenberg_wasm_thread/factory/node/thread.worker.js",
    ],
  },
  serverExternalPackages: ["@aztec/bb.js", "@noir-lang/noir_js"],
  webpack: (config: webpack.Configuration) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    );
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "../../node_modules/@aztec/bb.js/dest/node/barretenberg_wasm/barretenberg-threads.wasm",
            to: ".",
          },
        ],
      })
    );
    return config;
  },
};

export default nextConfig;
