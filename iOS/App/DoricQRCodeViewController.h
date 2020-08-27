//
//  DoricQRCodeViewController.h
//  DoricPlayground
//
//  Created by pengfei.zhou on 2020/8/27.
//  Copyright © 2020 pengfei.zhou. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <DoricCore/Doric.h>

NS_ASSUME_NONNULL_BEGIN

@interface DoricQRCodeViewController : UIViewController
- (instancetype)initWithPromise:(DoricPromise *)promise;
@end

NS_ASSUME_NONNULL_END
