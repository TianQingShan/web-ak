var _vue = _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'lines': [{
            'name': 'Line01 (Singapore)',
            'url': 'www.api17.com'
        }, {
            'name': 'Line02 (Asia)',
            'url': 'www.api17.com'
        }, {
            'name': 'Line03 (America)',
            'url': 'www.api17.com'
        }, {
            'name': 'Line04 (Europe)',
            'url': 'www.api17.com'
        }],
        'selectedIndex': 0,
        'language': {},
        'statusbarHeight': 0
    },
    methods: {
        'confirmLine': function () {
            var item = this.lines[this.selectedIndex];
            APP.GLOBAL.setItem(APP.CONFIG.SYSTEM_KEYS.APP_BASE_URL_KEY, item.url);
            var queryUrl = APP.CONFIG.BASE_URL+'Public_Test';
            APP.GLOBAL.toastLoading({ 'message': this.language.TOAST_LOADING_TEXT });
            this.doTestAjax(queryUrl);
        },
        'doTestAjax': function (queryUrl, callback) {
            APP.GLOBAL.ajax({
                url: queryUrl,
                ontimeout: function () {
                    APP.GLOBAL.closeToastLoading();
                    APP.GLOBAL.toastMsg(_vue.language.TIMEOUT_TEXT);
                },
                success: function (result) {
                    if (!APP.GLOBAL.queryString('from')) {
                        if (result.IsAvailable) {
                            APP.GLOBAL.gotoNewWindow('mainPage', 'pages/home');
                        } else {
                            APP.GLOBAL.gotoNewWindow('loginPage', 'pages/account/login');
                        }
                    } else if (APP.GLOBAL.queryString('from') === 'login') {
                        APP.GLOBAL.closeWindow();
                    }else {
                        _vue.$toast.success({
                            'message': _vue.language.CHANGE_SUCCESS,
                            'duration': 1500
                        });
                        setTimeout(function () {
                            APP.GLOBAL.closeWindow();
                        }, 1500);
                    }
                },
                error: function () {
                    APP.GLOBAL.closeToastLoading();
                    APP.GLOBAL.toastMsg(_vue.language.TIMEOUT_TEXT);
                }
            });
        },
        'getIndex': function (url) {
            for (var i = 0; i < this.lines.length; i++) {
                if (this.lines[i].url === url) return i;
            }
            return -1;
        },
        'changeLanguage': function () {
            LSE.install('index', function (lang) {
                Vue.set(_vue, 'language', lang);

                document.title = lang.TITLE_TEXT;
            });
        }
    },
    created: function () {
        this.changeLanguage();

        var baseUrl = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.APP_BASE_URL_KEY);
        if (!baseUrl) {
            this.selectedIndex = 0;
        } else {
            this.selectedIndex = this.getIndex(baseUrl);
        }
    },
    mounted: function () {
        if (!APP.GLOBAL.queryString('from')) {
            var baseUrl = APP.GLOBAL.getItem(APP.CONFIG.SYSTEM_KEYS.APP_BASE_URL_KEY);
            if (baseUrl) {
                var queryUrl = APP.CONFIG.BASE_URL+'Public_Test';
                this.doTestAjax(queryUrl);
            }
        }
    }
});
