var _vue = new Vue({
    el: '#app',
    data: {
        'currentUser': APP.GLOBAL.getUserModel(),
        'isLoading': true,
		'Search': APP.GLOBAL.queryString('Search'),
        'pageModel': {
            'pageIndex': 1,
            'pageSize': 15,
            'list': [],
            'isLoadMore': false,
            'isLoadComplete': false
        },
         
         
        'statusbarHeight': 0,
        'language': {}
    },
    methods: {         
        'loadPageData1': function() {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'My_Analyze_Chart1',
				data: {
					'Search': this.Search
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					  Master.setOption({
						series: [
						  {
							data: result.Data.Master
						  }
						]
					  });
                    _vue.isLoading = false;
                }
            });
        },
		
		'loadPageData2': function() {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'My_Analyze_Chart2',
				data: {
					'Search': this.Search
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					  Performance.setOption({
						xAxis: {
						  data: result.Data.xAxis
						},
						series: [
						{
						  name: result.Data.Name1,
						  type: 'line',
						  stack: 'Total',
						  data: result.Data.List1
						},
						{
						  name: result.Data.Name2,
						  type: 'line',
						  stack: 'Total',
						  data: result.Data.List2
						},
						{
						  name: result.Data.Name3,
						  type: 'line',
						  stack: 'Total',
						  data: result.Data.List3
						}
					  ]
					  });
                    _vue.isLoading = false;
                }
            });
        },
		'loadPageData3': function() {
            APP.GLOBAL.ajax({
				url: APP.CONFIG.BASE_URL+'My_Analyze_Chart3',
				data: {
					'Search': this.Search
                },
                success: function(result) {
                    if (result.Error) {
                        APP.GLOBAL.toastMsg(result.Msg);
                        return;
                    }
					  Market.setOption({
						yAxis: {
								type: 'category',
								data: result.Data.yAxis
							  },
							  series: [
								{
								  data: result.Data.Name1,
								  type: 'bar',
								  data: result.Data.List1
								}/*,
								{
								  data: result.Data.Name2,
								  type: 'bar',
								  data: result.Data.List2
								},
								{
								  data: result.Data.Name3,
								  type: 'bar',
								  data: result.Data.List3
								}*/
							  ]
					  });
                    _vue.isLoading = false;
                }
            });
        },
		
		 
		 
        'changeLanguage': function() {
            LSE.install('analyze_chart', function(lang) {
                Vue.set(_vue, 'language', lang);
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
        this.loadPageData1();
		this.loadPageData2();
		this.loadPageData3();
    }
});