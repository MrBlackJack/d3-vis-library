define(["jquery", "./js/d3.min", "./js/senseD3utils", "./js/senseUtils", "./js/heatmap.min", "./library/contents"],
    function ($, d3, d3utils, senceUtils, heat, contents) {
        'use strict';

        //Accessing requirejs semi-private API - This might break in future versions of require.
        var base = requirejs.s.contexts._.config.baseUrl + requirejs.s.contexts._.config.paths.extensions

        //Load external CSS instead of inlining to work in desktop/server/mashups
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: base + "/d3-vis-library/d3-vis-library.css"
        }).appendTo("head");


        var GeneralSection = {
            uses: "settings",
            items: {
                GeneralSetting: {
                    type: "items",
                    label: "Общие настройки",
                    items: {
                        ChartDropDown: {
                            type: "string",
                            component: "dropdown",
                            label: "Chart",
                            ref: "chart",
                            options: content_options,
                            defaultValue: 1
                        },
                        ResponsiveCheckbox: {
                            type: "boolean",
                            component: "switch",
                            label: "Responsive",
                            ref: "responsive",
                            options: responsive_options,
                            defaultValue: true
                        }
                    }
                }
            }
        };

        //BackgroundImage
        var BackgroundImage = {
            type: "boolean",
            component: "switch",
            label: "Показывать фон",
            ref: "ShowBackground",
            options: back_options,
            defaultValue: true
        };

        //autoX
        var autoX = {
            type: "boolean",
            component: "switch",
            label: "Авто диапазон",
            ref: "autoX",
            options: autoX_options,
            defaultValue: false
        };

        //max x coord
        var MaxX = {
            type: "number",
            label: "Max X",
            ref: "MaxX"
        };

        //min x coord
        var MinX = {
            type: "number",
            label: "Min x",
            ref: "MinX"
        };

        //autoY
        var autoY = {
            type: "boolean",
            component: "switch",
            label: "Авто диапазон",
            ref: "autoY",
            options: autoY_options,
            defaultValue: false
        };

        //max y coord
        var MaxY = {
            type: "number",
            label: "Max Y",
            ref: "MaxY"
        };

        //min y coord
        var MinY = {
            type: "number",
            label: "Min Y",
            ref: "MinY"
        };


        var TwoDimensionScatter = {
            component: "expandable-items",
            label: "Two dimension scatter",
            items: {
                GenaralSetting: {
                    type: "items",
                    label: "Общие настройки",
                    items: {
                        BackgroundImage: BackgroundImage
                    }
                },
                X: {
                    type: "items",
                    label: "Ось X",
                    items: {
                        autoX: autoX,
                        MinX: MinX,
                        MaxX: MaxX
                    }
                },
                Y: {
                    type: "items",
                    label: "Ось Y",
                    items: {
                        autoY: autoY,
                        MinY: MinY,
                        MaxY: MaxY
                    }
                }
            }
        }

        var lastUsedChart = -1;
        return {
            initialProperties: {
                version: 1.0,
                qHyperCubeDef: {
                    qDimensions: [],
                    qMeasures: [],
                    qInitialDataFetch: [{
                        qWidth: 6,
                        qHeight: 1500
     }]
                }
            },
            definition: {
                type: "items",
                component: "accordion",
                items: {
                    dimensions: {
                        uses: "dimensions",
                        min: 0
                    },
                    measures: {
                        uses: "measures",
                        min: 0
                    },
                    sorting: {
                        uses: "sorting"
                    },
                    apperance: GeneralSection,
                    TwoDimScat: TwoDimensionScatter
                }
            },
            snapshot: {
                canTakeSnapshot: true
            },
            paint: function ($element, layout) {
                var self = this;

                // Responsive: change between multi-dim bar chart types
                if (typeof layout.responsive == 'undefined') {
                    layout.responsive = true;
                }
                if (layout.responsive) {
                    if ((layout.chart == 2) || (layout.chart == 3) || (layout.chart == 4)) {
                        var w = $element.width();

                        if (w <= 640) {
                            layout.chart = 4;
                        } else if (w <= 1024) {
                            layout.chart = 3;
                        } else {
                            layout.chart = 2;
                        }
                    }
                }

                senseUtils.extendLayout(layout, self);
                var dim_count = layout.qHyperCube.qDimensionInfo.length;
                var measure_count = layout.qHyperCube.qMeasureInfo.length;

                if ((dim_count < charts.filter(function (d) {
                        return d.id === layout.chart
                    })[0].min_dims || dim_count > charts.filter(function (d) {
                        return d.id === layout.chart
                    })[0].max_dims) || measure_count < charts.filter(function (d) {
                        return d.id === layout.chart
                    })[0].measures) {
                    $element.html("This chart requires " + charts.filter(function (d) {
                        return d.id === layout.chart
                    })[0].min_dims + " dimensions and " + charts.filter(function (d) {
                        return d.id === layout.chart
                    })[0].measures + " measures.");
                } else {
                    $element.html("");

                    if (layout.chart != lastUsedChart) {
                        // Determine URL based on chart selection
                        var src = charts.filter(function (d) {
                            return d.id === layout.chart
                        })[0].src;

                        var url = base + "/d3-vis-library/library/" + src;

                        // Load in the appropriate script and viz
                        jQuery.getScript(url, function () {
                            viz($element, layout, self, heat);
                            lastUsedChart = layout.chart;
                        });


                    } else {
                        viz($element, layout, self, heat);
                    }

                }

            },
            resize: function ($el, layout) {
                this.paint($el, layout);
            }
        };

    });


// Helper functions
function getLabelWidth(axis, svg) {
    // Create a temporary yAxis to get the width needed for labels and add to the margin
    svg.append("g")
        .attr("class", "y axis temp")
        .attr("transform", "translate(0," + 0 + ")")
        .call(axis);

    // Get the temp axis max label width
    var label_width = d3.max(svg.selectAll(".y.axis.temp text")[0], function (d) {
        return d.clientWidth
    });

    // Remove the temp axis
    svg.selectAll(".y.axis.temp").remove();

    return label_width;
}
