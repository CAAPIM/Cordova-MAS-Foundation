var fs = require('fs'),
    plist = require('plist'),
    fileHound = require('filehound'),
    xcode = require('xcode');

module.exports = function (context) {

    var iOSConfigPath = process.cwd() + '/platforms/ios/msso_config.json';

    if (fs.existsSync('platforms/ios/ios.json')) {

        //  Remove msso_config.json configuration file.
        fileHound.create()
            .paths('./platforms/ios/')
            .depth(0)
            .ext('pbxproj')
            .find()
            .then(files => {
                files.forEach(file => {

                    var ProjectDir = (file.split("/").slice(-2)[0]).split(".")[0];

                    //  Remove authorizations for location services. 
                    fileHound.create()
                        .paths('./platforms/ios/' + ProjectDir + '/')
                        .depth(0)
                        .ext('plist')
                        .match('*' + ProjectDir + '-Info*')
                        .find()
                        .then(files => {
                            files.forEach(file => {

                                var infoPlist = plist.parse(fs.readFileSync(file, 'utf8'));

                                if (infoPlist.NSLocationWhenInUseUsageDescriptio === 'The application requires location services to connect to MAS backend services.')
                                    delete infoPlist.NSLocationWhenInUseUsageDescriptio;
                                if (infoPlist.NSLocationAlwaysUsageDescription === 'The application requires location services to connect to MAS backend services.')
                                    delete infoPlist.NSLocationAlwaysUsageDescription;
                                if (infoPlist.NSLocationAlwaysAndWhenInUseUsageDescription === 'The application requires location services to connect to MAS backend services.')
                                    delete infoPlist.NSLocationAlwaysAndWhenInUseUsageDescription;
                                if (infoPlist.NSFaceIDUsageDescription === 'The application requires FaceId authentication.')
                                    delete infoPlist.NSFaceIDUsageDescription;

                                fs.writeFileSync(file, plist.build(infoPlist));
                            });
                        });

                    var appProj = xcode.project(file);
                    appProj.parse(function (err) {
                        //
                        //  Remove the msso_config.json from resources directory of the XCode project.
                        //
                        if (fs.existsSync(iOSConfigPath)) {
                            appProj.removeResourceFile(iOSConfigPath);
                            fs.unlinkSync(iOSConfigPath);
                        }
                        fs.writeFileSync(file, appProj.writeSync());
                        console.log('\n' + 'Successfully removed configuration file ' + iOSConfigPath + '\n');
                    });
                });
            });

    }
    //Remove the msso_config.json configuration file from Android project's 'assets' folder.
    if (fs.existsSync('platforms/android/android.json')) {
        if (fs.existsSync('platforms/android/app/src/main/assets/msso_config.json')) {
            fs.unlinkSync('platforms/android/app/src/main/assets/msso_config.json');
            console.log('\n' + 'Successfully removed configuration file ' + 'platforms/android/app/src/main/assets/msso_config.json' + '\n');
        }
        if (fs.existsSync('platforms/android/assets/msso_config.json')) {
            fs.unlinkSync('platforms/android/assets/msso_config.json');
            console.log('\n' + 'Successfully removed configuration file ' + 'platforms/android/assets/msso_config.json' + '\n');
        }
    }
}