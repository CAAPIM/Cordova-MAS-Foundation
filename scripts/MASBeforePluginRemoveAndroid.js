var fs = require('fs');

module.exports = function (context) {
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