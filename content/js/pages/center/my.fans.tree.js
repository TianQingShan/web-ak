var sysName = APP.CONFIG.SYSTEM_NAME;

var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'searchKey': '',
        'isFocus': false,
        'ajaxURLs': {},
        'isLoading': true,
        'historyList': [],
        'currentFlowNumber': '',
        'currentNFlow': 0,
        'isShow': false,
        'radioType': '1',
        'currentReport': {
            'pId': 0,
            'pos': 0
        },
        'request': {
            'parentId': APP.GLOBAL.queryString('pi')
        },
        'language': {},
        'statusbarHeight': 0
    },
    methods: {
        'myLeftDown': function () {
            APP.GLOBAL.toastLoading({ 'message': this.language.LOADING_TEXT });

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_LowerLeft',
                data: {
                    'uNumber': this.currentFlowNumber
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();

                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }

                    if (_vue.currentFlowNumber !== result.FlowNumber) {
                        var temp = _vue.currentFlowNumber;
                        _vue.loadNextLayer(result.FlowNumber, temp);
                    }
                }
            });
        },
        'gotoBack': function () {
            var index = this.historyList.length - 1;
            var flowNumber = this.historyList[index];
            this.historyList.splice(index, 1);
            this.currentFlowNumber = flowNumber;
            this.loadPageData();
        },
        'gotoUpLayer': function () {
            //this.currentFlowNumber = this.currentNFlow;
			var index = this.historyList.length - 1;
            var flowNumber = this.historyList[index];
            this.historyList.splice(index, 1);
            this.currentFlowNumber = flowNumber;
            this.loadPageData();
        },
        'onSearch': function () {
            if (!this.searchKey) {
                APP.GLOBAL.toastMsg(this.language.INPUT_PLAYER_ID);//'請輸入玩家ID'
            } else {
                this.historyList.push(this.currentFlowNumber);
                this.currentFlowNumber = this.searchKey;

                this.loadPageData();
            }
        },
        'onCancel': function () {
            if (this.searchKey) {
                this.historyList = [];
                this.currentFlowNumber = this.currentUser.MemberNo;
                this.loadPageData();
            }
        },
        'newReport': function (pId, pos) {
            this.currentReport.pId = pId;
            this.currentReport.pos = pos;
            this.isShow = true;
        },
        'typeConfirm': function () {
            if (this.radioType === '1') {
                this.reportByNew();
            } else {
                this.reportBySub();
            }
        },
        'reportByNew': function () {
            APP.GLOBAL.toastLoading({ 'message': this.language.READY_DATA }); 

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Public_NodalPerson',
                data: {
                    'nId': this.currentReport.pId
                },
                success: function (result) {
                    if (result.Error) {
                        APP.GLOBAL.closeToastLoading();
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					
					//console.log('后端返回数据:', result);

                    APP.GLOBAL.gotoNewWindow('new.reportPage', 'new.report', {
                        param: 'rId=' + _vue.currentReport.pId +
                            '&display=' + result.Data.FlowNumber +
							'&MemberNo=' + result.Data.MemberNo +
                            '&parentDisplay=' + encodeURIComponent(result.Data.NickName + '(' + result.Data.MemberNo + ')') +
                            '&pos=' + _vue.currentReport.pos +
                            '&fromTree=true'+
							'&source=true'+
							'&first=true1',
                        openCallback: function () {
                            APP.GLOBAL.closeWindow('none');
                        }
                    });
                }
            });
        },
        'reportBySub': function () {
            APP.GLOBAL.toastLoading(this.language.AUDIT_RULES);

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'Check_DeclarationForm_Son',
                data: {
                    'pId': this.currentReport.pId
                },
                success: function (result) {
                    APP.GLOBAL.closeToastLoading();
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
                    if (!result.CanCreate) {
                        _vue.$dialog.alert({
                            'message': _vue.language.AUDIT_FAIL_MESSAGE_1 + result.CanCreateDate + _vue.language.AUDIT_FAIL_MESSAGE_2,
                            'title': _vue.language.AUDIT_FAIL//'不符合規則'
                        });
                        return;
                    }

                    try {
                        var displayText = result.Data.NickName + '(' + result.Data.MemberNo + ')';
                        APP.GLOBAL.gotoNewWindow('new.subaccountPage', 'new.subaccount', {
                            param: 'fromTree=true&source=true' +
                                '&parentId=' + _vue.currentReport.pId +
                                '&display=' + result.Data.FlowNumber +
								'&MemberNo=' + result.Data.MemberNo +
                                '&parentDisplay=' + encodeURIComponent(displayText) +
                                '&pos=' + _vue.currentReport.pos,
                            openCallback: function () {
                                APP.GLOBAL.closeWindow('none');
                            }
                        });
                    } catch (e) {
                        APP.GLOBAL.toastMsg(e.message);
                    }
                }
            });
        },
        'loadNextLayer': function (id, temp) {
            this.historyList.push(this.currentFlowNumber);
            this.currentFlowNumber = id;

            this.loadPageData(temp);
        },
        'loadPageData': function (temp) {
            this.isLoading = true;

            APP.GLOBAL.ajax({
                url: APP.CONFIG.BASE_URL+'My_RelationDiagram',
                data: {
                    'id': this.currentFlowNumber
                },
                success: function (result) {
                    _vue.isLoading = false;

                    if (result.Error) {
                        var index = _vue.historyList.length - 1;
                        _vue.historyList.splice(index, 1);

                        APP.GLOBAL.toastMsg(result.Msg);
                    } else {
                        _vue.currentNFlow = result.Source.MemberNo;
						_vue.currentFlowNumber = result.Source.MemberNo;
                        $('#chart-container').html('');
                        _vue.$nextTick(function () {
                            $('#chart-container').orgchart({
                                'data': result.Source,
                                'ajaxURL': _vue.ajaxURLs,
                                'nodeContent': 'title',
                                'nodeId': 'id'
                            });
                        });

                        if (temp) {
                            APP.GLOBAL.toastMsg('當前為 ' + temp + ' 的最左下');
                        }
                    }
                }
            });
        },
        'changeLanguage': function () {
            LSE.install('my.fans.tree', function (lang) {
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
        if (this.request.parentId) {
            this.currentFlowNumber = this.request.parentId;
        } else {
            this.currentFlowNumber = this.currentUser.MemberNo;
        }
        
        this.loadPageData();
    }
});