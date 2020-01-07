#import <Doric.h>

#import "DoricQRCodeLibrary.h"
#import "DoricQRCodePlugin.h"
#import "DoricQRCodeViewController.h"

@implementation DoricQRCodePlugin

- (void)scan:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        DoricQRCodeViewController *doricQRCodeViewController = [[DoricQRCodeViewController alloc] init];

        [((DoricViewController*) self.doricContext.navigator).navigationController pushViewController:doricQRCodeViewController animated:YES];
    });
}
@end
