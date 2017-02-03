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

@interface WebViewController ()<UIScrollViewDelegate, UINavigationBarDelegate, UIGestureRecognizerDelegate, UIWebViewDelegate>{
    BOOL _hideStatusBar;
}
@end

@implementation WebViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}


- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    //set the webView delegate
    //self.webView.delegate = self;
    
    [self.app loadWebApp:self.webView completion:^(BOOL completed, NSError *error) {
        
    }];
    
    self.webView.scrollView.delegate=self;
    self.navigationItem.title = self.app.identifier;
    UITapGestureRecognizer *tapCatcher = [[UITapGestureRecognizer alloc] init];
    [tapCatcher setNumberOfTapsRequired:1];
    [tapCatcher setNumberOfTouchesRequired:1];
    [tapCatcher setDelegate:self];
    [tapCatcher addTarget:self action:@selector(tapped:)];
    
    [self.webView addGestureRecognizer:tapCatcher];
    
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


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)backButtonPressed:(id)sender {
    [self.webView goBack];
}
- (IBAction)forwardButtonPressed:(id)sender {
    [self.webView goForward];
}

- (void)done:(id)sender {
    
    for (UIGestureRecognizer *gr in self.webView.gestureRecognizers) {
        
        gr.delegate = nil;
    }
    
    self.webView.scrollView.delegate = nil;
    
    [self dismissViewControllerAnimated:YES completion:nil];
}


/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
 {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

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

- (void)webViewDidStartLoad:(UIWebView *)webView{
    NSLog(@"webViewDidStartLoad");
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    NSLog(@"webView:shouldStartLoadWithRequest:navigationType:");
    return YES;
}

- (void)webViewDidFinishLoad:(UIWebView *)webView{
    NSLog(@"webViewDidFinishLoad");
}
- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
    NSLog(@"webView:didFailLoadWithError");
}
@end
