/* eslint-disable @typescript-eslint/no-var-requires */
const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const tailwindcssNesting = require("tailwindcss/nesting");
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [postcssImport, tailwindcssNesting, tailwindcss, autoprefixer],
};
