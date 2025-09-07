window.allowAccess = true;

var _vue = new Vue({
    el: '#app',
    data: {
        'isRemember': false,
        'isDropdownList': false,
        'isLogin': false,
        'form': {
            'account': 'hbj289',
            'password': 'Q1w2e3A',
            'client': 'WEB'
        },
        'request': {
            'from': APP.GLOBAL.queryString('from'),
            'canclose': APP.GLOBAL.queryString('canclose')
        },
        'statusbarHeight': 0,
        'localList':[],
        'language': {}
    },
    methods: {
        'gotoLines': function () {
            APP.GLOBAL.gotoNewWindow('indexPage', '../../index', {
                'param': 'from=login'
            });
        },
        'removeAccount': function (item) {
            var removeItem = item;

            APP.GLOBAL.confirmMsg({
                'title': this.language.CONFIRM_TITLE,
                'message': this.language.CONFIRM_TEXT,
                'confirmButtonText': this.language.CONFIRM_BUTTON,
                'cancelButtonText': this.language.CANCEL_BUTTON,
                'confirmCallback': function () {
                    var rememberList = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY);
                    var arr = JSON.parse(rememberList).reverse();
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].account === removeItem.account) {
                            arr.splice(i, 1);
                            _vue.localList.splice(i, 1);

                            APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY, JSON.stringify(arr));
                            if (arr.length === 0) {
                                _vue.isDropdownList = false;
                            }
                            return;
                        }
                    }
                }
            });
        },
        'hideDropdownlist': function () {
            this.isDropdownList = false;
        },
        'choiceList': function (item) {
            this.form.account = item.account;
            this.form.password = item.password;
        },
        'checkInput': function () {
            if (!this.form.account) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else if (!this.form.password) {
                APP.GLOBAL.toastMsg(this.language.ERROR_2);
            } else if (this.form.password.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_3);
            } else {
                this.isLogin = true;
                this.doLoginAjax();
            }
        },
        'doLoginAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Login',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        _vue.isLogin = false;
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                    } else {
                        _vue.logedCallback(result);
                    }
                }
            });
        },
        'logedCallback': function (result) {
            result.UserData['Key'] = result.Key;
            APP.GLOBAL.updateUserModel(result.UserData);

            if (_vue.request.canclose) {
                APP.GLOBAL.closeWindow();
                return;
            }

            if (this.isRemember) {
                var rememberList = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY);
                if (rememberList === null || !rememberList) {
                    var item = [{
                        'account': this.form.account,
                        'password': this.form.password
                    }];
                    APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY, JSON.stringify(item));
                } else {
                    var list = JSON.parse(rememberList);
                    var isExists = this.getLocalAccount(list, this.form.account);
                    if (!isExists) {
                        list.push({
                            'account': this.form.account,
                            'password': this.form.password
                        });
                        APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY, JSON.stringify(list));
                    }
                }
            }

            window.location = '../home.html?first=true';
        },
        'getLocalAccount': function (list, account) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].account === account) return true;
            }

            return false;
        },
        'changeLanguage': function () {
            LSE.install('login', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    computed: {
        'publicVersion': function () {
            return 'v' + numberFormat(APP.CONFIG.VERSION / 10, 1);
        },
        'screenHeight': function () {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                return plus.display.resolutionHeight;
            } else {
                return document.body.clientHeight;
            }
        }
    },
    created: function () {
        this.changeLanguage();

        var rememberList = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.LOCAL_LOGIN_INFO_KEY);
        if (rememberList) {
            this.localList = JSON.parse(rememberList).reverse();
        }
    }
});