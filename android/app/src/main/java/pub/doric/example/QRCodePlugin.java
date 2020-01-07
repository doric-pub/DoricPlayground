package pub.doric.example;

import android.Manifest;
import android.content.Intent;

import androidx.appcompat.app.AppCompatActivity;

import com.tbruyelle.rxpermissions2.RxPermissions;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.DoricContext;
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
        final RxPermissions rxPermissions = new RxPermissions((AppCompatActivity) getDoricContext().getContext());
        Disposable disposable = rxPermissions
                .request(Manifest.permission.CAMERA)
                .subscribe(new Consumer<Boolean>() {
                    @Override
                    public void accept(Boolean grant) throws Exception {
                        if (grant) {
                            Intent intent = new Intent(getDoricContext().getContext(), ScanQRCodeActivity.class);
                            getDoricContext().getContext().startActivity(intent);
                        }
                    }
                });
    }
}
