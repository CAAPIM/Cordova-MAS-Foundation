/**
 * Copyright (c) 2016 CA, Inc. All rights reserved.
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 *
 */

function include(file)
{

  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}
include("http://code.jquery.com/jquery-1.8.2.min.js");
include("http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js");
