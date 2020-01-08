package pub.doric.example;


import android.os.Bundle;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.ui.DemoDebugActivity;

public class MainActivity extends DemoDebugActivity {
    private final String BUNDLE_NAME = "DoricPlayground";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String scheme = "assets://src/" + BUNDLE_NAME + ".js";
        getIntent().putExtra("scheme", scheme);
        getIntent().putExtra("alias", BUNDLE_NAME);
        super.onCreate(savedInstanceState);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQRCodeResultEvent(final QRCodeResultEvent qrCodeResultEvent) {
        findViewById(android.R.id.content).postDelayed(new Runnable() {
            @Override
            public void run() {
                DoricContext[] contexts = new DoricContext[DoricContextManager.aliveContexts().size()];
                DoricContextManager.aliveContexts().toArray(contexts);
                contexts[0].getDoricNavigator().push(qrCodeResultEvent.url, "temp.js", "");
            }
        }, 2000);
    }
}
