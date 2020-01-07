#import <Doric.h>

#import "DoricQRCodeLibrary.h"
#import "DoricQRCodePlugin.h"

@implementation DoricQRCodeLibrary

- (void)load:(DoricRegistry *)registry {
    [registry registerNativePlugin:DoricQRCodePlugin.class withName:@"qrcode"];
}

@end
