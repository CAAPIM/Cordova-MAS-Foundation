package com.ca.apim;

import android.content.Context;
import android.telecom.Call;
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
        Command command;
        switch(action){

            case REGISTER_WITH_USER_CREDENTIALS:
                command=new LoginCommand(context,args,callbackContext);
                command.execute();
                return true;

            case START:
                command=new STARTCommand(context,args,callbackContext);
                command.execute();
                return true;
            case DEREGISTER:
                command=new DeregisterCommand(context,args,callbackContext);
                command.execute();
                return true;
        }
        return false;
    }

    public interface Command{
        void execute();
    }

    public class STARTCommand implements  Command{
        Context context;
        CallbackContext callbackContext;
        JSONArray jsonArray;

        public STARTCommand(Context context,JSONArray args,CallbackContext callbackContext){
            this.context=context;
            this.callbackContext=callbackContext;
            jsonArray=args;
        }

        @Override
        public void execute() {
            try{
                MAS.start(context);
                callbackContext.success(SUCCESS);

            }catch(Exception e){
                Log.e(TAG,"Error while starting MAS SDK",e);
                callbackContext.error(FAIL);
            }
        }
    }

    public class LoginCommand implements  Command{
        Context context;
        CallbackContext callbackContext;
        JSONArray jsonArray;

        public LoginCommand(Context context,JSONArray args,CallbackContext callbackContext){
            this.context=context;
            this.callbackContext=callbackContext;
            jsonArray=args;
        }

        @Override
        public void execute() {
            String username= null;
            String password=null;
            try {
                username = (String) jsonArray.get(0);
                password= (String) jsonArray.get(1);
            } catch (JSONException e) {
                callbackContext.error(FAIL+" Could not retrieve username or password");
            }

            MASUser.getCurrentUser(context).login(username, password, new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    Log.i(TAG,"User login with username and password was SUCCESSFUL");
                    callbackContext.success(SUCCESS);
                }

                @Override
                public void onError(Throwable throwable) {
                    Log.i(TAG,"User login with username and password was FAIL");
                    callbackContext.error(FAIL);
                }
            });
        }
    }

    public class DeregisterCommand implements  Command{
        Context context;
        CallbackContext callbackContext;
        JSONArray jsonArray;

        public DeregisterCommand(Context context,JSONArray args,CallbackContext callbackContext){
            this.context=context;
            this.callbackContext=callbackContext;
            jsonArray=args;
        }

        @Override
        public void execute() {
            Device masDevice = new MASDevice(context);
            masDevice.deregister(new MASCallback<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    callbackContext.success(SUCCESS);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(FAIL);
                }
            });
        }
    }

}

