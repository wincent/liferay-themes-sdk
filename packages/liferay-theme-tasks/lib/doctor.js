'use strict';

var gutil = require('gulp-util');
var lfrThemeConfig = require('./liferay_theme_config');

var chalk = gutil.colors;

module.exports = function(themeConfig) {
	themeConfig = themeConfig || lfrThemeConfig.getConfig(true);

	if (!themeConfig) {
		return;
	}

	var dependencies = themeConfig.dependencies;
	var liferayVersion = themeConfig.liferayTheme.version;
	var supportCompass = themeConfig.liferayTheme.supportCompass;

	var missingDeps = 0;

	if (liferayVersion == '7.0') {
		missingDeps = logMissingDeps(dependencies, 'liferay-theme-deps-7.0', missingDeps);

		if (supportCompass) {
			missingDeps = logMissingDeps(dependencies, 'gulp-ruby-sass', missingDeps);
		}
	}
	else if (liferayVersion == '6.2') {
		missingDeps = logMissingDeps(dependencies, 'liferay-theme-deps-6.2', missingDeps);

		if (!supportCompass) {
			missingDeps = logMissingDeps(dependencies, 'gulp-sass', missingDeps);
		}
	}

	haltTask(missingDeps);
};

function haltTask(missingDeps) {
	if (missingDeps > 0) {
		throw new Error('Missing ' + missingDeps + ' theme dependencies');
	}
}

function logMissingDeps(dependencies, moduleName, missingDeps) {
	if (!dependencies[moduleName]) {
		gutil.log(chalk.red('Warning:'), 'You must install the correct dependencies, please run', chalk.cyan('npm i --save', moduleName), 'from your theme directory.');

		missingDeps++;
	}

	return missingDeps;
}