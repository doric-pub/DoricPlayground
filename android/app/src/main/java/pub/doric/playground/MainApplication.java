package pub.doric.playground;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;
import pub.doric.extension.fs.DoricFileLoader;
import pub.doric.extension.fs.DoricFsLibrary;
import pub.doric.extension.sqlite.DoricSQLiteLibrary;
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
        Doric.registerLibrary(new DoricLibrary() {
            @Override
            public void load(DoricRegistry registry) {
                registry.registerNativePlugin(QRCodePlugin.class);
            }
        });
        DoricJSLoaderManager.getInstance().addJSLoader(new DoricFileLoader());
        Doric.registerLibrary(new DoricFsLibrary());
        Doric.registerLibrary(new DoricSQLiteLibrary());
    }
}
