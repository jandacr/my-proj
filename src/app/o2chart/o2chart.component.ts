import {Component, Directive, Input, OnInit, Inject, ElementRef } from '@angular/core';
import {Output, OnChanges, SimpleChange} from '@angular/core';
import {O2Common, O2LegendData, O2ScatterPlotData, O2StackBarData, O2LineData, O2IdValueData} from './shared/o2common';
import {ChartConst} from './shared/chart-const';
import * as d3  from 'd3';

@Component({
    selector: 'o2-chart'
})


@Directive({
  selector: 'o2-chart'
})
export class O2ChartComponent implements OnInit, OnChanges {
@Input() chartType: string;
@Input() svgWidth: string;
@Input() svgHeight: string;
@Input() graphData: Array<number>;
@Input() configData: any;


root: any;

  constructor( elementRef: ElementRef ) {
      console.log('el:HTMLElement-------------------');
      let el: HTMLElement    = elementRef.nativeElement;
      this.root = d3.select(el);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let svgWidth = parseInt(this.svgWidth);
    let svgHeight = parseInt(this.svgHeight);
    let dataSet = this.graphData;
    let configData = this.configData;
    let chartType = this.chartType;
    let svgContainer = this.root.append('svg')
              .attr('width', svgWidth)
              .attr('height', svgHeight);

    console.log(chartType);
    switch (chartType) {
      case ChartConst.LINE_CHART_TYPE_NAME:
        this.buildLine(svgContainer, configData, dataSet, svgWidth, svgHeight);
        break;
      case ChartConst.BAR_CHART_TYPE_NAME:
        this.buildBar(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.PIE_CHART_TYPE_NAME:
        this.buildPie(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.SCATTER_PLOT_CHART_TYPE_NAME:
        this.buildScatterPlot(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.HISTOGRAM_CHART_TYPE_NAME:
        this.buildHistogram(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.STACK_BAR_CHART_TYPE_NAME:
        this.buildStackBar(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.GEO_MAP_CHART_TYPE_NAME:
        this.buildGeoMap(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.GEO_ORTHOGRAPHIC_CHART_TYPE_NAME:
        this.buildGeoOrthographic(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.TREE_CHART_TYPE_NAME:
        this.buildTree(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.PACK_LAYOUT_CHART_TYPE_NAME:
        this.buildPackLayout(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.CHOROPLETH_CHART_TYPE_NAME:
        this.buildChoropleth(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;

      case ChartConst.FORCE_CHART_TYPE_NAME:
        this.buildForce(svgContainer, configData, dataSet, svgWidth, svgHeight );
        break;
      case ChartConst.TREE_MAP_CHART_TYPE_NAME:
        //  this.buildTreeMap(svgContainer,configData, dataSet,svgWidth,svgHeight );
        break;
      case ChartConst.SANKEY_CHART_TYPE_NAME:
        //  this.buildSankey(svgContainer,configData, dataSet,svgWidth,svgHeight );
        break;

      default:
        ;
    }

  }



    private buildHistogram(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildHistogram-------------------');

        let dataSet = dataSetJson.data;
        let _binNumber = dataSetJson.bins.length - 1;

        let _maxY = 300; // dummy number

        let _maxX = dataSetJson.range[1];
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);
        let _graphWidth = cdt.graphWidth;
        let _graphHeight = cdt.graphHeight;
        let _maxYValue = cdt.maxYValue;
        let _graphXScale = cdt.graphXScale;
        let _graphInitX = cdt.graphInitXPos;
        let _graphInitY = cdt.graphInitYPos;

        let _titleDisplay = configData.title.display;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;
        let _gridYDisplay = configData.grid.y.display;
        let _marginLeft = configData.margin.left;
        let _marginTop = configData.margin.top;
        let _className = configData.className.histogramBar;


        let _dataSet: Array<number> = new Array();
        for (let i in dataSet) {
            if (dataSet.hasOwnProperty(i)) {
                let _num = dataSet[i] / _maxX;
                _dataSet.push(_num);
            }
        }

        let formatCount = d3.format(',.0f');

        let _histgramContainer = svgContainer
                        .append('g')
                        .attr('transform', 'translate(' + _graphInitX + ',' + _graphInitY + ')');

        let _xScale = d3.scaleLinear()
            .rangeRound([0, _graphWidth]);

        let bins = d3.histogram()
            .domain([0, 1])
            .thresholds(_xScale.ticks(_binNumber))
            (_dataSet);


        let _yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, (d: any) => {
                return d.length;
            })])
            .range([_graphHeight, 0]);

        let bar = _histgramContainer
            .selectAll('.bar')
            .data(bins)
            .enter()
            .append('g')
            .attr('class', _className)
            .attr('transform', (d: any) => {
                return 'translate(' + _xScale(d.x0) + ',' + _yScale(d.length) + ')';
            });

        if (_animation) {
            bar.append('rect')
                .attr('x',  1)
                .attr('width', _xScale(bins[0].x1) - _xScale(bins[0].x0) - 1)
                .attr('height', 0)
                .transition()
                .duration(_animationDuration)
                .attr('height', (d: any) => {
                    return _graphHeight - _yScale(d.length);
                });
        } else {
            bar.append('rect')
                .attr('x', 1)
                .attr('width', _xScale(bins[0].x1) - _xScale(bins[0].x0) - 1)
                .attr('height', (d: any) => {
                    return _graphHeight - _yScale(d.length);
                });
        }

        bar.append('text')
            .attr('dy', '.75em')
            .attr('y', 6)
            .attr('x', (_xScale(bins[0].x1) - _xScale(bins[0].x0)) / 2)
            .attr('text-anchor', 'middle')
            .text((d: any) => {
                return formatCount(d.length);
            });

        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }
        // ------------------------------------
        // ---CALL buildAxis-----------------
        this.buildYAxis(cdt);

        this.buildXAxis(cdt);

         if (_gridYDisplay) {
            this.drawYGrid(cdt);
        }
    }



    private buildForce(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('In  buildFoce----------------');

        let _maxX = 0;
        let _maxY = 0;
        _maxY = 100;
        _maxX = 100;
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _color = cdt.defaultColorFunc;
        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;
        let _centerPos = cdt.graphCenterPos;
        let _graphHeight = cdt.graphHeight;
        let _graphWidth = cdt.graphWidth;

        let _marginLeft = configData.margin.left;
        let _marginTop = configData.margin.top;


        let simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((d: any) => {
                return d.id;
            }))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(_graphWidth / 2, _graphHeight / 2));


        let _forceContainer = svgContainer
          .append('g')
          .attr('transform',
            'translate(' + _marginLeft + ',' + _marginTop + ')');

        let link = _forceContainer.append('g')
            .attr('class', 'force-links')
            .selectAll('line')
            .data(dataSetJson.links)
            .enter()
            .append('line')
            .attr('stroke-width', (d: any) => {
                return Math.sqrt(d.value);
            });

        let node = _forceContainer.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(dataSetJson.nodes)
            .enter()
            .append('circle')
            .attr('r', 5)
            .attr('fill', (d: any) => {
                return _color(d.group);
            })
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

            node.append('title')
                .text((d: any) => {
                    return d.id;
                });

        simulation
            .nodes(dataSetJson.nodes)
            .on('tick', ticked);

        let _forceLink: any = simulation.force('link');
        _forceLink.links(dataSetJson.links);

        function ticked() {
            link
                .attr('x1', (d: any) => { return d.source.x; })
                .attr('y1', (d: any) => { return d.source.y; })
                .attr('x2', (d: any) => { return d.target.x; })
                .attr('y2', (d: any) => { return d.target.y; });

            node
                .attr('cx', (d: any) => { return d.x; })
                .attr('cy', (d: any) => { return d.y; });
        }

        function dragstarted(d: any)  {
            if (!d3.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d: any)  {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d: any)  {
            if (!d3.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        }

        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        let _legendDataSet: Array<O2LegendData> = new Array();
        for (let i in dataSetJson.groups) {
            if (dataSetJson.groups.hasOwnProperty(i)) {
                let _id = dataSetJson.groups[i].id;
                _legendDataSet.push(new O2LegendData(dataSetJson.groups[i].name, _color(_id)));
            }
        }
        this.buildLegend(cdt, _legendDataSet);



    }




    private buildChoropleth(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildChoropleth -------------------');

        let _maxX = 100; // any value
        let _maxY = 100; // any value
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);
        let _graphCenterPos = cdt.graphCenterPos;
        let _graphInitX = cdt.graphInitXPos;
        let _graphInitY = cdt.graphInitYPos;


        let _titleDisplay = configData.title.display;
        let _legendDisplay = configData.legend.display;
        let _focusColor = configData.color.focusColor;

        let _scale = dataSetJson.map.scale;
        let _targetName = dataSetJson.map.targetName;
        let _keyDataName = dataSetJson.map.keyDataName;
        let _keyName = 'data.' + _keyDataName;
        let _geoMapDataUrl = dataSetJson.map.baseGeoDataUrl;
        let _startColor = dataSetJson.map.startColor;
        let _endColor = dataSetJson.map.endColor;
        let _colorNum = dataSetJson.map.colorNumber;
        let _center = dataSetJson.map.center;
        let _targetPropertyName = dataSetJson.map.targetPropertyName;
        let _targetProperty = 'd.' + _targetPropertyName;

        let color = d3.interpolateHsl(_startColor, _endColor);

        let _max = dataSetJson.data[0].value;
        let _min = dataSetJson.data[0].value;
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                if (_max < dataSetJson.data[i].value) {
                    _max = dataSetJson.data[i].value;
                }
                if (_min > dataSetJson.data[i].value) {
                    _min = dataSetJson.data[i].value;
                }
            }
        }
        let _range = _max - _min;
        let _step = _range / (_colorNum - 1);

        let _findColorById = (id: number): string => {
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    if (id === dataSetJson.data[i].id) {
                        let _value = dataSetJson.data[i].value;
                        let _rate = Math.ceil((_value - _min) / _step);
                        return color(_rate / _max);
                    }
                }
            }
        };

        let path = d3.geoPath()
                    .projection(
                        d3.geoMercator()
                        .center(_center)
                        .scale(_scale)
                        .translate(_graphCenterPos)
                    );

        d3.json(_geoMapDataUrl, (error, data) => {
            svgContainer.selectAll('path')
                    .data(eval(_keyName))
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .style('fill', (d: any, i: number) =>  {
                        let _cl = _findColorById(eval(_targetProperty));
                        return _cl;
                    });
        });

        // ------------------------------------
        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }

        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i = 0; i < _colorNum; i++) {
                let _label = String(_min + (i * _step)) +  ' --';
                _legendDataSet.push(new O2LegendData(_label, color(i / _max)));
            }
            this.buildLegend(cdt, _legendDataSet);
        }

    }

    private buildPackLayout(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in PackLayout------------------');

        let _packlayoutClass = configData.className.packlayout;
        let _packlayoutLabelClass = configData.className.packlayoutLabel;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        //  let color = d3.scale.category10();
        let bubble = d3.pack()
                        .size([svgWidth, svgHeight]);

        let nodes0 = d3.hierarchy(dataSetJson);

        let pack =  svgContainer.selectAll('g')
                    .data(bubble(nodes0).descendants())
                    .enter()
                    .append('g')
                    .attr('transform', (d: any, i: number) =>  {
                        return 'translate(' + d.x + ',' + d.y + ')';
                    });

        let _circle = pack.append('circle');
        if (_animation) {
            _circle.attr('r', 0)
                    .transition()
                    .duration((d: any, i: number) =>  {
                        return d.depth * _animationDuration  + 500;
                    })
                    .attr('r', (d: any) => {
                        return d.r;
                    })
                    .style('fill', (d: any, i: any) =>  {
                        return color(i);
                    });
        } else {
            _circle.attr('r', (d: any) => {
                        return d.r;
                    })
                    .style('fill', (d: any, i: any) =>  {
                        return color(i);
                    });
        }

        let _text = pack.append('text')
                    .attr('class', _packlayoutLabelClass)
                    .text((d: any, i: number) =>  {
                        if (d.depth === 1) {
                            return d.data.name;
                        }
                        return null;
                    });

        if (_animation) {
            _text.style('opacity', 0)
                .transition()
                .duration(_animationDuration)
                .style('opacity', 1.0);
        } else {
            _text.style('opacity', 1.0);
        }

    }



    private buildTree(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('In  buildTree----------------');

        let _maxX = 0;
        let _maxY = 0;
        _maxY = 100;
        _maxX = 100;
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _color = cdt.defaultColorFunc;
        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;
        let _graphHeight = cdt.graphHeight;
        let _graphWidth = cdt.graphWidth;

        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;
        let _treemapClass = configData.className.treemap;
        let _treemapLabelClass = configData.className.treemapLabel;
        let _marginLeft = configData.margin.left;
        let _marginTop = configData.margin.top;


        let tree = d3.tree()
                        .size([_graphWidth, _graphHeight]);

        let nodes0 = d3.hierarchy(dataSetJson);

        let nodes = tree(nodes0);

        let _treeContainer = svgContainer
          .append('g')
          .attr('transform',
            'translate(' + _marginLeft + ',' + _marginTop + ')');

        let link = _treeContainer
            .selectAll('.link')
            .data( nodes.descendants().slice(1))
            .enter()
            .append('path')
            .attr('class', 'tree-node-link')
            .attr('d', (d: any) => {
                return 'M' + d.x + ',' + d.y
                    + 'C' + d.x + ',' + (d.y + d.parent.y) / 2
                    + ' ' + d.parent.x + ',' +  (d.y + d.parent.y) / 2
                    + ' ' + d.parent.x + ',' + d.parent.y;
                }
            );

        let node = _treeContainer
            .selectAll('.node')
            .data(nodes.descendants())
            .enter()
            .append('g')
            .attr('class', (d: any) => {
                return 'tree-node' +
                (d.children ? '-internal' : '-leaf');
            })
            .attr('transform', (d: any) => {
                return 'translate(' + d.x + ',' + d.y + ')';
            });

        node.append('circle')
            .attr('r', 10);

        node.append('text')
            .attr('dy', '.35em')
            .attr('y', (d: any) => {
                return d.children ? -20 : 20;
            })
            .style('text-anchor', 'middle')
            .text((d: any) => {
                return d.data.name;
            });


  }



    private buildGeoOrthographic(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildGeoOrthographic -------------------');

        let _maxX = 100; // any value
        let _maxY = 100; // any value
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);
        let _graphCenterPos = cdt.graphCenterPos;
        let _graphInitX = cdt.graphInitXPos;
        let _graphInitY = cdt.graphInitYPos;

        let _titleDisplay = configData.title.display;
        let _legendDisplay = configData.legend.display;
        let _focusColor = configData.color.focusColor;

        let _geoMapDataUrl = dataSetJson.map.baseGeoDataUrl;
        let _scale = dataSetJson.map.scale;
        let _targetName = dataSetJson.map.targetName;
        let _targetProperty = 'd.' + dataSetJson.map.targetPropertyName;
        let _keyDataName = dataSetJson.map.keyDataName;
        let _keyName = 'data.' + _keyDataName;
        let _clipAngle = dataSetJson.map.clipAngle;
        let _rotateH   = dataSetJson.map.rotate.horizontal;
        let _rotateV   = dataSetJson.map.rotate.vertical;
        let _oceanColor = dataSetJson.map.oceanColor;
        let _antarcticaColor = dataSetJson.map.antarcticaColor;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;
        let _animationH = 0;

        let _findColorByName = (name: string): string => {
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    if (name === dataSetJson.data[i].name) {
                        let _color = dataSetJson.data[i].color;
                        return _color;
                    }
                }
            }
            return null;
        };

        let targetPath = d3.geoOrthographic()
                    .translate(_graphCenterPos)
                    .clipAngle(_clipAngle)
                    .scale(_scale)
                    .rotate([_rotateH, _rotateV]);

        let path = d3.geoPath()
                    .projection(
                        targetPath
                    );

        d3.json(_geoMapDataUrl, (error, data) => {
            svgContainer.append('circle')
                .attr('cx', _graphCenterPos[0])
                .attr('cy', _graphCenterPos[1])
                .attr('r', _scale)
                .style('fill', _oceanColor);

            let earthPath = svgContainer.selectAll('path')
                .data(eval(_keyName))
                .enter()
                .append('path')
                .attr('d', path)
                .style('fill', (d: any, i: number) =>  {
                    let _targetArea = eval(_targetProperty);
                    if (_findColorByName(_targetArea) !== null) {
                        return _findColorByName(_targetArea);
                    }

                    return 'hsl(' + i + ',80%,60%)';
                });
            if (_animation) {
                d3.timer(() => {
                    targetPath.rotate([_rotateH + _animationH, _rotateV]);
                    _animationH += 2;
                    earthPath.attr('d', path);
                });
            }
        });

        // ------------------------------------
        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }

        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    let _name = dataSetJson.data[i].name;
                    let _color = dataSetJson.data[i].color;
                    if (_name === 'Antarctica') {
                        continue;
                    }
                    _legendDataSet.push(new O2LegendData(dataSetJson.data[i].name, dataSetJson.data[i].color));
                }
            }
            this.buildLegend(cdt, _legendDataSet);
        }


    }



    private buildGeoMap(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildGeoMap -------------------');

        let _maxX = 100; // any value
        let _maxY = 100; // any value
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);
        let _graphCenterPos = cdt.graphCenterPos;
        let _geoMapDataUrl =  dataSetJson.map.baseGeoDataUrl;
        let _scale = dataSetJson.map.scale;
        let _keyDataName = dataSetJson.map.keyDataName;
        let _keyName = 'data.' + _keyDataName;
        let _targetProperty = 'd.' + dataSetJson.map.targetPropertyName;
        let _antarcticaColor = dataSetJson.map.antarcticaColor;
        let _legendDisplay = configData.legend.display;

        let path = d3.geoPath()
                    .projection(
                        d3.geoMercator()
                        .translate(_graphCenterPos)
                        .scale(_scale)
                    );

        let _findColorByName = (name: string): string => {
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    if (name === dataSetJson.data[i].name) {
                        let _color = dataSetJson.data[i].color;
                        return _color;
                    }
                }
            }
            return null;
        };

        d3.json(_geoMapDataUrl, (error, data) => {
            svgContainer.selectAll('path')
                    .data(eval(_keyName))
                    .enter()
                    .append('path')
                    .attr('d', path)
                    .style('fill', (d: any, i: number) =>  {
                        let _targetArea = eval(_targetProperty);
                        if (_findColorByName(_targetArea) !== null) {
                            return _findColorByName(_targetArea);
                        }
                        return 'hsl(' + i + ',80%,60%)';
                    });
            });

        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    let _name = dataSetJson.data[i].name;
                    let _color = dataSetJson.data[i].color;
                    if (_name === 'Antarctica') {
                        continue;
                    }
                    _legendDataSet.push(new O2LegendData(dataSetJson.data[i].name, dataSetJson.data[i].color));
                }
            }
            this.buildLegend(cdt, _legendDataSet);
        }

    }



    private buildStackBar(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildStackBar-------------------');

        interface HashString {
          [index: string]: string;
        }
        interface HashNumber {
          [key: string]: number;
        }

        let _totalY: Array<number> = new Array();
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
               _totalY.push(0);
            }
        }

        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                let k = 0;
                for (let j in dataSetJson.data[i].value) {
                    if (dataSetJson.data[i].value.hasOwnProperty(j)) {
                        _totalY[k++] += dataSetJson.data[i].value[j].y;
                    }
                }
            }
        }
        let _maxX = 0;
        let _maxY = 0;
        _maxY = d3.max(_totalY);
        _maxX = 100;
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _color = cdt.defaultColorFunc;
        let _columnNum =  dataSetJson.data.length;
        let _barWidth = (cdt.graphWidth / _columnNum) - configData.margin.between;
        let _columnWidth = (cdt.graphWidth / _columnNum) ;
        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;
        let _graphHeight = cdt.graphHeight;
        let _maxYValue = cdt.maxYValue;

        let _opacity = configData.color.opacity;
        let _legendDisplay = configData.legend.display;
        let _gridYDisplay = configData.grid.y.display;
        let _gridXDisplay = configData.grid.x.display;
        let _labelDisplay = configData.label.display;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;

        //  Get Data Name
        let _seriesDateName = dataSetJson.series[0];

        //  Get Keys
        let _keyArray: Array<string> = new Array();
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                let _key = dataSetJson.data[i].name;
                let _value = dataSetJson.data[i].value[0].y;
                _keyArray.push(_key);
            }
        }

        //  Get Date String
        let _dateArray: Array<string> = new Array();
        for (let i in dataSetJson.data[0].value) {
            if (dataSetJson.data[0].value.hasOwnProperty(i)) {
                let _xValue = dataSetJson.data[0].value[i].x;
                _dateArray.push(_xValue);
            }
        }

        let _hashArray: Array<any> = new Array();
        for (let i in _dateArray) {
            if (_dateArray.hasOwnProperty(i)) {
                let _dateSt = _dateArray[i];
                let _hashNumber: HashNumber = { };
                for (let j in _keyArray) {
                    if (_keyArray.hasOwnProperty(j)) {
                        let _key = _keyArray[j];
                        let _value = dataSetJson.data[j].value[i].y;
                        _hashNumber[_key]  = _value;
                    }
                }
                _hashArray.push(_hashNumber);
            }
        }

        let yScale = d3.scaleLinear()
                        .domain([0, _maxYValue])
                        .range([0, _graphHeight]);


        let stack = d3.stack();
        let _rect = svgContainer.selectAll('g')
            .data(stack.keys(_keyArray)(_hashArray))
            .enter()
            .append('g')
            .attr('fill', (d: any, i: number) => {
                return _color(i);
            } )
            .attr('fill-opacity', _opacity)
            .selectAll('rect')
            .data((d: any, i: number) => {
                return d;
            })
            .enter()
            .append('rect');



        if (_animation) {
            _rect.attr('x', (d: any, i: number) => {
                return _initPosX　 + 　i * _columnWidth;
            })
            .attr('height',  0)
            .attr('y', (d: any, i: number) => {
                let nm = 'd.data.' + _keyArray[i];
                let _yValue = eval(nm);
                return svgHeight - configData.margin.bottom - yScale(d[1]);
            })
            .attr('width', _barWidth)
            .transition()
            .duration(_animationDuration)
            .attr('height', (d: any, i: number) => {
                return yScale(d[1] - d[0]);
            });
        } else {
            _rect.attr('x', (d: any, i: number) => {
                return _initPosX + (i * _columnWidth);
            })
            .attr('y', (d: any, i: number) => {
                let nm = 'd.data.' + _keyArray[i];
                let _yValue = eval(nm);
                return svgHeight - configData.margin.bottom - yScale(d[1]);
            })
            .attr('width', _barWidth)
            .attr('height', (d: any, i: number) => {
                return yScale(d[1] - d[0]);
            });
        }


        // ------------------------------------
        // ---CALL buildTitle-----------------
        this.drawTitle(cdt);

        // ------------------------------------
        // ---CALL buildAxis-----------------
        this.buildYAxis(cdt);

        this.drawXBaseLine(cdt);

        //  ------------------------------------
        //  ---CALL drawXAxisLabel-----------------
        if (_labelDisplay) {
            let _labelArray:  Array<string> = new Array();
            for (let i in dataSetJson.data[0].value) {
                if (dataSetJson.data[0].value.hasOwnProperty(i)) {
                    _labelArray.push(dataSetJson.data[0].value[i].x);
                }
            }
            this.drawXAxisLabel(cdt, _labelArray, ChartConst.STACK_BAR_CHART_TYPE_NAME);
        }


        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    _legendDataSet.push(new O2LegendData(dataSetJson.data[i].name, _color(i)));
                }
            }
            this.buildLegend(cdt, _legendDataSet);
        }

        if (_gridYDisplay) {
            this.drawYGrid(cdt);
        }

    }

    private buildScatterPlot(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('In  buildScatterPlot----------------');

        let _dataSet: Array<O2ScatterPlotData> = new Array();
        let _maxX = 0;
        let _maxY = 0;
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                for (let j in dataSetJson.data[i].value) {
                    if (dataSetJson.data[i].value.hasOwnProperty(j)) {
                        if (_maxX < dataSetJson.data[i].value[j].x) {
                            _maxX = dataSetJson.data[i].value[j].x;
                        }
                        if (_maxY < dataSetJson.data[i].value[j].y) {
                            _maxY = dataSetJson.data[i].value[j].y;
                        }
                        let _scatterPlotData = new O2ScatterPlotData(
                            dataSetJson.data[i].value[j].x,
                            dataSetJson.data[i].value[j].y,
                            dataSetJson.data[i].value[j].r,
                        ) ;
                        _dataSet.push(_scatterPlotData);
                    }
                }
            }
        }
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;

        let _seriesNumber = dataSetJson.series.length;
        let _color = cdt.defaultColorFunc;
        let _opacity = configData.color.opacity;
        let _gridYDisplay = configData.grid.y.display;
        let _gridXDisplay = configData.grid.x.display;
        let _titleDisplay = configData.title.display;
        let _legendDisplay = configData.legend.display;

        let _circle = svgContainer.selectAll('circle')
                .data(_dataSet)
                .enter()
                .append('circle')
                .attr('cx', (d: O2ScatterPlotData, i: any): number => {
                    return _initPosX + d.x;
                })
                .attr('cy', (d: O2ScatterPlotData, i: any): number => {
                    return (svgHeight - configData.margin.bottom - d.y);
                })
                .attr('r', (d: O2ScatterPlotData, i: any): number => {
                    return d.r;
                })
                .style('fill', (d: any, i: number) =>  {
                    let _colorNum = i % _seriesNumber;
                    return _color(_colorNum);
                })
                .attr('fill-opacity',  _opacity);


        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }

        // ------------------------------------
        // ---CALL buildLegend-----------------
        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i = 0; i < dataSetJson.series.length; i++) {
                _legendDataSet.push(new O2LegendData(dataSetJson.series[i], _color(i)));
            }
            this.buildLegend(cdt, _legendDataSet);
        }
        // ------------------------------------
        // ---CALL buildAxis-----------------
        this.buildYAxis(cdt);

        this.buildXAxis(cdt);

        if (_gridYDisplay) {
            this.drawYGrid(cdt);
        }
        if (_gridXDisplay) {
            this.drawXGrid(cdt);
        }
    }



    private drawXGrid(o2Common: any): void {

        console.log('in buildXGrid-------------------');

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        let _stepX =  cdt.gridXStep;

        let _maxX = cdt.maxXValue;
        let _graphYScale = cdt.graphYScale;
        let _graphXScale = cdt.graphXScale;
        let _graphWidth = cdt.graphWidth;
        let _gridClassName = configData.className.grid;
        let _axisXScale = d3.scaleLinear()
                        .domain([0, _maxX])
                        .range([0, _maxX * _graphXScale]);
        let _rangeX = d3.range(_stepX * _graphXScale,
                        _maxX  * _graphXScale,
                        _stepX * _graphXScale);

        svgContainer.append('g')
            .selectAll('line.x')
            .data(_rangeX)
            .enter()
            .append('line')
            .attr('class', _gridClassName)
            .attr('x1', (d: any, i: number) =>  {
                let _x1 = configData.margin.left  + d;
                return _x1;
            })
            .attr('y1', cdt.svgHeight - configData.margin.bottom)
            .attr('x2', (d: any, i: number) =>  {
                let _x2 = configData.margin.left  + d;
                return _x2;
            })
            .attr('y2', configData.margin.top + configData.title.height);
    }

    private buildXAxis(o2Common: any): void {

        console.log('in buildXAxis-------------------');

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        let _maxX = cdt.maxXValue;
        let _graphXScale = cdt.graphXScale;

        let _axisXScale = d3.scaleLinear()
                        .domain([0, _maxX])
                        .range([0, _maxX * _graphXScale]);

        svgContainer.append('g')
            .attr('class', cdt.axisClassName)
            .attr('transform', cdt.axisXBorderTranslatePos)
            .call(
                  d3.axisBottom(_axisXScale)
            );
                  //  .scale()
                  //  .orient(cdt.axisXOrient)
                  //  );

    }



    private buildPie(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('In  buildPie----------------');

        let _maxX = 0;
        let _maxY = 0;
        _maxY = 100;
        _maxX = 100;
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _color = cdt.defaultColorFunc;
        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;
        let _graphHeight = cdt.graphHeight;
        let _graphWidth = cdt.graphWidth;

        let _opacity = configData.color.opacity;
        let _titleHeight = configData.title.height;
        let _leftMargin = configData.margin.left;
        let _topMargin = configData.margin.top;
        let _bottomMargin = configData.margin.bottom;
        let _betweenMargin = configData.margin.between;
        let _innerRadiusPercent = cdt.innerRadiusPercent;
        let _graphCenterTranslatePos = cdt.graphCenterTranslatePos;
        let _pieClassName = configData.className.pie;
        let _pieValueClassName = configData.className.pieNum;
        let _pieInnerTitleClassName = configData.className.pieInnerTitle;
        let _innerRadiusTitleTranslatePos = cdt.innerRadiusTitleTranslatePos;
        let _innerRadiusTitle = cdt.innerRadiusTitle;
        let _titleDisplay = configData.title.display;
        let _legendDisplay = configData.legend.display;
        let _labelDisplay = configData.label.display;
        let _valueDisplay = configData.pie.value.display;
        let _percentDisplay = configData.pie.percent.display;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;

        let width = svgWidth;
        let height = svgHeight;

        let dataSet: Array<number> = new Array();
        for (let i  in  dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                let _num = dataSetJson.data[i].value;
                dataSet.push(_num);
            }
        }

        let _sum = d3.sum(dataSet);
        let pie = d3.pie();
        let arc = d3.arc()
                    .innerRadius(_graphHeight * _innerRadiusPercent / 100)
                    .outerRadius(_graphHeight / 2);

        let pieElements = svgContainer.selectAll('path')
                                .data(pie(dataSet))
                                .enter()
                                .append('g')
                                .attr('transform', _graphCenterTranslatePos);


        let _makeCenterTitle = (): string => {
                if (_valueDisplay && _percentDisplay) {
                    let _st = _innerRadiusTitle + ':' + _sum +  ' (100%)';
                    return _st;
                }
                if (_percentDisplay) {
                    return '100%';
                }
                if (_valueDisplay) {
                    return _innerRadiusTitle + ':' + _sum;
                }
        };

        let textElements = svgContainer.append('text')
                                .attr('class', _pieInnerTitleClassName)
                                .attr('transform', _innerRadiusTitleTranslatePos )
                                .text(_makeCenterTitle);

        let _arc = pieElements.append('path')
                    .attr('class', _pieClassName)
                    .style('fill', (d: any, i: number) =>  {
                        return _color(i);
                    })
                    .attr('fill-opacity', _opacity);

        //  For d3Version4 animation is not available now  
        //  if (_animation) {
        //      _arc.transition()
        //      .duration(_animationDuration)
        //      .delay((d,i)=> {
        //          return i *1000;
        //      })
        //      .attrTween('d',(d: any,i: number) =>  {
        //          let _interpolate = d3.interpolateObject(
        //              { startAngle:d.startAngle,endAngle:d.startAngle }
        //              { startAngle:d.startAngle,endAngle:d.endAngle }
        //          )
        //          return (t) {
        //              return arc(_interpolate(t));
        //          }
        //      })
        //  }
        //  else{
        //      _arc.attr('d',arc);
        //  }
        _arc.attr('d', arc);

        pieElements.append('text')
                    .attr('class', _pieValueClassName)
                    .attr('transform', (d: any, i: number) => {
                    return 'translate(' + arc.centroid(d) + ')';
                    })
                    .text((d: any, i: number) => {
                        if (_valueDisplay && _percentDisplay) {
                            let _percentSt = String(Math.ceil(d.value / _sum  * 100));
                            let _st = String(d.value) + ' (' + _percentSt + '%)';
                            return _st;
                        }
                        if (_percentDisplay) {
                            let _percentSt = String(Math.ceil(d.value / _sum  * 100));
                            let _st = _percentSt + '%';
                            return _st;
                        }
                        if (_valueDisplay) {
                            return d.value;
                        }
                    });

        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }

        // ------------------------------------
        // ---CALL buildLegend-----------------
        if (_legendDisplay) {
            let _legendDataSet: Array<O2LegendData> = new Array();
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    _legendDataSet.push(new O2LegendData(dataSetJson.data[i].name, _color(i)));
                }
            }
            this.buildLegend(cdt, _legendDataSet);
        }
    }



    private buildBar(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('In  buildBar----------------');

        let _yDataSet: Array<number> = new Array();
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                for (let j in dataSetJson.data[i].y) {
                    if (dataSetJson.data[i].y.hasOwnProperty(j)) {
                        let _y = dataSetJson.data[i].y[j];
                        _yDataSet.push(_y);
                    }
                }
            }
        }

        let _maxX = 0;
        let _maxY = 0;
        _maxY = d3.max(_yDataSet);
        _maxX = 100;
        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);

        let _barValueClass = configData.className.barValue;
        let _color = cdt.defaultColorFunc;
        let _seriesNum =  dataSetJson.series.length;
        let _columnNum =  _yDataSet.length;
        let _initPosX = cdt.graphInitXPos;
        let _initPosY = cdt.graphInitYPos;
        let _graphHeight = cdt.graphHeight;
        let _graphWidth = cdt.graphWidth;
        let _maxYValue = cdt.maxYValue;
        let _opacity = configData.color.opacity;
        let _titleHeight = configData.title.height;
        let _titleDisplay = configData.title.display;
        let _leftMargin = configData.margin.left;
        let _topMargin = configData.margin.top;
        let _bottomMargin = configData.margin.bottom;
        let _betweenMargin = configData.margin.between;
        let _legendDisplay = configData.legend.display;
        let _labelDisplay = configData.label.display;
        let _gridYDisplay = configData.grid.y.display;
        let _animation = configData.animation.enable;
        let _animationDuration = configData.animation.duration;

        let _barWidth = (_graphWidth - (_betweenMargin * _columnNum / _seriesNum)) /  _columnNum;
        let _columnWidth = (_graphWidth / _columnNum) ;

        let _graphYScale = cdt.graphYScale;

        let yBarScale = d3.scaleLinear()
                        .domain([0, _maxY])
                        .range([_maxY * _graphYScale, 0]);

        let _barPadding = _betweenMargin;




        let grpGraph = svgContainer.selectAll('g')
            .data(_yDataSet)
            .enter()
            .append('g')
            .attr('transform', (d: any, i: number): string => {
                let _padding = ((i % _seriesNum) === 0) ? _barPadding : 0;
                return 'translate(' + (_padding + _columnWidth * i) + ')';
            })
            .style('fill', (d: any, i: number) =>  {
                let _remnant = (i % _seriesNum);
                return _color(_remnant);
            })
            .attr('fill-opacity', _opacity);

        let _rect =  grpGraph.append('rect');
        if (_animation) {
            _rect.attr('x', _leftMargin)
            .attr('height', 0)
            .attr('y', (d: any) : number => {
                return _initPosY;
            })
            .attr('width', _barWidth - _barPadding)
            .transition()
            .duration(_animationDuration)
            .attr('y', (d: any) : number => {
                return yBarScale(d) + _initPosY;
            })
            .attr('height', (d: any) : number => {
                return _graphHeight - yBarScale(d) ;
            });
        } else {
            _rect.attr('x', _leftMargin)
            .attr('y', (d: any): number => {
                return yBarScale(d) + _initPosY;
            })
            .attr('width', _barWidth - _barPadding)
            .attr('height', (d: any): number => {
                return _graphHeight - yBarScale(d);
            });
        }

        let textBarValue = grpGraph.append('text');
        textBarValue
            .attr('class', _barValueClass)
            .attr('x', _leftMargin)
            .attr('y', (d: any): number => {
              return yBarScale(d) + _initPosY;
            })
            .text((d: any): string => { return d ; });

        // ------------------------------------
        // ---CALL buildAxis-----------------
        this.buildYAxis(cdt);

        //  ------------------------------------
        //  ---CALL drawXAxisLabel-----------------
        if (_labelDisplay) {
            let _labelArray:  Array<string> = new Array();
            for (let i in dataSetJson.data) {
                if (dataSetJson.data.hasOwnProperty(i)) {
                    _labelArray.push(dataSetJson.data[i].x);
                }
            }
            this.drawXAxisLabel(cdt, _labelArray, ChartConst.BAR_CHART_TYPE_NAME);
        }

        this.drawXBaseLine(cdt);

        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        let _legendDataSet: Array<O2LegendData> = new Array();
        for (let i in dataSetJson.series) {
            if (dataSetJson.series.hasOwnProperty(i)) {
              _legendDataSet.push(new O2LegendData(dataSetJson.series[i], _color(i)));
            }
        }
        this.buildLegend(cdt, _legendDataSet);

        // ------------------------------------
        // ---CALL buildTitle-----------------
        if (_titleDisplay) {
            this.drawTitle(cdt);
        }

        if (_gridYDisplay) {
            this.drawYGrid(cdt);
        }

    }


    private buildLine(svgContainer: any, configData: any, dataSetJson: any, svgWidth: number, svgHeight: number): void {

        console.log('in buildTest-------------------');

        let _groupMaxY: Array<number> = new Array();

        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                let _gMaxY = 0;
                for (let j in dataSetJson.data[i].value) {
                    if (dataSetJson.data[i].value.hasOwnProperty(j)) {
                        if (_gMaxY < dataSetJson.data[i].value[j].y) {
                            _gMaxY = dataSetJson.data[i].value[j].y;
                        }
                    }
                }
                _groupMaxY.push(_gMaxY) ;
            }
        }
        let _maxX = 0;
        let _maxY = 0;
        _maxY = d3.max(_groupMaxY);
        _maxX = 100;

        let cdt = new O2Common(svgContainer, configData, _maxX, _maxY, svgWidth, svgHeight);
        let _color = cdt.defaultColorFunc;

        let _columnNum = dataSetJson.data[0].value.length ;
        let _columnWidth = cdt.graphWidth / _columnNum;

        console.log(_columnWidth);

        if (configData.grid.y.display) {
            this.drawYGrid(cdt);
        }

        //  O2IdValueData
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
                let _lineArray: Array<O2IdValueData> = new Array();
                for (let j in dataSetJson.data[i].value) {
                    if (dataSetJson.data[i].value.hasOwnProperty(j)) {
                        let idValue = new O2IdValueData(parseInt(j), dataSetJson.data[i].value[j].y);
                        _lineArray.push(idValue);
                    }
                }
                let num = parseInt(i);
                this.drawSingleLine(cdt, _lineArray, num);
            }
        }

        // ------------------------------------
        // ---CALL buildTitle-----------------
        this.drawTitle(cdt);

        // ------------------------------------
        // ---CALL buildAxis-----------------
        this.buildYAxis(cdt);

        this.drawXBaseLine(cdt);

        //  ------------------------------------
        //  ---CALL drawXAxisLabel-----------------
        let _labelArray:  Array<string> = new Array();
        for (let i in dataSetJson.data[0].value) {
            if (dataSetJson.data[0].value.hasOwnProperty(i)) {
                _labelArray.push(dataSetJson.data[0].value[i].x);
            }
        }
        this.drawXAxisLabel(cdt, _labelArray, ChartConst.LINE_CHART_TYPE_NAME);

        //  ------------------------------------
        //  ---CALL buildLegend-----------------
        let _legendDataSet: Array<O2LegendData> = new Array();
        for (let i in dataSetJson.data) {
            if (dataSetJson.data.hasOwnProperty(i)) {
              _legendDataSet.push(new O2LegendData(dataSetJson.data[i].name, _color(i)));
            }
        }
        this.buildLegend(cdt, _legendDataSet);

    }




    private drawSingleLine(o2Common: any, dataSet: any, lineNum: number): void {

        console.log('in drawSingleLine-------------------');

        console.log(dataSet);
        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        let _maxX = cdt.maxXValue;
        let _initXPos = cdt.axisXLabelInitXPos;
        let _initYPos = cdt.axisXLabelInitYPos;
        let _columnNum = dataSet.length;
        let _columnWidth = cdt.graphWidth / (_columnNum - 1);
        let _color = d3.scaleOrdinal(d3.schemeCategory10);

        let _lineClassName = configData.className.multiLinePrefix + String(lineNum);
        let _leftMargin = configData.margin.left;
        let _bottomMargin = configData.margin.bottom;

        let _yScale = cdt.graphYScale;


        let line = d3.line()
            .curve(d3.curveLinear)
            .x( (d: any) => {
                return _leftMargin + d.id * _columnWidth;
            })
            .y( (d: any) => {
                return cdt.svgHeight - _bottomMargin - ( d.value * _yScale) ;
            });

        svgContainer.append('path')
                .attr('class', _lineClassName)
                .attr('d', line(dataSet));
                //  .attr('transform', cdt.axisTranslatePos)

    }


