/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import android.util.Log;

import com.ca.mas.foundation.auth.MASApplication;
import com.ca.mas.foundation.auth.MASProximityLogin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;


public class MASUtil {
    private static final String TAG = MASUtil.class.getCanonicalName();
    private static MASProximityLogin qrCode;

    public static MASProximityLogin getQrCode() {
        return qrCode;
    }

    public static void setQrCode(MASProximityLogin qrCode) {
        MASUtil.qrCode = qrCode;
    }

    public static JSONArray convertMASApplicationListToJson(List<MASApplication> masApplications){
        JSONArray result=new JSONArray();
        try {
            for (int i = 0; i < masApplications.size(); i++) {
                MASApplication app = masApplications.get(i);
                JSONObject appInfo = new JSONObject();
                appInfo.put("authUrl", app.getAuthUrl());
                appInfo.put("appName",app.getName());
                appInfo.put("nativeUrl",app.getNativeUri());
                appInfo.put("identifier",app.getIdentifier());
                appInfo.put("iconUrl",app.getIconUrl());
                result.put(appInfo);
            }

        }catch(JSONException e){
            Log.e(TAG, e.getMessage(), e);
        }
        return result;
    }
}
