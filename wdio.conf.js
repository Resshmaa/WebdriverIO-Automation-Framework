const Log = require('./CommonUtils/Log');
const argv = require("yargs").argv;
const DateUtil = require('./CommonUtils/DateUtil');
const fs = require('fs');
const path = require('path');
const { removeSync } = require('fs-extra');
const wdioParallel = require('wdio-cucumber-parallel-execution');



// The below module is used for cucumber html report generation
const reporter = require('cucumber-html-reporter');
const cucumberJson = require('wdio-cucumberjs-json-reporter');
const BrowserUtil = require('./CommonUtils/BrowserUtil');
const currentTime = DateUtil.getDateISOString().replace(/:/g, "-");
const jsonTmpDirectory = './reports/json/tmp/';
const junitReportDirectory = './reports/junit/';
const { attach } = require('@wdio/cucumber-framework');


// For receiving --log parameters.
logLevelSettings = argv.log || "DEBUG" //if --log is supplied, set loglevel; else, default to DEBUG
Log.setLogLevel(logLevelSettings);


// For receiving --env parameters.
testEnv = argv.env || "prod" //if --env is supplied, set env; else, default to CTE
Log.audit('Current Test Environment: ' + testEnv);


//For receiving --headless parameter
// if --headless parameter is supplied, set the browser args
// https://webdriver.io/docs/docker/
chromeArgs = [];
if (argv.headless) {
    Log.audit('Browser mode: Headless')
    chromeArgs = ['--headless', '--disable-gpu', 'window-size=1600,900', '--no-sandbox', '--disable-infobars', '--disable-dev-shm-usage', '--disable-features=UserAgentClientHint'];

}
else { Log.audit('Browser mode: On Screen') }


// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(__dirname, 'tempDownloads');


// If parallel execution is set to true, then split the feature files
// And store then in a tmp spec directory (created inside `the source spec directory)
if (argv.parallel === 'true') {
    tmpSpecDirectory = `${sourceSpecDirectory}/tmp`;
    wdioParallel.performSetup({
        sourceSpecDirectory: sourceSpecDirectory,
        tmpSpecDirectory: tmpSpecDirectory,
        cleanTmpSpecDirectory: true
    });
    featureFilePath = `${tmpSpecDirectory}/*.feature`;
}



exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    specs: [
        // ToDo: define location for spec files here
        './SampleProject/Features/*.feature'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            "args": chromeArgs,
            prefs: {
                'directory_upgrade': true,
                'prompt_for_download': false,
                'download.default_directory': downloadDir
            }
        }
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'warn',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: 'http://localhost',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    //services: [''],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    // reporters: [//for cucumberjson
    //     ['cucumberjs-json', {
    //         jsonFolder: jsonTmpDirectory,
    //         language: 'en',
    //     }],
    // ],

    reporters: [
        'spec',
        ['cucumberjs-json', {
            jsonFolder: jsonTmpDirectory,
            language: 'en',
        }],
    ],


    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: ['./SampleProject/StepDefs/*.js'],
        // <boolean> show full backtrace for errors
        backtrace: false,
        // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        requireModule: [],
        // <boolean> invoke formatters without executing steps
        dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <string[]> Only execute the scenarios with name matching the expression (repeatable).
        name: [],
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <boolean> fail if there are any undefined or pending steps
        strict: false,
        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: '',
        // <number> timeout for step definitions
        timeout: 120000,
        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false
    },


    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },

    onPrepare: () => {
        // Remove the `tmp/` folder that holds the json report files
        removeSync(jsonTmpDirectory);
        if (!fs.existsSync(jsonTmpDirectory)) {
            fs.mkdirSync(jsonTmpDirectory);
        }

        // Remove the `reports/junit` folder that hold the junit reports
        // junit folder is recreated by wdio reporter automatically, so there is no need to recreate it here
        removeSync(junitReportDirectory);

        // Remove the downaload dir then create if it doesn't exist
        removeSync(downloadDir);
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }
    },

    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Cucumber Hooks
     *
     * Runs before a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // beforeFeature: function (uri, feature) {
    // },

    beforeFeature: function (uri, feature) {
        Log.audit("======================================================================")
        Log.audit("FEATURE to be executed is: " + feature.name);
    },

    /**
     *
     * Runs before a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
     * @param {object}                 context  Cucumber World object
     */
    // beforeScenario: function (world, context) {
    // },

    beforeScenario: function (world, context) {
        Log.audit("-----------------------------------------------------------------------")
        Log.audit("SCENARIO to be executed is: " + world.pickle.name);
    },

    /**
     *
     * Runs before a Cucumber Step.
     * @param {Pickle.IPickleStep} step     step data
     * @param {IPickle}            scenario scenario pickle
     * @param {object}             context  Cucumber World object
     */
    // beforeStep: function (step, scenario, context) {
    // },
    /**
     *
     * Runs after a Cucumber Step.
     * @param {Pickle.IPickleStep} step             step data
     * @param {IPickle}            scenario         scenario pickle
     * @param {object}             result           results object containing scenario results
     * @param {boolean}            result.passed    true if scenario has passed
     * @param {string}             result.error     error stack if scenario failed
     * @param {number}             result.duration  duration of scenario in milliseconds
     * @param {object}             context          Cucumber World object
     */
    // afterStep: function (step, scenario, result, context) {
    // },


    afterStep: async function (step, scenario, { error, duration, passed }) {
        if (!passed) {
            const screenshot = await browser.takeScreenshot();
            await attach(screenshot, 'image/png');
        }
    },

    /**
     *
     * Runs after a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
     * @param {object}                 result           results object containing scenario results
     * @param {boolean}                result.passed    true if scenario has passed
     * @param {string}                 result.error     error stack if scenario failed
     * @param {number}                 result.duration  duration of scenario in milliseconds
     * @param {object}                 context          Cucumber World object
     */
    // afterScenario: function (world, result, context) {
    // },

    afterScenario: async function (world, result, context) {
        var executionDuration = DateUtil.formatDuration(world.result.duration.nanos)
        Log.audit("SCENARIO: " + world.pickle.name + ", STATUS: " + world.result.status + ", EXECUTION DURATION: " + executionDuration);
        Log.audit("-----------------------------------------------------------------------")

        await BrowserUtil.reset();
    },

    /**
     *
     * Runs after a Cucumber Feature.
     * @param {string}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // afterFeature: function (uri, feature) {
    // },
    
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },

    onComplete: () => {

        if (argv.suite) {
            reportName = `reports/html/${argv.suite}-${currentTime}.html`;
        } else {
            reportName = `reports/html/${currentTime}.html`;
        }

        try {
            // Step 1: Consolidate all JSON reports
            const consolidatedJsonArray = wdioParallel.getConsolidatedData({
                parallelExecutionReportDirectory: jsonTmpDirectory
            });

            const jsonFile = path.join(jsonTmpDirectory, 'report.json');
            fs.writeFileSync(jsonFile, JSON.stringify(consolidatedJsonArray, null, 2));

            // Step 2: Read and deduplicate scenarios
            let content = JSON.parse(fs.readFileSync(jsonFile));

            content.forEach(feature => {
                const uniqueElements = [];
                const seenNames = new Set();

                feature.elements.forEach(element => {
                    if (!seenNames.has(element.name)) {
                        seenNames.add(element.name);
                        uniqueElements.push(element);
                    }
                });

                feature.elements = uniqueElements;
            });

            fs.writeFileSync(jsonFile, JSON.stringify(content, null, 2));

            // Step 3: Generate HTML report
            const options = {
                theme: 'bootstrap',
                jsonFile: jsonFile,
                output: reportName,
                reportSuiteAsScenarios: false,
                scenarioTimestamp: true,
                launchReport: true,
                ignoreBadJsonFile: true,
                screenshotsDirectory: 'reports/html/screenshots/',
                storeScreenshots: false,
                brandTitle: 'WDIO-CucumberJS Tests',
                metadata: {
                    'App Version': 'Version xxxxxx',
                    'Test Environment': testEnv,
                    'Parallel': 'Scenarios',
                    'Executed': 'Remote'
                }
            };

            reporter.generate(options);
        } catch (err) {
            console.error('[ERROR][onComplete] Report Generation Failed:', err);
        }
    }

    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}
