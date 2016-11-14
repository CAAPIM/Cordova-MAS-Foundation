/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginConstants = require("./MASPluginConstants");

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

    this.MASPopupUI: function(url, popupafterclose, onload) {
        
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
};

module.exports = MASPluginUtils;