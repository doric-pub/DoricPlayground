package pub.doric.playground;

import android.content.ContentResolver;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.ParcelFileDescriptor;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import pub.doric.Doric;
import pub.doric.async.AsyncResult;
import pub.doric.loader.IDoricJSLoader;

/**
 * @Description: pub.doric.playground
 * @Author: pengfei.zhou
 * @CreateDate: 2020/9/1
 */
public class FileLoader implements IDoricJSLoader {
    @Override
    public boolean filter(String source) {
        return source.startsWith("content://");
    }

    @Override
    public AsyncResult<String> request(String source) {
        Uri uri = Uri.parse(source);
        AsyncResult<String> result = new AsyncResult<>();

        ContentResolver resolver = Doric.application().getContentResolver();
        InputStream inputStream = null;
        try {
            inputStream = resolver.openInputStream(uri);
            assert inputStream != null;
            int length = inputStream.available();
            byte[] buffer = new byte[length];
            inputStream.read(buffer);
            result.setResult(new String(buffer));
        } catch (Exception e) {
            e.printStackTrace();
            result.setError(e);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            return result;
        }
    }
}
