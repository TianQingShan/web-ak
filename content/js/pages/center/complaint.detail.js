Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default_feedback_img.jpg',
    'error': '../../content/img/default_feedback_img.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isWorking': false,
        'choiceFilePath': '',
        'imageUrl': '',
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
                alert(this.language.UPLOAD_ERROR_1);
                return;
            }

            if (event.target.files.length === 0) {
                APP.GLOBAL.toastMsg(this.language.UPLOAD_ERROR_2);
                return;
            }

            var file = event.target.files[0];
            var extIndex = file.name.lastIndexOf('.');
            if (extIndex === -1) {
                APP.GLOBAL.toastMsg(this.language.UPLOAD_ERROR_3);
                return;
            }

            var ext = file.name.substring(extIndex).toLowerCase();
            if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                APP.GLOBAL.toastMsg(this.language.UPLOAD_ERROR_3);
                return;
            }

            if (file.size > Math.pow(1024, 2) * 2) {
                APP.GLOBAL.toastMsg(this.language.UPLOAD_ERROR_4);
                return;
            }

            APP.GLOBAL.toastLoading(this.language.UPLOAD_LOADING_TEXT);
            var reader = new FileReader();
            reader.onload = function (e) {
                _vue.compressImage(e.target.result, function (dataUrl) {
                    _vue.imageUrl = window.URL.createObjectURL(file);
                    _vue.choiceFilePath = window.URL.createObjectURL(file);
                    _vue.form.imgBase64_1 = encodeURIComponent(dataUrl);
                    APP.GLOBAL.closeToastLoading();
                });
            };

            reader.readAsDataURL(file);
        },
        'compressImage': function (base64, callback) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var compressedDataUrl = canvas.toDataURL('image/jpeg', .7);

                callback(compressedDataUrl);
            };

            img.src = base64;
        },
        'checkData': function () {
            if (!this.form.text) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

            if (this.isWorking) {
                APP.GLOBAL.toastMsg(this.language.ERROR_2);
                return;
            }

            this.isWorking = true;
            this.doSubmitAjax();
        },
        'doSubmitAjax': function () {
            var item = {
                'RoleType': 1,
                'CreateTime': this.language.SEND_TIME_DEFAULT,
                'AskList': {
                    'ImageAddress_1': this.choiceFilePath,
                    'Text': this.form.text
                },
                'isSubmit': true
            };
            this.pageModel.ParentList.push(item);
            this.$nextTick(function () {
                document.body.scrollTop = document.body.scrollHeight;
            });

            var postData = {};
            postData = Object.assign({}, postData, this.form);

            this.form.text = '';
            this.form.imgBase64_1 = '';
            this.choiceFilePath = '';

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_Reply',
                data: postData,
                success: function (result) {
                    _vue.isWorking = false;

                    if (result.Error) {
                        _vue.pageModel.ParentList.splice(_vue.pageModel.ParentList.length - 1, 1);
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    item.isSubmit = false;
                }
            });
        },
        'removeImage': function () {
            this.choiceFilePath = '';
            this.imageUrl = '';
        },
        'viewImage': function (src) {
            vant.ImagePreview({
                images: [src],
                showIndex: false
            });
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
                        document.body.scrollTop = document.body.scrollHeight;
                    });
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('complaint_detail', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    computed: {
        'userAvatar': function () {
            return {
                'src': this.currentUser.AvatarImage,
                'loading': '../../content/img/default_avatar.jpg',
                'error': '../../content/img/default_avatar.jpg'
            };
        }
    },
    created: function () {
        this.changeLanguage();
    },
    mounted: function () {
        this.loadPageData();
    }
});