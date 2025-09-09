var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'tabIndex': 1,
        'isConfirmAmountShow': false,
        'isConfirmDialogShow': false,
        'isTipShow': false,
        'isLoadingBank': true,
        'isBankNameShow': false,
		'isnationNameShow': false,
        'statusbarHeight': 0,
        'display': {
            'amountText': '',
            //'payTimeText': '',
            //'confirmTimeText': '',
            'bankNumberFormat': '---- ---- ---- ---- ---',
            'convertAmountDisplay': 0,
            'questionText': '',
			'mnemonicid1': '',
            'sellTotalAmount': '0',
			'EPFeeDisplay': '0'
        },
        'bankNameList': [],
        'epList': [],
        'form': {
            'epAmount': 0,
            //'limitConfirm': 0,
            //'limitPayment': 0,
            //'qId': 0,
			'mnemonicid1': 0,
			'mnemonickey': '',
			'mnemonicstr1': '',
            //'answer': '',
            //'idcard': '',
            //'password': '',
            'bankNumber': '',
            'bankNumber1': '',
            'phone': '',
            'bankName': '',
            'bankBranchName': '',
            'usdtAddress': '',
            'usdtAddress1': '',
            'usdtAddress2': '',
            'usdtAddress3': '',
            'receiveType': 2,
			'EPFee': '',
            'gCode': '',
            'alipay': '',
            'imagesbase': ''
        },
        'language': {},
        'filePath': '',
        'isAddressError_1': false,
        'isAddressError_2': false,
        'isAddressError_3': false
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
        'fileChanged': function() {
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
            reader.onload = function(e) {
                _vue.compressImage(e.target.result, function(dataUrl) {
                    _vue.form.imagesbase = encodeURIComponent(dataUrl);
                    _vue.filePath = _vue.language.CHOOSE_ALIPAY_COMPLETE;
                    APP.GLOBAL.closeToastLoading();
                });
            };

            reader.readAsDataURL(file);
        },
        'getReceiveTypeName': function() {
            if (this.form.receiveType === 1) {
                return this.language.TAB_1;
            } else if (this.form.receiveType === 2) {
                return this.language.TAB_2;
            } else if (this.form.receiveType === 3) {
                return this.language.TAB_3;
            }
        },
        'removeAlipayQR': function() {
            APP.GLOBAL.confirmMsg({
                'title': this.language.DELETE_ALIPAY_QR_TITLE,
                'message': this.language.DELETE_ALIPAY_QR_MESSAGE,
                'confirmButtonText': this.language.DELETE_ALIPAY_CONFIRM,
                'cancelButtonText': this.language.DELETE_ALIPAY_CANCEL,
                'confirmCallback': function() {
                    _vue.form.imagesbase = '';
                    _vue.filePath = '';
                }
            });
        },
        'compressImage': function(base64, callback) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var compressedDataUrl = canvas.toDataURL('image/jpeg', .8);

                callback(compressedDataUrl);
            };

            img.src = base64;
        },
		'selectednationItem': function(item) {
		    this.form.nationName = item.Name;
			this.form.NationNameID = item.Id;
			this.form.Currency = item.Currency;
			this.form.Exchange = item.Exchange;
		    this.isnationNameShow = false;
			this.loadBankName();
		},
        'selectedBankItem': function(item) {
            this.form.bankName = item.Name;
			this.form.bankBranchNameID = item.Id;
            this.isBankNameShow = false;
        },

        'tabChanged': function(index) {
            this.form.receiveType = index + 1;
            this.changeItems(index);
        },
        'checkData': function() {
            this.isAddressError_1 = false;
            this.isAddressError_2 = false;
            this.isAddressError_3 = false;

            if (!this.form.epAmount) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
                return;
            }

           // if ((this.form.epAmount + 5) * 1 > this.currentUser.EP * 1) {
