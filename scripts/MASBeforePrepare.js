var fs = require('fs'),
    plist = require('plist'),
    fileHound = require('filehound'),
    resolve = require('path').resolve,
    xcode = require('xcode');

module.exports = function (context) {

    var path = require('os').homedir() + '/masconfig/msso_config.json';
    var iOSConfigPath = process.cwd() + '/platforms/ios/msso_config.json';

    // Abort if the msso config path doesn't exist...
    if (!fs.existsSync(path)) {

        throw '\n' + 'Config file does not exist @ path : ' + path + '\n';
    }

    if (fs.existsSync('platforms/ios/ios.json')) {

        fs.writeFileSync(iOSConfigPath, fs.readFileSync(path));

        //
        //  Configure MAS iOS project with msso_config.json.
        //  Add Run script to remove the simulator file that is required to successfully deploy your app to the Apple Store.
        //
        fileHound.create()
            .paths('./platforms/ios/')
            .depth(0)
            .ext('pbxproj')
            .find()
            .then(files => {
                files.forEach(file => {

                    var ProjectDir = (file.split("/").slice(-2)[0]).split(".")[0];

                    //
                    //  Configure authorization for location services. 
                    //
                    fileHound.create()
                        .paths('./platforms/ios/' + ProjectDir + '/')
                        .depth(0)
                        .ext('plist')
                        .match('*' + ProjectDir + '-Info*')
                        .find()
                        .then(files => {
                            files.forEach(file => {
                                var infoPlist = plist.parse(fs.readFileSync(file, 'utf8'));

                                infoPlist.NSLocationWhenInUseUsageDescription =
                                    infoPlist.NSLocationAlwaysUsageDescription =
                                    infoPlist.NSLocationAlwaysAndWhenInUseUsageDescription =
                                    'The application requires location services to connect to MAS backend services.';

                                infoPlist.NSFaceIDUsageDescription = 'The application requires FaceId authentication.';

                                fs.writeFileSync(file, plist.build(infoPlist));

                                console.log('\n' + 'Successfully configured authorization for iOS location services.' + '\n');
                            });
                        });

                    var appProj = xcode.project(file);

                    appProj.parse(function (err) {

                        //
                        //  Add the msso_config.json to resources directory of the XCode project.
                        //
                        appProj.addResourceFile(iOSConfigPath);

                        //
                        //  Add the XCode proejct buildPhase 'Run Script' Shell script.
                        //  The script removes the simulator file that is required to successfully deploy your app to the Apple Store.
                        //
                        var script = "APP_PATH=\"${TARGET_BUILD_DIR}/${WRAPPER_NAME}\"\n\n# This script loops through the frameworks embedded in the application and\n# removes unused architectures.\nfind \"$APP_PATH\" -name '*.framework' -type d | while read -r FRAMEWORK\ndo\nFRAMEWORK_EXECUTABLE_NAME=$(defaults read \"$FRAMEWORK/Info.plist\" CFBundleExecutable)\nFRAMEWORK_EXECUTABLE_PATH=\"$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME\"\necho \"Executable is $FRAMEWORK_EXECUTABLE_PATH\"\n\nEXTRACTED_ARCHS=()\n\nfor ARCH in $ARCHS\ndo\necho \"Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME\"\nlipo -extract \"$ARCH\" \"$FRAMEWORK_EXECUTABLE_PATH\" -o \"$FRAMEWORK_EXECUTABLE_PATH-$ARCH\"\nEXTRACTED_ARCHS+=(\"$FRAMEWORK_EXECUTABLE_PATH-$ARCH\")\ndone\n\necho \"Merging extracted architectures: ${ARCHS}\"\nlipo -o \"$FRAMEWORK_EXECUTABLE_PATH-merged\" -create \"${EXTRACTED_ARCHS[@]}\"\nrm \"${EXTRACTED_ARCHS[@]}\"\n\necho \"Replacing original executable with thinned version\"\nrm \"$FRAMEWORK_EXECUTABLE_PATH\"\nmv \"$FRAMEWORK_EXECUTABLE_PATH-merged\" \"$FRAMEWORK_EXECUTABLE_PATH\"\n\ndone";
                        var options = { shellPath: '/bin/sh', shellScript: script };
                        var buildPhase = appProj.addBuildPhase([], 'PBXShellScriptBuildPhase', 'Run a script', appProj.getFirstTarget().uuid, options).buildPhase;

                        fs.writeFileSync(file, appProj.writeSync());
                    });
                });
            });
    }

    if (fs.existsSync('platforms/android/android.json')) {
        if (fs.existsSync('platforms/android/app/src/main/assets/')) {
            fs.createReadStream(path).pipe(fs.createWriteStream('platforms/android/app/src/main/assets/msso_config.json'));
        } else {
            fs.createReadStream(path).pipe(fs.createWriteStream('platforms/android/assets/msso_config.json'));
        }     
    }
    console.log('\n' + 'Successfully configured ' + ' cordova project with : ' + path + '\n');

};