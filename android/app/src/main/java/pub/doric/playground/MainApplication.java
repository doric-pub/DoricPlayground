package pub.doric.playground;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.dangle.library.DangleLibrary;
import pub.doric.devkit.DoricDev;
import pub.doric.library.DoricBarcodeScannerLibrary;
import pub.doric.library.DoricImagePickerLibrary;
import pub.doric.library.fs.DoricFsLibrary;
import pub.doric.library.sqlite.DoricSQLiteLibrary;
import pub.doric.library.three.DoricThreeLibrary;
import pub.doric.library.webview.DoricWebViewLibrary;

/**
 * @Description: pub.doric.playground
 * @Author: pengfei.zhou
 * @CreateDate: 2019-12-05
 */
public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
        DoricDev.getInstance();
        Doric.registerLibrary(new DoricFsLibrary());
        Doric.registerLibrary(new DoricSQLiteLibrary());
        Doric.registerLibrary(new DoricBarcodeScannerLibrary());
        Doric.registerLibrary(new DoricImagePickerLibrary());
        Doric.registerLibrary(new DoricWebViewLibrary());
        Doric.registerLibrary(new DangleLibrary());
        Doric.registerLibrary(new DoricThreeLibrary());
    }
}
