var viz = function ($element, layout, _this, h) {

    var id = senseUtils.setupContainer($element, layout, "d3vl_heatmapJS");

    var ext_width = $element.width();
    var ext_height = $element.width();


    var width = /*$element.width() - margin.left - margin.right*/ ext_width;
    var height = /*$element.height() - margin.top - margin.bottom*/ ext_height;

    var extension = d3.select("#" + id).append("div")
        .attr("id", "HeatMap")
        .attr("class", "div-heatmap")
        .attr("style", "position: relative;")
        .attr("width", width)
        .attr("height", height);

    //Background image
    var urlImage = requirejs.s.contexts._.config.baseUrl + requirejs.s.contexts._.config.paths.extensions + "/d3-vis-library/images/rink.svg";

    extension.append("img")
        .attr("class", "img-heatmap")
        .attr("src", urlImage);

    extension.append("canvas")
        .attr("id", "cnv")
        .attr("class", "cnv-heatmap")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "position: absolute; left: 0px; top: 0px;");

    console.log('w: ' + width);
    console.log('h: ' + height);

    /*Real shit*/
    var data = layout.qHyperCube.qDataPages[0].qMatrix;
    var heatmapInstance = h.create({
        container: document.getElementById("HeatMap")//,
        /*maxOpacity: .25,
        minOpacity: 0,
        blur: .75*/
    });

    //heatmapInstance.configure(Config);

    var maxValue = d3.max(data, function (d) {
        return +d.measure(1).qNum;
    });

    var max = 0;
    var objdata = data.map(function (d) {
        var val = d[3].qNum;
        var rad = Math.floor(val / maxValue);
        var x = Math.floor((width / 30) * d[1].qNum);
        var y = Math.floor((height / 60) * d[2].qNum);

        max = Math.max(max, val);

        return {
            x: x,
            y: y,
            value: val,
            radius: rad
        }
    });

    var hData = {
        max: max,
        data: objdata
    };

    heatmapInstance.setData(hData);

    //var cnv = document.getElementById("cnv");
    //var ctx = cnv.getContext("2d");
    //ctx.rotate(360 * Math.PI / 180);

    /*Random shit*/
    /*
    var objdata = .map(function (d) {
        return {
            value: d[3].qNum,
            y: d[2].qNum * 100,
            x: d[1].qNum * 100
        }
    });

    var obj = {
        data: tdata
    }*/


    /*
    var points = [];
    var max = 0;
    var width = 1024;
    var height = 742;
    var len = 500;

    while (len--) {
        var val = Math.floor(Math.random() * 100);
        var radius = Math.floor(Math.random() * 70);

        max = Math.max(max, val);
        var point = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            value: val,
            radius: radius
        };
        points.push(point);
    }
    var testData = {
        max: max,
        data: points
    };

    heatmapInstance.setData(testData);
    */
}
