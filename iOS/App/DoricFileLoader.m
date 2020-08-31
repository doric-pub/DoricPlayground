//
//  DoricFileLoader.m
//  DoricPlayground
//
//  Created by pengfei.zhou on 2020/8/31.
//  Copyright © 2020 pengfei.zhou. All rights reserved.
//

#import "DoricFileLoader.h"

@implementation DoricFileLoader
- (BOOL)filter:(NSString *)source {
    return [source hasPrefix:@"file:///"];
}

- (DoricAsyncResult <NSString *> *)request:(NSString *)source {
    DoricAsyncResult *ret = [DoricAsyncResult new];
    NSURL *URL = [NSURL URLWithString:source];
    NSError *error;
    NSString *jsContent = [NSString stringWithContentsOfURL:URL encoding:NSUTF8StringEncoding error:&error];
    if (error) {
        [ret setupError:[NSException new]];
    } else {
        [ret setupResult:jsContent];
    }
    return ret;
}


@end
