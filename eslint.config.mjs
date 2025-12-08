import eslintConfigNext from "eslint-config-next";

const config = [
  {
    ignores: ["node_modules", ".next", "dist", "out"]
  },
  ...eslintConfigNext
];

export default config;
