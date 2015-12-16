var viz = function ($element, layout, _this) {

    var id = senseUtils.setupContainer($element, layout, "d3vl_donut"),
        ext_width = $element.width(),
        ext_height = $element.height();

    var data = layout.qHyperCube.qDataPages[0].qMatrix;

    var sumData = 0;

    data.forEach(function (d) {
        sumData = sumData + d.measure(1).qNum;
    });


    var width = ext_width,
        height = ext_height,
        radius = Math.min(width, height) / 2,
        labelr = radius - 40;

    var color = d3.scale.ordinal()
        //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        .range(["#0F6DD9", "#E36677"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 50)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.measure_cumulative;
        });

    var svg = d3.select("#" + id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    data.forEach(function (d) {
        d.measure_cumulative = +d.measure(1).qNum;
    });
    /*
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
            });*/

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.dim(1).qText);
        })
        .style("stroke-width", "2px")
        .style("stroke", "white")
        .on("click", function (d) {
            d.data.dim(1).qSelect();
        })
        .on('mouseover', function (d) {
            var nodeSelection = d3.select(this).style({
                opacity: '0.5'
            });
            nodeSelection.select("text").style({
                opacity: '1.0'
            });
            d3.select(this).style("stroke", "black");
        })
        .on('mouseout', function (d) {
            var nodeSelection = d3.select(this).style({
                opacity: '1.0'
            });
            nodeSelection.select("text").style({
                opacity: '0.5'
            });
            d3.select(this).style("stroke", "white");
        });

    g.append("text")
        .attr("transform", function (d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * labelr) + ',' +
                (y / h * labelr) + ")";
        })
        .attr("class", "text")
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
            return (d.endAngle + d.startAngle) / 2 > Math.PI ?
                "end" : "start";
        })
        .text(function (d, i) {
            return Math.round((data[i].measure(1).qNum / sumData) * 100) + "%";
        })
        .on("click", function (d) {
            d.data.dim(1).qSelect();
        });

    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius - 70)
        .attr("fill", "#fff");

    svg.append("text")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#36454f")
        .text(function (d) {
            return Math.round(sumData);
        });
}
