﻿var APP_NAME = 'AK';
var APP = {
    'CONFIG': {
        'TIME_OUT': 59,
        'VERSION': 28,
        'BASE_URL': function() {
            var url = 'https://www.akapi3.com/RPC/';
            return url
        }(),
		'BASE_Shunt': function() {
            var url = 'https://www.akapi3.com/RPC/';
            return url;
        }(),
        'IS_RUNTIME': navigator.userAgent.indexOf("Html5Plus") > -1,
        'SYSTEM_KEYS': {
            'USER_MODEL_KEY': APP_NAME + '_user_model',
            'LANGUAGE_KEY': APP_NAME + '_current_langeuage',
            'LOCAL_LOGIN_INFO_KEY': APP_NAME + '_local_login_info',
            'IS_FINGER_PRINT_OPEN': APP_NAME + '_is_finger_print_open',
            'FIRST_LOGIN_QUESTION_KEY': APP_NAME + '_first_login_question',
            'FIRST_LOGIN_RESETPIN_KEY': APP_NAME + '_login_resetpin',
            'APP_BASE_URL_KEY': APP_NAME + 'app_base_url'
        },
        'SUB_PAGES': [{
            'pageName': 'home.html',
            'statusBar': 'dark'
        }, {
            'pageName': 'ace.list.html',
            'loadAction': '_vue.loadPageData()',
            'isLoaded': false,
            'statusBar': 'dark'
        }, {
            'pageName': 'ep.list.html',
            'loadAction': '_vue.loadPageData()',
            'isLoaded': false,
            'statusBar': 'dark'
        }, {
            'pageName': 'center.html',
            'isLoaded': true,
            'statusBar': 'light'
        }],
        'IPHONE': {
            // iPhone X、iPhone XS
            isIPhoneX: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812,
            // iPhone XS Max
            isIPhoneXSMax: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896,
            // iPhone XR
            isIPhoneXR: /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896,
        },
        'IsSafeArea': function() {
            return APP.CONFIG.IPHONE.isIPhoneX || APP.CONFIG.IPHONE.isIPhoneXSMax || APP.CONFIG.IPHONE.isIPhoneXR;
        },
        'TOAST_DEFAULT': {
            mask: true,
            message: 'Loading...',
            duration: 0,
            forbidClick: true
        },
        'CONFIRM_DEFAULT': {
            title: 'title',
            message: 'message',
            confirmButtonText: 'confirm',
            cancelButtonText: 'cancel',
            confirmCallback: function() {},
            cancelCallback: function() {}
        },
        'SYSTEM_NAME': function() {
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                return 'ios';
            } else {
                return 'andr';
            }
        }()
    },
    'GLOBAL': {
        'getItem': function(key) {
            if (APP.CONFIG.IS_RUNTIME) {
                return plus.storage.getItem(key);
            } else {
                return window.localStorage.getItem(key);
            }
        },
        'setItem': function(k, v) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.setItem(k, v);
            } else {
                window.localStorage.setItem(k, v);
            }
        },
        'removeItem': function(key) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.removeItem(key);
            } else {
                window.localStorage.removeItem(key);
            }
        },
        'getUserModel': function() {
            var jsonText = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            if (jsonText === null) {
                return APP.USER.MODEL;
            }

            APP.USER.MODEL = JSON.parse(jsonText);
            return APP.USER.MODEL;
        },
        'updateUserModel': function(model, pages) {
            APP.USER.MODEL = Object.assign(APP.USER.MODEL, model);
            APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY, JSON.stringify(APP.USER.MODEL));

            if (pages instanceof Array && APP.CONFIG.IS_RUNTIME) {
                for (var i = 0; i < pages.length; i++) {
                    var wb = plus.webview.getWebviewById(pages[i].pageName);
                    wb.evalJS(pages[i].actionName);
                }
            }
        },
        'removeModel': function() {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.storage.removeItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            } else {
                window.localStorage.removeItem(APP.CONFIG.SYSTEM_KEYS.USER_MODEL_KEY);
            }

            APP.USER.MODEL = {
                'Id': 0,
                'Key': ''
            };
        },
        'gotoNewWindow': function(id, page, an) {
            if (typeof an !== 'undefined' && typeof an.param !== 'undefined') {
                window.location = page + '.html?' + an.param;
            } else {
                window.location = page + '.html';
            }
        },
        'closeWindow': function(ani) {
            if (!APP.CONFIG.IS_RUNTIME) {
                window.history.back();
                return;
            }

            if (typeof window.onPageClose === 'function') {
                window.onPageClose();
            }

            plus.webview.currentWebview().close(typeof ani === 'string' ? ani : 'auto');
        },
        'showWaiting': function(text) {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.nativeUI.showWaiting(text);
            } else {
                APP.GLOBAL.toastLoading({ 'message': text });
            }
        },
        'closeWaiting': function() {
            if (APP.CONFIG.IS_RUNTIME) {
                plus.nativeUI.closeWaiting();
            } else {
                APP.GLOBAL.closeToastLoading();
            }
        },
        'toastLoading': function(option) {
            if (typeof _vue === 'undefined') return;
            if (typeof option === 'string') {
                option = {
                    message: option
                };
            }

            option = Object.assign({}, APP.CONFIG.TOAST_DEFAULT, option);
            _vue.$toast.loading({
                mask: option.mask,
                duration: option.duration,
                message: option.message
            });
        },
        'closeToastLoading': function() {
            if (typeof _vue === 'undefined') return;

            _vue.$toast.clear();
        },
        'toastMsg': function(text) {
            if (!APP.CONFIG.IS_RUNTIME) {
                _vue.$dialog.alert({
                    'title': 'AK',
                    'message': text
                });
            } else {
                plus.nativeUI.toast(text);
            }
        },
		//---
		'toastMsgUrl': function (text, redirectUrl) {
			if (!text) return;
			if (!APP.CONFIG.IS_RUNTIME) {
				if (_vue && _vue.$dialog) {
					_vue.$dialog.alert({
						title: 'AK',
						message: text,
						confirmButtonText: '立即跳转'   // 替换按钮文字
					}).then(() => {
						if (redirectUrl) {
							window.location.href = redirectUrl;
						}
					});
				} else {
					alert(text);
					if (redirectUrl) {
						window.location.href = redirectUrl;
					}
				}
			} else {
				if (typeof plus !== 'undefined' && plus.nativeUI && plus.nativeUI.toast) {
					plus.nativeUI.toast(text);
					if (redirectUrl) {
						setTimeout(() => {
							plus.runtime.openURL(redirectUrl);
						}, 1000); // 稍微延迟跳转
					}
				} else {
					alert(text);
					if (redirectUrl) {
						window.location.href = redirectUrl;
					}
				}
			}
		},
		//---
        'confirmMsg': function(option) {
            option = Object.assign({}, APP.CONFIG.CONFIRM_DEFAULT, option);
            _vue.$dialog.confirm(option).then(option.confirmCallback).catch(option.cancelCallback);
        },
        'queryString': function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);

            if (r !== null) {
                return decodeURIComponent(r[2]);
            }
            return null;
        },
        'gotoLogin': function() {
            //window.location = '/index.html?canclose=false';
			window.location = '/pages/account/login.html';
        },
        'ajax': function(option) {
            var d = new Date();
            var timespan = d.getFullYear() + d.getMonth() + d.getDate() + d.getHours() + d.getMinutes();
            option = option || {};
            option.method = "POST";
            option.url = option.url || '';
            option.dataType = "JSON";
            option.async = option.async || true;
            option.data = option.data || {};
            option.timeout = option.timeout || 20000;
            if (!option.data['Userkey']) {
                option.data['key'] = APP.USER.MODEL.Key ? APP.USER.MODEL.Key : '123';
            }
			if (!option.data['UserID']) {
				option.data['UserID'] = APP.USER.MODEL.Id ? APP.USER.MODEL.Id : '123';
			}
            option.data['v'] = timespan;
            option.data['lang'] = LSE.currentLanguage();
            option.success = option.success || function() {};
            option.error = option.error || function(XMLHttpRequest, textStatus, errorThrown) {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }
                console.log('status:' + XMLHttpRequest.status);
                console.log('XMLHttpRequest：' + JSON.stringify(XMLHttpRequest));
                console.log('readyStatetus:' + XMLHttpRequest.readyState);
                console.log('textStatus:' + textStatus);
                console.log('errorThrown:' + errorThrown);
            };

            if (!XMLHttpRequest) {
                console.log("XMLHttpRequest");
                return;
            }

            var xhr = new XMLHttpRequest();
            xhr.ontimeout = option.ontimeout || function() {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }

                APP.GLOBAL.toastMsg('Server busy - web');
            };

            if (typeof xhr === 'undefined' || xhr === null) {
                console.log("XMLHttpRequest");
                return;
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            // debugger
                            var json = JSON.parse(xhr.responseText || xhr.response);
                            if (json.Error && json.IsLogin === false) {
                                console.log(json)
                                APP.GLOBAL.gotoLogin();
                                return;
                            }

                            option.success(json);
                        } catch (e) {
                            console.error('Response:' + (xhr.responseText || xhr.response) + '\r\nMessage:' + e.message + '\r\nStack:' + e.stack);
                            option.error(xhr, xhr.status);
                        }
                    } else {
                        option.error(xhr, xhr.status);
                    }
                }
            };

            var params = [];
            for (var key in option.data) {
                if (option.data.hasOwnProperty(key)) {
                    params.push(key + '=' + option.data[key]);
                }
            }

            try {
                var postData = params.join('&');
                xhr.open(option.method, option.url, option.async);
                xhr.timeout = option.timeout;
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xhr.send(postData);
            } catch (e) {
                console.log(e);
            }
        },
        'ajax_get': function(option) {
            option = option || {};
            option.method = "GET";
            option.url = option.url || '';
            option.dataType = "JSON";
            option.async = option.async || true;
            option.data = option.data || {};
            option.timeout = option.timeout || 20000;

            if (!option.data['Userkey']) {
                option.data['key'] = USER_MODEL.Key ? USER_MODEL.Key : '123';
            }
			if (!option.data['UserID']) {
				option.data['UserID'] = APP.USER.MODEL.Id ? APP.USER.MODEL.Id : '123';
			}

            option.data['lang'] = LSE.currentLanguage();
            option.success = option.success || function() {};
            option.error = option.error || function(XMLHttpRequest, textStatus, errorThrown) {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }

                console.log('status:' + XMLHttpRequest.status);
                console.log('XMLHttpRequest：' + JSON.stringify(XMLHttpRequest));
                console.log('readyStatetus:' + XMLHttpRequest.readyState);
                console.log('textStatus:' + textStatus);
                console.log('errorThrown:' + errorThrown);
            };

            if (!XMLHttpRequest) {
                console.log("XMLHttpRequest");
                return;
            }

            var xhr = new XMLHttpRequest();

            xhr.ontimeout = option.ontimeout || function() {
                if (typeof _vue !== 'undefined' && typeof _vue.$toast !== 'undefined') {
                    _vue.$toast.clear();
                }

                toastMsg('Server busy - web！');
            };

            if (typeof xhr === 'undefined' || xhr === null) {
                console.log("XMLHttpRequest");
                return;
            }

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            var json = JSON.parse(xhr.responseText || xhr.response);
                            if (json.IsLogin === false && CONFIG.IS_RUNTIME) {
                                globalToLogin();
                            } else if (json.IsResetPin === true && CONFIG.IS_RUNTIME) {
                                globalToChangePin();
                            } else {
                                option.success(json);
                            }
                        } catch (e) {
                            console.log(e.message);
                            option.error(xhr, xhr.status);
                        }
                    } else {
                        option.error(xhr, xhr.status);
                    }
                }
            };

            var params = [];
            for (var key in option.data) {
                if (option.data.hasOwnProperty(key)) {
                    params.push(key + '=' + encodeURIComponent(option.data[key]));
                }
            }

            try {
                var postData = params.join('&');
                xhr.open(option.method, option.url + '?' + postData, option.async);
                xhr.timeout = option.timeout;
                xhr.send();
            } catch (e) {
                console.log(e);
            }
        }
    },
    'USER': {
        'MODEL': {
            'Id': 0,
            'Key': ''
        }
    }
};

