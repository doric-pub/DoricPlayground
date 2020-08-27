//
//  DoricQRCodePlugin.m
//  DoricPlayground
//
//  Created by pengfei.zhou on 2020/8/27.
//  Copyright © 2020 pengfei.zhou. All rights reserved.
//

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
