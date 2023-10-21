module.exports = {
	webpack: config => {
		config.watchOptions.pull = 300;
		return config;
	},
};
