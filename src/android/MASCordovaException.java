package com.ca.mas.cordova.core;


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
