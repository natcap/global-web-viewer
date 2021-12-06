module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-styled-components',
  ],
  noParse: /(mapbox-gl)\.js$/,
  ignore: [ './node_modules/mapbox-gl/dist/mapbox-gl.js' ]
};
