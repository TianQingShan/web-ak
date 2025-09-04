﻿var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
		'isInstallLanuage': false,
        'isLoadingAnswer': true,
        'confirmPassword': '',
        'statusbarHeight': 0,
        'questionDisplay': '',
        'form': {
            'bai': 'kr'
        },
        'request': {
            'from': APP.GLOBAL.queryString('from')
        },
        'language': {
            'TITLE_TEXT': '',
            'WARNING_TEXT': ''
        }
    },
    methods: {
        'returnLogin': function () {
            var hotScreen = plus.webview.getWebviewById('hot.screenPage');
            if (hotScreen != null) {
                hotScreen.close('none');
            }

            gotoNewWindow('loginPage', '../../account/login', {
                openCallback: function () {
                    plus.webview.getWebviewById('mainPage').close('none');
                    closeWindow('none');
                }
            })
        },
        'checkData': function () {
                this.doSubmitAjax();
        },
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading({
                'message': this.language.SUBMIT_TOAST_TEXT
            });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Mnemonic_Confirm',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                    } else {

                        APP.GLOBAL.updateUserModel({
                            'IsMnemonic': true
                        });

                        APP.GLOBAL.gotoNewWindow('change.successPage', 'mnemoniccheck', {
                            
                             
                        });
                    }
                }
            })
        },
        'loadAnswer': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Mnemonic_Get12',
				data: this.form,
                success: function (result) {
					APP.GLOBAL.updateUserModel({'IsMnemonic': true});
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					_vue.mnemonic1 = result.mnemonic1;
					_vue.mnemonic2 = result.mnemonic2;
					_vue.mnemonic3 = result.mnemonic3;
					_vue.mnemonic4 = result.mnemonic4;
					_vue.mnemonic5 = result.mnemonic5;
					_vue.mnemonic6 = result.mnemonic6;
					_vue.mnemonic7 = result.mnemonic7;
					_vue.mnemonic8 = result.mnemonic8;
					_vue.mnemonic9 = result.mnemonic9;
					_vue.mnemonic10 = result.mnemonic10;
					_vue.mnemonic11 = result.mnemonic11;
					_vue.mnemonic12 = result.mnemonic12;
                    _vue.isLoadingAnswer = false;
                }
            })
        },
        'changeLanguage': function () {
            LSE.install('change.mnemonic', function (lang) {
                Object.assign(_vue.language, lang);
            });
        },
		'gotoLightPage': function(id, page) {
            APP.GLOBAL.gotoNewWindow(id, page);
        },
        'backButton': function () {
            toastMsg('請重置您的登錄密碼');
        }

    },
    created: function () {
        if (this.request.from) {
            window.backButton = this.backButton;
        }

        this.changeLanguage();
        this.loadAnswer()
		
    }
});