# Version 1.7.10

### Bug fixes
- None

### New features
- API to register Authentication Listener/Login Block to Cordova Plugin. [US510676]
  - MAS.setAuthCallbackHandler(authHandler)
  - MAS.removeAuthCallbackHandler()

### Deprecated classes
- None

### Removed classes
- None

# Version 1.7

### Bug fixes
- None

### New features
- Business logic for login moved over to the developers. [US469657]
- Config file preference to specify the iOS deployment target.
- CocoaPods integration with framework podspec for iOS 'MASFoundation' framework.

### Deprecated classes
- None

### Removed classes
- getAuthCredentialsType has been removed.

# Version 1.6.10

### Bug fixes
- None

### New features
- None

### Deprecated classes
- None

# Version 1.6

### Bug fixes
- None

### New features
- Set security configuration to access public server APIs.
- Start SDK with msso_config.json from a URL.
- Sign claims with keys to generate JWT token.
- Login with authorization credentials with username/password, JWT token and auth code.

### Deprecated classes
- None.

# Version 1.5

### Bug fixes
- None

### New features
- Exposed API to get accessToken in MASPluginUser.
- Exposed API for loginWithIdToken in MASPluginUser.
- Now available as npm package "cordova-plugin-mas-core".

### Deprecated classes
- None.

# Version 1.4

### Bug fixes
- An Enterprise browser webapp on back button press will now go back to Enterprise Browser base view (Android only). [DE273428]
- On cancelling the SSL error verify dialog screen goes blank. Fixed to move back to EB window (Android only). [DE273690]
- Improved Error handling and Error message standardized.

### New features
- Social Login Support in Cordova [US236694,US236697]
- Refactoring the code - New plugins to handle different flow i.e. Device, Application, User and MAS APIs  [US298706]
- Provided MASUI support for new Login and OTP screens, to be in sync with native SDK (Android only). [US298706]
- MASUser APIs made instance specific. This would now require an instance of MASUser to be created to access its state variable.[US298706]
- Change in Javascript files and index to call different native Cordova Plugins as per the flow.[US298706]
- Added Reference Documentation for Cordova APIs [US304202]

### Deprecated classes
- None.

# Version 1.3.00

### Bug fixes
- NA

### New features
- Initial Release for MAS Foundation.

### Deprecated methods
- NA


 [mag]: https://docops.ca.com/mag
 [mas.ca.com]: http://mas.ca.com/
 [docs]: http://mas.ca.com/docs/
 [blog]: http://mas.ca.com/blog/

 [releases]: ../../releases
 [contributing]: /CONTRIBUTING.md
 [license-link]: /LICENSE