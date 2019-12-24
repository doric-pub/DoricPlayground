package pub.doric.example;


import android.os.Bundle;

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
}
