var _vue = new Vue({
    el: '#app',
    data: {
        'statusbarHeight': 0,
        'language': {},
        'request': {
            'from': APP.GLOBAL.queryString('from')
        }
    },
    methods: {
        'selectLanguage': function (name) {
            LSE.switchLanguage(name);

            //if (!this.request.from) {
            //    var mainPage = plus.webview.getWebviewById('mainPage');
            //    if (mainPage != null) {
            //        mainPage.evalJS('pageScript.reloadLanguage()');
            //    }
            //}

            APP.GLOBAL.closeWindow();
        },
        'getLanguageById': function (id) {
            for (var i = 0; i < this.langList.length; i++) {
                if (this.langList[i].id == id) return this.langList[i];
            }

            return this.langList[0];
        },
        'changeLanguage': function () {
            LSE.install('language', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function () {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    }
});