//                APP.GLOBAL.toastMsg(this.language.ERROR_2);
//                return;
//            }

            if (!this.form.phone || this.form.phone.length !== 11) {
                APP.GLOBAL.toastMsg(this.language.ERROR_9);
                return;
            }

            if (this.form.receiveType === 1) {
                if (!this.form.bankName) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_11);
                    return;
                }

                if (!this.form.bankNumber) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_10);
                    return;
                }

                if (this.form.bankNumber != this.form.bankNumber1) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_10_1);
                    return;
                }
            } else if (this.form.receiveType === 2) {
                if (!this.form.usdtAddress1 && !this.form.usdtAddress2 && !this.form.usdtAddress3) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_13);
                    return;
                }

                if (this.form.usdtAddress1) {
                    if (this.form.usdtAddress1.length < 27 || this.form.usdtAddress1[0] !== 'T') {
                        this.isAddressError_1 = true;
                        APP.GLOBAL.toastMsg(this.language.ERROR_19);
                        return;
                    }
                }
            } else if (this.form.receiveType === 3) {
                if (!this.form.alipay) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_17);
                    return;
                } else if (!/^[0-9a-zA-Z@\._]+$/.test(this.form.alipay)) {
                    APP.GLOBAL.toastMsg(this.language.ERROR_18);
                    return;
                }
            }

            if (!this.form.mnemonicstr1) {
                APP.GLOBAL.toastMsg(this.language.INPUT_PLACEHOLDER_12);
                return;
            }

            /* if (!this.form.idcard) {
                APP.GLOBAL.toastMsg(this.language.ERROR_8);
                return;
            }

            if (!this.form.password) {
                APP.GLOBAL.toastMsg(this.language.ERROR_5);
                return;
            }

            if (this.form.password.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_6);
                return;
            } */

            if (!this.form.gCode) {
                APP.GLOBAL.toastMsg(this.language.ERROR_15);
                return;
            }

            if (this.form.gCode.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_16);
                return;
            }

            this.form.bankBranchName = this.form.bankName;
            this.isConfirmDialogShow = true;
        },
        'doSubmitAjax': function() {
            this.isConfirmDialogShow = false;
            APP.GLOBAL.toastLoading(this.language.TOAST_TEXT);

            var u1 = this.form.usdtAddress1 ? this.form.usdtAddress1 : 'null';
            var u2 = this.form.usdtAddress2 ? this.form.usdtAddress2 : 'null';
            var u3 = this.form.usdtAddress3 ? this.form.usdtAddress3 : 'null';
            this.form.usdtAddress = u1 + ',' + u2 + ',' + u3;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'EP_Sell',
                data: this.form,
                timeout: 60000,
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.updateUserModel({
                        'EP': _vue.currentUser.EP - _vue.form.epAmount
                    });

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
        'confirmAmount': function(item) {
            this.isConfirmAmountShow = false;
            //this.display.sellTotalAmount = item.value + 5 + 'EP';
            this.display.amountText = item.text;
            //this.form.epAmount = item.value;
        },
        'loadPageData': function() {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'Mnemonic_Get01',
                error() {
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.display.mnemonicid1 = result.mnemonicid1;
                    _vue.form.mnemonicid1 = result.mnemonicid1;
					_vue.form.mnemonickey = result.mnemonickey;
                    _vue.isLoading = false;
                }
            });
        },
		'loadnationName': function() {
		    APP.GLOBAL.ajax({
		        url: APP.CONFIG.BASE_URL+'Public_Nations',
		        success: function(result) {
		            if (result.Error) {
		                APP.GLOBAL.toastMsg(result.Msg);
		                return;
		            }

		            _vue.nationNameList = result.Data;
		            _vue.isLoadingBank = false;
					_vue.form.EPFee = result.EPFee;
					_vue.display.Global = result.Global;
					_vue.display.ExchangeUsdt = result.ExchangeUsdt;
					if (result.EPFee	===1 )
					{
						_vue.display.EPFeeDisplay 	= '5 EP';
						_vue.display.sellTotalAmount = numberFormat(parseInt(_vue.form.epAmount)+5, 0) + '    EP';
					}
					else
					{
						_vue.display.EPFeeDisplay 	= '5 TP';
						_vue.display.sellTotalAmount = numberFormat(parseInt(_vue.form.epAmount), 0) + ' EP  + 5 TP';
					}

		        },

		    });
		},
        'loadBankName': function() {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Public_Banks',
				data: this.form,
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.bankNameList = result.Data;
                    _vue.isLoadingBank = false;


                }
            });
        },
        'changeItems': function(index) {
            this.epList = [];
            this.display.amountText = this.language.INPUT_PLACEHOLDER_1;
            //this.form.epAmount = 111;
            this.display.sellTotalAmount = '0';


			if (index === 0 || index === 2)
			{
           		 this.form.epAmount = 150;
			}
			else
			{
				 this.form.epAmount = 200;
			}

            if (index === 0 || index === 2) {
                for (var i = 150; i <= 1000; i += 50) {
                    this.epList.push({
                        'text': i + 'EP',
                        'value': i
                    });
                }
            } else {
                for (var j = 200; j <= 5000; j += 100) {
                    this.epList.push({
                        'text': j + 'EP',
                        'value': j
                    });
                }
            }
        },
        'changeLanguage': function() {
            LSE.install('sell.ep', function(lang) {
                Vue.set(_vue, 'language', lang);

                _vue.display.amountText = _vue.language.INPUT_PLACEHOLDER_1;
            });
        }
    },
    watch: {
        'form.epAmount': function(value) {
            this.display.convertAmountDisplay = this.currentUser.WithdrawExchangeRate * value;
			//this.display.sellTotalAmount = numberFormat(parseInt(value)+5, 0) + '    EP';
			if (this.form.EPFee === 1)
			{
				this.display.EPFeeDisplay =  ' 5  EP';
				this.display.sellTotalAmount = numberFormat(parseInt(value)+5, 0) + '    EP';
			}
			if (this.form.EPFee === 2)
			{
				this.display.EPFeeDisplay = '  5  TP';
				this.display.sellTotalAmount = numberFormat(parseInt(value), 0) + ' EP  +  5 TP';
			}

        },
        'form.bankNumber': function(v) {
            if (!v) {
                this.display.bankNumberFormat = '---- ---- ---- ---- ---';
                return;
            }

            var len = v.length / 4 + 1;
            var display = '';
            for (var i = 0; i < len; i++) {
                display += v.substring(i * 4, i * 4 + 4) + ' ';
            }
            this.display.bankNumberFormat = display;
        }
    },
    created: function() {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        this.changeItems(0);
    },
    mounted: function() {
        this.loadPageData();
        //this.loadBankName();
		this.loadnationName();
    }
});