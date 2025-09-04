Vue.use(vant.Lazyload, {
    'loading': '../content/img/default_avatar.jpg',
    'error': '../content/img/default_avatar.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isReloading': false,
		'isShowDateTime': false,
		'dateTimeObj': {
            'display': '',
            'value': new Date(),
            'minDate': new Date(2023, 9),
            'maxDate': new Date(new Date().getFullYear(), new Date().getMonth() + 24),
            'isLoading': false,
            'month': ''
        },
        'result': {
            'MonthTotalMoney': '',
            'FirstWeek': '',
            'SecondWeek': '',
            'ThirdWeek': '',
            'FourWeek': '',
            'FiveWeek': ''
        },
        'tabActive': 0,
		'searchKey': '',
        'tabControl': [{
            'title': '挂單中',
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'type': 1,
			'URL': APP.CONFIG.BASE_URL+'My_Freed1',
            'isLoaded': true,
            'isLoadMore': false,
            'isLoadComplete': false,
            'isLoading': true
        }, {
            'title': '交易中',
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'type': 2,
			'URL': APP.CONFIG.BASE_URL+'My_Freed2',
            'isLoaded': false,
            'isLoadMore': false,
            'isLoadComplete': false,
            'isLoading': false
        }, {
            'title': '已完成',
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'type': 8,
			'URL': APP.CONFIG.BASE_URL+'My_Freed3',
            'isLoaded': false,
            'isLoadMore': false,
            'isLoadComplete': false,
            'isLoading': false
        }],
        'menus': [{
            'index': 0,
            'text': '首頁',
            'default': 'iconhome',
            'active': 'iconhomefill',
            'url': 'home.html'
        }, {
            'index': 1,
            'text': 'AK交易',
            'default': 'iconpuke',
            'active': 'iconpuke_fill',
            'url': 'ace.list.html'
        }, {
            'index': 2,
            'text': 'EP交易',
            'default': 'iconjiaoyi',
            'active': 'iconjiaoyi_fill',
            'url': '#'
        }, {
            'index': 3,
            'text': '我的',
            'default': 'iconmy',
            'active': 'iconmyfill',
            'url': 'center.html'
        }],
        'currentIndex': 2,
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
         
        'tabChange': function(index) {
            var tab = this.tabControl[index];
            if (!tab.isLoaded) {
                tab.isLoaded = true;
                tab.isLoading = true;
                this.loadPageData();
            }
        },
        'onRefresh': function() {
            setTimeout(this.loadPageData, 500);
        },
        'loadPageData': function() {
            var tab = this.tabControl[this.tabActive];
            tab.pageIndex = 1;
            tab.isLoadMore = false;
            tab.isLoadComplete = false;
			
            APP.GLOBAL.ajax({
				url: tab.URL,
                data: {
                    'p': tab.pageIndex,
                    'pageSize': tab.pageSize,
                    'type': tab.type,
					'account': this.searchKey
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tab.list = result.Data.List;
                    tab.pageIndex++;
                    tab.isLoading = false;
                    _vue.isReloading = false;
                }
            });
        },
		'doSearchAjax': function () {
            //this.pageModel.pageIndex = 1;
            //this.isLoadComplete = false;
            //APP.GLOBAL.toastLoading(this.language.LOADING_TEXT);
			
			var tab = this.tabControl[this.tabActive];
            tab.pageIndex = 1;
            tab.isLoadMore = false;
            tab.isLoadComplete = false;

            APP.GLOBAL.ajax({
				url: tab.URL,
                data: {
                    //'p': tab.pageIndex,
                    //'pageSize': tab.pageSize,
                    'type': tab.type,
					'p': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize,
                    'fn': this.searchKey
					
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tab.list = result.Data.List;
                    tab.pageIndex++;
                    tab.isLoading = false;
                    _vue.isReloading = false;
                }
            });
        },
        'loadMore': function() {
            var tab = this.tabControl[this.tabActive];

            APP.GLOBAL.ajax({
				url: tab.URL,
                data: {
                    'p': tab.pageIndex,
                    'pageSize': tab.pageSize,
                    'type': tab.type
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tab.list = tab.list.concat(result.Data.List);
                    tab.pageIndex++;
                    tab.isLoadMore = false;

                    if (result.Data.List.length < tab.pageSize) {
                        tab.isLoadComplete = true;
                    }
                }
            });
        },
		'formatTime': function (value) {
            var arr = value.split(' ');
            if (arr.length !== 2) return value;

            return arr[0];
        },
        'gotoDetail': function (weekIndex) {
            APP.GLOBAL.gotoNewWindow('profit.weekPage', 'child/profit.week', {
                'param': 'wIndex=' + weekIndex +
                    '&year=' + this.dateTimeObj.value.getFullYear() +
                    '&month=' + (this.dateTimeObj.value.getMonth() + 1)
            });
        },
		'confirmDateTime': function (value) {
            this.isShowDateTime = false;

            this.dateTimeObj.value = value;
            var y = value.getFullYear();
            var m = value.getMonth() + 1;

            this.dateTimeObj.month = m;
            this.dateTimeObj.display = y + ' / ' + m;
            this.loadDataByDate(y, m);
        },
        'loadDataByDate': function (y, m) {
            this.isSearchMode = true;
            this.dateTimeObj.isLoading = true;
			var tab = this.tabControl[this.tabActive];
            tab.pageIndex = 1;
            tab.isLoadMore = false;
            tab.isLoadComplete = false;

            APP.GLOBAL.ajax({
                //url: APP.CONFIG.BASE_URL+'My_Month_Stat',
				url: tab.URL,
                data: {
                    'key': this.currentUser.Key,
					'UserID': this.currentUser.UserID,
                    'Requestyear': y,
                    'Requestmonth': m,
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    tab.list = result.Data.List;
                    tab.pageIndex++;
                    tab.isLoading = false;
                    _vue.isReloading = false;

                    Vue.set(_vue, 'result', result.Data);
                    _vue.dateTimeObj.isLoading = false;
                }
            });
        },
		
        'windowScroll': function() {
            var tab = this.tabControl[this.tabActive];
            if (!tab.isLoadMore && !tab.isLoadComplete) {
                tab.isLoadMore = true;
                this.loadMore();
            }
        },
        'changeLanguage': function() {
            LSE.install('freed.list', function(lang) {
                Vue.set(_vue, 'language', lang);

                _vue.tabControl[0].title = _vue.language.TAB_1;
                _vue.tabControl[1].title = _vue.language.TAB_2;
                _vue.tabControl[2].title = _vue.language.TAB_3;

                for (var i = 0; i < _vue.menus.length; i++) {
                    _vue.menus[i].text = lang['BOTTOM_MENU_' + (i + 1)];
                }
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
        if (!APP.CONFIG.IS_RUNTIME) {
            this.loadPageData();
        }

        window.scrollBottom = this.windowScroll;
    }
});