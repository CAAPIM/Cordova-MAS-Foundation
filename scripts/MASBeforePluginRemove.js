var fs = require('fs');

module.exports = function (context) {

    console.log('\n' + "Removing config file ");

    if (fs.existsSync('platforms/ios/ios.json')) {
        var iOSConfigPath = process.cwd() + '/platforms/ios/msso_config.json';
        if(fs.existsSync(iOSConfigPath)){
            fs.unlinkSync(iOSConfigPath);
        }
    }

    if (fs.existsSync('platforms/android/android.json')) {
        if (fs.existsSync('platforms/android/app/src/main/assets/msso_config.jso')) {
            fs.unlinkSync('platforms/android/app/src/main/assets/msso_config.json');
        }
        if (fs.existsSync('platforms/android/assets/msso_config.json')) {
            fs.unlinkSync('platforms/android/assets/msso_config.json');
        }
    }
}