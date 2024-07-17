package com.biblicalinstitute.manual;



import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.ConsoleMessage;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class MainActivity extends AppCompatActivity {

    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        CookieManager.getInstance().setAcceptCookie(true);

        myWebView = (WebView) findViewById(R.id.webView);
        myWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String currentDisposition, String mimeType, long size) {
                Intent viewIntent = new Intent(Intent.ACTION_VIEW);
                viewIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                viewIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                if (mimeType.isEmpty() && url.contains("flv")) {
                    mimeType = "video/flv";
                }

                String url_dec = url;
                try {
                    url_dec = URLDecoder.decode(url, "utf-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
				//Uri u = Uri.parse(url);
                File f = getFileFromAsset(url_dec);
                
                Uri u = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".provider", f);
                viewIntent.setDataAndType(u, mimeType);
                try {
                    Intent chooser = Intent.createChooser(viewIntent, "Selecciona app para abrir el archivo");
                    if (viewIntent.resolveActivity(getPackageManager()) != null) {
                        startActivity(chooser);
                    }
                } catch (ActivityNotFoundException ex) {
                    CharSequence text = "No hay app para abrir " + mimeType;
                    Toast.makeText(MainActivity.this, text, Toast.LENGTH_LONG).show();
                }
            }
        });
        myWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(getString(R.string.app_name), consoleMessage.message() + " -- from line "
                        + consoleMessage.lineNumber() + " of "
                        + consoleMessage.sourceId());

                return super.onConsoleMessage(consoleMessage);
            }
        });
         // myWebView.setWebViewClient(new WebViewClient());

        myWebView.setWebViewClient(new WebViewClient() {
            @Override
           public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.contains("/localhost")) {
                    myWebView.loadUrl(url);
                    return false;
                } else {
                    //if(url.matches("(.*).html$")) {
                    if(url.matches("^http(.*)")) {
                         Intent intent = new Intent(Intent.ACTION_VIEW);
                         intent.setData(Uri.parse(url));
                         startActivity(intent);
                         return true;
                    }else {
                        return false;
                    }
                }
            }
			/*
            public boolean shouldOverrideUrlLoading(WebView view, String url) {            
                if (url.startsWith("mailto:")) {
                    int p1 = url.indexOf(":");
                    int p2 = url.indexOf("?");
                    String mailto = url.substring(0, p2);
                    String mail = url.substring(p1 + 1, p2);


                    // Intent emailIntent = new Intent(Intent.ACTION_SENDTO, Uri.parse(mailto));
                    Intent emailIntent = new Intent(Intent.ACTION_SEND);

                    //    emailIntent.setData(Uri.parse(url));

                    //emailIntent.setType("message/rfc822");
                    emailIntent.setType("text/html");

                    Uri param = Uri.parse(url.substring(p2));
                    String subject = param.getQueryParameter("subject");
                    String body = param.getQueryParameter("body");

                    emailIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{mail});
                    emailIntent.putExtra(Intent.EXTRA_SUBJECT, subject);
                    //emailIntent.putExtra(Intent.EXTRA_HTML_TEXT, body); //Hstml.fromHtml(body)
                    emailIntent.putExtra(Intent.EXTRA_TEXT, "Envie sus datos personales como nombre y dirección particular");

                    File file = new File(getCacheDir(), "result.html");
                    PutInFile (file, body);
                    Uri uri  = FileProvider.getUriForFile(MainActivity.this, BuildConfig.APPLICATION_ID +".provider", file);

                    emailIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    emailIntent.putExtra(Intent.EXTRA_STREAM, uri);

                    //file.isFile()
                    startActivity(Intent.createChooser(emailIntent, "Enviar resultados"));
                }
                return true;
            }*/
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            myWebView.setWebContentsDebuggingEnabled(true);
        }
        /*
        if (Build.VERSION.SDK_INT >= 21) {
            //android.webkit.CookieManager.getInstance().setAcceptThirdPartyCookies(webview.android);
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.setAcceptCookie(true);
            //cookieManager.setAcceptThirdPartyCookies(myWebView, true);
        }*/

        WebSettings settings = myWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.getLoadWithOverviewMode();
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowContentAccess(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        //webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        //settings.setBuiltInZoomControls(true);
        //settings.setDisplayZoomControls(false);
        WebAppInterface webInterface = new WebAppInterface(MainActivity.this);
        myWebView.addJavascriptInterface(webInterface, "AppNative");
        //if (savedInstanceState == null)
            myWebView.loadUrl("file:///android_asset/www/index.html");

    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
    }
    /*
        @Override
        protected void onSaveInstanceState(Bundle outState )
        {
            super.onSaveInstanceState(outState);
            myWebView.saveState(outState);
        }

        @Override
        protected void onRestoreInstanceState(Bundle savedInstanceState)
        {
            super.onRestoreInstanceState(savedInstanceState);
            myWebView.restoreState(savedInstanceState);
        }
    */
    public static boolean PutInFile(File file, String text) {
        try {
            if (!file.exists()) {
                file.createNewFile();
            }

            FileOutputStream fileOutputStream = new FileOutputStream(file, true);
            fileOutputStream.write((text + System.getProperty("line.separator")).getBytes());
            return true;

        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }


    //boolean cancelBack = false;
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        /*if(cancelBack) {
            cancelBack = false;
            return false;
        }*/
        // Check if the key event was the Back button and if there's history
        if ((keyCode == KeyEvent.KEYCODE_BACK) && myWebView.canGoBack()) {
            myWebView.goBack();
            return true;
        }
        // If it wasn't the Back key or there's no web page history, bubble up to the default
        // system behavior (probably exit the activity)
        return super.onKeyDown(keyCode, event);
    }

    File getFileFromAsset(String url) {

        int pos = url.lastIndexOf("/");
        String name = url.substring(pos + 1);
        File f = new File(getCacheDir(), name);
        if (!f.exists()) try {

            InputStream is = getAssets().open(url.replace("file:///android_asset/", ""));
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();

            FileOutputStream fos = new FileOutputStream(f);
            fos.write(buffer);
            fos.close();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return f;
    }

    public class WebAppInterface {
        Context mContext;

        /** Instantiate the interface and set the context */
        WebAppInterface(Context c) {
            mContext = c;
        }

        /** Show a toast from the web page */
        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public void share(String title, String url) {
            Share.shareIntentSpecificApps(title, url, MainActivity.this);
        }
    }
}

