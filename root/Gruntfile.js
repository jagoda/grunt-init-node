var path  = require("path");

module.exports = function (grunt) {
    
    var sourceFiles = [ "*.js", "lib/**/*.js" ],
        testFiles   = [ "test/**/*.js" ],
        allFiles    = sourceFiles.concat(testFiles);
    
    function localCommand (command) {
        return path.join(__dirname, "node_modules", ".bin", command);
    }
    
    grunt.initConfig({
        
        jscs : {
            files   : allFiles,
            options : {
            
                requireCurlyBraces : [
                    "if", "else", "for", "while", "do", "try", "catch", "case",
                    "default"
                ],
                
                requireSpaceAfterKeywords : [
                    "if", "else", "for", "while", "do", "switch", "return",
                    "try", "catch"
                ],
                
                requireSpacesInFunctionExpression : {
                    beforeOpeningRoundBrace : true,
                    beforeOpeningCurlyBrace : true
                },
                
                requireMultipleVarDecl            : true,
                requireSpacesInsideObjectBrackets : "all",
                requireSpacesInsideArrayBrackets  : "all",
                disallowQuotedKeysInObjects       : true,
                requireSpaceAfterObjectKeys       : true,
                requireAlignedObjectValues        : "skipWithLineBreak",
                
                disallowLeftStickedOperators : [
                    "?", "+", "-", "/", "*", "=", "==", "===", "!=", "!==", ">",
                    ">=", "<", "<="
                ],
                
                requireRightStickedOperators  : [ "!" ],
                
                disallowRightStickedOperators : [
                    "?", "+", "/", "*", ":", "=", "==", "===", "!=", "!==", ">",
                    ">=", "<", "<="
                ],
                
                requireLeftStickedOperators : [ "," ],
                
                disallowSpaceAfterPrefixUnaryOperators : [
                    "++", "--", "+", "-", "~", "!"
                ],
                
                disallowSpaceBeforePostfixUnaryOperators : [ "++", "--" ],
                
                requireSpaceBeforeBinaryOperators : [
                    "+", "-", "/", "*", "=", "==", "===", "!=", "!=="
                ],
                
                requireSpaceAfterBinaryOperators : [
                    "+", "-", "/", "*", "=", "==", "===", "!=", "!=="
                ],
                
                disallowImplicitTypeConversion : [
                    "numeric", "boolean", "binary", "string"
                ],
                
                disallowKeywords : [ "with" ],
                
                disallowMultipleLineBreaks : true,
                validateLineBreaks         : "LF",
                
                requireKeywordsOnNewLine : [ "else" ],
                
                safeContextKeyword : "that",
                
                excludeFiles : [ "node_modules/**" ]
                
            }
        },
        
        jshint : {
            options : {
                bitwise       : true,
                camelcase     : true,
                curly         : true,
                eqeqeq        : true,
                es3           : false,
                forin         : false,
                immed         : true,
                indent        : 4,
                latedef       : true,
                newcap        : true,
                noarg         : true,
                noempty       : true,
                nonew         : true,
                plusplus      : true,
                quotmark      : "double",
                undef         : true,
                unused        : true,
                strict        : false,
                trailing      : true,
                maxparams     : 3,
                maxdepth      : 3,
                maxstatements : false,
                maxlen        : 80,
                
                node : true,
                
                ignores : [ "node_modules/**/*.js" ]
            },
            
            src : sourceFiles,
            
            testOverrides : {
                options : {
                    expr : true,
                    
                    globals : {
                        after      : false,
                        before     : false,
                        afterEach  : false,
                        beforeEach : false,
                        describe   : false,
                        it         : false
                    }
                },
                
                files : {
                    test : testFiles
                }
            }
        }
        
    });
    
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs-checker");
    
    grunt.registerTask("default", [ "lint", "style", "test", "coverage" ]);
    
    grunt.registerTask(
        "coverage",
        "Create a test coverage report.",
        function () {
            var done = this.async();
            
            grunt.log.writeln(
                "Checking test coverage thresholds..."
            );
            grunt.util.spawn(
                {
                    args : [
                        "check-coverage", "--statements", "100",
                        "--functions", "100", "--branches", "100",
                        "--lines", "100"
                    ],
                    cmd  : localCommand("istanbul"),
                    opts : {
                        stdio : "inherit"
                    }
                },
                function (error) {
                    if (error) {
                        grunt.log.error("Some code is not covered.");
                        return grunt.fail.fatal(error);
                    }
                    else {
                        grunt.log.ok("All code has test coverage.");
                        return done();
                    }
                }
            );
        }
    );
    
    grunt.registerTask("lint", "Check for common code problems.", [ "jshint" ]);
    
    grunt.registerTask("style", "Check for style conformity.", [ "jscs" ]);
    
    grunt.registerTask("test", "Run the test suite.", function () {
        var done        = this.async(),
            environment = Object.create(process.env);
        
        environment.NODE_ENV = "test";
        grunt.log.writeln("Invoking the mocha test suite...");
        grunt.util.spawn(
            {
                args : [
                    "cover", localCommand("_mocha"), "--", "--recursive",
                    "--reporter", "spec", path.join(__dirname, "test")
                ],
                cmd  : localCommand("istanbul"),
                opts : {
                    env   : environment,
                    stdio : "inherit"
                }
            },
            function (error) {
                if (error) {
                    grunt.log.error("Some tests failed.");
                    grunt.fail.fatal(error);
                }
                else {
                    grunt.log.ok("All tests passed.");
                }
                done();
            }
        );
    });
    
};
