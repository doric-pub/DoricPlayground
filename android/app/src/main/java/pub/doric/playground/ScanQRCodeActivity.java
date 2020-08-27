package pub.doric.playground;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import cn.bingoogolapple.qrcode.core.QRCodeView;
import cn.bingoogolapple.qrcode.zbar.ZBarView;

/**
 * @Description: pub.doric.playground
 * @Author: pengfei.zhou
 * @CreateDate: 2020/8/27
 */
public class ScanQRCodeActivity extends AppCompatActivity implements QRCodeView.Delegate {
    private ZBarView mZbarView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.layout_qrcode_scan);
        mZbarView = findViewById(R.id.zbar_view);
        mZbarView.setDelegate(this);
    }

    @Override
    protected void onStart() {
        super.onStart();

        mZbarView.startCamera();
        mZbarView.startSpotAndShowRect();
    }

    @Override
    protected void onStop() {
        super.onStop();

        mZbarView.stopCamera();
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        mZbarView.onDestroy();
        super.onDestroy();
    }

    @Override
    public void onScanQRCodeSuccess(String result) {
        setTitle("扫描结果为：" + result);
        Intent intent = new Intent("onScanQRCodeSuccess");
        intent.putExtra("result", result);
        LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
        finish();
    }

    @Override
    public void onCameraAmbientBrightnessChanged(boolean isDark) {
        String tipText = mZbarView.getScanBoxView().getTipText();
        String ambientBrightnessTip = "\n环境过暗，请打开闪光灯";
        if (isDark) {
            if (!tipText.contains(ambientBrightnessTip)) {
                mZbarView.getScanBoxView().setTipText(tipText + ambientBrightnessTip);
            }
        } else {
            if (tipText.contains(ambientBrightnessTip)) {
                tipText = tipText.substring(0, tipText.indexOf(ambientBrightnessTip));
                mZbarView.getScanBoxView().setTipText(tipText);
            }
        }
    }

    @Override
    public void onScanQRCodeOpenCameraError() {
        System.out.println();
    }
}