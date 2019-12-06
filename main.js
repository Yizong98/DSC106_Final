/*
<td id="barGrid"></td>
The purpose of this demo is to demonstrate how multiple charts on the same page
can be linked through DOM and Highcharts events and API methods. It takes a
standard Highcharts config with a small variation for each data set, and a
mouse/touch event handler to bind the charts together.
*/
/*
 * In order to synchronize tooltips and crosshairs, override the
 * built-in events with handlers defined on the parent element.
 */
var curr = [];
var curr2 = [];
['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
    document.getElementById('container').addEventListener(
        eventType,
        function (e) {
            var chart,
                point,
                i,
                event,
                sources,
                loads,
                overall;

            for (i = 0; i < Highcharts.charts.length; i = i + 1) {
                chart = Highcharts.charts[i];
                if (chart){
                    // Find coordinates within the chart
                    event = chart.pointer.normalize(e);
                    // Get the hovered point
                    var j;
                    sources = 0;
                    loads = 0;
                    renew = 0;
                    for (j = 0; j < chart.series.length; j = j + 1){
                        point = chart.series[j].searchPoint(event, true);
                        if (point) {
                            point.highlight(e);
                            if (chart.series.length > 1){
                            if (["attack","pumps"].includes(point.series.name)) {
                                overall = point.category;
                                if (point.y){document.getElementById(point.series.name).innerHTML = point.y.toFixed(4);
                                }
                                else{
                                    document.getElementById(point.series.name).innerHTML = "-";
                                }
                                
                            } else {
                                sources += point.y;
                                document.getElementById(point.series.name).innerHTML = point.y.toFixed(4);
                            }
                            
                        }

                        }
                    }
                    if (chart.series.length > 1){
                        var temp = [];
                        var tempcent = [];
                        var nets = (loads+sources).toFixed(4)
                        for (j = 0; j < chart.series.length; j = j + 1){
                        point = chart.series[j].searchPoint(event, true);
                        if (point) {
                            point.highlight(e);
                            if (chart.series.length > 1){
                            if (["exports","pumps"].includes(point.series.name)) {
                                if (point.y){
                                    document.getElementById(point.series.name+"p").innerHTML = (-point.y*100.0/nets).toFixed(4) + "%";
                                }
                                else{
                                    document.getElementById(point.series.name+"p").innerHTML = "-";
                                }  
                            } else {
                                if (["wind","hydro"].includes(point.series.name)){
                                        renew += (point.y*100.0/nets);
                                }
                                temp.push([point.series.name,point.y]);
                                tempcent.push([point.series.name,+((point.y*100.0/nets).toFixed(4))])
                            }
                            
                        }
                        }

                    }
                    curr2 = tempcent;
                    curr = temp;
                    var checkbox = document.querySelector('input[type="radio"]');
                    let trans = () => {
                        document.documentElement.classList.add('transition');
                        window.setTimeout(() => {
                            document.documentElement.classList.remove('transition');
                        }, 1000)
                    }
                    if(checkbox.checked) {
                        trans()
                        var chartDiv = document.getElementById("pieGrid")
                        var chartha = Highcharts.chart(chartDiv,{
                            chart: {
                                type: 'pie'
                            },
                            title: {
                                text:sources.toFixed(2)+"MW",
                                verticalAlign: 'middle'
                            },
                            plotOptions: {
                                states: {
                                inactive: {
                                    opacity: 1
                                }
                                },
                                series: {
                                    animation: false
                                },
                                pie: {
                                    innerSize: '70%'
                                }
                            },
                            series: [{
                                data: temp}]
                        })
                    } else {
                        trans()
                        var chartDiv = document.getElementById("pieGrid")
                        Highcharts.chart(chartDiv, {
                            chart: {
                                type: 'bar'
                            },
                            plotOptions: {
                                states: {
                                inactive: {
                                    opacity: 1
                                }
                                },
                                series: {
                                    animation: false
                                },
                                bar: {
                                    dataLabels: {
                                        enabled: true
                                    }
                                }
                            },
                            xAxis:{
                                categories:tempcent.map(i=>i[0])
                            },
                            yAxis:{
                                labels: {
                                    formatter: function () {
                                      return this.value + '%';
                                    }
                                }
                            },
                            legend: {
                                layout: 'vertical',
                                align: 'right',
                                verticalAlign: 'top',
                                x: -40,
                                y: 80,
                                floating: true,
                                borderWidth: 1,
                                backgroundColor:
                                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                                shadow: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                data: tempcent}]
                        });
                }
                Highcharts.ajax({
                    url: 'unique_trans.json',
                    dataType: Text,
                    success:function (activity){
                        activity=JSON.parse(activity)
                        const arr= [activity[overall]]
                        console.log(arr);
                        gater=arr.map(i =>{return({name: overall, type: 'line', data: [i['pace'], 
                        i['shooting'], i['passing'], i['dribbling'], i['defending'], i['physic']]})})
                        const lab=['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic']
                
                        var chartDiv = document.getElementById("container2")
                        Highcharts.chart(chartDiv, {
                
                            chart: {
                                polar: true
                            },
                        
                            title: {
                                text: 'polar chart by rating'
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
                            exporting: {
                                sourceWidth: 800,
                                sourceHeight: 600
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
                }
            }
            }
        }
    );
});

var checkbox = document.querySelector('input[name="toggle"]');
checkbox.addEventListener('change', function() {
    if(this.checked) {
        trans()
        var chartDiv = document.getElementById("pieGrid")
        Highcharts.chart(chartDiv,{
            chart: {
                type: 'pie'
            },
            plotOptions: {
                states: {
                inactive: {
                    opacity: 1
                }
                },
                series: {
                    animation: false
                },
                pie: {
                    innerSize: '70%'
                }
            },
            series: [{
                data: curr}]
        });
    } 
})
var off = document.getElementById("toggle-off");
off.addEventListener('change', function() {
    console.log(off.checked)
    if(this.checked) {
        trans()
        var chartDiv = document.getElementById("pieGrid")
        Highcharts.chart(chartDiv, {
            chart: {
                type: 'bar'
            },
            plotOptions: {
                states: {
                inactive: {
                    opacity: 1
                }
                },
                series: {
                    animation: false
                },
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            xAxis:{
                categories:curr2.map(i=>i[0])
            },
            yAxis:{
                labels: {
                    formatter: function () {
                      return this.value + '%';
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                data: curr2}]
        });
    } 
})
let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition');
    }, 1000)
}

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    event = this.series.chart.pointer.normalize(event);
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(
                        e.min,
                        e.max,
                        undefined,
                        false,
                        { trigger: 'syncExtremes' }
                    );
                }
            }
        });
    }
}







