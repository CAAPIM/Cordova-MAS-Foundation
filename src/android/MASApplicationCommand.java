/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.ca.apim.util.MASUtil;
import com.ca.mas.foundation.MAS;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.auth.MASApplication;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public abstract class MASApplicationCommand {

    private static final String TAG = MASApplicationCommand.class.getCanonicalName();
    private static List<MASApplication> masApplicationsStatic;

    private static MASApplication fetchCurrentApp(String appIdentifier){
        MASApplication masApplication=null;
        if(masApplicationsStatic!=null){
            for(int i=0;i<masApplicationsStatic.size();i++){
                if(masApplicationsStatic.get(i).getIdentifier().equals(appIdentifier)){
                    masApplication=masApplicationsStatic.get(i);
                    break;
                }
            }
        }
        return masApplication;
    }
    public static class GetIdentifierCommand extends Command{

        @Override
        void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
           /* MASApplication.setApplicationLauncher(new MASApplication.MASApplicationLauncher() {
                @Override
                public void onWebAppLaunch(MASApplication masApplication) {

                }
            });*/

        }

        @Override
        String getAction() {
            return "getIdentifier";
        }
    }

    public static class GetNameCommand extends Command{

        @Override
        void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                String appId = args.getString(0);
               /* MASApplication masApplication=null;
                for(int i=0;i<masApplicationsStatic.size();i++){
                    if(masApplicationsStatic.get(i).getIdentifier().equals(appId)){
                        masApplication=masApplicationsStatic.get(i);
                        break;
                    }
                }*/
                MASApplication masApplication=fetchCurrentApp(appId);
                callbackContext.success(masApplication.getName());
            }
            catch (Exception e){

            }

        }

        @Override
        String getAction() {
            return "getName";
        }
    }


    public static class RetrieveEnterpriseAppsCommand extends Command{

        @Override
        void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            MASApplication.retrieveEnterpriseApps(new MASCallback<List<MASApplication>>() {
                @Override
                public void onSuccess(List<MASApplication> masApplications) {
                    //System.out.println("hello"+masApplications.get(0).getIdentifier());
                    masApplicationsStatic=masApplications;
                    JSONArray appIdentifiers=new JSONArray();
                    
                   /* for(int i=0;i<masApplicationsStatic.size();i++){
                        appIdentifiers.put(masApplicationsStatic.get(i).getIdentifier());
                    }*/

                    appIdentifiers= MASUtil.convertMASApplicationListToJson(masApplications);
                    callbackContext.success(appIdentifiers);
                }

                @Override
                public void onError(Throwable throwable) {

                }
            });
        }

        @Override
        String getAction() {
            return "retrieveEnterpriseApps";
        }
    }

    public static class LaunchAppCommand extends Command{

        @Override
        void execute(final Context context, JSONArray args, final CallbackContext callbackContext) {
            if(args.length()<2){
                callbackContext.error("");
            }
            try {
                String appIdentifier=args.getString(0);
                String nativeOrWebUrl=args.getString(1);  //TODO not used
                MASApplication masApplication=fetchCurrentApp(appIdentifier);
                MASApplication.MASApplicationLauncher masApplicationLauncher=new MASApplication.MASApplicationLauncher() {
                    @Override
                    public void onWebAppLaunch(MASApplication masApplication) {
                        Intent intent = new Intent(Intent.ACTION_DEFAULT, Uri.parse(masApplication.getAuthUrl()));
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        try {
                             MAS.getContext().startActivity(intent);
                             // context.startActivity(intent);
                        } catch (ActivityNotFoundException e) {
                            Log.e(TAG, e.getMessage(), e);
                            throw e;
                        }

                    }
                };
                if(!masApplication.getNativeUri().isEmpty()) {
                    masApplicationLauncher.onNativeAppLaunch(masApplication);
                }
                else if(!masApplication.getAuthUrl().isEmpty()){
                    masApplicationLauncher.onWebAppLaunch(masApplication);
                }

            } catch (JSONException e) {
                Log.e(TAG,e.getMessage(),e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        String getAction() {
            return "launchApp";
        }
    }
}
