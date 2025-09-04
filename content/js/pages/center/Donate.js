var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': false,
        'tabIndex': 0,
        'statusbarHeight': 0,
        'display': {
			'EP': '',
			'SP': '',
			'ACE': ''
        },
		'request': {
            'is': APP.GLOBAL.queryString('is'),
            'display': APP.GLOBAL.queryString('display'),
            'sId': APP.GLOBAL.queryString('sId'),
			'ACE': APP.GLOBAL.queryString('ACE'),
			'BatchID': APP.GLOBAL.queryString('BatchID'),
			'Tab': APP.GLOBAL.queryString('Tab')
        },
		
        'form': {
			'EP': 0,
            'SP': 0,
			'ACE': 0,
			'DonateID':0
        },
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
		
		'selectedAllItem': function(item) {			
			if (item	==='EP' ) 
				{
					_vue.form.EP 	= _vue.display.EP;
				}
			if (item	==='SP' ) 
				{
					_vue.form.SP 	= _vue.display.SP;
				}
			if (item	==='ACE' ) 
				{
					_vue.form.ACE 	= _vue.display.ACE;
				}
        },
		
		'gotoChoiceSubaccountlp': function() {
            APP.GLOBAL.gotoNewWindow('choice.subaccountPage.lp', 'child/choice.subaccount.lp', {
                openCallback: function() {
                    plus.navigator.setStatusBarStyle('dark');
                },
                closeCallback: function() {
                    plus.navigator.setStatusBarStyle('light');
                }
            });
        },
		'gotoback': function() {
            APP.GLOBAL.gotoNewWindow('center', '../center', {
                openCallback: function() {
                    plus.navigator.setStatusBarStyle('dark');
                },
                closeCallback: function() {
                    plus.navigator.setStatusBarStyle('light');
                }
            });
        },
		'gotoChoiceSubaccountas': function() {
            APP.GLOBAL.gotoNewWindow('choice.subaccountPage.as', 'child/choice.subaccount.as', {
                openCallback: function() {
                    plus.navigator.setStatusBarStyle('dark');
                },
                closeCallback: function() {
                    plus.navigator.setStatusBarStyle('light');
                }
            });
        },
        'tabChanged': function(index) {
            this.form.DonateID = index;
			 if (index === 1) {
				window.location.href = "Donate.as.html";
			}
        },
        'doSubmitAjax': function() {
            APP.GLOBAL.toastLoading(this.language.TOAST_TEXT);
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Donate',
                data: this.form,
                timeout: 60000,
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    APP.GLOBAL.gotoNewWindow('Donate.successPage', 'security/Donate.success', {
                        param: 'title=' + encodeURIComponent(_vue.language.SUCCESS_TITLE) +
                            '&text=' + encodeURIComponent(_vue.language.SUCCESS_TEXT),
                        openCallback: function() {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
		'loadnationName': function() {
		    APP.GLOBAL.ajax({
		        url: APP.CONFIG.BASE_URL+'My_Balance_Donate',
		        success: function(result) {
		            if (result.Error) {
		                APP.GLOBAL.toastMsg(result.Msg);
		                return;
		            }
					_vue.isLoadingBank = false;
					_vue.display.SP = result.Data.SP;
					_vue.display.EP = result.Data.EP;
					if ((APP.GLOBAL.queryString('is') !== 'true')) 
					{
					_vue.display.ACE = result.Data.ACE;
					}
					
		        },
		    });
		},
        'changeLanguage': function() {
            LSE.install('Donate', function(lang) {
                Vue.set(_vue, 'language', lang);
                _vue.display.amountText = _vue.language.INPUT_PLACEHOLDER_1;
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
		this.loadnationName();
		if (this.request.is) {
			this.display.ACE = this.request.ACE;
			this.display.BatchID = this.request.BatchID;
            this.form.sonId = this.request.sId;
            this.display.accountDisplay = this.request.display;
			this.form.DonateID = this.request.Tab;
        }
		this.tabIndex = this.request.Tab;
		
    }
});