var colors = Highcharts.getOptions().colors;
var chartDiv = document.createElement('div');
chartDiv.className = 'grid-item';
document.getElementById('container').appendChild(chartDiv);
Highcharts.chart(chartDiv, {

    chart: {
        type: 'streamgraph',
        marginBottom: 30,
        zoomType: 'x'
    },

    // Make sure connected countries have similar colors
    colors: [
        colors[0],
        colors[1],
        colors[2],
        colors[3],
        colors[4],
    ],

    title: {
        floating: true,
        align: 'left',
        text: 'Attribute Ratings across Overall Ratings'
    },
    subtitle: {
        floating: true,
        align: 'left',
        y: 30,
        text: 'Source: <a href="https://www.kaggle.com/karangadiya/fifa19">FIFA19 Dataset</a>'
    },

    xAxis: {
        crosshair: {
            width: 3,
            color:"#CA5131"
        },
        events: {
            setExtremes: syncExtremes
        },
        categories: [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 93, 94]

    },

    yAxis: {
        visible: false,
        startOnTick: false,
        endOnTick: false
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                minFontSize: 5,
                maxFontSize: 15,
                style: {
                    color: 'rgba(255,255,255,0.75)'
                }
            }
        }
    },

    // Data parsed with olympic-medals.node.js
    series: [{
        name: 'attack',
        data: [70.91, 71.48, 72.6, 73.89, 74.05, 75.66, 76.38, 78.95, 78.66, 78.4, 76.67, 81.0, 83.07, 78.2, 87.4, 86.6]
    }, {
        name: 'skill',
        data: [65.93, 67.63, 68.73, 69.56, 69.06, 70.47, 72.26, 76.05, 75.66, 74.8, 82.8, 78.07, 80.77, 81.0, 83.0, 94.4]
    }, {
        name: 'movement',
        data: [72.24, 71.79, 74.97, 73.1, 75.95, 73.41, 77.6, 68.85, 75.11, 80.4, 85.6, 81.4, 82.87, 91.4, 86.8, 91.6]
    }, {
        name: 'power',
        data: [74.87, 73.57, 75.42, 75.61, 75.8, 76.75, 76.29, 74.85, 76.86, 79.13, 70.27, 80.4, 82.1, 78.2, 89.2, 78.2]
    }, {
        name: 'mentality',
        data: [65.08, 66.34, 66.79, 68.21, 67.77, 70.4, 69.04, 73.46, 70.5, 74.72, 69.83, 74.5, 75.89, 77.0, 74.83, 74.5]
    }],

    exporting: {
        sourceWidth: 800,
        sourceHeight: 600
    }

});


// Chart 2
Highcharts.ajax({
    url: 'spider.json',
    dataType: Text,
    success:function (activity){
        activity=JSON.parse(activity)
        const arr=[activity['0']]
        gater=arr.map(i =>{return({name: 0, type: 'line', data: [0, 
        0, 0, 0, 0, 0]})})
        const lab=['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic']

        var chartDiv=document.createElement('div');
        chartDiv.className = 'grid-item';
        document.getElementById('container2').appendChild(chartDiv);
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
            exporting: {
                sourceWidth: 800,
                sourceHeight: 600
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


