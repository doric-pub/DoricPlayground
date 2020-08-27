package pub.doric.playground;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;


import pub.doric.DoricContext;
import pub.doric.devkit.qrcode.activity.CaptureActivity;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.plugin.DoricJavaPlugin;
import pub.doric.utils.ThreadMode;

@DoricPlugin(name = "qrcode")
public class QRCodePlugin extends DoricJavaPlugin {
    public QRCodePlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(thread = ThreadMode.UI)
    public void scan() {
        Activity activity = (Activity) getDoricContext().getContext();
        if (!(activity instanceof MainActivity)) {
            return;
        }
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
            Intent intent = new Intent(activity, CaptureActivity.class);
            activity.startActivityForResult(intent, MainActivity.REQUEST_CODE);
        }
    }


}