// ------------------------------------
// ---Build Legend  -------------------
// ------------------------------------
    private buildLegend(o2Common: any, _legendDataSet: any): void {

        console.log('in buildLegend-------------------');

        //  maxValues are meaningless

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;
        //  let cdt = new O2Common(configData, 100, 100, svgWidth, svgHeight);

        let legendRectSize = configData.legend.rectWidth;
        let legendSpacing = 10;
        let ySpacing = configData.legend.ySpacing;
        let initPosX = cdt.legendInitXPos;
        let initPosY = cdt.legendInitYPos;
        let opacity = configData.color.opacity;

        let grpLegend = svgContainer.append('g')
                    .selectAll('g')
                    .data(_legendDataSet)
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', (d: O2LegendData, i: number) => {
                        let height = legendRectSize + ySpacing;
                        let x = initPosX;
                        let y = i * height + initPosY ;
                        return 'translate(' + x + ', ' + y + ')';
                    });

        grpLegend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', (d: O2LegendData) => {
                return d.color;
            })
            .style('stroke', (d: O2LegendData) => {
                return d.color;
            })
            .attr('fill-opacity', opacity);

        grpLegend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize)
            .text((d: O2LegendData) => {
                return d.title;
            });
    }


    private drawXAxisLabel(o2Common: any, labelDataSet: any, chartType: string): void {

        console.log('in drawXAxisLabel-------------------');

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        // let _maxX = cdt.maxXValue;
        let _initXPos = cdt.axisXLabelInitXPos;
        let _initYPos = cdt.axisXLabelInitYPos;

        let _columnNum = labelDataSet.length;
        let _columnWidth = cdt.graphWidth / _columnNum;
        if ( chartType === ChartConst.LINE_CHART_TYPE_NAME) {
            _columnWidth = cdt.graphWidth / (_columnNum - 1);
        }

        let grpLabel = svgContainer.append('g')
                    .selectAll('g')
                    .data(labelDataSet)
                    .enter()
                    .append('g')
                    .attr('class', configData.axisXText)
                    .attr('transform', (d: any, i: number) => {
                        let _x = _initXPos + _columnWidth * i;
                        let _y = _initYPos ;
                        return 'translate(' + _x + ', ' + _y + ')';
                    });

        grpLabel.append('text')
                    .attr('class', configData.className.axisXText)
                    .text((d: any, i: number) => {
                        return d;
                    });


    }


    private drawXBaseLine(o2Common: any): void {

        console.log('in drawXBaseLine-------------------');

        let cdt = o2Common;
        let svgContainer = cdt.svgContainer;

        svgContainer.append('rect')
            .attr('class', cdt.axisXBorderLineClassName)
            .attr('width', cdt.axisXBorderWidth)
            .attr('height', cdt.axisXBorderLineWidth)
            .attr('transform', cdt.axisXBorderTranslatePos);

    }


