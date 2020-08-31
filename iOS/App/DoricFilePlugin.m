//
//  DoricFilePlugin.m
//  DoricPlayground
//
//  Created by pengfei.zhou on 2020/8/31.
//  Copyright © 2020 pengfei.zhou. All rights reserved.
//

#import "DoricFilePlugin.h"

@interface DoricFilePlugin () <UIDocumentPickerDelegate, UIDocumentInteractionControllerDelegate>
@property(nonatomic, strong) DoricPromise *currentPromise;
@end

@implementation DoricFilePlugin
- (void)choose:(NSDictionary *)dic withPromise:(DoricPromise *)promise {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.currentPromise = promise;
        UIDocumentPickerViewController *documentPickerViewController = [[UIDocumentPickerViewController alloc] initWithDocumentTypes:@[@"public.source-code", @"public.executable",]
                                                                                                                              inMode:UIDocumentPickerModeImport];
        documentPickerViewController.delegate = self;
        [((UIViewController *) (self.doricContext.navigator)).navigationController presentViewController:documentPickerViewController
                                                                                                animated:YES
                                                                                              completion:nil];
    });
}

- (void)documentPicker:(UIDocumentPickerViewController *)controller didPickDocumentsAtURLs:(NSArray <NSURL *> *)urls {
    NSURL *url = urls.firstObject;
    NSFileCoordinator *fileCoordinator = [[NSFileCoordinator alloc] init];
    NSError *error = nil;
    [fileCoordinator coordinateReadingItemAtURL:url options:NSFileCoordinatorReadingWithoutChanges error:&error byAccessor:^(NSURL *newURL) {
        [self.currentPromise resolve:newURL.absoluteString];
    }];
}

- (void)documentPickerWasCancelled:(UIDocumentPickerViewController *)controller {
    [self.currentPromise reject:@"Cancelled"];
}

@end
