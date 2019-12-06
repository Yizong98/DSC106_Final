Highcharts.ajax({
    url: 'spider.json',
    dataType: Text,
    success:function (activity){
        activity=JSON.parse(activity)
        const arr=[activity['0'], activity['1'], activity['2']]
        gater=arr.map(i =>{return({name: i['short_name'], type: 'line', data: [i['pace'], 
        i['shooting'], i['passing'], i['dribbling'], i['defending'], i['physic']]})})
        const lab=['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic']

        var chartDiv=document.createElement('div');
        chartDiv.className='chart';
        document.getElementById('spider').appendChild(chartDiv);
        Highcharts.chart(chartDiv, {

            chart: {
                polar: true
            },
        
            title: {
                text: 'Top 3 Striker data polar chart'
            },
        
            pane: {
                startAngle: 0,
                endAngle: 360
            },
        
            xAxis: {
                tickInterval: 60,
                min: 0,
                max: 360,
                labels: {
                    formatter:function() {
                        return lab[this.value/60]
                    }
                }
            },
        
            yAxis: {
                min: 0,
                max: 100
            },
        
            plotOptions: {
                series: {
                    pointStart: 0,
                    pointInterval: 60,
                    states: {
                        inactive: {
                            opacity: 1
                        }
                    }

                },
                column: {
                    pointPadding: 0,
                    groupPadding: 0
                }
            },
        
            series:gater,
            tooltip:{
                shadow: false
            }
        })
        
    }


})