// ------------------------------------
// ---Build Axis  -------------------
// ------------------------------------
    private buildYAxis(o2Common: any): void {

        console.log('in buildYAxis-------------------');

        let cdt = o2Common;
        let svgContainer = cdt.svgContainer;

        let _maxY = cdt.maxYValue;
        let _graphYScale = cdt.graphYScale;

        let _axisYScale = d3.scaleLinear()
                        .domain([0, _maxY])
                        .range([_maxY * _graphYScale, 0]);

        svgContainer.append('g')
            .attr('class', cdt.axisClassName)
            .attr('transform', cdt.axisTranslatePos)
            .call(
                  d3.axisLeft(_axisYScale)
                  );

    }


    // ------------------------------------
    // --- drawTitle-----------------

    private drawTitle(o2Common: any): void {

        console.log('in drawTitle-------------------');

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        let _title = configData.title.name;
        let _xPos = cdt.titleInitXPos;
        let _yPos = cdt.titleInitYPos;
        let _titleClassName = configData.title.className;

        svgContainer.append('text')
            .attr('class', _titleClassName)
            .attr('x', _xPos)
            .attr('y', _yPos)
            .text(_title);
    }


// ------------------------------------
// ---drawGrid  -------------------
// ------------------------------------
    private drawYGrid(o2Common: any): void {

        console.log('in buildYGrid-------------------');

        let cdt = o2Common;
        let configData = cdt.configData;
        let svgContainer = cdt.svgContainer;

        let _stepY =  cdt.gridYStep;
        let _maxY = cdt.maxYValue;
        let _graphYScale = cdt.graphYScale;
        let _gridClassName = configData.className.grid;
        let _rangeY = d3.range(_stepY * _graphYScale,
                        _maxY * _graphYScale,
                        _stepY * _graphYScale);

        svgContainer.append('g')
            .selectAll('line.y')
            .data(_rangeY)
            .enter()
            .append('line')
            .attr('class', _gridClassName)
            .attr('x1', configData.margin.left)
            .attr('y1', ( d: any, i: number ) =>  {
                let _y1 = cdt.svgHeight - configData.margin.bottom - d;
                return _y1;
            })
            .attr('x2', configData.margin.left + cdt.axisXBorderWidth)
            .attr('y2', ( d: any, i: number ) =>  {
                let _y1 = cdt.svgHeight - configData.margin.bottom - d;
                return _y1;
            });
    }





}



