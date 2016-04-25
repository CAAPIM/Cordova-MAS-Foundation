package com.ca.apim;

import android.content.Context;
import android.util.Log;

import com.ca.mas.MAS;
import com.ca.mas.foundation.Device;
import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASDevice;
import com.ca.mas.foundation.MASUser;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.concurrent.CountDownLatch;


public class MASPlugin extends CordovaPlugin{

    private static final String TAG=MASPlugin.class.getCanonicalName();

    private static final String SUCCESS="success";
    private static final String FAIL="fail";
    private static final String REGISTER_WITH_USER_CREDENTIALS="loginWithUsernameAndPassword";
    private static final String START="start";
    private static final String DEREGISTER="deregister";

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {


        Context context = webView.getContext();

        if(action.equals(REGISTER_WITH_USER_CREDENTIALS)){

            final CountDownLatch latch=new CountDownLatch(1);
            String username= (String) args.get(0);
            String password= (String) args.get(1);

            MASUser.getCurrentUser(context).login(username, password, new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    Log.i(TAG,"user login SUCCESSFUL with username and password");
                    callbackContext.success(SUCCESS);
                    latch.countDown();
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.i(TAG,"user login FAIL with username and password");
                    callbackContext.error(FAIL);
                    latch.countDown();
                }
            });
            try {
                latch.await();
            } catch (InterruptedException e) {
                Log.e(TAG,"Exception in latch await",e);
            }
        }
        if(action.equals(START)){

            try{
                MAS.start(context);
                callbackContext.success(SUCCESS);

            }catch(Exception e){
                Log.e(TAG,"Error while starting MAS SDK",e);
                callbackContext.error(FAIL);
            }
        }
        if(action.equals(DEREGISTER)){
            Device masDevice = new MASDevice(context);
            final CountDownLatch latch=new CountDownLatch(1);
            masDevice.deregister(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    callbackContext.success(SUCCESS);
                    latch.countDown();
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(FAIL);
                    latch.countDown();
                }
            });
            try {
                latch.await();
            } catch (InterruptedException e) {
                Log.e(TAG,"Exception in latch await",e);
            }
        }
        return false;
    }

}

