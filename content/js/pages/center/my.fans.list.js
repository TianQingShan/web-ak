var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'searchKey': '',
        'isLoading': true,
        'isFirst': true,
        'isShowTip': false,
        'isFocus': false,
        'showAgainCheckValue': false,
        'isEmptyParent': false,
        'layer': {
            'FirstLayer': {},
            'SecondLayer': [{
                'Id': 0
            }, {
                'Id': 0
            }],
            'ThirdLayer': []
        },
		'request': {
            'parentId': APP.GLOBAL.queryString('pi')
        },
        'historyList': [],
        'currentFlowNumber': '',
		'currentMemberNo': '',
        'currentNFlow': '',
        'language': {},
        'statusbarHeight': 0
    },
    methods: {
        'gotoUpLayer': function () {
            this.currentFlowNumber = this.currentNFlow;
			this.currentMemberNo = this.currentNFlow;
            this.loadPageData();
        },
        'gotoBack': function () {
            var index = this.historyList.length - 1;
            var flowNumber = this.historyList[index];
            this.currentFlowNumber = flowNumber;
			this.currentMemberNo = flowNumber;
            this.historyList.splice(index, 1);

            this.loadPageData();
        },
        'reportByNew': function (item) {
            APP.GLOBAL.toastLoading({ 'message': this.language.READY_DATA }); //'正在準備數據'

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Public_NodalPerson',
                data: {
                    'nId': item.NodalPersonId
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    APP.GLOBAL.gotoNewWindow('new.reportPage', 'new.report', {
                        param: 'rId=' + item.NodalPersonId +
                            '&display=' + result.Data.FlowNumber +
							'&MemberNo=' + result.Data.MemberNo +
                            '&parentDisplay=' + encodeURIComponent(result.Data.NickName + '(' + result.Data.MemberNo + ')') +
                            '&fromTree=true' +
							'&source=false' +
							'&first=true' +
                            '&pos=' + item.Position,
							
                        openCallback: function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'reportBySub': function (item) {
            APP.GLOBAL.toastLoading({ 'message': this.language.AUDIT_RULES }); //'正在檢查規則'

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Check_DeclarationForm_Son',
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (!result.CanCreate) {
                        _vue.$dialog.alert({
                            'message': _vue.language.AUDIT_FAIL_MESSAGE_1 + result.CanCreateDate + _vue.language.AUDIT_FAIL_MESSAGE_2,
                            'title': _vue.language.AUDIT_FAIL
                        });
                        return;
                    }

                    var parentNode = _vue.getDisplay(item.NodalPersonId);
                    APP.GLOBAL.gotoNewWindow('new.subaccountPage', 'new.subaccount', {
                        param: 'fromTree=true&source=false' +
                            '&parentId=' + item.NodalPersonId +
                            '&display=' + parentNode.FlowNumber +
							'&MemberNo=' + parentNode.MemberNo +
                            '&parentDisplay=' + encodeURIComponent(parentNode.NickName + '(' + parentNode.MemberNo + ')') +
                            '&pos=' + item.Position,
                        openCallback: function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'getDisplay': function (pId) {
            if (this.layer.FirstLayer.Id === pId)
                return {
                    'NickName': this.layer.FirstLayer.NickName,
					'MemberNo': this.layer.FirstLayer.MemberNo,
                    'FlowNumber': this.layer.FirstLayer.FlowNumber
                };

            for (var i = 0; i < this.layer.SecondLayer.length; i++) {
                if (this.layer.SecondLayer[i].Id === pId) {
                    return {
                        'NickName': this.layer.SecondLayer[i].NickName,
						'MemberNo': this.layer.SecondLayer[i].MemberNo,
                        'FlowNumber': this.layer.SecondLayer[i].FlowNumber
                    };
                }
            }

            return null;
        },
        'loadList': function (item) {
            this.historyList.push(this.currentFlowNumber);
            this.currentMemberNo   = item.MemberNo;
			this.currentFlowNumber = item.FlowNumber;
            this.loadPageData();
        },
		'gotoLightPage': function(id, page) {
            APP.GLOBAL.gotoNewWindow(id, page);
        },
        'myLeftDown': function () {
            APP.GLOBAL.toastLoading({ 'message': this.language.SEARCHING }); //'正在搜索'

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_LowerLeft',
                data: {
                    'uNumber': this.currentMemberNo
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    var temp = _vue.currentFlowNumber;

                    if (_vue.currentFlowNumber !== result.FlowNumber) {
                        _vue.historyList.push(_vue.currentFlowNumber);
                        _vue.currentFlowNumber = result.FlowNumber;
                        _vue.loadPageData(temp);
                    }
                }
            });
        },
        'onSearch': function () {
            if (!this.searchKey) {
                APP.GLOBAL.toastMsg(this.language.INPUT_PLAYER_ID);// '請輸入玩家ID'
            //} else if (!/^\d+$/.test(this.searchKey) || this.searchKey.length < 5) {
            // APP.GLOBAL.toastMsg(this.language.PLAYER_ID_RULES); //'玩家ID只能是整數且最少5位'
            } else {
                this.historyList.push(this.currentFlowNumber);
                this.currentFlowNumber = this.searchKey;

                this.loadPageData();
            }
        },
        'loadPageData': function (temp) {
            this.isLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_RelationList',
                data: {
					'Pi': APP.GLOBAL.queryString('pi'),
                    'id': this.currentFlowNumber
                },
                success: function (result) {
                    if (result.Error) {
                        var index = _vue.historyList.length - 1;
                        _vue.historyList.splice(index, 1);
                        _vue.isLoading = false;

                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    _vue.currentNFlow = result.Data.nFlow;
                    _vue.layer = Object.assign(_vue.layer, result.Data);
                    _vue.isEmptyParent = _vue.isThirdLayerNotEmpty();
                    _vue.isLoading = false;

                    if (temp) {
                        APP.GLOBAL.toastMsg('current: ' + temp + '  bottom left');
                    }

                    if (_vue.isFirst && _vue.isShowAgain) {
                        _vue.isFirst = false;
                        _vue.isShowTip = true;
                    }
                }
            });
        },
        'isThirdLayerNotEmpty': function () {
            for (var i = 0; i < _vue.layer.ThirdLayer.length; i++) {
                if (_vue.layer.ThirdLayer[i].NodalPersonId !== 0) return true;
            }

            return false;
        },
        'changeLanguage': function () {
            LSE.install('my.fans.list', function (lang) {
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
        this.currentMemberNo   = this.currentUser.MemberNo;
		this.currentFlowNumber = this.currentUser.FlowNumber;
		//if (this.request.parentId) {
        //    this.currentFlowNumber = this.request.parentId;
        //} else {
        //    this.currentFlowNumber = this.currentUser.FlowNumber;
        //}
        
        this.loadPageData();
    }
});