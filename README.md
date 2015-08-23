jquery.ajaxFile (0.1.0)
===============
Library to upload and download files in a single page application.


You must manage older browsers and send files in your SPA ?

**DON'T PANIC !**

`jquery.ajaxFile` support old browsers (>=IE6) and manages all use cases.
Sending file by user, with or without additional data, with or without response (data or file)...

Enjoy :)


# Installation
With npm :
```
npm install --save jquery.ajaxFile
```
With bower :
```
bower install --save jquery.ajaxFile
```

# Dependency
Only `JQuery`

# AjaxFile without jquery integration
Add the script `dist/ajaxFile.js` in your page

Send a file :
``` js
var resultPromise = AjaxFile.send({
    method: 'POST',
    url: url,
    desiredResponseDataType: AjaxFile.DataType.Json,
    files: [
        { name: 'joeFile', element: inputElement }
    ],
    data: {
        name: 'joe'
    },
    timeoutInSeconds: 30
}).then(function(result) { 
    console.log('Result: ' + result.data); 
}, function(result) { 
    console.log('Error: ' + result.error);
}).done(function(result) {
    console.log('Result: ' + result.data); 
}).fail(function(result) {
    console.log('Error: ' + result.error);
}).always(function(result) {
    console.log('end');
});
```
 * `method` (default: `'POST'`): HTTP Method
 * `url` (default: current url): url of server
 * `desiredResponseDataType` (default: `AjaxFile.DataType.Json`): AjaxFile.DataType expose enum with as key : `AjaxFile.DataType.Xml`, `AjaxFile.DataType.Json` and `AjaxFile.DataType.Text`
 * `files` (default: `[]`): key value with the name of file and file input element
 * `data` (default: `{}`): additional data
 * `timeoutInSeconds` (default: `60`): with old browsers, javascript cann't know if the treatment is in progress or in error. This timeout is as a garbage collector.

This method return an promise with methods :
 * `then(successCallback, errorCallback)`
 * `done(successCallback)`
 * `fail(errorCallback)`: call in case of error and timeout
 * `always(callback)`: `callback` is called on `done` and `fail`
 * `abord()`: cancel process

callbacks has a parameter with properties :
 * `error`: error message
 * `data`: object return by server (desiredResponseDataType used to deserialize)
 * `status`: 
    * `code`: HTTP status code
    * `text`: HTTP status name
    * `isSuccess`: 304 or between 200 and 300

# AjaxFile with jquery integration
Add the script `dist/ajaxFile.jquery.js` in your page (not need `ajaxFile.js`)

Send a file :
``` js
$.fn.ajaxWithFile({
    type: 'POST',
    url: url,
    dataType: "json",
    files: [
        { name: 'joeFile', element: input.getElement() }
    ],
    data: {
        name: 'joe'
    },
    success: function (result) {
        console.log('Result: ' + result);
    },
    error: function (jqXhr, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
    },
    complete: function (jqXhr, textStatus) {
        console.log('end');
    },
    global: true,
    timeout: 60
});
```
It's same parameter that `$.ajax` (see [jQuery doc](http://api.jquery.com/jQuery.ajax/))
 * `dataType` (default: `'Json'`): support `Xml`, `Json` or `Text`
 * `files` (default: `[]`): key value with the name of file and file input element
 * `timeoutInSeconds` (default: `60`): with old browsers, javascript cann't know if the treatment is in progress or in error. This timeout is as a garbage collector.

This method return jqXHR object (see [jQuery doc](http://api.jquery.com/jQuery.ajax/#jqXHR))

# Server requirement
## Standard response format
Old browsers poorly manages reading the response from the server. A place to interpret and expose the answer, it prompts the user to download a file.
To work around this problem, it's necessary that the server returns HTML code.

A second problem, in case of error (status code different from 2XX), the JS cann't have access to content.

By convention, to solve these problems, server responses must be in the following form:
``` html
<textarea statusCode=%HTTP_STATUS_CODE% statusText=%HTTP_STATUS_TXT%>%DATA%</textarea>
```
example with json and 200 code :
``` html
<textarea statusCode=200 statusText=OK>{ text: 'hello' }</textarea>
```
example with error :
``` html
<textarea statusCode=400 statusText="Bad Request">[\"Can receive error\"]</textarea>
```

## Response with file
If you want to respond by sending a file, then `ajaxFile` can't interpret the `textarea`.
Don't worry, AjaxFile also manages!

`ajaxFile` can't read reponse content, but it can read cookies!

When `ajaxFile` sends a file, it adds the POST parameter `__requestId`.
You must create a cookie with the name as the value contained in `__requestId`.

**/!\ You need content in the cookie. If it's empty, it will be ignored by old browsers. The value doesn't matter. By example, you can put `"1"`.**

# Plugin Knockout
With mvvm pattern, it's difficult to take reference to input element.
This extension add binding and wrap input element.

## Usage
Add the script `dist/ajaxFile.knockout.js`

On input element :
``` html
<input type="file" name="file" data-bind="file: selectedFile">
```

In your viewmodel, a simple observable :
``` js
this.selectedFile = ko.observable();
```

`selectedFile` contains :
 * `getElement()`: return Input Element
 * `fileSelected`: indicate if user has selected a file

So to send :
``` js
var resultPromise = AjaxFile.send({
    url: url,
    files: [
        { name: 'joeFile', element: selectedFile().getElement() }
    ]
}).then(function(result) { 
    console.log('Done'); 
});
```

# DEMO
You can see a demo : [/Demo/Jquery.AjaxFile.Demo/Jquery.AjaxFile.Demo.Nancy/Content/main.js](https://github.com/fpellet/jquery.ajaxFile/blob/master/Demo/Jquery.AjaxFile.Demo/Jquery.AjaxFile.Demo.Nancy/Content/main.js) 

# Licence
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.