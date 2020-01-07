package pub.doric.example;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;

/**
 * @Description: pub.doric.example
 * @Author: pengfei.zhou
 * @CreateDate: 2019-12-05
 */
public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
        DoricRegistry.register(new DoricLibrary() {
            @Override
            public void load(DoricRegistry registry) {
                registry.registerNativePlugin(QRCodePlugin.class);
            }
        });
    }
}
