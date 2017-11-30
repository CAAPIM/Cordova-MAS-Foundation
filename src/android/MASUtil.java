/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

package com.ca.mas.cordova.core;

import android.util.Base64;
import android.util.Log;

import com.ca.mas.foundation.auth.MASApplication;
import com.ca.mas.foundation.auth.MASAuthenticationProvider;
import com.ca.mas.foundation.auth.MASAuthenticationProviders;
import com.ca.mas.foundation.auth.MASProximityLogin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigInteger;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import sun.security.util.DerInputStream;
import sun.security.util.DerValue;

/**
 * Utilities class
 */
public class MASUtil {
    private static final String TAG = MASUtil.class.getCanonicalName();
    private static MASProximityLogin qrCode;
    private static Map<String, MASAuthenticationProvider> _providerMap = new HashMap<String, MASAuthenticationProvider>();
    private static final ReentrantReadWriteLock _lock = new ReentrantReadWriteLock();
    // PKCS#8 format
    private static final String PEM_PRIVATE_START = "-----BEGIN PRIVATE KEY-----";
    private static final String PEM_PRIVATE_END = "-----END PRIVATE KEY-----";

    // PKCS#1 format
    private static final String PEM_RSA_PRIVATE_START = "-----BEGIN RSA PRIVATE KEY-----";
    private static final String PEM_RSA_PRIVATE_END = "-----END RSA PRIVATE KEY-----";

    /**
     * @return the already set MASProximityLoginQRCode qrCode
     */
    public static MASProximityLogin getQrCode() {
        return qrCode;
    }

    /**
     * @param qrCode MASProximityLoginQRCode that is set
     */
    public static void setQrCode(MASProximityLogin qrCode) {
        MASUtil.qrCode = qrCode;
    }

    /**
     * Convert list of MASApplications into json format.
     *
     * @param masApplications list of {@link MASApplication}
     * @return jsonArray
     */
    public static JSONArray convertMASApplicationListToJson(List<MASApplication> masApplications) {
        JSONArray result = new JSONArray();
        try {
            for (int i = 0; i < masApplications.size(); i++) {
                MASApplication app = masApplications.get(i);
                JSONObject appInfo = new JSONObject();
                appInfo.put("authUrl", app.getAuthUrl());
                appInfo.put("appName", app.getName());
                appInfo.put("nativeUrl", app.getNativeUri());
                appInfo.put("identifier", app.getIdentifier());
                appInfo.put("iconUrl", app.getIconUrl());
                result.put(appInfo);
            }

        } catch (JSONException e) {
            Log.e(TAG, e.getMessage(), e);
        }
        return result;
    }

    /**
     * Sets the list of MASAuthentication Providers in cache and returns an Array of Providers supported by server
     *
     * @param providers list of {@link MASAuthenticationProviders}
     * @return _ids Array of providers supported at server
     */
    public static JSONArray setAuthenticationProviders(MASAuthenticationProviders providers) {
        JSONArray array = new JSONArray();
        _providerMap.clear();
        List<MASAuthenticationProvider> masProviders = providers.getProviders();
        String idp = providers.getIdp();
        try {
            _lock.writeLock().lock();
            for (MASAuthenticationProvider p : masProviders) {
                String identifier = p.getIdentifier();
                if (identifier.equalsIgnoreCase("qrcode")) {
                    continue;
                }
                if ((idp.equalsIgnoreCase("all") || idp.equalsIgnoreCase(identifier)) && !p.isProximityLogin()) {
                    array.put(identifier);
                    _providerMap.put(identifier, p);

                }
            }
        } finally {
            _lock.writeLock().unlock();
        }
        return array;
    }

    /**
     * Returns the MASAuthenticationProvider cached for a particular identifier chosen by user
     *
     * @param identifier String
     * @return MASAuthenticationProvider
     */
    public static MASAuthenticationProvider getProvider(String identifier) {
        try {
            _lock.readLock().lock();
            return _providerMap.get(identifier);
        } finally {
            _lock.readLock().unlock();
        }
    }

    /**
     * Generates a java.security.PrivateKey out of PEM String provided
     *
     * @param privateKeyPem PEM formatted private Key
     * @return PrivateKey
     */
    public static PrivateKey generatePrivateKeyFromPEM(String privateKeyPem) throws Exception {
        if (privateKeyPem.indexOf(PEM_PRIVATE_START) != -1) { // PKCS#8 format
            privateKeyPem = privateKeyPem.replace(PEM_PRIVATE_START, "").replace(PEM_PRIVATE_END, "");
            privateKeyPem = privateKeyPem.replaceAll("\\s", "");

            byte[] pkcs8EncodedKey = Base64.decode(privateKeyPem, Base64.DEFAULT);

            KeyFactory factory = KeyFactory.getInstance("RSA");
            return factory.generatePrivate(new PKCS8EncodedKeySpec(pkcs8EncodedKey));
        } else if (privateKeyPem.indexOf(PEM_RSA_PRIVATE_START) != -1) {  // PKCS#1 format
            privateKeyPem = privateKeyPem.replace(PEM_RSA_PRIVATE_START, "").replace(PEM_RSA_PRIVATE_END, "");
            privateKeyPem = privateKeyPem.replaceAll("\\s", "");
            DerInputStream derReader = new DerInputStream(Base64.decode(privateKeyPem, Base64.DEFAULT));
            DerValue[] seq = derReader.getSequence(0);

            if (seq.length < 9) {
                throw new GeneralSecurityException("Could not parse a PKCS1 private key.");
            }

            // skip version seq[0];
            BigInteger modulus = seq[1].getBigInteger();
            BigInteger publicExp = seq[2].getBigInteger();
            BigInteger privateExp = seq[3].getBigInteger();
            BigInteger prime1 = seq[4].getBigInteger();
            BigInteger prime2 = seq[5].getBigInteger();
            BigInteger exp1 = seq[6].getBigInteger();
            BigInteger exp2 = seq[7].getBigInteger();
            BigInteger crtCoef = seq[8].getBigInteger();

            RSAPrivateCrtKeySpec keySpec = new RSAPrivateCrtKeySpec(modulus, publicExp, privateExp, prime1, prime2, exp1, exp2, crtCoef);
            KeyFactory factory = KeyFactory.getInstance("RSA");
            return factory.generatePrivate(keySpec);
        }
        throw new GeneralSecurityException("Could not parse the private key.");
    }
}
