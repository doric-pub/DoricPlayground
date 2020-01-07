#import <Doric.h>

#import "DoricQRCodeLibrary.h"
#import "DoricQRCodePlugin.h"

@implementation DoricQRCodePlugin

- (void)scan:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        __block DoricGravity gravity = BOTTOM;
        ShowToast(@"Scan", gravity);
    });
}
@end
