                /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Voronoi & Redrawing ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

                var voronoi = d3.geom.voronoi()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .clipExtent([[-10, -10], [width+10, height+10]]);

                /* recenterVoronoi is called everytime the nodes are redrawn, i.e. in each tick of the       
                simulation. It calculates the vertices of the voronoi polygon RELATIVE to each node's xy-position. */
                function recenterVoronoi(nodes) {
                    //console.log("tock")
                    var shapes = [];
                    voronoi(nodes).forEach(function(d) {
                        if ( !d.length ) return;
                        var n = [];
                        d.forEach(function(c){
                            n.push([ c[0] - d.point.x, c[1] - d.point.y ]); 
                            /* n is an array of the vertices of the voronoi polygon
                            of the nth node in each tick, relative to node circle center.
                            point is the node object itself and also included as last element of n. */
                        });
                        n.point = d.point;
                        //console.log(n);
                
                        shapes.push(n);
                    });
                    //console.log(shapes);
                    
                    /* Calculate optional additional points for the polygon here:
                    Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)) < r */
                    
                    //console.log(nodes.length);
                    //console.log(shapes[0]); 
                    return shapes;
                }

                function getVertices(nodes) {
                    var verts = [];
                    voronoi(nodes).forEach(function(d) {
                        if ( !d.length ) return;
                        d.forEach(function(c){
                            verts.push([ c[0] - d.point.x, c[1] - d.point.y ]); //relative to node circle center
                        });
                    });
                    return verts;
                }


                function redrawLink(link) {
                    //console.log("tack");
                    link.attr('x1', function(d) { return d.source.x; })
                        .attr('y1', function(d) { return d.source.y; })
                        .attr('x2', function(d) { return d.target.x; })
                        .attr('y2', function(d) { return d.target.y; });
                }



                /* The <clipPath> SVG element defines a clipping path. A clipping path is used/referenced using the 'clip-path' property. The clipping path restricts the region to which paint can be applied. Conceptually, any parts of the drawing that lie outside of the region bounded by the currently active clipping path are not drawn. */
                var idxVerts = [];

                function redrawNode(node) {
                    //console.log("tick");
                    node.attr('transform', function(d) { return 'translate('+d.x+','+d.y+')'; })
                        .attr('clip-path', function(d) { return 'url(#uclip-'+d.index+')'; });        
                    
                    var clip = svg.selectAll('.mclip')
                        .data(recenterVoronoi(node.data()), function(d) { 
                            //console.log(d); /*one voronoi polygon, array of 2D points and the node object itself (called "point") */
                            return d.point.index; } );

                    clip.enter().append('clipPath')
                        .attr('id', function(d) { return 'uclip-'+d.point.index; })
                        .attr('class', 'mclip');

                    clip.exit().remove();

                
                    clip.selectAll('path').remove();
                    clip.append('path')
                        .attr('d', function(d) { return 'M'+d.join('L')+'Z'; });

                    clabels.attr({"x":function(d) {return get_cmean(d.cluster)[0];},
                                "y":function(d) {return get_cmean(d.cluster)[1];}
                        });
                }
