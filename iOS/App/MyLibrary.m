//
//  MyLibrary.m
//  DoricPlayground
//
//  Created by pengfei.zhou on 2020/8/27.
//  Copyright © 2020 pengfei.zhou. All rights reserved.
//

#import "MyLibrary.h"
#import "DoricQRCodePlugin.h"
#import "DoricFilePlugin.h"

@implementation MyLibrary
- (void)load:(DoricRegistry *)registry {
    [registry registerNativePlugin:DoricQRCodePlugin.class withName:@"qrcode"];
    [registry registerNativePlugin:DoricFilePlugin.class withName:@"file"];
}
@end
