var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
			'NextLevelTIP': '',
            'list': [],
            'isLoadMore': false,
            'isLoadComplete': false
        },
        'language': {}
    },
    methods: {
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_Upgrade_Record',
                data: {
                    'p': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					_vue.pageModel.NextLevelTIP = result.NextLevelTIP;							
                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'loadMoreAjax': function () {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'My_Upgrade_Record',
                data: {
                    'p': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					_vue.pageModel.NextLevelTIP = result.NextLevelTIP;
                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = _vue.pageModel.list.concat(result.Data);
                    _vue.pageModel.isLoadMore = false;

                    if (result.Data.length < _vue.pageModel.list.length) {
                        _vue.pageModel.isLoadComplete = true;
                    }
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('upgrade_record', function (lang) {
                document.title = lang.TITLE_TEXT;
                Vue.set(_vue, 'language', lang);
            });
        },
        'windowScroll': function () {
            if (!this.pageModel.isLoadMore && !this.pageModel.isLoadComplete) {
                //this.loadMoreAjax();
            }
        }
    },
    created: function () {
        this.changeLanguage();
    },
    mounted: function () {
        this.loadPageData();
        //window.scrollBottom = this.windowScroll;
    }
});