var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'form': {
            'amount': '',
            'password': ''
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'checkData': function() {
            if (!this.form.amount) {
                APP.GLOBAL.toastMsg(this.language.PLEASE_INPUT_RP_AMOUNT);
            } else if (this.form.amount * 1 > this.currentUser.RP * 1) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else if (!this.form.password) {
                APP.GLOBAL.toastMsg(this.language.PLEASE_INPUT_TRANSFER_PWD);
            } else if (this.form.password.length < 6) {
                APP.GLOBAL.toastMsg(this.language.TRANSFER_PWD_MORE_CHARS);
            } else {
                this.doSubmitAjax();
            }
        },
        'doSubmitAjax': function() {
            APP.GLOBAL.toastLoading(this.language.EXCHANG_PROGRESSING);
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Exchange_RP_SP',
                data: this.form,
                success: function(result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.$toast(result.Msg);

                    setTimeout(function() {
                        APP.GLOBAL.updateUserModel({
                            'SP': _vue.currentUser.SP + _vue.form.amount,
                            'RP': _vue.currentUser.RP - _vue.form.amount
                        }, [{
                            'pageName': 'home.htmlPage',
                            'actionName': '_vue.updateUserModel()'
                        }]);

                        APP.GLOBAL.gotoNewWindow('change.successPage', 'security/change.success', {
                            param: 'title=' + encodeURIComponent(_vue.language.RESULT_TITLE) +
                                '&text=' + encodeURIComponent(_vue.language.RESULT_TEXT),
                            openCallback: function() {
                                APP.GLOBAL.closeWindow('none');
                            }
                        });
                    }, 1000)
                }
            });
        },
        'changeLanguage': function() {
            LSE.install('rp.to.sp', function(lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function() {
        this.changeLanguage();
        console.log(11)

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    }
});