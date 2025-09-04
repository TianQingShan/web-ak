var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isUsdtLoading': true,
        'isQrLoading': true,
        'displayAmount': '',
        'pageModel': {
            'ImageAddress': '',
            'Address': '',
            'RPPrice': '',
            'USDTPrice': ''
        },
        'form': {
            'amount': ''
        },
        'language': {},
        'isShowDiloag': false
    },
    methods: {
        'loadUSDTData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'USDT_Calc',
                success: function (result) {
                    if (result.Error) {
                        toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.RPPrice = result.Data.RPPrice;
                    _vue.pageModel.USDTPrice = result.Data.USDTPrice;
                    _vue.isUsdtLoading = false;

                    _vue.$dialog.alert({
                        'title': _vue.language.ALERT_TITLE,
                        'message': _vue.language.ALERT_MESSAGE,
                        'confirmButtonText': _vue.language.ALERT_CONFIRM_BUTTON
                    });
                }
            });
        },
        'loadQRData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Usdt_Address',
                success: function (result) {
                    if (result.Error) {
                        if (result.isSellOut) {
                            _vue.isShowDiloag = true;
                            _vue.isQrLoading = false;
                            return;
                        }

                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.pageModel.ImageAddress = result.ImageAddress;
                    _vue.pageModel.Address = result.Address;
                    _vue.isQrLoading = false;

                    _vue.$nextTick(function () {
                        var clipboard = new ClipboardJS('.clipboard');

                        clipboard.on('success', function (e) {
                            _vue.$toast.success({
                                'message': _vue.language.COPY_TOAST_TEXT,
                                'duration': 1000
                            });
                            e.clearSelection();
                        });

                        clipboard.on('error', function (e) {
                            _vue.$dialog.alert({
                                title: _vue.language.COPY_FAIL_TEXT,
                                message: _vue.language.COPY_FAIL_TEXT_1 + '\n' + _vue.pageModel.Address
                            });
                        });
                    });
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('new_recharge', function (lang) {
                Vue.set(_vue, 'language', lang);

                _vue.displayAmount = lang.INPUT_PLACEHOLDER_5;
            });
        }
    },
    watch: {
        'form.amount': function (value) {
            if (!value || value <= 0) {
                this.displayAmount = this.language.INPUT_PLACEHOLDER_5;
            } else {
                //this.displayAmount = numberFormat(value * this.pageModel.USDTPrice * 1 / this.pageModel.RPPrice * 1, 2);
				this.displayAmount = numberFormat(value * this.pageModel.RPPrice * 1, 2);
            }
        }
    },
    created: function () {
        this.changeLanguage();
    },
    mounted: function () {
        this.loadQRData();
        this.loadUSDTData();
    }
});