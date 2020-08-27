#import <AVFoundation/AVFoundation.h>

#import "DoricQRCodeViewController.h"
#import <DoricCore/DoricContextManager.h>
#import <DoricCore/DoricContext.h>

@interface DoricQRCodeViewController () <AVCaptureMetadataOutputObjectsDelegate>
@property(nonatomic, strong) AVCaptureSession *session;
@property(nonatomic, strong) DoricPromise *promise;
@end

@implementation DoricQRCodeViewController

- (instancetype)initWithPromise:(DoricPromise *)promise {
    if (self = [super init]) {
        _promise = promise;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    if (TARGET_OS_SIMULATOR == 1) {
        [self simulatorAlert];
    } else {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
            if (granted) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self loadScanView];
                });
            } else {
                NSLog(@"无权限访问相机");
            }
        }];
    }
}

- (void)loadScanView {
    //获取摄像设备
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    //创建输入流
    AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
    //创建输出流
    AVCaptureMetadataOutput *output = [[AVCaptureMetadataOutput alloc] init];
    //设置代理 在主线程里刷新
    [output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];

    //初始化链接对象
    self.session = [[AVCaptureSession alloc] init];
    //高质量采集率
    [self.session setSessionPreset:AVCaptureSessionPresetHigh];

    [self.session addInput:input];
    [self.session addOutput:output];

    //设置扫码支持的编码格式(如下设置条形码和二维码兼容)
    output.metadataObjectTypes = @[AVMetadataObjectTypeQRCode,//二维码
            //以下为条形码，如果项目只需要扫描二维码，下面都不要写
            AVMetadataObjectTypeEAN13Code,
            AVMetadataObjectTypeEAN8Code,
            AVMetadataObjectTypeUPCECode,
            AVMetadataObjectTypeCode39Code,
            AVMetadataObjectTypeCode39Mod43Code,
            AVMetadataObjectTypeCode93Code,
            AVMetadataObjectTypeCode128Code,
            AVMetadataObjectTypePDF417Code];

    AVCaptureVideoPreviewLayer *layer = [AVCaptureVideoPreviewLayer layerWithSession:self.session];
    layer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    layer.frame = self.view.layer.bounds;
    [self.view.layer insertSublayer:layer atIndex:0];
    //开始捕获
    [self.session startRunning];
}

#pragma mark - AVCaptureMetadataOutputObjectsDelegate

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection {
    if (metadataObjects.count > 0) {
        [self.session stopRunning];
        AVMetadataMachineReadableCodeObject *metadataObject = metadataObjects[0];
        [self.promise resolve:metadataObject.stringValue];
        [self.navigationController popViewControllerAnimated:NO];
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)simulatorAlert {
    UIAlertController *alertV = [UIAlertController alertControllerWithTitle:@"请使用真机扫码" message:nil preferredStyle:UIAlertControllerStyleAlert];

    UIAlertAction *popAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction *_Nonnull action) {
        [self.navigationController popViewControllerAnimated:YES];
    }];

    [alertV addAction:popAction];

    [self presentViewController:alertV animated:YES completion:nil];
}

@end
