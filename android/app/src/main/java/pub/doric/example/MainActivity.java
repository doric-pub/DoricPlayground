package pub.doric.example;


import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.tbruyelle.rxpermissions2.RxPermissions;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.devkit.ui.DemoDebugActivity;
import pub.doric.utils.DoricUtils;

public class MainActivity extends DemoDebugActivity {
    private final String BUNDLE_NAME = "DoricPlayground";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String scheme = "assets://src/" + BUNDLE_NAME + ".js";
        getIntent().putExtra("scheme", scheme);
        getIntent().putExtra("alias", BUNDLE_NAME);
        super.onCreate(savedInstanceState);

        ImageView scan = new ImageView(this);
        scan.setImageResource(R.mipmap.scan);
        FrameLayout.LayoutParams scanLP = new FrameLayout.LayoutParams(
                DoricUtils.dp2px(34), DoricUtils.dp2px(30)
        );
        scanLP.topMargin = DoricUtils.dp2px(7);
        scanLP.bottomMargin = DoricUtils.dp2px(7);
        scanLP.rightMargin = DoricUtils.dp2px(7);
        scanLP.leftMargin = DoricUtils.dp2px(7);
        scanLP.gravity = Gravity.CENTER;
        scan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final RxPermissions rxPermissions = new RxPermissions(MainActivity.this);
                Disposable disposable = rxPermissions
                        .request(Manifest.permission.CAMERA)
                        .subscribe(new Consumer<Boolean>() {
                            @Override
                            public void accept(Boolean grant) throws Exception {
                                if (grant) {
                                    Intent intent = new Intent(MainActivity.this, ScanQRCodeActivity.class);
                                    MainActivity.this.startActivity(intent);
                                }
                            }
                        });
            }
        });

        DraggableView floating = new DraggableView(this);
        floating.addView(scan, scanLP);

        FrameLayout.LayoutParams floatingLP = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT
        );
        floatingLP.gravity = Gravity.END;
        FrameLayout root = findViewById(android.R.id.content);
        root.addView(floating, floatingLP);
    }
}
