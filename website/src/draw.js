import d3 from 'd3';
import nv from 'nvd3';

/**
 * draw star history graph based on data
 * @param {String} sample: [{key:'tj/koa', values:[{x:'2016-6-12', y:12}, ...]}, ...]
 */
export default function draw(data) {
  nv.addGraph(function() {
    const chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .color(d3.scale.category10().range());

    chart.xAxis
      .tickFormat(function(d) {
        return d3.time.format('%x')(new Date(d))
      });

    chart.yAxis
      .axisLabel('Github Stars')
      .tickFormat(d3.format('d'));

    d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}