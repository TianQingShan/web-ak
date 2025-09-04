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
		'selected': [],  // 绑定复选框的数组
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'isLoadMore': false,
            'isLoadComplete': false
        },
        'form': {
            'password': ''
        },
		'CreateTime':'',
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'toggleSelectAll': function() {
			if (this.isAllSelected) {
			  this.selected = [];
			} else {
			  // 把所有 ID 加入 selected
			  this.selected = this.pageModel.list.map(item => item.ID);
			}
		 },
        'allInOne': function() {
            this.isPasswordInput = true;

            setTimeout(function() {
                _vue.$refs['passwordBox'].focus();
            }, 300);
        },
		
        'checkPassword': function(action, done) {
            if (action !== 'confirm') {
                done();
                return;
            }

            if (!this.form.password) {
                done(false);
                APP.GLOBAL.toastMsg(this.language.INPUT_TRANSFER_PASSWORD);
            } else if (this.form.password.length < 6) {
                done(false);
                APP.GLOBAL.toastMsg(this.language.TRANSFER_PASSWORD_REQUIRE);
            } else {
                var pwd = this.form.password;
                this.form.password = '';
                done();

                this.doAllInOneAjax(pwd);
            }
        },
        'doAllInOneAjax': function(pwd) {
            APP.GLOBAL.toastLoading(this.language.REGRESSING);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'donate_as_swap',
                data: {
					'password': pwd,
					'selectedIDs': this.selected  // 提交选中的子账户 ID 数组
				},
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        APP.GLOBAL.closeToastLoading();
                        return;
                    }
					APP.GLOBAL.toastMsgUrl('捐赠成功','../center.html');
                }
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
                url: APP.CONFIG.BASE_URL+'donate_as',
                data: {
                    'p': this.pageModel.pageIndex,
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
                url: APP.CONFIG.BASE_URL+'donate_as',
                data: {
                    'p': this.pageModel.pageIndex,
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
            LSE.install('Donate.as', function(lang) {
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
    },
	computed: {
			isAllSelected() {
			return (
			  this.selected.length > 0 &&
			  this.selected.length === this.pageModel.list.length
			);
			}
	}
});