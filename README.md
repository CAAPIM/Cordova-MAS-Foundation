# CordovaPlugin
This is the repo for the Cordova Plugin

## Cordova Installation

### Prerequisites

1. Donwload and install Node.js. Download installer from: [NodeJS website][nodejs]
2. Install Cordova utility.  In terminal, execute the following command: ```sudo npm install -g cordova```
3. To verify Cordova installation, execute the following command: ```cordova --version```
4. Clone Cordova Plugin project from the [repo][cordova-repo]


### iOS Project Setup

1. Create Cordova project by executing the following command in terminal: ```cordova create PROJECT_DIR_NAME com.app.bundle.identifier PROJECT_SCHEME```
2. cd into the ```PROJECT_DIR_NAME```
3. Execute the following command in terminal to add iOS platform to the project: ```cordova platform add ios```
4. Execute the following command in terminal to add MASPlugin to the project: ```cordova plugin add PATH_TO_PLUGIN```.  Note that ```PATH_TO_PLUGIN``` is the absolute file path to the Cordova repo directory.
5. Open Cordova iOS project in Xcode, and make sure to add ```MASFoundation.framework```, ```MASUI.framework```, and ```MASUIResources.bundle```.  Also add valid ```msso_config.json``` of your gateway.
6. In Xcode, make sure that development target is properly set **(older version of Cordova creates the project with development target for iOS 6)**.
7. In Xcode's Build Settings tab, search for **Enable Modules (C and Objective-C)** and set value to **YES**
8. In ```.plist``` of the project, make sure to add following value: ```    <key>NSLocationWhenInUseUsageDescription</key>
    <string>The application needs a location to use the MAS backend services</string>```
9. In Xcode's project directories, locate ```Staging->www```.  Replace the ```index.html``` with the ```index.html``` in the ```CORDOVA_REPO/sample/html/index.html```.
10. Execute following command in terminal: ```cordova prepare```.
11. Build your project in Xcode.

### Android Project Setup
1. Create Cordova project by executing the following command in terminal: ```cordova create PROJECT_DIR_NAME com.app.bundle.identifier PROJECT_SCHEME```
2. cd into the ```PROJECT_DIR_NAME```
3. Execute the following command in terminal to add Android platform to the project: ```cordova platform add android```
4. Execute the following command in terminal to add MASPlugin to the project: ```cordova plugin add PATH_TO_PLUGIN```.  Note that ```PATH_TO_PLUGIN``` is the absolute file path to the Cordova repo directory.
5. Open Cordova project in Android Studio, and add the following dependencies in the build.gradle file:
 - compile 'com.ca.mas.core:mobile-api-gateway-sdk-3.2.0@aar'
 - compile 'com.ca.mas:mobile-app-service-sdk-1.2.0@aar'
 - compile 'com.ca.mas.ui:mobile-app-service-sdk-ui-1.2.0@aar'
6. Copy above SDK libraries to the libs directory
7. Also add valid ```msso_config.json``` of your gateway.
8. Build your project in Android Studio.


[nodejs]: https://nodejs.org
[cordova-repo]: https://github.com/CAAPIM/MAS-Cordova
