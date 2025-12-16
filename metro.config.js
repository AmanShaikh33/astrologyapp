const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
	// point at the app-level global.css where Tailwind directives live
	input: './app/global.css',
	// ensure tailwind config is resolved correctly
	configPath: './tailwind.config.js',
});