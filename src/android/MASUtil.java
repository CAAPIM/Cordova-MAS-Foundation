/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
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

/**
 * Utilities class
 */
public class MASUtil {
    private static final String TAG = MASUtil.class.getCanonicalName();
    private static MASProximityLogin qrCode;

    /**
     *
     * @return the already set MASProximityLoginQRCode qrCode
     */
    public static MASProximityLogin getQrCode() {
        return qrCode;
    }

    /**
     *
     * @param qrCode MASProximityLoginQRCode that is set
     */
    public static void setQrCode(MASProximityLogin qrCode) {
        MASUtil.qrCode = qrCode;
    }

    /**
     * Convert list of MASApplications into json format.
     * @param masApplications list of {@link MASApplication}
     * @return jsonArray
     */
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
