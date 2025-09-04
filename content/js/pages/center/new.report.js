var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
        'isLoadFirstReport': true,
        'isShowMoney': false,
        'isConfirmPopup': false,
        'isCountryShow': false,
        'isIdTypeShow': false,
        'isSearch': false,
        'isFirstReport': false,
        'isPlayerLoading': false,
        'isNotFound': false,
		'isNoticeShow': false,
        'levelList': [],
        'searchFlowNumber': '',
        'display': {
            'levelText': '',
            'countryText': '',
            'idTypeText': '',
            'nodalPersonText': ''
        },
        'form': {
            'memberNo': '',
            'nickName': '',
            'countryCode': '86',
            'password1': '',
            'investmentAmount': '',
            'nationality': '',
            'nodalPersonId': '',
            'position': 1,
            'mPassword': ''
        },
        'request': {
            'fromTree': APP.GLOBAL.queryString('fromTree'),
			'source': APP.GLOBAL.queryString('source')
        },
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {
        'doSubmitAjax': function () {
            APP.GLOBAL.toastLoading(this.language.SUBMIT_TOAST);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'DeclarationForm_Main',
                data: this.form,
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.updateUserModel({
                        'RP': _vue.currentUser.RP - _vue.form.investmentAmount
                    });

                    APP.GLOBAL.gotoNewWindow('report.successPage', '../secondpage/report.success', {
                        'param': 'title=' + encodeURIComponent(_vue.language.SUCCESS_TITLE) +
                            '&text=' + encodeURIComponent(_vue.language.SUCCESS_TEXT) + 
                            '&parentId=' + _vue.searchFlowNumber + 
							'&source=' + _vue.request.source
                    });
                }
            });
        },
        'doSearchFlowNumber': function () {
            if (this.searchFlowNumber.length < 5) return;

            this.isSearch = true;
            this.form.nodalPersonId = '';
            this.isPlayerLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Public_NodalPersonList',
                data: {
                    'code': this.searchFlowNumber
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                    } else if (result.Data.List.length === 0) {
                        _vue.isNotFound = true;
                        _vue.display.nodalPersonText = _vue.language.PLAYER_NOTFOUND;
                    } else {
                        _vue.isNotFound = false;
                        _vue.display.nodalPersonText = result.Data.List[0].NickName + '(' + _vue.searchFlowNumber + ')';
                        _vue.form.nodalPersonId = result.Data.List[0].Id;
                    }

                    _vue.isPlayerLoading = false;
                }
            });
        },
		
		'checkmemberNo': function () {
            if (this.form.memberNo.length < 5) return;

            //this.isSearch = true;
            //this.form.nodalPersonId = '';
            //this.isPlayerLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Check_MemberIsExists',
                data: {
                    'mNumber': this.form.memberNo
                },
                success: function (result) {
                    if (result.IsExis) {
                        APP.GLOBAL.toastMsg(result.Msg);
                    }  
                }
            });
        },
		
        'checkData': function () {
            if (!this.form.memberNo) {
                APP.GLOBAL.toastMsg(this.language.ERROR_1);
            } else if (this.form.memberNo.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_2);
            } else if (!/^[0-9a-zA-Z]+$/.test(this.form.memberNo)) {
                APP.GLOBAL.toastMsg(this.language.ERROR_16);
            } else if (!this.form.nickName) {
                APP.GLOBAL.toastMsg(this.language.ERROR_3);
            } else if (this.form.nickName.length < 3) {
                APP.GLOBAL.toastMsg(this.language.ERROR_4);
            } else if (!this.form.password1) {
                APP.GLOBAL.toastMsg(this.language.ERROR_5);
            } else if (this.form.password1.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_6);
            } else if (!this.form.nodalPersonId) {
                APP.GLOBAL.toastMsg(this.language.ERROR_12);
            } else if (!this.form.mPassword) {
                APP.GLOBAL.toastMsg(this.language.ERROR_13);
            } else if (this.form.mPassword.length < 6) {
                APP.GLOBAL.toastMsg(this.language.ERROR_14);
            } else {
                this.isConfirmPopup = true;
            }
        },
        'confirmCountry': function (item) {
            this.isCountryShow = false;
            this.form.nationality = item.code;
            this.form.idType = '';
            this.display.countryText = item.text;
        },
        'confirmMoney': function (item) {
            this.isShowMoney = false;
            this.display.levelText = item.text;
            this.form.investmentAmount = item.value;
        },
        'changeIdType': function () {
            if (!this.form.nationality) {
                APP.GLOBAL.toastMsg(this.language.ERROR_15);
                return;
            }

            this.idTypes = [];
            this.idTypes.push({
                'text': _vue.language.ID_CHINA,
                'value': 1
            });
            this.idTypes.push({
                'text': _vue.language.ID_OTHER,
                'value': 2
            });

            this.isIdTypeShow = true;
        },
        'confirmIdType': function (item) {
            this.isIdTypeShow = false;
            this.display.idTypeText = item.text;
            this.form.idType = item.value;
        },
        'loadPageData': function () {
            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Public_InvestmentAmountList_Main',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					if (APP.GLOBAL.queryString('first')) {
                        _vue.isNoticeShow = true;
                    }


                    for (var i = 0; i < result.Data.List.length; i++) {
                        _vue.levelList.push({
                            'text': _vue.getStar(result.Data.List[i]),
                            'value': result.Data.List[i].InvestmentAmount,
                            'disabled': result.Data.List[i].IsDisable
                        });
                    }

                    _vue.isFirstReport = result.Data.IsFirstReport;
                    _vue.form.investmentAmount = result.Data.List[0].InvestmentAmount;
                    _vue.display.levelText = _vue.levelList[0].text;
                    _vue.isLoading = false;
                }
            });
        },
        'checkFirstReport': function () {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'Public_IsFirstReport',
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (result.IsFirst) {
                        _vue.searchFlowNumber = result.Data.MemberNo;
                        _vue.display.nodalPersonText = result.Data.NickName + '(' + result.Data.MemberNo + ')';
                        _vue.form.nodalPersonId = result.Data.Id;
                        _vue.form.position = 1;
                    }

                    _vue.isFirstReport = result.IsFirst;
                    _vue.isLoadFirstReport = false;
                }
            });
        },
        'getStar': function (item) {
            var starHtml = '&nbsp;';
            for (var i = 0; i < item.StarNumber; i++) {
                starHtml += '<i class="iconfont iconxing star"></i>';
            }

            var text = item.Name + '&nbsp;' + item.InvestmentAmount + '$';
            return text + '&nbsp;' + starHtml;
        },
        'changeLanguage': function () {
            LSE.install('new.report', function (lang) {
                Vue.set(_vue, 'language', lang);

                if (!_vue.request.fromTree) {
                    _vue.display.nodalPersonText = lang.PLAYER_DEFAULT;
                }
            });
        }
    },
    created: function () {
        this.changeLanguage();

        if (APP.CONFIG.IS_RUNTIME) {
            this.statusbarHeight = plus.navigator.getStatusbarHeight();
        }

        if (this.request.fromTree) {
            this.searchFlowNumber = APP.GLOBAL.queryString('MemberNo');
            this.display.nodalPersonText = APP.GLOBAL.queryString('parentDisplay');
            this.form.nodalPersonId = APP.GLOBAL.queryString('rId');
            this.form.position = APP.GLOBAL.queryString('pos') * 1;
        }
    },
    mounted: function () {
        this.loadPageData();
        this.checkFirstReport();
    }
});
function closeNotice() {
    _vue.isNoticeShow = false;
}