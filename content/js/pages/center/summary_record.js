var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': false,
        'form': {
            'count': '',
            'password': '',
            'sonId': '',
            'qId': 0,
            'answer': '',
            'gCode': ''
        },
        'request': {
            'is': APP.GLOBAL.queryString('is'),
            'display': APP.GLOBAL.queryString('display'),
            'sId': APP.GLOBAL.queryString('sId'),
            'amount': APP.GLOBAL.queryString('amount')
        },
        'display': {
            'currentACECount': 0,
            'dollarDisplay': '0.00',
            'accountDisplay': '',
            'questionDisplay': ''
        },
        'statusbarHeight': 0,
        'language': {},
        page: 1,
        list: [],
        finished: false,
    },
    methods: {
        'loadPageData': function() {
            var t = this
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Summary_Record',
                data: {
                    p: this.page,
                    pageSize: 10
                },
                success: function(result) {
                    // 加载状态结束
                    t.isLoading = false;

                    if (result.Error) {
                        t.finished = true
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    if (!result.Data.List.length) return t.finished = true
                    t.page++;

                    t.list = [...t.list, ...result.Data.List]
                }
            });

        },
        'changeLanguage': function() {
            LSE.install('sell.ace', function(lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function() {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function() {
        // this.loadPageData();
    }
});