package pub.doric.example;


import android.os.Bundle;

import com.github.pengfeizhou.jscore.JSONBuilder;

import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.ui.DemoDebugActivity;

public class MainActivity extends DemoDebugActivity {
    private final String BUNDLE_NAME = "DoricPlayground";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected String getSource() {
        return "assets://src/" + BUNDLE_NAME + ".js";
    }

    @Override
    protected String getAlias() {
        return BUNDLE_NAME;
    }

    @Override
    protected String getExtra() {
        return new JSONBuilder().put("href", "assets://").toJSONObject().toString();
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
