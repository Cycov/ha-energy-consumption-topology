import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/energy-consumption-topology.js",
  output: {
    file: "dist/energy-consumption-topology.js",
    format: "es",
  },
  plugins: [resolve(), terser()],
};
