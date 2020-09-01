package pub.doric.playground;

import android.Manifest;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;


import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.devkit.DoricDev;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.utils.ThreadMode;

@DoricPlugin(name = "qrcode")
public class QRCodePlugin extends DoricJavaPlugin {
    public QRCodePlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void scan(final DoricPromise promise) {
        Activity activity = (Activity) getDoricContext().getContext();
        if (!(activity instanceof MainActivity)) {
            promise.reject();
            return;
        }
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("onScanQRCodeSuccess");
        LocalBroadcastManager.getInstance(activity).registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String result = intent.getStringExtra("result");
                promise.resolve(new JavaValue(result));
                LocalBroadcastManager.getInstance(context).unregisterReceiver(this);
            }
        }, intentFilter);
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(activity,
                    Manifest.permission.CAMERA)) {
                Toast.makeText(activity, "Please grant camera permission", Toast.LENGTH_SHORT).show();
            } else {
                ActivityCompat.requestPermissions(activity,
                        new String[]{Manifest.permission.CAMERA,}, 1);
            }
        } else {
            Intent intent = new Intent(activity, ScanQRCodeActivity.class);
            activity.startActivity(intent);
        }
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void debug() {
        DoricDev.getInstance().openDevMode();
    }
}
