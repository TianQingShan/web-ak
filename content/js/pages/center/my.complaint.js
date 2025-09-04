Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default_feedback_img.jpg',
    'error': '../../content/img/default_feedback_img.jpg'
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'isLoadMore': false,
            'isLoadComplete': false,
            'list': []
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'gotoDetail': function (item) {
            APP.GLOBAL.gotoNewWindow('complaint.detailPage', 'complaint.detail', {
                'param': 'fId=' + item.Id
            });
        },
        'reloadPageData': function () {
            this.isLoading = true;
            this.isLoadMore = false;
            this.isLoadComplete = false;
            this.pageModel.pageIndex = 1;

            this.loadPageData();
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_List',
                data: {
                    'p': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = result.Data;
                    _vue.isLoading = false;
                }
            });
        },
        'loadMoreAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_List',
                data: {
                    'p': this.pageModel.pageIndex,
                    'pageSize': this.pageModel.pageSize
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.pageIndex++;
                    _vue.pageModel.list = _vue.pageModel.list.concat(result.Data);
                    _vue.pageModel.isLoadMore = false;

                    if (result.Data.length < _vue.pageModel.pageSize) {
                        _vue.pageModel.isLoadComplete = true;
                    }
                }
            });
        },
        'windowScroll': function () {
            if (!this.pageModel.isLoadMore && !this.pageModel.isLoadComplete) {
                this.pageModel.isLoadMore = true;
                this.loadMoreAjax();
            }
        },
        'changeLanguage': function () {
            LSE.install('my_complaint', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function () {
        this.changeLanguage();
    },
    mounted: function () {
        window.scrollBottom = this.windowScroll;
        this.loadPageData();
    }
});