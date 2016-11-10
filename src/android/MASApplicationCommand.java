/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

package com.ca.mas.cordova.core;

import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.net.http.SslError;
import android.os.Build;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import com.ca.mas.foundation.MASCallback;
import com.ca.mas.foundation.auth.MASApplication;
import com.ca.mas.foundation.auth.MASWebApplication;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.List;

import static android.content.DialogInterface.BUTTON_NEGATIVE;
import static android.content.DialogInterface.BUTTON_POSITIVE;

public abstract class MASApplicationCommand {

    private static final String TAG = MASApplicationCommand.class.getCanonicalName();
    private static List<MASApplication> masApplicationsStatic;
    private static WebView ENTERPRISE_BROWSER_WEBVIEW;

    private static MASApplication fetchCurrentApp(String appIdentifier) {
        MASApplication masApplication = null;
        if (masApplicationsStatic != null) {
            for (int i = 0; i < masApplicationsStatic.size(); i++) {
                if (masApplicationsStatic.get(i).getIdentifier().equals(appIdentifier)) {
                    masApplication = masApplicationsStatic.get(i);
                    break;
                }
            }
        }
        return masApplication;
    }

    public static class GetIdentifierCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
           /* MASApplication.setApplicationLauncher(new MASApplication.MASApplicationLauncher() {
                @Override
                public void onWebAppLaunch(MASApplication masApplication) {

                }
            });*/

        }

        @Override
        public String getAction() {
            return "getIdentifier";
        }
    }

    public static class GetNameCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {
            try {
                String appId = args.getString(0);
                MASApplication masApplication = fetchCurrentApp(appId);
                callbackContext.success(masApplication.getName());
            } catch (Exception e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }

        }

        @Override
        public String getAction() {
            return "getName";
        }
    }


    public static class RetrieveEnterpriseAppsCommand extends Command {

        @Override
        public void execute(Context context, JSONArray args, final CallbackContext callbackContext) {

            MASApplication.retrieveEnterpriseApps(new MASCallback<List<MASApplication>>() {
                @Override
                public void onSuccess(List<MASApplication> masApplications) {
                    masApplicationsStatic = masApplications;
                    JSONArray appIdentifiers;
                    appIdentifiers = MASUtil.convertMASApplicationListToJson(masApplications);
                    callbackContext.success(appIdentifiers);
                }

                @Override
                public void onError(Throwable throwable) {

                }
            });
        }

        @Override
        public String getAction() {
            return "retrieveEnterpriseApps";
        }
    }

    public static class EnterpriseBrowserWebAppBackButtonHandlerCommand extends Command {
        @Override
        public void execute(final Context context, JSONArray args, final CallbackContext callbackContext) {
            MASPlugin.getCurrentInstance().cordova.getActivity().runOnUiThread(
                    new Runnable() {
                        @Override
                        public void run() {
                            ((ViewGroup)ENTERPRISE_BROWSER_WEBVIEW.getParent()).removeView(ENTERPRISE_BROWSER_WEBVIEW);
                            callbackContext.success();
                        }
                    }
            );
        }

        @Override
        public String getAction() {
            return "enterpriseBrowserWebAppBackButtonHandler";
        }
    }

    public static class LaunchAppCommand extends Command {

        @Override
        public void execute(final Context context, JSONArray args, final CallbackContext callbackContext) {
            if (args.length() < 2) {
                callbackContext.error("");
            }
            try {
                String appIdentifier = args.getString(0);
                MASApplication masApplication = fetchCurrentApp(appIdentifier);
                MASApplication.MASApplicationLauncher masApplicationLauncher = new MASApplication.MASApplicationLauncher() {
                    @Override
                    public void onWebAppLaunch(final MASApplication masApplication) {
                        try {
                            MASPlugin.getCurrentInstance().cordova.getActivity().runOnUiThread(
                                    new Runnable() {
                                        @Override
                                        public void run() {
                                            final WebView web = new WebView(MASPlugin.getCurrentInstance().cordova.getActivity());
                                            ENTERPRISE_BROWSER_WEBVIEW = web;
                                            LinearLayout.MarginLayoutParams layoutParams= new LinearLayout.MarginLayoutParams
                                                    (LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);

                                            MASPlugin.getCurrentInstance().cordova.getActivity().addContentView(web, layoutParams);
                                            new MASWebApplication(web, masApplication.getAuthUrl()) {
                                                @Override
                                                protected WebViewClient getWebViewClient() {
                                                    final WebViewClient webViewClient = super.getWebViewClient();
                                                    return new WebViewClient() {
                                                        @Override
                                                        public void onReceivedSslError(WebView webView, final SslErrorHandler handler, SslError error) {
                                                            AlertDialog.Builder builder = new AlertDialog.Builder(context);
                                                            AlertDialog ad = builder.create();
                                                            String message;
                                                            switch (error.getPrimaryError()) {
                                                                case SslError.SSL_UNTRUSTED:
                                                                    message = "Certificate is untrusted.";
                                                                    break;
                                                                case SslError.SSL_EXPIRED:
                                                                    message = "Certificate has expired.";
                                                                    break;
                                                                case SslError.SSL_IDMISMATCH:
                                                                    message = "Certificate ID is mismatched.";
                                                                    break;
                                                                case SslError.SSL_NOTYETVALID:
                                                                    message = "Certificate is not yet valid.";
                                                                    break;
                                                                case SslError.SSL_DATE_INVALID:
                                                                    message = "Certificate date is invalid .";
                                                                    break;
                                                                default:
                                                                    message = "Certificate is invalid .";
                                                                    break;
                                                            }
                                                            message += " Do you want to continue anyway?";
                                                            ad.setTitle("SSL Certificate Error");
                                                            ad.setMessage(message);
                                                            ad.setButton(BUTTON_POSITIVE, "OK", new DialogInterface.OnClickListener() {
                                                                @Override
                                                                public void onClick(DialogInterface dialog, int which) {
                                                                    handler.proceed();
                                                                }
                                                            });
                                                            ad.setButton(BUTTON_NEGATIVE, "Cancel", new DialogInterface.OnClickListener() {
                                                                @Override
                                                                public void onClick(DialogInterface dialog, int which) {
                                                                    handler.cancel();
                                                                }
                                                            });
                                                            ad.show();
                                                        }

                                                        @SuppressWarnings("deprecation")
                                                        @Override
                                                        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                                                            return webViewClient.shouldInterceptRequest(view, url);
                                                        }

                                                        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
                                                        @Override
                                                        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                                                            return webViewClient.shouldInterceptRequest(view, request);
                                                        }
                                                    };
                                                }
                                            };

                                        }
                                    }
                            );

                        } catch (ActivityNotFoundException e) {
                            Log.e(TAG, e.getMessage(), e);
                            throw e;
                        }

                    }
                };
                if (!masApplication.getNativeUri().isEmpty()) {
                    masApplicationLauncher.onNativeAppLaunch(masApplication);
                } else if (!masApplication.getAuthUrl().isEmpty()) {
                    masApplicationLauncher.onWebAppLaunch(masApplication);
                }

            } catch (JSONException e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        }

        @Override
        public String getAction() {
            return "launchApp";
        }
    }
}
