/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginConstants = require("./MASPluginConstants"),
    MASPopup = require("./lib/simple-popup");

window.MASPopupUI = nil;

var MASPluginUtils = {
	
	this.isEmpty = function(val) {
        
        if (typeof val !== 'undefined' && val) {
            
            return false;
        }
        
        return true;
    },

    this.XHR = function(cfg)
	{
    	var xhr,
        url = cfg.url,
        method = cfg.method || 'GET',
        success = cfg.success || function () {},
        failure = cfg.failure || function () {};
		
        try {
         
            xhr = new XMLHttpRequest();
        } 
        catch (e) {
         
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
	
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4) 
            {
                if (xhr.status == 200) {
                    success.call(null, xhr);
                } 
                else {
                
                    failure.call(null, xhr);
                }
            }
        }

        xhr.open(method, url); 
        xhr.send(null);
    },

    this.onBackKeyPressEvent = function() {
            
        successHandler = function() {
            
            document.removeEventListener("backbutton", MASPluginUtils.onBackKeyPressEvent, false);
        };

        return Cordova.exec(successHandler, function() {}, "MASPlugin", "enterpriseBrowserWebAppBackButtonHandler", []);
    },

    this.setPopUpStyle = function(style) {
            
        MASPluginConstants.MASPopupStyle = style;
    },

    this.getPopUpStyle = function(){
        
        return MASPluginConstants.MASPopupStyle;
    },

    this.createPopupDiv: function() {

        if (typeof document.getElementsByClassName('popup-wrapper hide')[0] !== 'undefined') {

            var iDiv = document.createElement('div');
            iDiv.id = 'popup';
            iDiv.className = 'popup-wrapper hide';
        
            // Create the inner div before appending to the body
            var innerDiv1 = document.createElement('div');
            innerDiv1.className = 'popup-content';
        
            // The variable iDiv is still good... Just append to it.
            iDiv.appendChild(innerDiv1);
        
            // Create the inner div before appending to the body
            var innerDiv2 = document.createElement('div');
            innerDiv2.className = 'popup-title';
        
            // The variable iDiv is still good... Just append to it.
            innerDiv1.appendChild(innerDiv2);
        
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'popup-close';
            button.hidden = true;
        
            innerDiv2.appendChild(button);
        
            // Create the inner div before appending to the body
            var innerDiv3 = document.createElement('div');
            innerDiv3.id = 'popup-bdy';
            innerDiv3.className = 'popup-body';
        
            // The variable iDiv is still good... Just append to it.
            innerDiv1.appendChild(innerDiv3);
        
            // Then append the whole thing onto the body
            document.getElementsByTagName('body')[0].appendChild(iDiv);
        }   
    }

    this.MASPopupUI: function(url, popupafterclose, onload) {
        
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {

            var onLoadMakePopUpVisible = function() {
            
                if(document.getElementById('popUp') !== null) {
                    document.getElementById('popUp').hidden=false;
                }
            
                onload();
            };
        
            $('#popUp').remove();
        
            var template = "<div id='popUp' hidden data-role='popup' class='ui-content messagePopup' style='"+ MASPlugin.MASConfig.popUpStyle+"'>" + "</div>";
        
            popupafterclose = popupafterclose ? popupafterclose : function() {};
            
            $.mobile.activePage.append(template).trigger("create");        

            $('#popUp').load(url, onLoadMakePopUpVisible);        

            $.mobile.activePage.find(".closePopup").bind("tap", function() {            
                $.mobile.activePage.find(".messagePopup").popup("close");
            });           

            $.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
                
                popupafterclose: function() {
                    
                    $('body').off('touchmove');                    
                    $(this).unbind("popupafterclose").remove();                    
                    popupafterclose();
                }
            });
            
            $(".messagePopup").on({
                
                popupbeforeposition: function() {                    
                    $('.ui-popup-screen').off();
                }
            });
        }
        else {

                createPopupDiv();

                var popupEl = document.getElementById('popup');
                var popupBody = document.getElementById('popup-bdy');

                window.MASPopupUI = new Popup(popupEl, {
                    width: 500,
                    height: 500
                });

                var xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    
                    popupBody.innerHTML = this.response;
                    window.MASPopupUI.open();
                    
                    onload();
                };

                xhr.open('GET', url, true);
                xhr.send();
        }        
    }
};

module.exports = MASPluginUtils;