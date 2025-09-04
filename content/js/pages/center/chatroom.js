var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
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
        value: '',
        list: [],
        id: '',
        page: 1,
        isLoading: true,
        timer: null,
        data: {}
    },
    methods: {
        onSearch: function() {
            var t = this
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'chat',
                data: {
                    Message: this.value,
                    RecordID: this.id
                },
                success: function(result) {
                    console.log(result)
                    t.loadPageData(true)
                }
            });
        },
        'loadPageData': function(clear) {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }

            // return
            var t = this
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'chat_List',
                data: {
                    p: 1, //this.page,
                    PageSizes: 99999,
                    RecordID: this.id
                },
                success: function(result) {
                    // 加载状态结束
                    this.isLoading = false;

                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    // this.page++;
                    if (clear) {
                        t.value = '';
                        setTimeout(function() {
                            console.log(document.querySelector('#app').scrollTop)
                            document.querySelector('#app').scrollTop = document.querySelector('#app').scrollHeight
                        }, 100)
                    }
                    t.data = result
                    t.list = result.Data.List.reverse()

                    t.timer = setTimeout(function() {
                        t.loadPageData()
                    }, 2000)
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
        var params = (h => {
            var o = {},
                s = h.split('?')[1]
            s.split('&').map(i => i.split('=')).map(i => { o[i[0]] = i[1] });
            return o
        })(window.location.href)
        this.id = params.id
        this.loadPageData(true);
    }
});