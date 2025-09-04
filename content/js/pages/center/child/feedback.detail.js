Vue.use(vant.Lazyload, {
    'loading': '../../../content/img/default_feedback.png',
    'error': '../../../content/img/default_feedback.png',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isWorking': false,
        'fileName': '',
        'choiceFile': '',
        'items': [{
            'text': '密碼問題',
            'value': 1
        }, {
            'text': '充值問題',
            'value': 2
        }, {
            'text': '資料修正',
            'value': 3
        }, {
            'text': '其他',
            'value': 4
        }],
        'request': {
            'id': APP.GLOBAL.queryString('fId')
        },
        'form': {
            'id': APP.GLOBAL.queryString('fId'),
            'text': '',
            'imgBase64_1': ''
        },
        'pageModel': {},
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
            if (!this.form.text) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

            if (this.isWorking) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

            this.isWorking = true;
            if (this.choiceFile) {
                this.processImage();
            } else {
                this.doSubmitAjax();
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
                _vue.doSubmitAjax(source);
            };

            reader.onerror = function (fe) {
                _vue.isWorking = false;
                toastMsg('Error:' + fe.error);
            };

            reader.readAsDataURL(this.choiceFile);
        },
        'doSubmitAjax': function (source) {
            var item = {
                'RoleType': 1,
                'CreateTime': this.language.SEND_TIME_DEFAULT,
                'AskList': {
                    'ImageAddress_1': source,
                    'Text': this.form.text
                },
                'isSubmit': true
            };
            this.pageModel.ParentList.push(item);
            this.$nextTick(function () {
                window.scroll(0, document.body.scrollHeight);
            });

            var postData = {};
            postData = Object.assign({}, postData, this.form);

            this.form.text = '';
            this.form.imgBase64_1 = '';
            this.choiceFile = '';
            this.fileName = '';

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_Reply',
                data: postData,
                success: function (result) {
                    _vue.isWorking = false;

                    if (result.Error) {
                        toastMsg(result.Msg);
                        return;
                    }

                    item.isSubmit = false;
                }
            });
        },
        'removeImage': function () {
            this.choiceFile = '';
            this.fileName = '';
        },
        'viewImage': function (src) {
            vant.ImagePreview([src]);
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_Details',
                data: this.request,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    Vue.set(_vue, 'pageModel', result.Data);
                    _vue.isLoading = false;
                    _vue.$nextTick(function () {
                        window.scroll(0, document.body.scrollHeight);
                    });
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('feedback_detail', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    computed: {
        'userAvatar': function () {
            return {
                'src': this.currentUser.AvatarImage,
                'loading': '../../../content/img/default_avatar.jpg',
                'error': '../../../content/img/default_avatar.jpg'
            };
        }
    },
    created: function () {
        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.changeLanguage();
    },
    mounted: function () {
        this.loadPageData();
    }
});