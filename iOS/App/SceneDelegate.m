#import "SceneDelegate.h"
#import <DoricCore/Doric.h>
#import <DoricFs/DoricFsLibrary.h>
#import <DoricSQLite/DoricSQLiteLibrary.h>
#import <DoricBarcodeScanner/DoricBarcodeScannerLibrary.h>
#import <DoricImagePicker/DoricImagePickerLibrary.h>
#import <DoricDevkit/DoricDev.h>
#import <DoricWebView/DoricWebViewLibrary.h>
#import <DoricThree/DoricThreeLibrary.h>
#import <Dangle/DangleLibrary.h>
#import <mobx-doric/DoricMobxLibrary.h>
#import <DoricPlatformAPI/DoricPlatformAPILibrary.h>

@interface SceneDelegate ()
@end

@implementation SceneDelegate
- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    UIWindowScene *windowScene = (UIWindowScene *) scene;
    NSString *bundleName = @"DoricPlayground";
    [DoricDev instance];
    [Doric registerLibrary:[DoricFsLibrary new]];
    [Doric registerLibrary:[DoricSQLiteLibrary new]];
    [Doric registerLibrary:[DoricBarcodeScannerLibrary new]];
    [Doric registerLibrary:[DoricImagePickerLibrary new]];
    [Doric registerLibrary:[DoricWebViewLibrary new]];
    [Doric registerLibrary:[DangleLibrary new]];
    [Doric registerLibrary:[DoricThreeLibrary new]];
    [Doric registerLibrary:[DoricMobxLibrary new]];
    [Doric registerLibrary:[DoricPlatformAPILibrary new]];
    DoricViewController *doricViewController = [[DoricViewController alloc] initWithSource:[NSString stringWithFormat:@"assets://src/%@.js", bundleName]
                                                                                     alias:bundleName
                                                                                     extra:@""];
    doricViewController.view.backgroundColor = [UIColor whiteColor];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:doricViewController];
    UINavigationBar *bar = navigationController.navigationBar;
    if (@available(iOS 15.0, *)) {
        UINavigationBarAppearance *barAppearance = [UINavigationBarAppearance new];
        barAppearance.backgroundColor = UIColor.whiteColor;
        bar.scrollEdgeAppearance = bar.standardAppearance = barAppearance;
    }
    UIWindow *window = [[UIWindow alloc] initWithWindowScene:windowScene];
    window.frame = windowScene.coordinateSpace.bounds;
    window.rootViewController = navigationController;
    [UIApplication sharedApplication].delegate.window = window;
    [window makeKeyAndVisible];
}

- (void)sceneDidDisconnect:(UIScene *)scene {
    // Called as the scene is being released by the system.
    // This occurs shortly after the scene enters the background, or when its session is discarded.
    // Release any resources associated with this scene that can be re-created the next time the scene connects.
    // The scene may re-connect later, as its session was not neccessarily discarded (see `application:didDiscardSceneSessions` instead).
}


- (void)sceneDidBecomeActive:(UIScene *)scene {
    // Called when the scene has moved from an inactive state to an active state.
    // Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
}


- (void)sceneWillResignActive:(UIScene *)scene {
    // Called when the scene will move from an active state to an inactive state.
    // This may occur due to temporary interruptions (ex. an incoming phone call).
}


- (void)sceneWillEnterForeground:(UIScene *)scene {
    // Called as the scene transitions from the background to the foreground.
    // Use this method to undo the changes made on entering the background.
}


- (void)sceneDidEnterBackground:(UIScene *)scene {
    // Called as the scene transitions from the foreground to the background.
    // Use this method to save data, release shared resources, and store enough scene-specific state information
    // to restore the scene back to its current state.
}


@end

