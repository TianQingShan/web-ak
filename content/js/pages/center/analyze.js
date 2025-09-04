Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default_avatar.jpg',
    'error': '../../content/img/default_avatar.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'isLoading': true,
        'isPasswordInput': false,
        'currentUser': APP.GLOBAL.getUserModel(),
		'Search': '',
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'isLoadMore': false,
            'isLoadComplete': false
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'choiceUser': function (item) {
            //this.teamList.push(this.currentTopUser);
            //this.currentTopUser = item;

            //APP.GLOBAL.toastLoading(this.language.LOADING_TEXT);
			this.isLoading = true;
			this.Search = item;
            this.pageModel.list = [];
            this.pageModel.pageIndex = 1;
            this.loadPageData();
        },
		'chart': function (item) {
            APP.GLOBAL.gotoNewWindow('analyze_chart', 'analyze_chart', {
                'param': 'Search=' + item
            });
        },
		'Number': function (item) {
            APP.GLOBAL.gotoNewWindow('analyze_chart_Number', 'analyze_chart_Number', {
                'param': 'Search=' + item
            });
        },
        'redloadPageData': function() {
            this.isLoading = true;
            this.pageModel.pageIndex = 1;
            this.pageModel.list = [];
            this.loadPageData();
        },
        'loadPageData': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Analyze',
                data: {
                    'p': this.pageModel.pageIndex,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data.List;
                    _vue.isLoading = false;
                }
            });
        },
		
		'SearchloadPageData': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Analyze',
                data: {
                    'p': 1,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data.List;
                    _vue.isLoading = false;
                }
            });
        },
		
		
		
        'loadMore': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Analyze',
                data: {
                    'p': this.pageModel.pageIndex,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = _vue.pageModel.list.concat(result.Data.List);
                    _vue.pageModel.isLoadMore = false;
                    _vue.pageModel.isLoadComplete = result.Data.List.length < _vue.pageModel.pageSize;
                }
            });
        },
        'windowScroll': function() {
            if (!this.pageModel.isLoadMore && !this.pageModel.isLoadComplete) {
                this.pageModel.isLoadMore = true;
                this.loadMore();
            }
        },
        'changeLanguage': function() {
            LSE.install('analyze', function(lang) {
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
        this.loadPageData();
        window.scrollBottom = this.windowScroll;
    }
});