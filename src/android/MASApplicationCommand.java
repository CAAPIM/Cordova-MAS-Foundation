/*
 * Copyright (c) 2016 CA, Inc.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.apim;

import android.content.Context;

import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.auth.MASApplication;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;

import java.util.List;

public abstract class MASApplicationCommand {

    private static final String TAG = MASApplicationCommand.class.getCanonicalName();
    private static List<MASApplication> masApplicationsStatic;

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
                MASApplication masApplication=null;
                for(int i=0;i<masApplicationsStatic.size();i++){
                    if(masApplicationsStatic.get(i).getIdentifier().equals(appId)){
                        masApplication=masApplicationsStatic.get(i);
                        break;
                    }
                }
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
                    for(int i=0;i<masApplicationsStatic.size();i++){
                        appIdentifiers.put(masApplicationsStatic.get(i).getIdentifier());
                    }
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

}
