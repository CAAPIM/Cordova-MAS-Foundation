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
