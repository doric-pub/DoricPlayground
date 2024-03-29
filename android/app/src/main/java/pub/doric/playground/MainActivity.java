package pub.doric.playground;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricFragment;
import pub.doric.navbar.BaseDoricNavBar;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "DoricPlayground";

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
    }
}
