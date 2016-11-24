/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  WebViewController.h
//  ExpOTP
//
//  Created by Sangharsh Aglave on 03/10/16.
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