var LSE = function() {
    var _default_lang = 'cn';
    var _currentLanguage = function() {
        var item = APP.CONFIG.IS_RUNTIME ? plus.storage.getItem(APP.CONFIG.SYSTEM_KEYS.LANGUAGE_KEY) : window.localStorage.getItem(APP.CONFIG.SYSTEM_KEYS.LANGUAGE_KEY);
        if (item === null) {
            window.localStorage.setItem(APP.CONFIG.SYSTEM_KEYS.LANGUAGE_KEY, _default_lang);
            return _default_lang;
        }

        return item;
    };

    var _getLanguageAjax = function(option) {
        option = option || {};
        option.method = "GET";
        option.url = option.url || '';
        option.dataType = "JSON";
        option.async = option.async || true;
        option.timeout = option.timeout || 20000;
        option.success = option.success || function() {};
        option.error = option.error || function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('status:' + XMLHttpRequest.status);
            console.log('XMLHttpRequest：' + JSON.stringify(XMLHttpRequest));
            console.log('readyStatetus:' + XMLHttpRequest.readyState);
            console.log('textStatus:' + textStatus);
            console.log('errorThrown:' + errorThrown);
        };

        if (!XMLHttpRequest) {
            console.log("XMLHttpRequest");
            return;
        }

        var xhr = new XMLHttpRequest();

        if (typeof xhr === 'undefined' || xhr === null) {
            console.log("XMLHttpRequest");
            return;
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText || xhr.response);

                    try {
                        option.success(json);
                    } catch (e) {
                        console.log(e.message);
                    }
                } else {
                    option.error(xhr, xhr.status);
                }
            }
        };

        var params = [];
        for (var key in option.data) {
            if (option.data.hasOwnProperty(key)) {
                params.push(key + '=' + option.data[key]);
            }
        }

        try {
            var postData = params.join('&');
            xhr.open(option.method, option.url, option.async);
            xhr.send(postData);
        } catch (e) {
            console.log(e);
        }
    };

    var _installLanguage = function(pageName, callback) {
        var fileName = '/content/lang/' + _currentLanguage() + '.json?v=27';
        var successCallback = function(data) {
            if (typeof callback === 'function') {
                var lang = data[pageName];
                if (lang !== null) {
                    callback(data[pageName]);
                }
            }
        };

        if (APP.CONFIG.IS_RUNTIME) {
            plus.io.resolveLocalFileSystemURL(fileName, function(entry) {
                _getLanguageAjax({
                    url: APP.CONFIG.SYSTEM_NAME === 'ios' ? entry.toRemoteURL() : entry.toLocalURL(),
                    success: successCallback
                });
            });
        } else {
            _getLanguageAjax({
                url: fileName,
                success: successCallback
            });
        }
    };

    return {
        'currentLanguage': function() {
            return _currentLanguage();
        },
        'switchLanguage': function(lang) {
            if (APP.CONFIG.IS_RUNTIME)
                plus.storage.setItem(APP.CONFIG.SYSTEM_KEYS.LANGUAGE_KEY, lang);
            else
                window.localStorage.setItem(APP.CONFIG.SYSTEM_KEYS.LANGUAGE_KEY, lang);
        },
        'install': function(pageName, language, callback) {
            try {
                _installLanguage(pageName, language, callback);
            } catch (e) {
                console.log('install error:' + e.message);
            }
        }
    };
}();

