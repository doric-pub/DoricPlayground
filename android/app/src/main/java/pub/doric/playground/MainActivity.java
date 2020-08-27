package pub.doric.playground;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricFragment;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.qrcode.activity.CaptureActivity;
import pub.doric.devkit.qrcode.activity.CodeUtils;
import pub.doric.navbar.BaseDoricNavBar;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "DoricPlayground";
    public static final int REQUEST_CODE = 123;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String source = "assets://src/" + BUNDLE_NAME + ".js";
        getIntent().putExtra("source", source);
        getIntent().putExtra("alias", BUNDLE_NAME);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.getSupportFragmentManager().beginTransaction().add(R.id.container, new DoricFragment()).commit();
        BaseDoricNavBar doricNavBar = findViewById(R.id.doric_nav_bar);
        doricNavBar.setBackIconVisible(false);

        TextView textView = new TextView(this);
        textView.setText("Devkit");
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DoricDev.getInstance().openDevMode();
            }
        });
        textView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        doricNavBar.setRight(textView);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE) {
            if (null != data) {
                Bundle bundle = data.getExtras();
                if (bundle == null) {
                    return;
                }
                if (bundle.getInt(CodeUtils.RESULT_TYPE) == CodeUtils.RESULT_SUCCESS) {
                    String result = bundle.getString(CodeUtils.RESULT_STRING);
                    Toast.makeText(this, "dev kit connecting to " + result, Toast.LENGTH_LONG).show();
                }
            }
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1) {
            for (int i = 0; i < permissions.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    Intent intent = new Intent(this, CaptureActivity.class);
                    startActivityForResult(intent, REQUEST_CODE);
                }
            }
        }
    }
}
