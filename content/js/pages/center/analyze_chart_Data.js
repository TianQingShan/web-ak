var Master = echarts.init(document.getElementById('Master'));
// 显示标题，图例和空的坐标轴
Master.setOption({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
});

var Performance = echarts.init(document.getElementById('Performance'));
// 显示标题，图例和空的坐标轴
Performance.setOption({
  //title: {
  //  text: '新增账户'
  //},
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['直推', '主账户', '子账户']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '直推',
      type: 'line',
      stack: 'Total',
      data: []
    },
    {
      name: '主账户',
      type: 'line',
      stack: 'Total',
      data: []
    },
	{
      name: '子账户',
      type: 'line',
      stack: 'Total',
      data: []
    }
    
  ]
});

var Market = echarts.init(document.getElementById('Market'));
// 显示标题，图例和空的坐标轴
Market.setOption({
  //title: {
  //  text: 'World Population'
  //},
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: []
  },
  series: [
    {
      name: '业绩总额  ',
      type: 'bar',
      data: []
    }/*,
	{
      name: '卖出AK价值',
      type: 'bar',
      data: []
    },
    {
      name: '卖出EP    ',
      type: 'bar',
      data: []
    }*/
  ]
});


 