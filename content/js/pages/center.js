Vue.use(vant.Lazyload, {
    'loading': '../content/img/default_avatar.jpg',
    'error': '../content/img/default_avatar.jpg',
    'attempt': 1
});

var _vue = new Vue({
    el: '#app',
    data: {
        star: 0,
        'currentUser': APP.GLOBAL.getUserModel(),
        'isInstallLanuage': false,
        'language': {},
        'form': {
            'pin': '',
			'answer': ''
        },
        'isPassowrdShow': false,
        'isFansPassowrdShow': false,
		'isFansmapPassowrdShow': false,
		'isincomePassowrdShow': false,
		'isfriendsPassowrdShow': false,
		'isGrandPassowrdShow': false,
		'isScalePassowrdShow': false,
		'isupgradePassowrdShow': false,
		'display': {
            'questionDisplay': ''
        },
        'menus': [{
            'index': 0,
            'text': '首頁',
            'default': 'iconhome',
            'active': 'iconhomefill',
            'url': 'home.html'
        }, {
            'index': 1,
            'text': 'AK交易',
            'default': 'iconpuke',
            'active': 'iconpuke_fill',
            'url': 'ace.list.html'
        }, {
            'index': 2,
            'text': 'EP交易',
            'default': 'iconjiaoyi',
            'active': 'iconjiaoyi_fill',
            'url': 'ep.list.html'
        }, {
            'index': 3,
            'text': '我的',
            'default': 'iconmy',
            'active': 'iconmyfill',
            'url': '#'
        }],
        'currentIndex': 3,
        'statusbarHeight': 0
    },
    methods: {
        'confirmDialog': function(action, done) {
            if (action === 'confirm') {
                if (!this.form.pin) {
                    done(false);
                    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                } else if (this.form.pin.length < 6) {
                    done(false);
                    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                } else {
                    done();
                    this.doCheckPINAjax('center/profile.html');
                }
            } else {
                this.form.pin = '';
                done();
            }
        },
		'incomeConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    this.doCheckAnswerAjax('center/profit.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		'friendsConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    this.doCheckAnswerAjax('center/my.friend.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		
		'GrandConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    this.doCheckAnswerAjax('center/analyze.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		
		'ScaleConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    this.doCheckAnswerAjax('center/analyze_level.html?first=true');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		
		
        'fansConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    /* this.doCheckPINAjax('center/my.fans.tree.html'); */
					this.doCheckAnswerAjax('center/my.fans.list.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		'fansmapConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    /* this.doCheckPINAjax('center/my.fans.tree.html'); */
					this.doCheckAnswerAjax('center/my.fans.tree.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		'upgradeConfirmDialog': function(action, done) {
            if (action === 'confirm') {
                //if (!this.form.pin) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_1);
                //} else if (this.form.pin.length < 6) {
                //    done(false);
                //    APP.GLOBAL.toastMsg(this.language.DIALOG_ERROR_2);
                //} else {
                    done();
                    this.doCheckAnswerAjax('center/child/upgrade_record.html');
                //}
            } else {
                this.form.pin = '';
                done();
            }
        },
		'loadPageData': function() {
            APP.GLOBAL.ajax({
				url:APP.CONFIG.BASE_URL+'Question_Get1',
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
        'doCheckPINAjax': function(url) {
            APP.GLOBAL.toastLoading(this.language.DIALOG_TOAST);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Check_TransactionPassword',
                data: this.form,
                success: function(result) {
                    _vue.form.pin = '';
					_vue.form.answer = '';
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    window.location = url;
                }
            });
        },
		'doCheckAnswerAjax': function(url) {
            APP.GLOBAL.toastLoading(this.language.DIALOG_TOAST);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Check_Answer',
                data: this.form,
                success: function(result) {
                    _vue.form.pin = '';
					_vue.form.answer = '';
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    window.location = url;
                }
            });
        },
        'updateUserModel': function() {
            Vue.set(this, 'currentUser', APP.GLOBAL.getUserModel());
        },
        'gotoDarkPage': function(id, page) {
            APP.GLOBAL.gotoNewWindow(id, page);
        },
        'gotoLightPage': function(id, page) {
            APP.GLOBAL.gotoNewWindow(id, page);
        },
        'logoutAccount': function() {
            APP.GLOBAL.confirmMsg({
                'title': this.language.EXIT_TITLE,
                'message': this.language.EXIT_TEXT,
                'confirmCallback': function() {
                    _vue.doLogoutAjax();
                }
            });
        },
        'doLogoutAjax': function() {
            APP.GLOBAL.toastLoading(this.language.EXIT_TOAST_TEXT);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Logout',
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.removeModel();
                    window.location = '../index.html';
                }
            });
        },
        'changeLanguage': function() {
            LSE.install('center', function(lang) {
                Vue.set(_vue, 'language', lang);
                _vue.isInstallLanuage = true;

                for (var i = 0; i < _vue.menus.length; i++) {
                    _vue.menus[i].text = lang['BOTTOM_MENU_' + (i + 1)];
                }
            });
        }
    },
    computed: {
        'regTime': function() {
            // var t = this

            return
            var date = this.currentUser.CreateTime.replace(/\//g, '/');
            var regDate = new Date(date);

            var lang = LSE.currentLanguage();
            if (lang === 'cn') {
                return regDate.getFullYear() + '年' + (regDate.getMonth() + 1) + '月' + regDate.getDate() + '日';
            } else {
                return regDate.getFullYear() + '/' + (regDate.getMonth() + 1) + '/' + regDate.getDate();
            }
        },
        'screenWidth': function() {
            if (APP.CONFIG.IS_RUNTIME && APP.CONFIG.SYSTEM_NAME !== 'ios') {
                return window.screen.width;
            } else {
                return document.body.clientWidth;
            }
        }
    },
    created: function() {
        this.changeLanguage();
		this.loadPageData();
    }
});