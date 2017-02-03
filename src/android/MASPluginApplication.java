package com.ca.mas.cordova.core;

import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.DialogInterface;
import android.net.http.SslError;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
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

import java.util.ArrayList;
import java.util.List;

import static android.content.DialogInterface.BUTTON_NEGATIVE;
import static android.content.DialogInterface.BUTTON_POSITIVE;

/**
 * Created by trima09 on 29/01/2017.
 */

public class MASPluginApplication extends MASCordovaPlugin {
    private static final String TAG = MASPluginApplication.class.getCanonicalName();


    private List<MASApplication> masApplications = new ArrayList<MASApplication>();
    private WebView ENTERPRISE_BROWSER_WEBVIEW;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equalsIgnoreCase("getName")) {
            getName(args, callbackContext);
        } else if (action.equalsIgnoreCase("retrieveEnterpriseApps")) {
            retrieveEnterpriseApps(args, callbackContext);
        } else if (action.equalsIgnoreCase("enterpriseBrowserWebAppBackButtonHandler")) {
            enterpriseBrowserWebAppBackButtonHandler(args, callbackContext);
        } else if (action.equalsIgnoreCase("launchApp")) {
            launchApp(args, callbackContext);
        } else {
            callbackContext.error("Invalid action");
            return false;
        }
        return true;
    }

    /**
     * Fetches the system registered name of the current App
     */
    private void getName(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String appId = args.getString(0);
            MASApplication masApplication = fetchCurrentApp(appId);
            if (masApplication != null) {
                success(callbackContext, masApplication.getName(), false);
            } else {
                MASCordovaException e = new MASCordovaException("No Application found with given id");
                callbackContext.error(getError(e));
            }
        } catch (Exception e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }

    /**
     * Retrieves all the enterprise apps in form of JSON from the server. It includes both native and web apps.
     */
    private void retrieveEnterpriseApps(final JSONArray args, final CallbackContext callbackContext) {
        MASApplication.retrieveEnterpriseApps(new MASCallback<List<MASApplication>>() {
            @Override
            public void onSuccess(List<MASApplication> applications) {
                masApplications.clear();
                masApplications.addAll(applications);
                JSONArray appIdentifiers = MASUtil.convertMASApplicationListToJson(masApplications);
                success(callbackContext, appIdentifiers, false);
            }

            @Override
            public void onError(Throwable e) {
                Log.e(TAG, e.getMessage(), e);
                callbackContext.error(getError(e));
            }
        });
    }

    /**
     * Action to be taken if back button is pressed while an enterprise app is open
     */
    private void enterpriseBrowserWebAppBackButtonHandler(final JSONArray args, final CallbackContext callbackContext) {
        this.cordova.getActivity().runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        if (ENTERPRISE_BROWSER_WEBVIEW != null) {
                            ((ViewGroup) ENTERPRISE_BROWSER_WEBVIEW.getParent()).removeView(ENTERPRISE_BROWSER_WEBVIEW);
                            ENTERPRISE_BROWSER_WEBVIEW.destroy();
                        }
                        success(callbackContext, false);
                    }
                }
        );
    }

    /**
     * Launches the selected Enterprise App
     */
    private void launchApp(final JSONArray args, final CallbackContext callbackContext) {
        if (args.length() < 1) {
            callbackContext.error(getError(new MASCordovaException("Invalid input parameters")));
            return;
        }
        try {
            String appIdentifier = args.getString(0);
            MASApplication masApplication = fetchCurrentApp(appIdentifier);
            MASApplication.MASApplicationLauncher masApplicationLauncher = new MASApplication.MASApplicationLauncher() {
                @Override
                public void onWebAppLaunch(final MASApplication masApplication) {
                    try {
                        MASPluginApplication.this.cordova.getActivity().runOnUiThread(
                                new Runnable() {
                                    @Override
                                    public void run() {
                                        final WebView web = new WebView(MASPluginApplication.this.cordova.getActivity());
                                        web.setOnKeyListener(new View.OnKeyListener() {
                                            @Override
                                            public boolean onKey(View v, int keyCode, KeyEvent event) {
                                                if (event.getAction() == KeyEvent.ACTION_DOWN) {
                                                    switch (keyCode) {
                                                        case KeyEvent.KEYCODE_BACK:
                                                            if (ENTERPRISE_BROWSER_WEBVIEW != null &&
                                                                    ENTERPRISE_BROWSER_WEBVIEW.canGoBack()) {
                                                                ((ViewGroup) ENTERPRISE_BROWSER_WEBVIEW.getParent()).removeView(ENTERPRISE_BROWSER_WEBVIEW);
                                                                ENTERPRISE_BROWSER_WEBVIEW.destroy();
                                                                ENTERPRISE_BROWSER_WEBVIEW = null;
                                                            }
                                                            return true;
                                                    }

                                                }
                                                return false;
                                            }
                                        });
                                        ENTERPRISE_BROWSER_WEBVIEW = web;
                                        LinearLayout.MarginLayoutParams layoutParams = new LinearLayout.MarginLayoutParams
                                                (LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);

                                        MASPluginApplication.this.cordova.getActivity().addContentView(web, layoutParams);
                                        new MASWebApplication(web, masApplication.getAuthUrl()) {
                                            @Override
                                            protected WebViewClient getWebViewClient() {
                                                final WebViewClient webViewClient = super.getWebViewClient();
                                                return new WebViewClient() {
                                                    @Override
                                                    public void onReceivedSslError(WebView webView, final SslErrorHandler handler, SslError error) {
                                                        AlertDialog.Builder builder = new AlertDialog.Builder(webView.getContext());
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
            success(callbackContext, true, false);
        } catch (JSONException e) {
            Log.e(TAG, e.getMessage(), e);
            callbackContext.error(getError(e));
        }
    }


    private MASApplication fetchCurrentApp(String appIdentifier) {
        for (MASApplication application : masApplications) {
            if (application != null && application.getIdentifier().equalsIgnoreCase(appIdentifier)) {
                return application;
            }
        }
        return null;
    }
}
