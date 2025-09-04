var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isShow': false,
        'fileName': '',
        'choiceFile': '',
        'items': [{
            'text': '密碼問題-security',
            'value': 1
        }, {
            'text': '充值問題-Deposit',
            'value': 2
        }, {
            'text': '資料修正-Profile',
            'value': 3
        }, {
            'text': '其他-other',
            'value': 4
        }],
        'display': {
            'typeName': ''
        },
        'form': {
            'title': '',
            'text': '',
            'type': '',
            'imgBase64_1': ''
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'fileChanged': function () {
            if (!window.FileReader) {
                APP.GLOBAL.toastMsg('您的设备不支持图片预览功能，请升级您的设备');
                return;
            }

            if (event.target.files.length === 0) {
                APP.GLOBAL.toastMsg('未检测到图片');
                return;
            }

            var file = event.target.files[0];
            var extIndex = file.name.lastIndexOf('.');
            if (extIndex === -1) {
                APP.GLOBAL.toastMsg('图片格式不正确');
                return;
            }

            var ext = file.name.substring(extIndex).toLowerCase();
            if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                APP.GLOBAL.toastMsg('文件格式不正确');
                return;
            }

            if (file.size > Math.pow(1024, 2) * 2) {
                APP.GLOBAL.toastMsg('图片太大超出2MB限制');
                return;
            }

            this.fileName = file.name;
            this.choiceFile = file;
        },
        'checkData': function () {
            if (!this.form.type) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else if (!this.form.title) {
                APP.GLOBAL.toastMsg(this.language.ERROR_2);
            } else if (!this.form.text) {
                APP.GLOBAL.toastMsg(this.language.ERROR_3);
            } else {
                APP.GLOBAL.toastLoading({ 'message': this.language.SUBMIT_TOAST_TEXT });

                if (this.choiceFile) {
                    this.processImage();
                } else {
                    this.doSubmitAjax();
                }
            }
        },
        'processImage': function () {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                var source = e.target.result.toString();
                var base64 = '';

                if (source.indexOf('data:image/jpeg;base64,') !== -1) {
                    base64 = source.replace('data:image/jpeg;base64,', '');
                } else if (source.indexOf('data:image/png;base64,') !== -1) {
                    base64 = source.replace('data:image/png;base64,', '');
                }

                _vue.form.imgBase64_1 = encodeURIComponent(base64);
                _vue.doSubmitAjax();
            };

            reader.onerror = function (fe) {
                APP.GLOBAL.closeToastLoading();
                APP.GLOBAL.toastMsg('Error:' + fe.error);
            };

            reader.readAsDataURL(this.choiceFile);
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_Add',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					
					 
					APP.GLOBAL.gotoNewWindow('seller.infoPage', 'my.feedback', {'param': 'sId='});
                     
                }
            });
        },
        'selectedItem': function (item) {
            this.isShow = false;
            this.form.type = item.value;
            this.display.typeName = item.text;
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
        'changeLanguage': function () {
            LSE.install('feedback', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.changeLanguage();
    }
});