var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
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

		'redloadPageData': function() {
            this.isLoading = true;
            this.pageModel.pageIndex = 1;
            this.pageModel.list = [];
            this.loadPageData();
        },
		'loadPageData': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Analyze_Chart_Number',
                data: {
                    'p': this.pageModel.pageIndex,
					'searchKey': this.Search,
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
                url: APP.CONFIG.BASE_URL+'My_Analyze_Chart_Number',
                data: {
                    'p': this.pageModel.pageIndex,
					'searchKey': this.Search,
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
        'changeLanguage': function() {
            LSE.install('analyze_chart_Number', function(lang) {
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
    }
});