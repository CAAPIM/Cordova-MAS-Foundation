/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */
package com.ca.mas.cordova.core;

/**
 * This exception is thrown if cordova related error has to be thrown on cordova js layer.
 */
public class MASCordovaException extends Exception{

    public MASCordovaException(String detailMessage){
        super(detailMessage);
    }
    public MASCordovaException(String detailMessage,Throwable throwable){
        super(detailMessage, throwable);
    }
    public MASCordovaException(Throwable throwable){
        super(throwable);
    }
}
