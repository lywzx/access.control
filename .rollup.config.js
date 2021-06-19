/**
 * @type import('@lywzx/rollup-build-script/interfaces/package-option').IRollupConfig
 */
module.exports = {
  ts: true,
  dts: true,
  tsconfigOverride: {
    include: ["src"],
    exclude: ["test", "example"],
    compilerOptions: {
      "module": "ES6",
    }
  },
  externalEachOther: true,
  inputPrefix: 'src',
}
