let margin = { left: 300, right: 100, up: 300, down: 100 };
let gap_between_views = 150;
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let selectedValue;
let activeData;
let theMonth = "May";
//third assignment:final

var rowConverter = function (d) {
    return {
        end: parseInt(d.end),
        latitude: parseFloat(d.latitude),
        longitude: parseFloat(d.longitude),
        month: d.month,
        start: parseInt(d.start),
        station: d.station,
        tripdurationE: parseFloat(d.tripdurationE),
        tripdurationS: parseFloat(d.tripdurationS)

    };
}


d3.csv('citi_bike_2020.csv', rowConverter).then(function (data) {

    //this is the scatterplot
    //1. construct the xy axis
    var svg = d3.select('svg')
    var margin = { left: 300, right: 100, up: 300, down: 100 };
    var width = svg.attr("width") - margin.left;
    var height = svg.attr("height") - margin.up - margin.down;
    var scatterplot = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    let xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, (d) => d.tripdurationS)])
        .nice();

    let yScale = d3.scaleLinear()
        .range([height / 2, 0])
        .domain([0, d3.max(data, (d) => d.tripdurationE)])
        .nice();

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale)
        .ticks(5);

    scatterplot.append('g')
        .attr("transform", "translate(0," + (height) / 2 + ")")
        .attr('class', 'x-axis')
        .call(xAxis);

    scatterplot.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);



    //2. add division for tooltip

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("transform", "translate(100,100)")
        .style("opacity", 0);

    plotdots(theMonth);
    scatterplot.selectAll(".circle")
        .on('mouseover', Mouseover)
        .on('mouseout', Mouseout)

    //adding axis-lables

    plotScatterAxis();

    /////construct the bar chart//////////////////////////////////////////

    let barchart = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + (100 + 70 + height / 2) + ")")

    let dataset = data.filter(d => d.month == theMonth).sort(function (a, b) {
        return d3.descending(a.start, b.start)
    })

    let x1Scale = d3
        .scaleBand()
        .domain(dataset.map(function (d) { return d.station; }))
        .range([0, width]);
    let y1Scale = d3.scaleLinear()
        .range([height / 2, 0])
        //.domain([0, d3.max(data, (d)=> d.tripdurationS)])
        .nice();

    x1Scale.domain(dataset.map(function (d) { return d.station; }));
    y1Scale.domain([0, 4000]);


    //draw axis
    barchart.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.axisBottom(x1Scale))
        .selectAll("text")
        .style("font", "7px sans-serif")
        .attr("transform", "rotate(-70)")
        .attr("y", 4)
        .attr("x", -8)
        .attr("dy", ".35em")
        .style("text-anchor", 'end');


    barchart.append("g")
        .call(d3.axisLeft(y1Scale).ticks(5))

    //axis lable for graph2

    barChartLabel()

    drawBarChart(x1Scale, y1Scale)

    function barMouseOver(i, d) {
        activeData = [d.station, d.month];
        // let background = scatterplot.append("rect")
        //             .attr("x", 0)
        //             .attr("y", 0)
        //             .attr("width", width)
        //             .attr("height", height / 2)
        //             .style("opacity", 0.6)
        //             .classed("background", true)
        //             .moveToBack();

        scatterplot.selectAll(".circle")
            .classed("highlight", function (d,i) {
                return (d.station == activeData[0] && d.month == activeData[1])
            });


            
        scatterplot.selectAll(".circle.highlight")
        
        .attr('r', '10')
        .raise();
        let background = scatterplot.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", height / 2)
                    .style("opacity", 0.6)
                    .classed("background", true)
                    .moveToBack();
    }

    function barMouseOut(d) {
        
        scatterplot.selectAll(".circle.highlight")
            .classed("highlight", false).attr("r",'5');
        
            d3.select(".background").remove();
    }

    //linked chart
    barchart.selectAll(".bar").on('mouseover', barMouseOver)
        .on('mouseout', barMouseOut);



    //bar chart end//////////////////////////////////////////

    /////////slider begins////////////////////////////////////////
    //2.4begins
    var sliderTime = d3.select("#slider")
    sliderTime.on("input", function (d) {
        //console.log(document.getElementById("slider").value)
        theMonth = this.value;
        theMonth = month[this.value - 1]

        //console.log(theMonth);
        erasePlots();
        plotdots(theMonth);
        eraseBars()
        drawBarChart(x1Scale, y1Scale)

        updateText()

    })

    function updateText() {
        console.log(document.getElementById("slidertext").value);
        document.getElementById("slidertext").value = theMonth
        //let text = d3.select("#slidertext").text(theMonth)
        console.log();
    }
    //////function:
    function erasePlots() {
        d3.selectAll("circle").remove();
    }
    function eraseBars() {
        d3.selectAll("rect").remove();
    }

    function drawBarChart(x1Scale, y1Scale) {

        dataset = data.filter(d => d.month == theMonth).sort(function (a, b) {
            return d3.descending(a.start, b.start)
        });

        x1Scale = d3
            .scaleBand()
            .domain(dataset.map(function (d) { return d.station; }))
            .range([0, width]);
        x1Scale.domain(dataset.map(function (d) { return d.station; }));

        barchart.selectAll(".bar")
            .data(dataset)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x1Scale(d.station); })
            .attr("y", function (d) { return y1Scale(d.start); })
            .attr("width", x1Scale.bandwidth())
            .attr("height", function (d) { return height / 2 - y1Scale(d.start); })
            .on('mouseover', barMouseOver)
            .on('mouseout', barMouseOut);

    }
    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
    function Mouseover(event, d) {

        

        // let newCircle = scatterplot.append("circle").datum(d).classed("circle", true)
        //     .attr("cx", d => xScale(d.tripdurationS))
        //     .attr('cy', d => yScale(d.tripdurationE))
        //     .attr('r', '5')
        //     .on('mouseover', function (event, d) {
                d3.select(this).raise();
                let background = scatterplot.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", height / 2)
                    .style("opacity", 0.6)
                    .classed("background", true)
                    .moveToBack();
                activeData = [d.station, d.month];
                d3.select(this).classed("selected", true)

                    .transition().duration(200).attr('r', '10');

                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(d.station)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                barchart.selectAll("rect")
                    .classed("highlight", function (d, i) {
                        return (d.station == activeData[0] && d.month == activeData[1])
                    });

            // })
            // .on("mouseout", function (event, d) {
            //     d3.select(this).classed("selected", false)
            //         .transition().duration(200).attr('r', '5')
            //         .remove();
            //     barchart.selectAll("rect")
            //         .classed("highlight", false);
            //     div.transition()
            //         .duration(500)
            //         .style("opacity", 0);
            // })



    }

    /////////////functions:
    function plotdots(theMonth) {
        scatterplot.selectAll('.point')
            .data(data.filter(d => d.month == theMonth)
                .sort(function (a, b) {
                    return (a.start - b.start);
                }))
            .enter().append('circle')
            .attr('class', "circle")
            .attr("cx", d => xScale(d.tripdurationS))
            .attr('cy', d => yScale(d.tripdurationE))
            .attr('r', '5')
            .on("mouseover", Mouseover)
            .on("mouseout", Mouseout)


    }

    function Mouseout(event, d) {

        d3.select(".background").remove();

        div.transition()
            .duration(500)
            .style("opacity", 0);

        d3.select(this).
            classed("selected", false).
            transition().
            duration(200).
            attr('r', '5');

        barchart.selectAll("rect")
            .classed("highlight", false);
    }


    function plotScatterAxis() {



        scatterplot.append('g')
            .attr("class", 'axis-lable')
            .attr('transform', 'translate(20,' + (80) + ')')
            .append("text")
            .style("text-anchor", 'middle')
            .attr('transform', 'rotate(270)')
            .text("Trip duration end in")

        scatterplot.append('g')
            .attr("class", 'axis-lable')
            .attr('transform', 'translate(' + (width - 30) + ',' + (height / 2 - 10) + ')')
            .append("text")
            .style("text-anchor", 'middle')
            .text("Trip duration start from")
    }

    function barChartLabel() {
        barchart.append('g')
            .attr("class", 'axis-lable')
            .attr('transform', 'translate(80,' + (-10) + ')')
            .append("text")
            .style("text-anchor", 'end')
            .text("bikers start from")
    }


});

