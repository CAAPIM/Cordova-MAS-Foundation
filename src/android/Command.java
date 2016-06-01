/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.content.Context;

import com.ca.mas.core.error.MAGException;
import com.ca.mas.core.error.MAGRuntimeException;
import com.ca.mas.core.error.MAGServerException;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.PrintWriter;
import java.io.StringWriter;

public abstract class Command {

    String SUCCESS = "success";

    abstract void execute(Context context, JSONArray args, CallbackContext callbackContext);

    abstract String getAction();

    protected JSONObject getError(Throwable e) {
        int errorCode = 0;
        String errorMessage = e.getMessage();
        if (e instanceof MAGException) {
            MAGException ex = (MAGException) e;
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (e instanceof MAGRuntimeException) {
            MAGRuntimeException ex = (MAGRuntimeException) e;
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (e.getCause() != null && e.getCause() instanceof MAGException) {
            MAGException ex = (MAGException) e.getCause();
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (e.getCause() != null && e.getCause() instanceof MAGRuntimeException) {
            MAGRuntimeException ex = (MAGRuntimeException) e.getCause();
            errorCode = ex.getErrorCode();
            errorMessage = ex.getMessage();
        } else if (e.getCause() != null && e.getCause() instanceof MAGServerException) {
            MAGServerException serverException = ((MAGServerException) e.getCause());
            errorCode = serverException.getErrorCode();
            errorMessage = serverException.getMessage();
        }

        JSONObject error = new JSONObject();
        try {
            error.put("errorCode", errorCode);
            error.put("errorMessage", errorMessage);
            StringWriter errors = new StringWriter();
            e.printStackTrace(new PrintWriter(errors));
            error.put("errorInfo", errors.toString());
        } catch (JSONException ignore) {
        }
        return error;
    }


}
