/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

//
//  WebViewController.m
//  ExpOTP
//
//  Created by Sangharsh Aglave on 03/10/16.
//

#import "WebViewController.h"
#import "MASPluginMAS.h"
#import <WebKit/WebKit.h>

@interface WebViewController ()<UIScrollViewDelegate, UINavigationBarDelegate, UIGestureRecognizerDelegate, WKUIDelegate, WKNavigationDelegate>{
    BOOL _hideStatusBar;
}
@end

@implementation WebViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        
    }
    return self;
}


- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.app loadWebApp:self.webView completion:^(BOOL completed, NSError *error) {
        
    }];
       
    self.webView.allowsBackForwardNavigationGestures = YES;
    
    self.navigationItem.title = self.app.identifier;
    self.navigationItem.leftBarButtonItem = nil;
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(done:)];
}

- (IBAction)backViewController:(id)sender{
    
    [self.navigationController popViewControllerAnimated:YES];
}

- (void) viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    
    [self.navigationController setToolbarHidden:NO animated:YES];
}

- (IBAction)backButtonPressed:(id)sender {
    
    if ([self.webView canGoBack]) {
        [self.webView goBack];
    }
}
- (IBAction)forwardButtonPressed:(id)sender {
    
    if ([self.webView canGoForward]) {
        [self.webView goForward];
    }
}

- (void)done:(id)sender {
    
    [self dismissViewControllerAnimated:YES completion:nil];
}


- (UIBarPosition)positionForBar:(id<UIBarPositioning>)bar{
    
    return UIBarPositionTopAttached;
}


- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    if (!_hideStatusBar) {
        
        [self hideBars];
    }
}

- (void)hideBars
{
    _hideStatusBar = YES;
    
    [UIView animateWithDuration:0.25 animations:^{
        
        [self setNeedsStatusBarAppearanceUpdate];
        self.navigationController.navigationBar.alpha = 0.0f;
        self.navigationController.toolbar.alpha = 0.0f;
    } completion:^(BOOL finished) {
        
        [self.navigationController setNavigationBarHidden:YES animated:YES];
        [self.navigationController setToolbarHidden:YES animated:YES];
    }];
}

- (BOOL)prefersStatusBarHidden
{
    return _hideStatusBar;
}

- (void)tapped:(UIGestureRecognizer *)recognizer
{
    if (recognizer.state == UIGestureRecognizerStateEnded && _hideStatusBar) {
        [self showBars];
    }
}


- (void)showBars
{
    _hideStatusBar = NO;
    
    [self.navigationController setNavigationBarHidden:NO animated:YES];
    [self.navigationController setToolbarHidden:NO animated:YES];
    [UIView animateWithDuration:0.25 animations:^{
        [self setNeedsStatusBarAppearanceUpdate];
        self.navigationController.navigationBar.alpha = 1.0f;
        self.navigationController.toolbar.alpha = 1.0f;
    }];
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    return YES;
}

# pragma mark UIWebView delegate implementation

- (void) webView: (WKWebView *) webView decidePolicyForNavigationAction: (WKNavigationAction *) navigationAction decisionHandler: (void (^)(WKNavigationActionPolicy)) decisionHandler
{
    decisionHandler(WKNavigationActionPolicyAllow);
}

@end
