package pub.doric.playground;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;
import pub.doric.loader.DoricJSLoaderManager;

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
        DoricJSLoaderManager.getInstance().addJSLoader(new FileLoader());
        Doric.registerLibrary(new DoricLibrary() {
            @Override
            public void load(DoricRegistry registry) {
                registry.registerNativePlugin(QRCodePlugin.class);
                registry.registerNativePlugin(FilePlugin.class);
            }
        });
    }
}
