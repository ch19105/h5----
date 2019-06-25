/*
注意：源生app需要配置jsbridge的环境，而在前端页面中需要下方封装代码，既可以达到调用app方法的功能和注册供app调用的方法
1、注册方法：注册后，供app调用，注册时，同名函数，下一个会覆盖上一个
2、调用函数，可以调用多次
3、使用时，只需要导入即可 如：import {setbridge, getbridge} from 'jsbridge'
4、使用方式：
调用app方法： getbridge(functionName,data,callback) 第一个参数是app的函数名字；
第2个参数是要传递给app方法的数据，数据类型不限（具体要看app接收什么类型的数据，如：json，string，number等）
第3个参数是一个函数，函数内隐含回调数据data，调用例子如下：

getbridge('closePage','关闭页面',(data) => {
  // 'app返回过来的数据：'+data
})
注册方法，供app使用：
setbridge(functionName,data,callback) 调用方式类似于上方说明
第一个参数：函数名字，可以自定义
第2个参数，app调用该方法是，需要给app传递的数据
第3个参数，回调函数，默认函数有一个数据data参数，得到的是app返回给前台js的数据

*/

function setupWebViewJavascriptBridge(callback) {
    if (/android/.test(navigator.userAgent.toLowerCase())) {
        if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge);
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function() {
                    callback(window.WebViewJavascriptBridge);
                },
                false
            );
        }
    } else if (/ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
        if (window.WebViewJavascriptBridge) {
            return callback(window.WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe);
        }, 100);
    }
}
setupWebViewJavascriptBridge(function(bridge) {
    if (/android/.test(navigator.userAgent.toLowerCase())) {
        bridge.init(function(message, responseCallback) {
            // 'JS got a message', message
            var data = {
                'Javascript Responds': '测试中文!'
            };

            if (responseCallback) {
                // 'JS responding with', data
                responseCallback(data);
            }
        });
    }

});
// 初始化jsbridge
function setbridge(funName, dataJson, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler(funName, function(data, responseCallback) {
            // '注册函数，从app拿到的数据', data
            callback && callback(data);
            var responseData = dataJson;
            // 'js返回给app的数据', responseData
            responseCallback(responseData);
        });
    });
    console.log(123)
}

function getbridge(funName, dataJson, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(funName, dataJson, function(response) {
            callback && callback(response);
        });
    });
    console.log(12366)

}
console.log(33332222222);

// export { setbridge, getbridge };