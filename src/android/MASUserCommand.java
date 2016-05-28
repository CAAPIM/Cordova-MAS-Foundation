package com.ca.apim;

import android.content.Context;

import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.MASUser;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by andy on 2016-05-25.
 */
public class MASUserCommand {

    public static class LoginCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            String username= null;
            String password=null;
            try {
                username = (String) args.get(0);
                password= (String) args.get(1);
            } catch (JSONException e) {
                callbackContext.error(getError(e));
                return;
            }

            MASUser.login(username, password, new MASCallback<MASUser>() {
                @Override
                public void onSuccess(MASUser masUser) {
                    callbackContext.success(SUCCESS);
                }

                @Override
                public void onError(Throwable throwable) {
                    callbackContext.error(getError(throwable));
                }
            });
        }

        @Override
        public String getAction() {
            return "loginWithUsernameAndPassword";
        }
    }

    public static class LogOffUserCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASUser masUser = MASUser.getCurrentUser();
            if (masUser != null) {
                masUser.logout(new MASCallback<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        callbackContext.success(SUCCESS);
                    }

                    @Override
                    public void onError(Throwable throwable) {
                        callbackContext.error(getError(throwable));
                    }
                });
            } else {
                callbackContext.success(SUCCESS);
            }
        }

        @Override
        public String getAction() {
            return "logOffUser";
        }
    }


}
