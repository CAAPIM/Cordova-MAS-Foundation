//
//  WebViewController.h
//  ExpOTP
//
//  Created by Sangharsh Aglave on 03/10/16.
//
//

#import <UIKit/UIKit.h>
#import <MASFoundation/MASFoundation.h>
@interface WebViewController : UIViewController
@property (strong, nonatomic) IBOutlet UIWebView *webView;
@property (strong, nonatomic) NSURLRequest *urlRequest;
@property (strong, nonatomic) NSData *data;
@property (strong, nonatomic) MASApplication *app;
@property (strong, nonatomic) UINavigationController *navController;
@end
