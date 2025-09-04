var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isShow': false,
        'fileName': '',
        'choiceFilePath': '',
        'items': [{
            'text': '密碼問題',
            'value': 1
        }, {
            'text': 'EP交易',
            'value': 5
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
        'display': {
            'typeName': ''
        },
        'form': {
            'title': '',
            'text': '',
            'type': '8',
            'imgBase64_1': ''
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'checkData': function () {
            if (!this.form.type) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else if (!this.form.title) {
                APP.GLOBAL.toastMsg(this.language.ERROR_2);
            } else if (!this.form.text) {
                APP.GLOBAL.toastMsg(this.language.ERROR_3);
            } else {
                APP.GLOBAL.toastLoading({ 'message': this.language.SUBMIT_TOAST_TEXT });

                this.doSubmitAjax();
            }
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Feedback_Add',
                data: this.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.updateUserModel({
                        'RP': _vue.currentUser.RP - _vue.currentUser.CollateralAmount
                    });

                    _vue.$toast.success({
                        'message': _vue.language.SUBMIT_SUCCESS,
                        'duration': 1500
                    });

                    setTimeout(APP.GLOBAL.closeWindow, 1500);
                }
            });
        },
        'fileChange': function () {
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
                    _vue.fileName = file.name;
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
                var compressedDataUrl = canvas.toDataURL('image/jpeg', .6);

                callback(compressedDataUrl);
            };

            img.src = base64;
        },
        'selectedItem': function (item) {
            this.isShow = false;
            this.form.type = item.value;
            this.display.typeName = item.text;
        },
        'changeLanguage': function () {
            LSE.install('complaint', function (lang) {
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