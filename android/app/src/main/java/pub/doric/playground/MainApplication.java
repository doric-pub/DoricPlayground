package pub.doric.playground;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.library.DoricBarcodeScannerLibrary;
import pub.doric.library.DoricImagePickerLibrary;
import pub.doric.library.fs.DoricFsLibrary;
import pub.doric.library.sqlite.DoricSQLiteLibrary;

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
        Doric.registerLibrary(new DoricFsLibrary());
        Doric.registerLibrary(new DoricSQLiteLibrary());
        Doric.registerLibrary(new DoricBarcodeScannerLibrary());
        Doric.registerLibrary(new DoricImagePickerLibrary());
    }
}
