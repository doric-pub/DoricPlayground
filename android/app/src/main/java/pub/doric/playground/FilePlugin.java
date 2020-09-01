package pub.doric.playground;

import android.app.Activity;
import android.content.Intent;

import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.plugin.DoricJavaPlugin;

/**
 * @Description: pub.doric.playground
 * @Author: pengfei.zhou
 * @CreateDate: 2020/9/1
 */
@DoricPlugin(name = "file")
public class FilePlugin extends DoricJavaPlugin {
    private DoricPromise promise;

    public FilePlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void choose(DoricPromise promise) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/javascript");
        getDoricContext().startActivityForResult(intent, 10001);
        this.promise = promise;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 10001) {
            if (resultCode == Activity.RESULT_OK) {
                promise.resolve(new JavaValue(data.getDataString()));
            } else {
                promise.reject(new JavaValue("Cancelled"));
            }
        }
    }
}
