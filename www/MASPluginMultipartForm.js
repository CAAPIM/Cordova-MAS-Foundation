/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

/**
* @class MASPluginMultipartForm
* @hideconstructor
* @classdesc A class to create and set Multipart form details for a POST request.
* <table>
*	<tr bgcolor="#D3D3D3"><th>MASPluginMultipartForm Constructor</th></tr>
*	<tr><td><i>var MASMultipartForm = new MASPlugin.MASMultipartForm();</td></tr>
* </table>
*/
var MASPluginUtils = require("./MASPluginUtils");
var MASPluginMultipartForm = function(){
	this.formData = {},
	this.files = [],
	/**
	* Allows to add key value pairs (ASCII) to the form data
	* @memberOf MASPluginMultipartForm
	* @function addFormData
	* @instance
	* @param {string} key The name of the attribute
	* @param {string} value The value of the attribute
	*/
	this.addFormData = function(key, value){
	    if(!MASPluginUtils.isEmpty(key)){
		    this.formData[key] = value;
		}
	},
	/**
	* Adds a file object to the multipart form
	* @deprecated
	* @memberOf MASPluginMultipartForm
	* @function addFiles
	* @instance
    * @param {string} fileName Name of the file to be uploaded
	* @param {string} filePath Local path of the file on the SD/drive on the phone. The path should be accessible by native platform.
	* @param {string} fileMimeType Type of the file ex. "text/plain" or "image/png" etc.
    * @param {string} fileFieldName Field name in the multipart form request
    * @param {string} fileData Base64 Encoded bytes of the file. If not available,make sure that filePath is on a readable path on card.
	*/
	this.addFiles = function(fileName,filePath,fileMimeType,fileFieldName,fileData){
		let uploadFile =
		{
		    "fileName":fileName,
		    "filePath":filePath,
		    "fileMimeType":fileMimeType,
		    "fileFieldName":fileFieldName,
		    "fileData":fileData
		};
		this.files.push(uploadFile);
	},

		/**
	* Adds a file object to the multipart form
	* @memberOf MASPluginMultipartForm
	* @function addFiles
	* @instance
    * @param {string} fileName Name of the file to be uploaded
	* @param {string} fileMimeType Type of the file ex. "text/plain" or "image/png" etc.
    * @param {string} fileFieldName Field name in the multipart form request
    * @param {string} fileData Base64 Encoded bytes of the file. If not available,make sure that filePath is on a readable path on card.
	*/
	this.addFiles = function(fileName,fileMimeType,fileFieldName,fileData){
		let uploadFile =
		{
		    "fileName":fileName,
		    "fileMimeType":fileMimeType,
		    "fileFieldName":fileFieldName,
		    "fileData":fileData
		};
		this.files.push(uploadFile);
	},

	/**
	* Returns the final JavaScript Object representation of MASPluginMultipartForm in  JSON format.
    * @memberOf MASPluginMultipartForm
	* @function getMultipartForm
	* @instance
    * @returns {Object} The MASPluginMultipartForm object.
    */
	this.getMultipartForm = function(){
		let finalForm =  {
		formData:this.formData,
		files : this.files
		};
		return finalForm;
	}
}
module.exports = MASPluginMultipartForm;