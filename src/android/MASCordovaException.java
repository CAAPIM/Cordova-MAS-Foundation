package com.ca.mas.cordova.core;

/**
 * Created by sinsu17 on 11/3/16.
 */
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
