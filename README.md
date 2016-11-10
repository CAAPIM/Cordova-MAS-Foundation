# MAS Foundation Plugin for Cordova
## Overview
MAS-Foundation-Cordova is the core Cordova Plugin for [CA Mobile App Services][mas.ca.com]

## Features
The MAS-Foundation-Cordova plugin comes with the following features:
- Authentication
    + OAuth
    + OIDC
    + BLE
    + Dynamic Client ID & Client Secret
    + QR Code
    + Social Login
    + Single Sign On
    + One Time Password
- Dynamic SDK Configuration
- Enterprise Browser
- Geo Location

## Get Started

For documentation guide, visit our [developer site][docs].

## Cordova Installation And Project Setup ##
#### Prerequisites

1. Donwload and install Node.js. Download installer from: [NodeJS website][nodejs]
2. Install Cordova utility.  In terminal, execute the following command: ```sudo npm install -g cordova```
3. To verify Cordova installation, execute the following command: ```cordova --version```
4. Clone `MAS-Foundation-Cordova` Plugin project from the [repo][cordova-repo]


## iOS Project Setup

1. Create Cordova project by executing the following command in terminal: ```cordova create PROJECT_DIR_NAME com.app.bundle.identifier PROJECT_SCHEME```
2. cd into the ```PROJECT_DIR_NAME```
3. Execute the following command in terminal to add iOS platform to the project: ```cordova platform add ios```
4. Execute the following command in terminal to add MASPlugin to the project: ```cordova plugin add PATH_TO_PLUGIN```.  Note that ```PATH_TO_PLUGIN``` is the absolute file path to the Cordova repo directory.
5. Replace the sample index.html file ```PROJECT_DIR_NAME/www/index.html``` with ```PROJECT_DIR_NAME/plugins/cordova-plugin-mas-core/sample/html/index.html```.
6. Execute following command in terminal: ```cordova prepare```; this command will update the master index.html code into platform specific project.
7. Open Cordova iOS project in Xcode, and make sure to add ```MASFoundation.framework```, ```MASUI.framework```, and ```MASUIResources.bundle```.  To download these frameworks goto [CAAPIM Releases][releases] repository. Navigate to ```MAS-<version>/iOS``` and download the ```iOS-MobileSDK-<version>.zip``` file. 
8. Add a valid ```msso_config.json``` of your gateway into your project directory.
9. In ```.plist``` of the project, make sure to add following value: ```    <key>NSLocationWhenInUseUsageDescription</key>
    <string>The application needs a location to use the MAS backend services</string>```
10. Build your project in Xcode.

**Note**
```
1. If you are using older version of Cordova along with latest version of Xcode, you may experience problem updating master html/js codes into your platform staging directories.  Please make sure you have the latest version of Cordova and the Cordova version is compatible with your Xcode version.
2. If your Cordova framework is older version, there is a chance that Cordova creates the project with older configuration.  Please ensure that the following settings are properly set for the latest development.

- In Xcode's Build Settings tab, search for **Enable Modules (C and Objective-C)** and set value to **YES**
- In Xcode, development target is properly set as older version of Cordova creates the project with development target for iOS 6. **Minmun version of iOS required for MASPlugin is iOS 8.x+.**
```

## Android Project Setup
1. Create Cordova project by executing the following command in terminal: ```cordova create PROJECT_DIR_NAME com.app.bundle.identifier PROJECT_SCHEME```
2. cd into the ```PROJECT_DIR_NAME```
3. Execute the following command in terminal to add Android platform to the project: ```cordova platform add android```
4. Execute the following command in terminal to add Cordova Plugin to the project: ```cordova plugin add PATH_TO_PLUGIN```.  Note that ```PATH_TO_PLUGIN``` is the absolute file path to the Cordova Plugin directory.
5. Replace the sample index.html file ```PROJECT_DIR_NAME/www/index.html``` with ```PROJECT_DIR_NAME/plugins/cordova-plugin-mas-core/sample/html/index.html```.
6. Execute following command in terminal: ```cordova prepare```; this command will update the master index.html code into platform specific project.
7. Copy the SDK libraries to the libs directory of your project. To download these libraries goto [CAAPIM Releases][releases] repository. Navigate to ```MAS-<version>/Android``` and download the ```Android-MobileSDK-<version>.zip``` file.
8. Open Cordova project in Android Studio, and add the MAS,Bouncycastle and QRCode authentication dependencies in the build.gradle file:
 - ```compile 'com.ca.mas.core:mobile-api-gateway-sdk-<build-version>@aar'```
 - ```compile 'com.ca.mas:mobile-app-service-sdk-<build-version>@aar'```
 - ```compile 'com.ca.mas.ui:mobile-app-service-sdk-ui-<build-version>@aar'```
 - ```compile 'com.madgag:scprov-jdk15on:1.47.0.3'```
 - ```compile 'com.madgag:sc-light-jdk15on:1.47.0.3'```
 - ```compile 'com.google.zxing:core:3.2.0'```
9. In the build.gradle file, add the repository section as below.
    ```
    repositories {
        mavenCentral()
        flatDir {
            dirs 'libs'
        }
    }
    ```
    **If repository section is already there then just add the _flatDir_ section.** 
10. Add a valid ```msso_config.json``` of your gateway into the assets folder of your project..
10. Update the minSdkVersion in AndroidManifest.xml to 19 or more if the Android Studio recommends as per the version of Android SDK being used.
11. Update the target to android-23 or more as required.
12. Build your project in Android Studio.
 
## How You Can Contribute
Contributions are welcome and much appreciated. To learn more, see the [Contribution Guidelines][contributing].

## License
Copyright (c) 2016 CA. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the [LICENSE][license-link] file for details.


[nodejs]: https://nodejs.org
[cordova-repo]: https://github.com/CAAPIM/MAS-Foundation-Cordova
[releases]: https://github.com/CAAPIM/Releases
[mas.ca.com]: http://mas.ca.com/
[docs]: http://mas.ca.com/docs/
 [contributing]: /CONTRIBUTING.md
 [license-link]: /LICENSE