var allowPages = ['mnemonic.id.html','mnemonic.cn.html', 'mnemonic.en.html', 'mnemonic.kr.html', 'mnemonic.jp.html', 'mnemonic.tw.html', 'mnemonic.fr.html', 'mnemonic.it.html', 'mnemonic.pt.html', 'mnemonic.es.html', 'mnemoniccheck.html',  'change.success.html', 'change.password.html','change.pin.html','reset.question.html','index.html', 'answering.html', 'forgot.html', 'forgot1.html', 'reset.password.html','login.html','languages.html'];
function pageLoaded() {
    if (typeof window.allowAccess === 'undefined') {
        var _any = function() {
            for (var i = 0; i < allowPages.length; i++) {
                if (window.location.href.indexOf(allowPages[i]) > 0) return true;
            }

            return false;
        };

        var user = APP.GLOBAL.getUserModel();

		if (!user.IsMnemonic && !_any()) {
            window.location = '/pages/center/security/mnemonic.cn.html?from=first&url=' + encodeURIComponent(window.location);
            return;
        }

		if (!user.IsSetSecurityQuestion && !_any()) {
            window.location = '/pages/center/security/reset.question.html?from=first&url=' + encodeURIComponent(window.location);
            return;
        }

		if (!user.IsStrong && !_any()) {
            window.location = '/pages/center/security/change.pin.html?from=first&url=' + encodeURIComponent(window.location);
            return;
        }



    }

    window.addEventListener('scroll', function() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = document.body.clientHeight < document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight;
        } else {
            clientHeight = document.body.clientHeight > document.documentElement.clientHeight ? document.body.clientHeight : document.documentElement.clientHeight;
        }

        var scrollTop = document.body.scrollTop > document.documentElement.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
        var scrollBottom = document.body.scrollHeight - scrollTop;
        if (typeof window.scrollChange === 'function') {
            window.scrollChange(scrollTop);
        }

        if (scrollBottom >= clientHeight && scrollBottom <= clientHeight + 70) {
            if (typeof window.scrollBottom === 'function') window.scrollBottom();
        }
    });

    var back = document.getElementById('app-back-button');
    if (back !== null) {
        back.addEventListener('click', APP.GLOBAL.closeWindow);
    }
}

