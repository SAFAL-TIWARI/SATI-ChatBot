package com.thunder.satichatbot;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

//File upload extensions
import android.content.Intent;
import android.net.Uri;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebChromeClient.FileChooserParams;


public class MainActivity extends AppCompatActivity {
    // private static final int REQUEST_RECORD_AUDIO_PERMISSION = 1;
    private WebView mWebView;
    private String lastTriedUrl = "https://sati-chatbot.vercel.app/index.html";
	private ValueCallback<Uri[]> filePathCallback;
	private static final int FILE_CHOOSER_REQUEST_CODE = 1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

		/* Remove mic permission for now
        // Request mic permission
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.RECORD_AUDIO},
                        REQUEST_RECORD_AUDIO_PERMISSION);
            }
        }
        */

        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setSupportMultipleWindows(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);

        // Add JS interface so offline.html can access lastTriedUrl
        mWebView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public String getLastUrl() {
                return lastTriedUrl;
            }
        }, "Android");

	mWebView.setWebChromeClient(new WebChromeClient() {
		@Override
		public void onPermissionRequest(final PermissionRequest request) {
			runOnUiThread(() -> request.grant(request.getResources()));
		}

		@Override
public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
    if (MainActivity.this.filePathCallback != null) {
        MainActivity.this.filePathCallback.onReceiveValue(null);
    }
    MainActivity.this.filePathCallback = filePathCallback;

    Intent intent = fileChooserParams.createIntent();
    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true); // ✅ Enable multiple file selection

    try {
        startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
    } catch (Exception e) {
        MainActivity.this.filePathCallback = null;
        return false;
    }
    return true;
}

	});


        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                lastTriedUrl = url;  // Save the attempted URL
                if (isNetworkAvailable()) {
                    view.loadUrl(url);
                } else {
                    view.loadUrl("file:///android_asset/offline.html");
                }
                return true;
            }

            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return shouldOverrideUrlLoading(view, request.getUrl().toString());
            }
        });

        // Initial load
        mWebView.loadUrl(lastTriedUrl);
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = cm != null ? cm.getActiveNetworkInfo() : null;
        return networkInfo != null && networkInfo.isConnected();
    }


@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
        if (filePathCallback == null) return;

        Uri[] results = null;

        if (resultCode == RESULT_OK) {
            if (data != null) {
                if (data.getClipData() != null) {
                    // Multiple files selected
                    final int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    // Single file selected
                    results = new Uri[]{data.getData()};
                }
            }
        }

        filePathCallback.onReceiveValue(results);
        filePathCallback = null;
    }
}


/* Removing mic permission

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION) {
            // mic permission result
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
    */
}
