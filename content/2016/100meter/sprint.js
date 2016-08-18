    var undef;
var Backbone = require('backbone');
var $ = jQuery = require('jquery');
var d3 = require('d3-browserify');

Backbone.$ = $;

module.exports = Backbone.View.extend({

    className: 'sprint-graphic',

    initialize: function(options){
        var self = this;

        self.graphicWidth = options.width;
        self.graphicHeight = options.height;;
        self.barHeight = 20;

        if(window.isMobile) {
            self.barHeight = 16;
        }

        self.strokeWidth = 3;
        self.margin= {
            top: 10,
            left: 40,
            bottom: 10,
            right: 10
        }

        self.parent = options.parent;

    },

    render: function(callback){
        var self = this;

        d3.csv('data/sprints.csv', function(csvData) {

            self.allGames = [];

            for(var i=0; i<csvData.length; i++) {
                if(csvData[i].time != "") {
                    self.allGames.push(csvData[i]);
                }
            }

            var svgElement = d3.select('.svg-graphic')

            // Set size of SVG
            svgElement
                .attr('width',self.graphicWidth)
                .attr('height',(self.allGames.length*self.barHeight)+self.strokeWidth)

            var gBackground = svgElement.append('g')
                .attr('class','background')

                gBackground
                    .append('rect')
                        // .attr('transform','translate('+self.margin.left+','+self.margin.top+')')
                        .attr('transform','translate(0,0)')
                        .attr('class','rect background')
                        .attr('fill','#5377ab')
                        .attr('width',self.graphicWidth)
                        .attr('height',(self.allGames.length*self.barHeight)+self.strokeWidth-2)

            // Append start and finish line.. Ready, set, ..
            var startLine = svgElement.append('line')
                .attr('x1',self.margin.left).attr('x2',self.margin.left)
                .attr('y1',0).attr('y2',self.graphicHeight)
                .attr('stroke','white')
                .attr('stroke-width',self.strokeWidth)

            var finishLine = svgElement.append('line')
                .attr('x1',self.graphicWidth-self.margin.right).attr('x2',self.graphicWidth-self.margin.right)
                .attr('y1',0).attr('y2',self.graphicHeight)
                .attr('stroke','white')
                .attr('stroke-width',self.strokeWidth)


            // Append rows / bars as rect
            for(var i=0; i<self.allGames.length; i++) {

                var rowHeight = (i*self.barHeight);                

                var defs = d3.select('#mdef')
                    .append('pattern')
                        .attr('id','pattern-'+self.allGames[i].flag)
                        .attr('x',0)
                        .attr('y',0)
                        .attr('height',self.barHeight/3*2)
                        .attr('width',self.barHeight/3*2);

                    defs.append('image')
                        .attr('x',0)
                        .attr('y',0)
                        .attr('width',self.barHeight/3*2)
                        .attr('height',self.barHeight/3*2)
                        .attr('xlink:href','imgs/'+self.allGames[i].flag+'.jpg');


                // Append dividing lines
                var line = svgElement.append('line')
                    .attr('class','line line-'+i)
                    .attr('stroke','white')
                    .attr('stroke-width',self.strokeWidth)
                    .attr('x1',0)
                    .attr('x2',self.graphicWidth)
                    .attr('y1',self.barHeight+(i*self.barHeight))
                    .attr('y2',self.barHeight+(i*self.barHeight))

                // Year text on the left
                var text = svgElement.append('text')
                    .attr('class','text text-'+i)
                    .attr('x',2)
                    .attr('y',self.barHeight+(self.barHeight*i)-5)
                    .style('fill','white')
                    .text(self.allGames[i].year)

                // Append the fast runner as a circle
                var runner = svgElement.append('circle')
                    .attr('data-time',self.allGames[i].time)
                    .attr('data-id',i)
                    .attr('class','circle circle-'+i)
                    .attr('cx',self.margin.left)
                    .attr('cy',self.barHeight/2+(self.barHeight*i))
                    .attr('r',self.barHeight/3)
                    .attr('fill','url(#pattern-'+self.allGames[i].flag+')')
                    .attr('opacity',0.9)
                    .attr('stroke','white')
                    .attr('stroke-width',0.5)

                // Append time for each run
                var clockSeconds = svgElement.append('text')
                    .attr('opacity',0)
                    .attr('data-time',self.allGames[i].time)
                    .attr('class','clock clock-'+i)
                    .attr('x',self.graphicWidth-83)
                    .attr('text-anchor','end')
                    .style('font-family','Benton Sans Cond Black')
                    .attr('y',self.barHeight+(self.barHeight*i)-5)
                    .style('fill','white')
                    .text(self.allGames[i].time)

                var clockLabel = svgElement.append('text')
                    .attr('opacity',0)
                    .attr('data-time',self.allGames[i].time)
                    .attr('class','clock clock-'+i)
                    .attr('x',self.graphicWidth-80)
                    .attr('text-anchor','start')
                    .attr('y',self.barHeight+(self.barHeight*i)-5)
                    .style('fill','white')
                    .text(' Seconds')

                var runnerName = svgElement.append('text')
                    .attr('opacity',0)
                    .style('font-family','Benton Sans Cond Black')
                    .attr('class','runner runner-'+i)
                    .attr('x',self.margin.left+10)
                    .attr('text-anchor','start')
                    .attr('y',self.barHeight+(self.barHeight*i)-5)
                    .style('fill','white')
                    .text(self.allGames[i].winner)

                // Runner country as text was planned, but not used because of the flag symbols
                
                // var runnerCountry = svgElement.append('text')
                //     .attr('opacity',0)
                //     .attr('class','runner runner-'+i)
                //     .attr('x',self.margin.left+120)
                //     .attr('text-anchor','start')
                //     .attr('y',self.barHeight+(self.barHeight*i)-5)
                //     .style('fill','white')
                //     .text(self.allGames[i].country)


            }
        
    
        })

        return self;
    },

    moveRunner: function(time) {
        var self = this;

        // console.log(time)

        var startPos = self.margin.left;
        var endPos = self.graphicWidth-self.margin.right;

        d3.selectAll('.circle')
            .each(function(d,i) {

                var distanceToGo = (self.graphicWidth-self.margin.right)-self.margin.left;
                var distancePerDecimal = parseFloat(distanceToGo / (self.allGames[i].time*100) * time);

                if(startPos + parseFloat(distanceToGo / (self.allGames[i].time*100) * time) >= endPos) {
                    var theOne = 0;
                    var thisElement = $(this).attr('data-id')
                    if(thisElement == 27) {
                        var audio = self.$el.find('.pistol');
                        audio[0].play();
                    }
                    d3.selectAll('.clock-'+thisElement)
                        // .transition().delay(0).duration(200)
                            .attr('opacity',1)

                    d3.select('.runner-'+thisElement)
                        // .transition().delay(0).duration(200)
                            .attr('opacity',1)
                
                    $('.button-text').text('Reload')
                    $('.play-button').removeClass('disabled');
                    $('.play-button').addClass('restart');
                

                } 
                else  
                {
                    // console.log(distanceToGo / 1200 * (parseFloat(self.allGames[i].time*100)))
                    d3.select(this)
                        .attr('cx',parseFloat(startPos + distancePerDecimal))
                }


            })


    },

    playAnimation: function() {
        var self = this;

        d3.selectAll('.circle')
            .each(function(d,i) {
                var theOne = 0;
                d3.select(this)
                    .transition().duration(self.allGames[i].time*1000).ease('linear')
                        .attr('cx',self.graphicWidth-self.margin.right)
                            .each('end',function(d,i){
                                var thisElement = $(this).attr('data-id')
                                // console.log(thisElement)
                                d3.selectAll('.clock-'+thisElement)
                                    .transition().delay(0).duration(200)
                                        .attr('opacity',1)

                                // Bolts fastest run is No. 26, so cheer if he finishes
                                if(thisElement == 26) {
                                    // console.log('Bolt!')
                                    $('audio.cheer')[0].play();
                                }

                                d3.selectAll('.runner')
                                    .each(function(d,i) {
                                        d3.select(this)
                                            .transition().delay(0).duration(200)
                                                .attr('opacity',1)
                                    })

                                $('.button-text').text('Reload')
                                $('.play-button').removeClass('disabled');
                                $('.play-button').addClass('restart');
                            })
                // .attr('y',self.graphicWidth)
            })

    }

});