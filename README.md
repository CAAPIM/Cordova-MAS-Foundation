Cordova-MAS-Foundation is the core Cordova framework for CA Mobile API Gateway.
*********************************************************

## Features
The Cordova-MAS-Foundation framework has the following features:

* User Authentication and Authorization
* Customize Login Dialogs
* Enterprise Browser
* Fingerprint Sessions Lock
* One-Time Password (OTP)
* Proximity Login (QR Code)
* Social Login

*********************************************************

## Get Started
Follow our [documentation](http://mas.ca.com/docs/) to install Cordova and set up iOS and Android projects.
*********************************************************

## Generate Reference documents

The reference documents for the MAS modules are generated using the JSDoc markdown language. JSDoc reads the JS files with annotations in comments, and generates an HTML output. It considers the comments that start with /**.

To install JSDoc, follow the instructions on [JSDoc](http://usejsdoc.org/) website.

The Cordova reference documents are available at our [mas.ca.com]( http://mas.ca.com/docs/cordova/1.4.00/sdk/) site.

Example:
An annotated comment for validateOTP method is as follows:

```
 /**
  Validate the OTP.
  * @param {function} successHandler user defined success callback
  * @param {function} errorHandler user defined error callback
  * @param {string} otp user defined one-time password to verify
  */
```

**Param** – Specifies a parameter.
**{string}**  – Specifies the return type of the method.
**otp** – Specifies the variable name.
**user defined one-time password to verify** – Describes the method.

Compile the JSDoc reference document as follows:

```
jsdoc www/ -d jsdocs
```

where “www/” is the location of the js file, and “-d jsdocs” is the location where the generated reference documents are placed.

For more information about how to write and compile the JSDoc reference documents, see the [JSDoc](http://usejsdoc.org/) website.

## How You Can Contribute

Contributions are welcome and much appreciated. To learn more, see the [Contribution Guidelines](https://github.com/CAAPIM/Cordova-MAS-Foundation/blob/develop/CONTRIBUTING.md).

## Communication

- *Have general questions or need help?*, use [Stack Overflow][StackOverflow]. (Tag 'massdk')
- *Find a bug?*, open an issue with the steps to reproduce it.
- *Request a feature or have an idea?*, open an issue.

## License
Copyright (c) 2016 CA. All rights reserved.

This software may be modified and distributed under the terms of the MIT license. See the [LICENSE](https://github.com/CAAPIM/Cordova-MAS-Foundation/blob/develop/LICENSE) file for details.
