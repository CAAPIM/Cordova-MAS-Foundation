/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
 
var MASPluginFetch = function (url, callback, error) {
    
    if (window.fetch) {
        
        fetch(url).then(function (res) {
            
            if (res.status != 200) {
                
                error({
                    "text": res.statusText,
                    "code": res.status
                });

                return;
            }

            res.text().then(function (data) {
                
                callback(data);
            });

        }).catch(function (err) {
            
            error(err);
        });
    } 
    else 
    {
        var xhr = new XMLHttpRequest();
        
        xhr.onload = function () {

            if (this.status != 200) {
                
                error({
                    "text": this.statusText,
                    "code": this.status
                });

                return;
            }

            callback(this.responseText);
        };
        
        xhr.onerror = function (err) {
            error(err);
        };

        xhr.open('GET', url);
        xhr.send();
    }
};

module.exports = MASPluginFetch;
