var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isConfirmAmountShow': false,
        'isConfirmDialogShow': false,
        'isLoadingBank': true,
        'isBankNameShow': false,
        'statusbarHeight': 0,
        'display': {
            'amountText': '',
            //'payTimeText': '',
            //'confirmTimeText': '',
            'convertAmountDisplay': 0,
            'questionText': '',
        },
        'form': {
            //'epAmount': 0,
            //'limitConfirm': 0,
            //'limitPayment': 0,
            //'qId': 0,
            'usdtaddress': '',
            'password': '',  
            'gCode': ''
        },
        'language': {},
        'filePath': ''
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
         
         
        'checkData': function() {
            if (!this.form.usdtaddress) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

            if (!this.form.password) {
                APP.GLOBAL.toastMsg(this.language.ERROR_5);
                return;
            }

            if (this.form.password.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_6);
                return;
            }

            if (!this.form.gCode) {
                APP.GLOBAL.toastMsg(this.language.ERROR_15);
                return;
            }

            if (this.form.gCode.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_16);
                return;
            }
            this.isConfirmDialogShow = true;
        },
        'doSubmitAjax': function() {
            this.isConfirmDialogShow = false;
            APP.GLOBAL.toastLoading(this.language.TOAST_TEXT);

            

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Usdt_Bind',
                data: this.form,
                timeout: 60000,
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    

                    APP.GLOBAL.gotoNewWindow('change.successPage', 'security/change.success', {
                        param: 'title=' + encodeURIComponent(_vue.language.SELL_SUCCESS_TITLE) +
                            '&text=' + encodeURIComponent(_vue.language.SELL_SUCCESS_TEXT),
                        openCallback: function() {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
         
        'loadPageData': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Usdt_Bind_GetAddress',
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.display.questionText = result.OldUsdtaddress;
                    _vue.isLoading = false;
                }
            });
        },
         
         
        'changeLanguage': function() {
            LSE.install('usdtbind', function(lang) {
                Vue.set(_vue, 'language', lang);

                _vue.display.amountText = _vue.language.INPUT_PLACEHOLDER_1;
            });
        }
    },
    watch: {
        'form.epAmount': function(value) {
            this.display.convertAmountDisplay = this.currentUser.WithdrawExchangeRate * value;
			this.display.sellTotalAmount = numberFormat(parseInt(value)+5, 0) + '    EP';
        },
         
    },
    created: function() {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

         
    },
    mounted: function() {
        this.loadPageData();
        //this.loadBankName();
    }
});