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
		'isNoticeShow': false,
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'isLoadMore': false,
			'bottomTip1': '',
			'bottomTip2': '',
			'bottomTip3': '',
			'bottomTip4': '',
			'bottomTip5': '',
            'isLoadComplete': false
        },
		'display': {
            'bottomTip': ''
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'choiceUser': function (item) {
            //this.teamList.push(this.currentTopUser);
            //this.currentTopUser = item;

            //APP.GLOBAL.toastLoading(this.language.LOADING_TEXT);
			_vue.isNoticeShow = false;
			this.Search = item;
            this.pageModel.list = [];
			this.pageModel.pageIndex = 1;
            this.loadPageData();
        },
		 
       /*  'redloadPageData': function() {
            this.isLoading = true;
            this.pageModel.pageIndex = 1;
            this.pageModel.list = [];
            this.loadPageData();
        },
		
		 */
        'loadPageData': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Donate_Record',
                data: {
					'test': 1,
                    'p': this.pageModel.pageIndex,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					 
					
					_vue.pageModel.bottomTip1 = result.bottomTip1;
					_vue.pageModel.bottomTip2 = result.bottomTip2;
					_vue.pageModel.bottomTip3 = result.bottomTip3;
					_vue.pageModel.bottomTip4 = result.bottomTip4;
					_vue.pageModel.bottomTip5 = result.bottomTip5;
					//_vue.pageModel.pageIndex = 1;
                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data.List;
                    _vue.isLoading = false;
					_vue.pageModel.isLoadComplete = result.Data.List.length < _vue.pageModel.pageSize;
                }
            });
        },
		
		'SearchloadPageData': function() {
			_vue.isNoticeShow = false;
			//this.Search = item;
            this.pageModel.list = [];
			this.pageModel.pageIndex = 1;
			
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Donate_Record',
                data: {
					'test': 2,
                    'p': this.pageModel.pageIndex,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					_vue.isNoticeShow = false;
					_vue.pageModel.bottomTip1 = result.bottomTip1;
					_vue.pageModel.bottomTip2 = result.bottomTip2;
					_vue.pageModel.bottomTip3 = result.bottomTip3;
					_vue.pageModel.bottomTip4 = result.bottomTip4;
					_vue.pageModel.bottomTip5 = result.bottomTip5;
                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data.List;
                    _vue.isLoading = false;
					_vue.pageModel.isLoadComplete = result.Data.List.length < _vue.pageModel.pageSize;
                }
            });
        },
		
		
		
        'loadMore': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Donate_Record',
                data: {
					'test': 3,
                    'p': this.pageModel.pageIndex,
					'Search': this.Search,
                    'size': this.pageModel.pageSize
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					_vue.isNoticeShow = false;
					_vue.pageModel.bottomTip1 = result.bottomTip1;
					_vue.pageModel.bottomTip2 = result.bottomTip2;
					_vue.pageModel.bottomTip3 = result.bottomTip3;
					_vue.pageModel.bottomTip4 = result.bottomTip4;
					_vue.pageModel.bottomTip5 = result.bottomTip5;
                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = _vue.pageModel.list.concat(result.Data.List);
                    _vue.pageModel.isLoadMore = false;
                    _vue.pageModel.isLoadComplete = result.Data.List.length < _vue.pageModel.pageSize;
					
					
					
					
                    //if (result.Data.List.length < _vue.pageModel.pageSize) {
                    //    _vue.pageModel.isLoadComplete = true;
                    //}
					
					
					
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
            LSE.install('donate_record', function(lang) {
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
		//this.isNoticeShowIn();
        window.scrollBottom = this.windowScroll;
		 
    }
});
function closeNotice() {
    _vue.isNoticeShow = false;
}