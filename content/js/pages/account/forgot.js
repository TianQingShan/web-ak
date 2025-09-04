Vue.use(vant.Lazyload, {
    'loading': '../../content/img/default_feedback.png',
    'error': '../../content/img/default_feedback.png'
});

var _vue = new Vue({
    el: '#app',
    data: {
        'form': {
            'account': '',
            'changeType': '1',
			'mnemonicid1': '',
			'QuestionTitle': '',
			'mnemonicstr1': '',
			'mnemonickey': ''
        },
        'language': {},
        'imgSrc': '',
		'mnemonicid1': 'Please enter account...',
		'QuestionTitle': 'Please enter account...',
		'mnemonicstr1': '',

		'mnemonickey': '',
        'statusbarHeight': 0
    },
    methods: {
        'nextStep': function () {
            if (!this.form.account) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else {
                this.nextStepTo();
            }
        },
		
		'nextStepTo': function() {
            window.location = '../account/forgot1.html?' +
                '&account=' + this.form.account +
				'&changeType=' + this.form.changeType ;
        },
		
		'searchPlayer': function () {
            if (!this.form.account) return;

            if (this.form.account.length < 5) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

            //this.form.recipientId = '';
            this.isPlayerLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Login_Forget_Account',
                data: {
					'account': this.form.account
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                    } else {
                        _vue.isNotFound = false;

                    }

                    _vue.isPlayerLoading = false;
                }
            });
        },
		
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading({ 'message': this.language.SUBMIT_TEXT });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Login_Forget',
                data: this.form,
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                    } else {
                        _vue.form.Q1 = result.Q1;
                        _vue.form.Q2 = result.Q2;
                        _vue.form.Q3 = result.Q3;

                        APP.GLOBAL.gotoNewWindow('loginPage', 'login', {
                            openCallback: function () {
                                APP.GLOBAL.closeWindow('none');
                            }
                        });
                    }
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('forgot', function (lang) {
                Vue.set(_vue, 'language', lang);
            });
        }
    },
    created: function () {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        //this.getCodeAjax();
    }
});