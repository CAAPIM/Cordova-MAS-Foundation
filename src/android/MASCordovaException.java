/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
package com.ca.mas.cordova.core;


public class MASCordovaException extends Exception{

    MASCordovaException(String detailMessage){
        super(detailMessage);
    }
    MASCordovaException(String detailMessage,Throwable throwable){
        super(detailMessage, throwable);
    }
    MASCordovaException(Throwable throwable){
        super(throwable);
    }
}
