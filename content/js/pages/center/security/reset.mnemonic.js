var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isShow': false,
        'questionList': [],
        'currnetQuestionList': [],
        'questionIndex': 0,
        'questionDisplay': '',
        'display': {
            'q1': '請選擇您的問題1',
            'q2': '請選擇您的問題2',
            'q3': '請選擇您的問題3'
        },
        'form': {
			'gCode': ''
            //'idcard': ''
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
		clipFunc: function() {
            navigator.clipboard
                .readText()
                .then((v) => {
                    this.form.gCode = v
                    console.log("获取剪贴板成功：", v);
                })
                .catch((v) => {
                    console.log("获取剪贴板失败: ", v);
                });
        },
        'checkInput': function () {
 
 
                this.doSubmitAjax();
 
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading({ 'message': this.language.TOAST_TEXT });

            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'Mnemonic_Reset',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    APP.GLOBAL.gotoNewWindow('change.successPage', 'change.success', {
                        param: 'title=' + encodeURIComponent(_vue.language.RESET_TITLE) +
                            '&text=' + encodeURIComponent(_vue.language.RESET_TEXT),
                        openCallback: function () {
                            var firstLoginScreen = plus.webview.getWebviewById('first.loginPage');
                            if (firstLoginScreen !== null) {
                                firstLoginScreen.evalJS('_vue.resetItem("FIRST_LOGIN_QUESTION_KEY")');
                            }

                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
		'loadPageData': function() {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'Question_Get1',
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.display.questionDisplay = result.QTitle;
                    _vue.form.qId = result.Qid;
                    _vue.isLoading = false;
                }
            });
        },

        'changeLanguage': function () {
            LSE.install('reset.mnemonic', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function () {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }
    },
    mounted: function () {
		this.loadPageData();
    }
});