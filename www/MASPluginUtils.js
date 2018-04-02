/*
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

var MASPluginConstants = require("./MASPluginConstants"),
    MASPopup = require("./PopupUI");

var MASPluginUtils = {
    popupStyle:MASPluginConstants.MASPopupStyle.MASPopupLoginStyle,
    isEmpty: function(val) {
        return (typeof val === 'undefined' || !val || val == null);
    },

    XHR: function(cfg){
    	var xhr,
        url = cfg.url,
        method = cfg.method || 'GET',
        success = cfg.success || function () {},
        failure = cfg.failure || function () {};
		
        try {
            xhr = new XMLHttpRequest();
        }catch (e){
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
	
        xhr.onreadystatechange = function (){
            if (xhr.readyState == 4){
                if (xhr.status == 200) {
                    success.call(null, xhr);
                }else{
                    failure.call(null, xhr);
                }
            }
        }

        xhr.open(method, url); 
        xhr.send(null);
    },

    onBackKeyPressEvent: function() {
        successHandler = function() {
            document.removeEventListener("backbutton", MASPluginUtils.onBackKeyPressEvent, false);
        };
        return Cordova.exec(successHandler, function() {}, "MASPluginApplication", "enterpriseBrowserWebAppBackButtonHandler", []);
    },

    setPopUpStyle: function(style) {
        this.popupStyle = style;
    },

    getPopUpStyle: function(){
        return this.popupStyle;
    },

    createPopupDiv: function() {
        if (typeof document.getElementById('popup') !== 'undefined') {
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
    },

    MASPopupUI: function(url, result, popupafterclose, onload) {
        if(!this.isEmpty(result)){
            window.localStorage.setItem("masCallbackResult",JSON.stringify(result));
        }
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            var onLoadMakePopUpVisible = function() {
                if(document.getElementById('popUp') !== null) {
                    document.getElementById('popUp').hidden=false;
                }
                onload();
            };
        
            $('#popUp').remove();

            const popupStyle = this.getPopUpStyle();

            var template = "<div id='popUp' hidden data-role='popup' class='ui-content messagePopup' style='"+ popupStyle+"'>" + "</div>";
            popupafterclose = popupafterclose ? popupafterclose : function() {};
            $.mobile.activePage.append(template).trigger("create");
            $('#popUp').load(url,onLoadMakePopUpVisible);
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
        }else{
            window.MASPopupUI.close();
            document.getElementById('popup').remove();
            this.createPopupDiv();
            var popupEl = document.getElementById('popup');
            var popupBody = document.getElementById('popup-bdy');
                popupEl.style.backgroundColor = "white";
                popupBody.style.backgroundColor = "white";

            window.MASPopupUI = new Popup(popupEl, {
                 width: window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,
                 height: window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight
            });

            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                popupBody.innerHTML = this.response;
                var s = popupBody.getElementsByTagName('script');
                for (var i = 0; i < s.length ; i++) {
                    var node=s[i], parent=node.parentElement, d = document.createElement('script');
                    d.async=node.async;
                    d.type = node.type;
                    if(typeof node.src !== 'undefined' && node.src !== ""){
                        d.src=node.src;
                    }
                    d.text = node.text;
                    parent.insertBefore(d,node);
                    parent.removeChild(node);
                }
                window.MASPopupUI.open();
                onload();
            };

            xhr.open('GET', url, true);
            xhr.send();
        }
    },
    /**
    Closes an existing popup.
    */
    closePopup: function() {
        if (typeof jQuery !== 'undefined' && typeof $.mobile !== 'undefined') {
            $.mobile.activePage.find(".messagePopup").popup("close");
        } else {
            window.MASPopupUI.close();
            document.getElementById('popup').remove();
        }
    }
};

module.exports = MASPluginUtils;