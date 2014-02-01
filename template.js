var fs = require("fs");

exports.description = "Creates a basic node project with test infrastructure.";
exports.notes = "This template creates an initial Gruntfile and package.json.";
exports.warnOn = [ "Gruntfile.js", "package.json" ];

exports.template = function (grunt, init, done) {

	function createDirectory (path) {
		try {
			fs.mkdirSync(path);
		}
		catch (error) {
			grunt.fail.warn(error);
		}
	}

	init.process(
		{},
		[
			init.prompt("author_name"),
			init.prompt("author_email"),
			init.prompt("homepage"),
			init.prompt("licenses"),
			init.prompt("name"),
			init.prompt("description"),
			init.prompt("npm_test", "grunt"),
			init.prompt("repository"),
			init.prompt("version")
		],
		function (error, properties) {
			var files = init.filesToCopy(properties);

			createDirectory("lib");
			createDirectory("test");

			init.addLicenseFiles(files, properties.licenses);
			init.copyAndProcess(files, properties);
			init.writePackageJSON("package.json", properties);

			grunt.util.spawn(
				{
					args : [
						"install", "--save-dev", "chai", "grunt-cli",
						"grunt-contrib-jshint", "grunt-jscs-checker",
						"istanbul", "mocha"
					],
					cmd  : "npm",
					opts : { stdio : "inherit" }
				},
				done
			);
		}
	);
};
