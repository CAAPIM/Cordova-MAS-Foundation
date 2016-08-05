/*
 * Copyright (c) 2013 CA Technologies. All rights reserved.
 */

package com.l7tech.msso;

public class L7SMssoSDKPluginException extends Exception {

    private int errorCode;

    public L7SMssoSDKPluginException(int errorCode, Throwable throwable) {
        super(throwable);
        this.errorCode = errorCode;
    }

    public L7SMssoSDKPluginException(int errorCode) {
        this.errorCode = errorCode;
    }

    public int getErrorCode() {
        return errorCode;
    }
}