/*
 * */
function numberFormat(value, digitNum) {
    if (typeof value === 'undefined') return value;

    var initV = value;
    var seperator = ',';
    if ((value = ((value = (value * 1).toFixed(4) + "").replace(/^\s*|\s*$|,*/g, ''))).match(/^\d*\.?\d*$/) === null) return initV;

    var _padLeft = function(len, str) {
        var index = str.indexOf('.');
        if (index === -1) return [str, ''];

        if (len <= 0 && index !== -1) return [str.substr(0, index), ''];
        else if (len <= 0) return [str, ''];

        var arr = str.split('.');
        var count = len - arr[1].length;
        if (count < 0) return [arr[0], arr[1].substr(0, len)];

        for (var i = 0; i < count; i++) {
            arr[1] = arr[1] + '0';
        }

        return [arr[0], arr[1]];
    }

    var newValue = _padLeft(digitNum, value);
    var r = [];
    var tl = newValue[0];
    var tr = newValue[1];

    if (seperator !== null && seperator !== '') {
        while (tl.length >= 3) {
            r.push(tl.substring(tl.length - 3));
            tl = tl.substring(0, tl.length - 3);
        }

        if (tl.length > 0) {
            r.push(tl);
        }

        r.reverse();
        r = r.join(seperator);
        return !tr || tr.length === 0 ? r : r + '.' + tr;
    }
    return value;
}

String.prototype.startWith = function(s) {
    if (s === null || s === "" || this.length === 0 || s.length > this.length)
        return false;

    if (this.substr(0, s.length) === s)
        return true;
    else
        return false;
};

if (!Object.assign) {
    Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
            "use strict";
            if (target === undefined || target === null)
                throw new TypeError("Cannot convert first argument to object");
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) continue;
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
                }
            }
            return to;
        }
    });
}

document.addEventListener('touchstart', function() { return false; }, true);


document.addEventListener('DOMContentLoaded', pageLoaded);