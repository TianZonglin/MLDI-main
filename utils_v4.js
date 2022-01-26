/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 *  Resetting functionality 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
 // – Store original vweights of original 161 nodes
 // – Set their flag: "loadOnStartup = True"
 // – Last 100 unique sinks all have vweight 1 --> python script to set flags correctly

// var path = "static/208_c0.808_e0.9_tTrue_full_graph.json";
// var res;
// d3.json(path, function(error, data) {
// 	res = data;   
// });

// var originalVweights = (161) [1.020962, 1.01105, 1.020962, 1.020962, 1.020962, 1.837731, 1.01105, 1.01105, 4.28804, 1.01105, 1.348067, 1.020962, 1.01105, 1.01105, 1.348067, 1.01105, 8.625, 1.020962, 1.020962, 1.01105, 1.134402, 1.020962, 1.01105, 1.020962, 1.01105, 1.020962, 1.020962, 1.2, 1.020962, 1.01105, 1.020962, 3.675463, 1.983583, 1.020962, 2.246116, 1, 1.01105, 1.01105, 1.020962, 1.01105, 1.01105, 1.020962, 1.01105, 1.020962, 1.020962, 1.020962, 1.01105, 1.020962, 1.225154, 2.527625, 1.020962, 1.134402, 1.020962, 2.537537, 1.01105, 2.0221, 1.020962, 1.01105, 1.020962, 1.020962, 1.020962, 2.246116, 1.020962, 1.020962, 1.348067, 1.01105, 1.01105, 1.01105, 1.020962, 1.020962, 1.020962, 1.01105, 1.01105, 1.020962, 1.020962, 1.01105, 2.0221, 1.020962, 1.01105, 1.639927, 1.01105, 1.01105, 1.020962, 1.01105, 1.020962, 1.020962, 2.957549, 1.01105, 1.020962, 2.01105, 1.644883, 2.020962, 1.020962, 1.01105, 1.020962, 1.020962, 1.166814, 1.01105, 1.01105, 1.020962, …]




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 *  Global variables & Miscellaneous Utilties 
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var globalFilteringConstant = 0.808;
var linksLimit = 10;
var numClusters = 6; //number of clusters or respectively "countries"
var lang = "en";
//beamer at ZKM: 1920x1080
var width = innerWidth;// - 620,
	height = innerHeight-160;


// var clipPoly = [[-10, -10], [width+10, height+10]];
// clipPoly= clipPoly.map(function(i){return [i[0]-width/2, i[1]-height/2]});
var clipPoly = [[-20000,-20000],[20000,20000]]; 

function get_mean(nodes){
		var xs = nodes.data().map(function(a) {return a.x;});
		var ys = nodes.data().map(function(a) {return a.y;});
		var totalx = 0;
		var totaly = 0;
		for(var i = 0; i < xs.length; i++) {
			  totalx += xs[i];
			  totaly += ys[i];
		  }
		  var mx = totalx/xs.length;
		  var my = totaly/ys.length;
		  var geommean = [[mx,my]];
		  return geommean;
}

/* For array of nodes without data()-method */
function get_cmean(cluster){

	var totalx = 0;
	var totaly = 0;
	for(var i = 0; i < cluster.length; i++) {
	  totalx += cluster[i]["x"];
	  totaly += cluster[i]["y"];
  }
  var mx = totalx/cluster.length;
  var my = totaly/cluster.length;
  var geommean = [mx,my];
  return geommean;
}


function sortByAttribute(values, attribute){
	values.sort(function(a, b) { return a[attribute] < b[attribute] ? 1 : -1; });
}

/* Quick select to find median quickly, average complexity: O(n)*/

function swap(array, idxA, idxB) {
    var temp = array[idxA] 
    array[idxA] = array[idxB]
    array[idxB] = temp
}

    function partitionStart(arr, left, right) {  
      var pivotIdx = Math.floor(Math.random() * (right - left + 1)) + left;
      var storeIdx = left, pivotVal = arr[pivotIdx]      
      for (var i = left; i <= right; i++) {
        if (arr[i] < pivotVal) {
          swap(arr, storeIdx, i)
          storeIdx++
        }
      }  
      return storeIdx;
    }

    function quickSelect(arr, k) {  
      var pivotDist;   
      var left = 0, right = arr.length - 1;  
      while(right !== left) {      	
        pivotDist = partitionStart(arr, left, right)        

        if (k < pivotDist) {
          right = pivotDist - 1;
        } else {
          left = pivotDist;
        }
      }    
      return arr[k]
    }

 /* --- */



function median(cluster){

  var half = Math.floor(cluster.length / 2);
  var median = [];
  var odd = cluster.length % 2;

  sortByAttribute(cluster, "x");
  if(odd){
  	median[0] = cluster[half].x;
  }
  else{
  	median[0] = (cluster[half - 1].x + cluster[half].x) / 2.0;
  	
  }
  sortByAttribute(cluster, "y");
  if(odd){
  	median[1] = cluster[half].y;
  }
  else{
  	median[1] = (cluster[half - 1].y + cluster[half].y) / 2.0;
  }
  return median;

}

function getEdgeNums() {
	var nums = []
	for (var i = 0; i < numClusters; i++) {
		var e = graph.links.filter(function(l) {
			return l.source.membership_im == i && l.target.membership_im == i;
		});
	nums.push(e.length);
	}
	return nums;
}

function getClusters(){

	var edgenums = getEdgeNums();
	var clusters = [];
			for(var i = 0; i < numClusters; i++) {
					var c = graph.nodes.filter(function(n){
						return n.membership_im==i;
					});
					var sum = function(){
						var res = 0;
						for(var i = 0; i < c.length; i++){
							res += c[i].vweight;
						}
						return res;
					}();
					clusters.push({"label":clusterLabels[i], "cluster":c, "numNodes":c.length, "numEdges":edgenums[i], "totalVWeight":sum, "fontSize":nominalFontSize*log(25, sum)});
			}
		return clusters;
}


/* ~~~~~~~~~~~~~~ Checking country connectivity ~~~~~~~~~~~~~~ */

function findNeighborCells(id) {
	var delaunay = voronoi.links(graph.nodes);
	var res = delaunay.filter(function(l){
		dir1 = l.source["id"] == id
		dir2 = l.target["id"] == id
		return (dir1 || dir2)
	})
	var neighbors = []
	for(var i = 0; i < res.length; i++){
		res[i].source["id"]==id ? neighbors.push(res[i].target):neighbors.push(res[i].source)
	}
	return neighbors;
}

var euclidDistance = function(A, B) {
	return Math.sqrt(Math.pow((B.x-A.x),2)+Math.pow((B.y-A.y),2)); 
}

function log(b, n) {
    return Math.log(n) / Math.log(b);
}


function calculateAvgDist(){
	var distances = [];
	graph.links.forEach(function(e){
		var dist = euclidDistance({"x":e.source.x, "y":e.source.y}, {"x":e.target.x, "y":e.target.y});
		distances.push(dist);
	});
	var sum = distances.reduce(function(a, b) { return a + b; }, 0);
	return sum/distances.length;
}

function setRadius(){
	var avgDist = calculateAvgDist();
	radius = avgDist/3;
}

function adjust(){
	setRadius();
	zoom(getZoomFac());
	update();
}

function isConnected(cId){

	var result = true;
	var country = graph.nodes.filter(function(n) {return n.membership_im == cId});
	country.forEach(function(n) {
		var ns = findNeighborCells(n["id"]);
		var connected =	ns.some(function(n) {return n["membership_im"] === cId});
		if(connected == false){
			result = false;
		}
	});
	console.log("Country \""+clusterLabels[cId]+"\" is connected: "+result);
	return result;
}
/* ~~~~~~~~~~~~~~ Color and scale node circles ~~~~~~~~~~~~~~ */


function vweight(d) { return d['vweight'];}

function get_attribute(d, attribute) { return d[attribute]; }


function diet(d) { 
	if ( d["proponents"][0]["diet"] == "vegan") return 1;
	else if ( d["proponents"][0]["diet"] == "vegetarian") return 2;
	else if ( d["proponents"][0]["diet"] == "restricted") return 3;
	else if ( d["proponents"][0]["diet"] == "omni") return 4;
	else if ( d["proponents"][0]["diet"] == "none") return 5;
	else return 0;
}

/* country colors */
//var colors = ['#FF7F0E', '#FFBB78', '#1F77B4', '#AEC7E8' , '#2CA02C', '#98DF8A'];
//var seacolor = '#deeefc';

/* ~~~ Safari color scheme ~~~ 
Ethical Gourmania": '#DDE07F', 
Moderatia: '#E9AF1F', 
Omnivoria: '#039974', 
Traditionalistan: '#70ccaa', 
Veganland: '#B8C327', 
Vegetaristan: '#58A62C
Seacolor: '#C7DCD7'
*/

var seq_colors = ['#D55E00FF', '#009e73','#56B4E9FF','#F0E442FF','#CC79A7FF','#0072B2FF'];
//var seq_col_label = {"Gourmania": '#f1eef6', "Moderatia":'#d0d1e6', "Omnivoria":'#a6bddb', "Traditionalistan":'#74a9cf',"Vegania": '#2b8cbe', "Vegetaria":'#045a8d'}
var seq_col_label = {"Orange": '#D55E00FF', "Green":'#009e73', "Light Blue":'#56B4E9FF', "Yellow":'#F0E442FF',"Purple": '#CC79A7FF', "Blue":'#0072B2FF'}

var age_colors = d3.scale.ordinal()
        .domain(["12-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-74"])
        .range(["#e9dcf4", "#d9bcf2", "#c99eef" ,"#b980ed", "#a65bea", "#993fea", "#8e1fef", "#8102ef"]);

var gender_colors =d3.scale.ordinal()
        .domain(["male", "female", "unknown"])
        .range(['#99ccff','#ffcccc','#ccffcc']);

var diet_colors = d3.scale.ordinal()
        .domain(["omni", "restricted", "vegetarian", "vegan", "none"])
        .range(['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494']);



var hColors = ['#e98f51', '#f17014', '#5e624a', '#a4826d', '#d27d19', '#946a1c'];

/* ~~~ Alternate color scheme ~~~ */
var dcolors = ['#000099', '#006600', '#ff6600' , '#99cc00', '#6600ff', '#ff0066', '#cc3300'];

var support_color = "#e1f7d5";
var reject_color = "#ffbdbd";


function colorByMembership(d) { var cIdx = get_attribute(d, "membership_im");
								if (cIdx == -1) {return '#545c60';} //initial color for node
								else if(typeof(cIdx) !== "undefined"){return seq_colors[cIdx];}
								else {return '#E45E9D';}
}

function colorByDiet(d) { return dcolors[diet(d)]; }

function setDietColors(duration){
  console.log("highlighting");
  cellcircle.attr('fill', colorByDiet);
  setTimeout(function(){
  	cellcircle.attr('fill', colorByMembership);
  	}, duration);
}

function highlightColors(ids, duration){
  console.log("highlighting");
  cellcircle.attr('fill', function(d){
  	if (ids.indexOf(d["id"]) >= 0){
	  	var cIdx = get_attribute(d, "membership_im");
	  	return hColors[cIdx];
	}
	else {
		return colorByMembership(d);
	}
  });
  setTimeout(function(){
  	cellcircle.attr('fill', colorByMembership);
  	}, duration);
}

//this is to find the nodes given in "ids" (array of string-ids) on the map
function highlight(ids, duration){
  console.log("highlighting");
  cellcircle.attr('fill', function(d) {
	  if (ids.indexOf(d["id"]) >= 0){
		return 'blue';
	  }
	  else {
		return d3.select(this).attr('fill');
	  }
	});
  var to = setTimeout(function(){cellcircle.attr('fill', colorByMembership);}, duration);
}

function findSentenceId(stnc) {
	for (var i=0; i < sentence_pool.length; i++) {
		if (stnc == sentence_pool[i][4]){
			var id = sentence_pool[i][0];
		}
	}
	return id;
}

function findSupportiveNodes(sentence) {
	n = [];
	var s_id = ""+findSentenceId(sentence)+"";

	for (var i=0; i < graph.nodes.length; i++){
		if (checkClaimInNode(i,s_id) == 1) {
			n.push(graph.nodes[i]["id"]);
		}
	}
	return n; 
}

function findRejectingNodes(sentence) {
	n = [];
	var s_id = ""+findSentenceId(sentence)+"";

	for (var i=0; i < graph.nodes.length; i++){
		if (checkClaimInNode(i, s_id) == 0) {
			n.push(graph.nodes[i]["id"]);
		}
	}
	return n; 
}

function highlightSupportiveNodes(stnc, duration){
	
	cellcircle.attr('fill', function(d) {
		n = findSupportiveNodes(stnc);
		if(n.indexOf(d["id"]) !== -1){
			return support_color;
		}
		else {
			return seq_colors[get_attribute(d, "membership_im")];
		}
	});
	//var to = setTimeout(function(){cellcircle.attr('fill', colorByMembership);}, duration)
}

function highlightSupportiveNodesInOneCluster(stnc, cluster) {
	ids = [];

	for (n_id in cluster["cluster"]) {
	//console.log(c["cluster"][n_id]["id"]);
		ids.push(cluster["cluster"][n_id]["id"]);
	};

	cellcircle.attr('fill', function(d) {
		if(ids.indexOf(d["id"]) >= 0){
			n = findSupportiveNodes(stnc);
			if(n.indexOf(d["id"]) !== -1){
				return support_color;
			}
			else {
				return seq_colors[get_attribute(d, "membership_im")];
			}
		} else {
			return seq_colors[get_attribute(d, "membership_im")]
		}
	});
}

function highlightRejectingNodes(stnc, duration){
	
	cellcircle.attr('fill', function(d) {
		n = findRejectingNodes(stnc);
		if(n.indexOf(d["id"]) !== -1){
			return reject_color;
		}
		else {
			return seq_colors[get_attribute(d, "membership_im")];
		}
	});
	//var to = setTimeout(function(){cellcircle.attr('fill', colorByMembership);}, duration)
}

function highlightRejectingNodesInOneCluster(stnc, cluster) {
	ids = [];

	for (n_id in cluster["cluster"]) {
	//console.log(c["cluster"][n_id]["id"]);
		ids.push(cluster["cluster"][n_id]["id"]);
	};

	cellcircle.attr('fill', function(d) {
		if(ids.indexOf(d["id"]) >= 0){
			n = findRejectingNodes(stnc);
			if(n.indexOf(d["id"]) !== -1){
				return reject_color;
			}
			else {
				return seq_colors[get_attribute(d, "membership_im")];
			}
		} else {
			return seq_colors[get_attribute(d, "membership_im")]
		}
	});
}

function highlightSupRejNodes(stnc) {
	cellcircle.attr('fill', function(d) {
		s_nodes = findSupportiveNodes(stnc);
		r_nodes = findRejectingNodes(stnc);
		if(s_nodes.indexOf(d["id"]) !== -1){
			return support_color;
		}
		if(r_nodes.indexOf(d["id"]) !== -1){
			return reject_color;
		}
		else {
			return seq_colors[get_attribute(d, "membership_im")];
		}
	});
}


function selectNode(id) {
	cellcircle.attr('fill', function(d) {
		if(d["id"] == id){
			return '#f4c542';
		}
		else {
			return seq_colors[get_attribute(d, "membership_im")];
		}
	});
}
/* function highlightNode(id, duration){
  var find = quickFindNode(id)[0].id
  cellcircle.attr('fill', function(d) {
	  if (d["id"]==find){
		return 'blue';
	  }
	  else {
		return d3.select(this).attr('fill');
	  }
	});
  var to = setTimeout(function(){cellcircle.attr('fill', colorByMembership);}, duration);
}


//stmt is e.g. "17" (as string) to highlight all nodes that agreed to statement 17
function highlightSentence(stmt){
  cellcircle.attr('fill', function(d) {
      if (d.opinion.indexOf(","+stmt+",") !== -1){
        return 'red';
      }
      else {
        return colors[get_attribute(d, "membership_im")];
      }
    });
} */

function colorByChoice2(d) {

    selectValue = d3.select('select').property('value')

    if(selectValue =="None"){
		//console.log("Selected group");
			d3.selectAll(".legend").remove();
          	return seq_colors[d["membership_im"]];
       } else if(selectValue=="Gender") {
            drawGenderLegend();
            var female = gender_colors("female");
            var male = gender_colors("male");
            var unknown = gender_colors("unknown");

            if (d["proponents"].length == 1) {
                
                return gender_colors(d["proponents"][0]["gender"]);
                
            } else {
                var f_count = 0;
                var m_count = 0;
                var u_count = 0;
                var ratio = 1;

                for (i in d["proponents"]) {
                    switch (d["proponents"][i]["gender"]){
                        case "m": 
                            m_count = m_count + 1;
                            break;
                        case "f":
                            f_count = f_count + 1;
                            break;
                        default:
                            u_count = u_count + 1;
                    }    
                };

                if (m_count==0 && f_count >= 1) {
                    return female;
                } else if (f_count == 0 && m_count >=1){
                    return male;
                } else if (m_count==f_count){
                    ratio = 0.5;
                    return find_middle(ratio, male, female);
                } else if (m_count > f_count) {
                    ratio = (m_count/d["proponents"].length);
                    return find_middle(ratio, male, female);
                } else {
                    ratio = 1 - ((f_count/m_count) * 0.1);
                    return find_middle(ratio, male, female);
                }

            }
       } else if(selectValue=="Age") {
        		drawAgeLegend();
            if (d["proponents"].length == 1) {
                //return age_colors[ageToValue(get_attribute(d["proponents"][0], "age"))]; 
                return age_colors(d["proponents"][0]["age"]);
            } else {

                return age_colors(ageMedian(allAges(d["proponents"])));   
            }
            
       } else {
					drawDietLegend();
          	return diet_colors(d["proponents"][0]["diet"]); 
       }
}

function allAges(props) {
	ages = [];
	for (let index = 0; index < props.length; index++) {
		ages.push(props[index]["age"])
	}
	return ages;
}

function ageMedian(ages) {
	values = [];
	for (var i = 0; i<ages.length; i++) {
		values.push(parseInt(ages[i].split("-")[0]));
		values.push(parseInt(ages[i].split("-")[1]));
	}

	var med = median(values.sort());

	if (12 <=med && med <=17) {
		return "12-17";
	} else if (18<=med && med<=24) {
		return "18-24";	
	} else if (25<=med && med<=34) {
		return "25-34";
	} else if (35<=med && med<=44) {
		return "35-44";
	} else if (45<=med && med<=54) {
		return "45-54";
	} else if (55<=med && med<=64) {
		return "55-64";
	} else if (65<=med && med<=74) {
		return "65-74";
	} else {
		return "none";
	}
}

function median(values) {
	values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}


//returns true if l is an intracluster link and false if it is an intercluster link
function linktype(l){
	res = get_attribute(l, "source")["membership_im"] == get_attribute(l, "target")["membership_im"];
	return res; 
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 *  Polygon generators
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* Just for testing */
function CalculateHeartPoints(){
	var x, y;
	var data = [];
	var heartString = ""
	for (var i = 0; i < 350; i++) {
	  var t = i * 0.1;
	  x = 16 * Math.pow(Math.sin(t),3);
	  y = 13 * Math.cos(t) - 5* Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
	  data[i] = [x,y];
		if (i == 0) {
        	heartString = x + "," + y;
	    }
	    else {
	    	heartString += ", " + x + "," + y;
	    }
	}
	return heartString;
}

function CalculateStarPoints(centerX, centerY, arms, outerRadius, innerRadius)
{
   var results = "";
   var angle = Math.PI / arms;
   for (var i = 0; i < 2 * arms; i++) {
      // Use outer or inner radius depending on what iteration we are in.
      var r = (i & 1) == 0 ? outerRadius : innerRadius;
     
      var currX = centerX + Math.cos(i * angle) * r;
      var currY = centerY + Math.sin(i * angle) * r;

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0) {
         results = currX + "," + currY;
      }
      else {
         results += ", " + currX + "," + currY;
      }
   }
   return results;
}

var nGon = function(center, n, r)
{
   var results = "";
   var angle = (2*Math.PI)/n;
   for (var i = 0; i < n; i++) {
      // Use outer or inner radius depending on what iteration we are in.     
      var currX = center.x + Math.cos(i * angle) * r;
      var currY = center.y + Math.sin(i * angle) * r;
      console.log(i*angle);

      // Our first time we simply append the coordinates, subsequet times
      // we append a ", " to distinguish each coordinate pair.
      if (i == 0) {
         results = currX + "," + currY;
      }
      else {
         results += ", " + currX + "," + currY;
      }
   }
   return results;
}

var int2Hex = function(num) {
	return num.toString(16);
}

var hex2Int = function(hex) {
	return parseInt(hex, 16);
}

//completely deterministic, will generate same polygon for same input
var irregularNGon = function(id, center, radius) {
	//fails for "0e5eb753-c5df-4ccf-adb9-2805b9cd03f5"
	var minPoints = 10;
	var maxPoints = 20;
	var hexStrings =  id.replace(/-/g,'');
	hexStrings = hexStrings.match(/.{1,2}/g);
	var nums = hexStrings.map(hex2Int);
	//normalize
	var max = Math.max.apply(Math, nums);
	nums = nums.map(function(x){return x/max;});
	var len = nums.length;
	var points = "";

	var angle = 0;
	var i = 0;
	for(var i = 0; i< maxPoints; i++) {
		angle += 1.3*nums[i%len]*2*Math.PI/minPoints;
		if(2*Math.PI < angle) break;

		var x = center.x + Math.cos(angle) * radius;
        var y = center.y + Math.sin(angle) * radius;
        if (i == 0) {
         points = x + "," + y;
	    }
	    else {
	      points += ", " + x + "," + y;
	    }
	}
	return points;
	//return results;
}

// angle += (a*i+b)%(4*Math.PI/10);
// i++;
// testCircle({"x":(quickFindNode("32fe")[0].x + Math.cos(angle) * radius), "y":(quickFindNode("32fe")[0].y + Math.sin(angle) * radius)}, 10, "red");


//testPoly(pseudoRandomPolygon(graph.nodes[0].id, {"x":graph.nodes[0].x, "y":graph.nodes[0].y}, 200, 230), "pink");


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 *  Displaying messages
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* time spans for showing dialogues etc. --> should be tested in a user study */
	var durationStartMsg = 15000;
	var durationNonsinkMsg = 60000;
	var durationInconsMsg = 30000;
	var durationDupMsg = 15000;
	var durationInsert = 5000;
	var durationCountry = 60000;
	var durationFillWait = 500;

var locWidth = 63, locHeight = 68;
// First Label used to be: "Country of Considerate Gourmets", but needed shorter name like Gourmania-Ethica
var clusterLabels = ["ETHICAL GOURMANIA", "MODERATIA", "OMNIVORIA", "TRADITIONALISTAN", "VEGANLAND", "VEGETARISTAN"];

//This variable stores the short names for accessing country descriptions in countryInfo
var shortNames = ["gourmania", "moderatia", "omnivoria", "tradition", "veganland", "vegetaria"]

var countryInfo = {
	"gourmania": {
					header: clusterLabels[0],
					desc_de: "In die&shy;sem Land gilt der Kon&shy;sum von Fleisch aus ku&shy;li&shy;na&shy;rischen und kul&shy;tu&shy;rellen Grün&shy;den prin&shy;zi&shy;piell als zu&shy;lässig. Aller&shy;dings wer&shy;den auch die Pro&shy;bleme der mo&shy;dernen Mas&shy;sen&shy;tier&shy;hal&shy;tung an&shy;er&shy;kannt. Da&shy;her herrscht die Über&shy;zeu&shy;gung, dass nur Fleisch aus nach&shy;hal&shy;tiger Bio&shy;-Pro&shy;duk&shy;tion ver&shy;zehrt wer&shy;den sollte.",
					desc_en: "In this coun&shy;try, eating meat is in prin&shy;ciple deemed per&shy;missible for rea&shy;sons of taste and cul&shy;tural tra&shy;dition. How&shy;ever, the problems of modern mass farming are also acknow&shy;ledged, which ex&shy;plains the wide&shy;-shared be&shy;lief that on&shy;ly meat from sus&shy;tainable and or&shy;ganic pro&shy;duction may be con&shy;sumed.",
					colorscheme: {header:"#656841", infotext:"#f6f9ca", footer:"#b2b771"},
					img: "static/img/icon_lobster.svg"
	},
	"moderatia": {
					header: "Once-A-Week-Land (aka  " + clusterLabels[1] + ")",
					desc_de: "In die&shy;sem Land herrscht ein tief&shy;greifendes Be&shy;wusst&shy;sein für die di&shy;versen Pro&shy;bleme mo&shy;derner Massen&shy;tier&shy;haltung – von der Miss&shy;achtung von Tier&shy;rechten bis hin zu glo&shy;balem Kli&shy;ma&shy;wandel. Eine (möglicher&shy;weise dras&shy;tische) Re&shy;duktion des Fleisch&shy;konsums und der Boy&shy;kott von Pro&shy;dukten aus Massen&shy;tier&shy;haltung gel&shy;ten als an&shy;ge&shy;messene Re&shy;aktion auf diese Pro&shy;bleme. Viele fordern so&shy;gar, dass der Kon&shy;sum be&shy;liebiger tierischer Pro&shy;dukte re&shy;duziert wird.", 
					desc_en: "In this coun&shy;try, there exist a pro&shy;found aware&shy;ness and re&shy;cognition of the diverse pro&shy;blems of mass farming – ranging from vio&shy;lations of animal rights in the farm to global climate change. A (possibly drastic) re&shy;duction of meat con&shy;sumption and a boy&shy;cott of pro&shy;ducts from mass farming are con&shy;sidered to be appropriate answers to these problems. Many even demand that the con&shy;sumption of all animal pro&shy;ducts what&shy;so&shy;ever be re&shy;duced.", 
					colorscheme: {header:"#514218", infotext:"#f7e6b7", footer:"#c49f36"},
					img: "static/img/icon_scale.svg"
	},
	"omnivoria": {
					header: "All-You-Can-(M)eat (aka  " + clusterLabels[2] + ")",
					desc_de: "In diesem Land werden Fleisch&shy;gerichte als zu lecker an&shy;gesehen, um auf sie zu ver&shy;zichten. Tiere gelten nicht als Krea&shy;turen mit einem Recht auf Le&shy;ben. Be&shy;wohner dieses Landes sehen mod&shy;erne Massen&shy;tier&shy;haltung generell nicht als sehr pro&shy;blema&shy;tisch an. Da&shy;her kann man in diesem Land im Grunde essen, was auch immer einem ge&shy;fällt.", 
					desc_en: "In this country, meat is con&shy;sidered to be way too de&shy;licious to be ab&shy;stained from. Animals are not re&shy;cognized as beings with a right to life. And modern mass farming, it is be&shy;lieved, doesn't re&shy;present much of a problem any&shy;way. So, in this country, you may basically eat what you want.", 
					colorscheme: {header:"#196b57", infotext:"#a4f4e0", footer:"#30d3ab"},
					img: "static/img/icon_meat.svg"
	},
	"tradition": {
					header: clusterLabels[3],
					desc_de: "In diesem Land, wird das Tö&shy;ten und Es&shy;sen von Tieren als sehr na&shy;türlich an&shy;gesehen. Die tra&shy;ditionelle mensch&shy;liche Er&shy;nährung gilt im Grunde als un&shy;pro&shy;blematisch. Jeg&shy;liche mora&shy;lische For&shy;derungen, seine in&shy;di&shy;vi&shy;duellen Ess&shy;ge&shy;wohn&shy;heiten zu ändern werden als un&shy;an&shy;ge&shy;brachter Be&shy;vor&shy;mundungs&shy;ver&shy;such ab&shy;ge&shy;lehnt.", 
					desc_en: "In this country, killing and eating animals is seen as some&shy;thing very natural. The tra&shy;ditional human diet is essentially viewed as un&shy;pro&shy;blematic. Any moral demands to change in&shy;dividual eating habits are re&shy;jected as pa&shy;ter&shy;nalistic and out&shy;-of&shy;-place.", 
					colorscheme: {header:"#2e4f42", infotext:"#c4fce6", footer:"#5da387"},
					img: "static/img/icon_cloche.svg"
	},
	"veganland": {
					header: clusterLabels[4],
					desc_de: "In diesem Land werden jeg&shy;liche Tier&shy;produkte abgelehnt. An&shy;gesichts aller Pro&shy;bleme bei der Tier&shy;haltung und der un&shy;ver&shy;meidlichen Un&shy;ge&shy;wiss&shy;heit der Kon&shy;su&shy;men&shy;ten über die tat&shy;sächlichen Lebens&shy;um&shy;stände der Nutz&shy;tiere wird ein&shy;stimmig eine ve&shy;gane Er&shy;nährungs&shy;weise gefordert. Aus kuli&shy;narischer Sicht wird die vegane Küche weit&shy;hin als nicht weniger lecker als die tra&shy;ditionelle emp&shy;funden.",
					desc_en: "In this country, animal pro&shy;ducts of any kind are a no-go. In view of all the problems of farming animals and the con&shy;sumer's irreducible un&shy;certain&shy;ty about what is really going on in a farm, a vegan diet is un&shy;ani&shy;mously de&shy;manded. From a culi&shy;nary point of view, the vegan cui&shy;sine is con&shy;sidered as no less de&shy;licious than the tra&shy;ditional one.",
					colorscheme: {header:"#555b21", infotext:"#e8efac", footer:"#a8b53f"},
					img: "static/img/icon_vegan.svg"
	},
	"vegetaria": {
					header: clusterLabels[5],
					desc_de: "In diesem Land darf kein Fleisch konsumiert werden, während der Ver&shy;zehr sons&shy;tiger Tier&shy;produkte voll&shy;kommen ak&shy;zeptabel ist. Tiere für Fleisch zu töten wird als un&shy;ethisch an&shy;gesehen. Nutz&shy;tier&shy;haltung zur Pro&shy;duktion von etwa Eiern und Milch gilt je&shy;doch nicht zwangs&shy;läufig als pro&shy;blema&shy;tisch. Ve&shy;getarische Ge&shy;richte werden als (mindestens) ge&shy;nau&shy;so lecker und nahr&shy;haft wie tra&shy;ditionelle emp&shy;funden.",
					desc_en: "In this country, one must not eat meat, while other animal pro&shy;ducts may very well be con&shy;sumed. Killing animals for meat pro&shy;duction is con&shy;sidered to be un&shy;-ethical. Far&shy;ming animals in order to produce, e.g., eggs or milk, it is be&shy;lieved how&shy;ever, is not ne&shy;cessarily pro&shy;blematic. Vege&shy;tarian dishes are judged to be (at least) as de&shy;licious and heal&shy;thy as tra&shy;ditional ones.",
					colorscheme: {header:"#3e662b", infotext:"#d8f9c7", footer:"#6bb249"},
					img: "static/img/icon_veggie.svg"
	},
}

var messages = {
	"abort": {	"de": {
						header: "Abbruch",
						desc: "Be&shy;rech&shy;nungen wur&shy;den ab&shy;ge&shy;brochen",
						img: "static/img/icon_abort.svg"
				},
				"en": {
						header: "Abort",
						desc: "Pro&shy;cess was cancelled",
						img: "static/img/icon_abort.svg"
				}
	},
	"duplicate": {	"de": {
						header: "Duplikat",
						desc: "Deine Mei&shy;nung wurde be&shy;reits ge&shy;nau&shy;so ge&shy;nannt. Sie wird gleich auf der Karte mar&shy;kiert.",
						img: "static/img/icon_dupli.svg"
			        },
					"en": {
						header: "Duplicate opinion",
						desc: "Your opinion has al&shy;ready been stated by some&shy;one else, it will now be high&shy;lighted on the map.",
						img: "static/img/icon_dupli.svg"
					}
	},
	"inconsistent": {	"de": {
						header: "Interpretation nicht möglich",
						desc: "Wir konnten deine Mei&shy;nung nicht kon&shy;sistent inter&shy;pretieren. Bitte über&shy;denke deine Ant&shy;worten.",
						img: "static/img/icon_question.svg"
			        },
					"en": {
						header: "Interpretation failed",
						desc: "We aren’t able to inter&shy;pret your opinion in a con&shy;sistent way. Please re&shy;consider your answers.",
						img: "static/img/icon_question.svg"
					}
	},
	"newnode": {	"de": {
						header: "Deine Meinung",
						desc: "Ein neuer Kno&shy;ten, welcher deine Mein&shy;ung re&shy;prä&shy;sentiert, wird nun in die Karte ein&shy;gefügt.",
						img: "static/img/icon_new.svg"
			        },
					"en": {
						header: "Your opinion",
						desc: "A new node, that re&shy;presents your opinion, will now be in&shy;serted to the map.",
						img: "static/img/icon_new.svg"
					}
	},
	"nonsink": {	"de": {
						header: "Deine Meinung",
						desc: "Deine Mei&shy;nung wird von ei&shy;nigen an&shy;deren Mei&shy;nungen mit ein&shy;ge&shy;schlos&shy;sen. Diese sind auf der Karte mar&shy;kiert.",
						img: "static/img/icon_question.svg"
			        },
					"en": {
						header: "Your opinion",
						desc: "Your opinion generalizes a number of other opinions, which are high&shy;lighted on the map.",
						img: "static/img/icon_question.svg"
					}
	}
}

function setVisibleDuration(selector, duration) {
	//document.getElementById(selector).style.display = "block";
	document.getElementById(selector).style.opacity = 0.8;
	setTimeout(function(){document.getElementById(selector).style.opacity = 0;}, duration);
}

function setVisible(selector) {
	//document.getElementById(selector).style.display = "block";
	document.getElementById(selector).style.opacity = 0.8;

}

function setInvisible(selector) {
	//document.getElementById(selector).style.display = "none";
	document.getElementById(selector).style.opacity = 0;
}

function isVisible(selector) {
	return document.getElementById(selector).style.opacity > 0;
}

function fillSelected(selector, text) {
	document.getElementById(selector).innerHTML = text;
}

function fillBox(object) {
	var headerText = "Your Predicted Country: " + object.header;
	fillSelected("tpl_header", headerText);
	document.getElementById("tpl_desc").innerHTML = object.desc;
	document.getElementById("tpl_img").src = object.img;
}

function fillCountryBox(country, lang, predicted) {
	var headerText = (lang=="de"?"Dein Voraussichtliches Land: ":"Your Predicted Country: ");
	if(!predicted){
		headerText = (lang=="de"? headerText.replace('Voraussichtliches ',''):headerText.replace('Predicted ',''));
	}
	var country = countryInfo[country];
	document.getElementById("tpl_header").style.backgroundColor = country["colorscheme"]["header"];
	fillSelected("tpl_header", headerText + country["header"]);
	document.getElementById("tpl_desc_wrapper").style.backgroundColor = country["colorscheme"]["infotext"];
	document.getElementById("tpl_desc").innerHTML = (lang=="de"? country["desc_de"]:country["desc_en"]);
	document.getElementById("tpl_footer").style.backgroundColor = country["colorscheme"]["footer"];
	// document.getElementById("progressbar").style.backgroundColor = country["colorscheme"]["infotext"];
	// document.getElementById("progressbar").style.border = "5px solid "+country["colorscheme"]["infotext"];
	// document.getElementById("progress").style.backgroundColor = country["colorscheme"]["header"];
	var footerText = "";
	if(!predicted){
		footerText = (lang=="de"? "Berechnungen abgeschlossen":"Calculations completed");
	}
	else {
		footerText = (lang=="de"? "Berechnungen laufen" : "Calculations in progress");
	}
	fillSelected("footer_text", footerText);
	document.getElementById("tpl_img").src = country["img"];
}

function setProgress(current, total, color){
	var percentage = (current/total*100).toFixed(0);
	document.getElementById("progress").setAttribute("style","width:"+percentage+"%");
	document.getElementById("percentage").innerHTML = percentage+"%";
	document.getElementById("progress").style.backgroundColor = color;
}

function resetProgress(){
	document.getElementById("progress").setAttribute("style","width:0%");
	document.getElementById("percentage").innerHTML = "0%";
}

function fillMessageBox(message, lang) {
	document.getElementById("tpl_header_msg").innerHTML = messages[message][lang]["header"];
	document.getElementById("tpl_msg").innerHTML = messages[message][lang]["desc"];
	if(!(typeof(messages[message][lang]["img"]) == "undefined")) {
		document.getElementById("tpl_img_msg").src = messages[message][lang]["img"];
	}
}

function fillFooter(text) {
	document.getElementById("footer_text").innerHTML = text; 
}

/* ~~~~~~~~~~~~~~ Generate debugging console output ~~~~~~~~~~~~~~ */

var testScreenCoordinate = function (x,y,r,color){
	d3.select("body")
	.append("svg")
	.append("svg:circle")
	.attr("class", "screentest")
	.attr("cx", x)
	.attr("cy",y)
	.attr("r",r)
	.attr("fill",color);
}

var testCircle = function (cp, r, color){
	svg.append("circle")
	.attr("class", "dummy")
	.attr("cx", cp.x)
	.attr("cy", cp.y)
	.attr("r", r)
	.attr("fill", color);
}

var testPoly = function (points, color){
	svg.append("polygon")
	.attr("class", "dummy")
	.attr("points", points)
	.attr("fill", color);
}

var testImage = function (url, x, y, w, h) {
	var test = svg.append("svg:image")
	   .attr("xlink:href", url)
	   .attr("class", "dummy")
	   .attr("width", w)
	   .attr("height", h)
	   .attr("x", x)
	   .attr("y", y);
	 return test;
}

"static/img/icon_lobster.svg"


var testCircles = function (points, r, color) {
	svg.selectAll("dummy")
	.data(points)
	.enter()
	.append("circle")
	.attr("class", "dummy")
	.attr("cx", function(d){return d.x;})
	.attr("cy", function(d){return d.y;})
	.attr("fill", color)
	.attr("r", r);
}

var testLines = function (xs, color) {
	svg.selectAll("dummy")
	.data(xs)
	.enter()
	.append("line")
	.attr("class", "dummy")
        .attr("x1", function(d) {return d;})
        .attr("y1", 0)
        .attr("x2", function(d) {return d;})
        .attr("y2", height)
        .style("stroke", "rgb(6,120,155)")
        .style("stroke-width", 2); 
}

var grid = function (container, xlines, ylines) {

	var w = container.attr("width");
	var h = container.attr("height");
	var offsets = function(count, dim){
		var result = [];
		var numerator = dim=="x"?w:h;
		for(var i = 0; i <= count+1; i++){
			result.push(i*numerator/(count+1));
		}
		return result;
	};

	var xOffsets = offsets(xlines, "x");
	var yOffsets = offsets(ylines, "y");
	
	container.selectAll("grid")
	.data(xOffsets)
	.enter()
	.append("line")
	.attr("class", "grid")
        .attr("x1", function(d) {return d;})
        .attr("y1", 0)
        .attr("x2", function(d) {return d;})
        .attr("y2", h)
        .style("stroke", "#8bc4d6")
        .style("stroke-width", 1); 

    container.selectAll("grid")
	.data(yOffsets)
	.enter()
	.append("line")
	.attr("class", "grid")
        .attr("x1", 0)
        .attr("y1", function(d) {return d;})
        .attr("x2", w)
        .attr("y2", function(d) {return d;})
        .style("stroke", "#8bc4d6")
        .style("stroke-width", 1); 
}

var removeTests = function(){
	d3.selectAll(".dummy").remove();
}

function getFormattedDate() {
	var date = new Date();
	var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+ ":"+date.getMilliseconds();

	return time;
}

/**
* For console output, logs time a process has taken.
* @param {Date object} starttime - the time a process has started.
* @param {Date object} endtime - the time a process has ended.
* @return {String} str - minutes and seconds the process has lasted
*/
function logTime(starttime, endtime) {

	var start = [];
	start[0]=starttime.getHours();
	start[1]=starttime.getMinutes();
	start[2]=starttime.getSeconds();

	var end = [];
	end[0]=endtime.getHours();
	end[1]=endtime.getMinutes();
	end[2]=endtime.getSeconds();

	var secsPassed = (end[0]*60*60+end[1]*60+end[2])-(start[0]*60*60+start[1]*60+start[2]);
	var minutes = Math.floor(secsPassed/60);
	var seconds = secsPassed % 60;
	var str = minutes.toString() + " minutes "+seconds.toString()+" seconds";
	return str;

}

/* ~~~~~~~~~~~~~~ Initialisation of force layout coordinates and vweights ~~~~~~~~~~~~~~ */

// var initCoords = [{"x":width/2,"y":height/3},
// 				  {"x":width/2,"y":2*height/3}, 
// 				  {"x":width/2+width/4,"y":height/3},
// 				  {"x":width/2+width/4,"y":2*height/3},
// 				  {"x":width/2-width/4,"y":height/3},
// 				  {"x":width/2-width/4,"y":2*height/3}, 
// 				  {"x":0, "y":0}];


var initCoords = [{"x":width/2,"y":0},
				  {"x":width/2,"y":height}, 
				  {"x":width/2+width/4,"y":height/3},
				  {"x":width/2+width/4,"y":2*height/3},
				  {"x":0,"y":height},
				  {"x":width/2-width/4,"y":2*height/3}, 
				  {"x":0, "y":0}];

var variance = {"x":40, "y":40};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrentCoords() {
	var coords = [];
	for(var i = 0; i<graph.nodes.length; i++){
    	coords.push({"x":graph.nodes[i].x, "y":graph.nodes[i].y});
	}
	console.log(JSON.stringify(coords));
}

function initializeCoords(n) {
	var idx = n.membership_im
	if(idx == -1 || idx == -2) idx = 6; // should not be necessary 
	n.x = getRandomInt(initCoords[idx]["x"]-variance["x"], initCoords[idx]["x"]+variance["x"]);	
	n.y = getRandomInt(initCoords[idx]["y"]-variance["y"], initCoords[idx]["y"]+variance["y"]);	

}

var initConfig = [{"x":673.4361890575803,"y":581.2336828172445},{"x":1318.3511627674259,"y":530.5997137884392},{"x":703.3350430358324,"y":493.2002112259959},{"x":752.6105961099847,"y":356.98115972425734},{"x":815.7999435097694,"y":324.39658347632724},{"x":955.6515643300266,"y":276.80166502039975},{"x":1243.1202983748658,"y":571.4256411483698},{"x":1311.0068548703337,"y":550.503153867584},{"x":699.235092663293,"y":410.5867703713361},{"x":1011.9680266835761,"y":564.3123929001874},{"x":1373.5600601200917,"y":484.8609834742008},{"x":1152.0590317548551,"y":235.55784780000118},{"x":1277.3072330034292,"y":524.2834545745446},{"x":1114.3005284495096,"y":380.090459169671},{"x":1353.3957061297576,"y":511.7619429356048},{"x":932.5392131167679,"y":471.274778717344},{"x":427.0482783792365,"y":457.1167258409325},{"x":890.4003829593835,"y":459.1013978462384},{"x":1079.962952472838,"y":413.1857123733986},{"x":890.5034784271505,"y":177.60973243802843},{"x":1002.810985482523,"y":337.3540491834047},{"x":875.2697028265999,"y":281.2200710351131},{"x":913.2020375596047,"y":582.9379980825938},{"x":818.314773550883,"y":472.7279094004012},{"x":1186.5630675368761,"y":432.2019134730359},{"x":1036.2264896427514,"y":411.8082734132971},{"x":786.6366959915423,"y":472.703562574584},{"x":464.08312407386586,"y":477.0028928938153},{"x":1083.0440461964433,"y":167.2519823645861},{"x":996.6979034928552,"y":464.8704017623494},{"x":702.858499247211,"y":269.52835731981907},{"x":600.7875767276439,"y":385.3549992936037},{"x":906.706858620022,"y":240.40430011185364},{"x":861.696564841387,"y":489.03942128338844},{"x":1053.7092334673232,"y":322.35000482189054},{"x":318.6566145682496,"y":411.3091062066198},{"x":1210.6420112715177,"y":587.6113204691719},{"x":1429.4353417850932,"y":448.48578650597796},{"x":957.4645413540479,"y":239.77260220764873},{"x":1372.4890476645612,"y":426.6527460738588},{"x":1354.5938773449634,"y":469.70299658718835},{"x":1147.5387829007548,"y":262.1377632183068},{"x":1254.0336588352181,"y":485.68843826085634},{"x":613.0881319629054,"y":488.3796010741349},{"x":826.8105810823383,"y":228.81992416653534},{"x":725.4716355047283,"y":331.56539280236626},{"x":1351.8760809717778,"y":452.32589458696987},{"x":1026.1216994052063,"y":271.08791093534865},{"x":604.328585070449,"y":316.29686378874965},{"x":705.2504517022203,"y":566.1668466061868},{"x":751.39792126281,"y":504.82919804073754},{"x":970.0997280457713,"y":454.02339058892176},{"x":748.1315605700717,"y":293.4057003890009},{"x":637.4884587262633,"y":523.1958345411734},{"x":936.2877235782627,"y":200.2392349149507},{"x":1384.6002365063707,"y":460.825006057003},{"x":997.3556478787451,"y":282.9074123406493},{"x":1094.0286667328298,"y":553.6199203840471},{"x":1117.5906909332778,"y":218.9394752820997},{"x":703.5947577592192,"y":319.4426934542472},{"x":668.4626409087329,"y":477.95634916422426},{"x":990.3290256481615,"y":208.0780428170133},{"x":643.6798306443137,"y":474.3001193896036},{"x":834.8884824268798,"y":270.30594874727774},{"x":1348.0857741126354,"y":493.6670270159436},{"x":1037.544168795326,"y":377.8479737361385},{"x":1299.9157651343012,"y":573.026990003589},{"x":691.3682209638168,"y":517.340324334995},{"x":781.1356143605497,"y":505.1281482050416},{"x":739.7319653734066,"y":470.601068493565},{"x":721.6849211225342,"y":286.1538115958696},{"x":740.2182834161526,"y":539.8021447766499},{"x":1257.2465406901365,"y":515.9937457528183},{"x":730.3527059628292,"y":240.35511003014713},{"x":1071.3142419329786,"y":219.61549330431654},{"x":749.2459366692799,"y":607.2446062477405},{"x":1329.1401053201548,"y":462.3323339264771},{"x":815.7841609884416,"y":355.43040397782784},{"x":1202.3841050540423,"y":574.7796947050297},{"x":659.6911685997858,"y":324.9639854809833},{"x":1360.3827037671908,"y":525.43839666281},{"x":1044.0861543462076,"y":160.4396724831206},{"x":1144.7044445922654,"y":333.56746847658957},{"x":785.2350337060485,"y":333.37825073378076},{"x":830.3959334345905,"y":514.8004408562754},{"x":961.4386242222904,"y":317.973561357982},{"x":1086.0329880579243,"y":267.51583868104706},{"x":1327.7153172019082,"y":507.7314391327251},{"x":681.7346346092089,"y":275.21032123555517},{"x":1283.0885425980193,"y":428.05812153131274},{"x":1012.1029771667594,"y":431.88467424908646},{"x":746.2066806292951,"y":190.42864236583947},{"x":931.052028154548,"y":436.93094103532974},{"x":1293.3624217370277,"y":537.7597930574981},{"x":898.0683270618836,"y":490.2625890723216},{"x":1103.7132472449387,"y":182.31445419022523},{"x":776.5144188463669,"y":254.57527953303511},{"x":1214.0401269870943,"y":565.4722780508043},{"x":1332.4930696323293,"y":545.2323227498446},{"x":789.7714238659925,"y":210.75281897646374},{"x":1226.7867575499981,"y":551.533465366555},{"x":913.0554133798258,"y":144.60656240409708},{"x":1279.662482993712,"y":483.9343019843406},{"x":1278.43059128714,"y":502.7618700397116},{"x":800.3181010842309,"y":536.5560995057575},{"x":655.8958891392631,"y":266.38722380701523},{"x":1072.9321611353653,"y":376.64272921023985},{"x":1058.026368867734,"y":474.3600183485066},{"x":771.2208868234684,"y":524.4424897208213},{"x":775.6168419801577,"y":447.3628098842993},{"x":767.2981202079949,"y":559.2720673654075},{"x":883.4327664801791,"y":142.0698691387578},{"x":699.7370777539871,"y":343.7012609402345},{"x":1038.8387593869986,"y":193.53577749718497},{"x":1108.712652714678,"y":334.4824140532944},{"x":813.9466723169737,"y":167.25404329355752},{"x":645.1638500369307,"y":449.3314820677674},{"x":595.2493945762434,"y":522.3031450843287},{"x":1023.6989175866413,"y":473.8176636514739},{"x":1130.2240574555217,"y":314.44161116982764},{"x":957.3110539002322,"y":162.3663557229908},{"x":870.0113084525766,"y":521.1488884283016},{"x":962.7695906601315,"y":406.531662694856},{"x":303.06524988958176,"y":383.09995572489044},{"x":1028.3950026467614,"y":225.396178884991},{"x":462.18978492131686,"y":492.09018047403094},{"x":283.2668126050015,"y":360.725725521593},{"x":925.7960296474017,"y":529.9375984278801},{"x":826.9140594971944,"y":569.0047330667792},{"x":957.6457497879786,"y":510.68373195950323},{"x":862.0416668724856,"y":227.95997550239665},{"x":899.877899685687,"y":370.96749937884084},{"x":1312.9496128481503,"y":484.1998819465814},{"x":1097.455326802998,"y":583.8943981708753},{"x":1351.5339918037278,"y":434.59277952056044},{"x":626.5795554277328,"y":310.13916746595675},{"x":1262.8893373907586,"y":556.9609973906495},{"x":800.0094604896157,"y":437.73743468318213},{"x":907.4273322441741,"y":285.2953850126393},{"x":1174.7264906413222,"y":596.0031209982035},{"x":1253.7319532052272,"y":590.4905371984471},{"x":857.2634558136446,"y":476.61957292875536},{"x":1006.700763864352,"y":378.06773960814365},{"x":758.7066737291716,"y":459.85246661849146},{"x":1229.1877376892428,"y":589.0720866950214},{"x":1308.2836506038532,"y":517.2669646231176},{"x":323.9662643920449,"y":366.9749314478422},{"x":987.7961059825575,"y":351.4542550535044},{"x":811.7468396674,"y":256.5326741064514},{"x":780.2502602658163,"y":294.60004913934927},{"x":1281.2969050372662,"y":553.7828813313117},{"x":1057.3689918687915,"y":435.53604062216345},{"x":1331.4668075229738,"y":435.36823985584056},{"x":1298.9706549882815,"y":493.8299046002055},{"x":1189.0818935485734,"y":536.9712916869971},{"x":1168.653087033916,"y":517.4806765453293},{"x":861.5575548398841,"y":194.00883716123997},{"x":1289.3033364695239,"y":583.8934457013734},{"x":1013.5797266383536,"y":137.7641247221043},{"x":722.6190147006428,"y":517.1018460188803},{"x":1203.1078973168962,"y":282.35934953378336}]; 
//[{"x":476.19998007650884,"y":482.02462961768737},{"x":1237.965947284406,"y":464.22044942249056},{"x":552.4985558354956,"y":468.37775645511334},{"x":648.9280853312329,"y":472.1126712829332},{"x":703.2771073249493,"y":373.49538614339457},{"x":808.7159571927033,"y":293.3900794948358},{"x":1174.9892855870858,"y":500.61221087638387},{"x":1238.2493884203438,"y":481.20211047262814},{"x":561.2904723054035,"y":399.3851907099446},{"x":936.6283096935268,"y":530.3210143048607},{"x":1273.3188218059322,"y":372.507070809395},{"x":1027.3448414566526,"y":282.7222224869799},{"x":1195.9877065791384,"y":458.3539791163162},{"x":984.5364700511569,"y":348.8963279206086},{"x":1271.5126358353875,"y":454.39907819967425},{"x":790.0886853611383,"y":529.6588116864195},{"x":288.12590842746346,"y":453.68431397814385},{"x":706.8266490739617,"y":326.39647438982604},{"x":912.1420475215868,"y":290.1651700043566},{"x":809.0724427437497,"y":243.21577070386323},{"x":881.4715012891462,"y":504.6877393706483},{"x":856.1749987843765,"y":450.5264721711117},{"x":774.2798788381702,"y":554.8598146153779},{"x":668.7737300725544,"y":499.3607812790108},{"x":1084.7887936175782,"y":409.37894099305163},{"x":772.1100443595611,"y":223.66780868853627},{"x":625.112679509341,"y":451.7074443656968},{"x":315.4475959608056,"y":490.6533810469637},{"x":1031.5052271143313,"y":332.2928139585964},{"x":816.7849001289138,"y":350.9128886305279},{"x":627.8710501613707,"y":334.4310273703359},{"x":470.12055578922383,"y":335.4380996046631},{"x":843.5602909655943,"y":322.01113054953953},{"x":688.6646879585777,"y":406.8973374047094},{"x":948.1261673771795,"y":321.24258667645904},{"x":197.4611934091826,"y":393.3619986398022},{"x":1146.111658514697,"y":513.293143598297},{"x":1347.138624256194,"y":386.10456093343487},{"x":927.3982301585198,"y":482.8280641751869},{"x":1282.618380422733,"y":384.9908392630178},{"x":1259.1043208372305,"y":407.2926265042243},{"x":997.5819222500282,"y":259.2183146937923},{"x":1171.4855030260517,"y":422.06492329246186},{"x":483.90969347733727,"y":445.099547606949},{"x":712.3767714397346,"y":256.3740222831906},{"x":631.1765702946645,"y":419.296555906065},{"x":1256.840496313748,"y":394.7117375572283},{"x":901.2849846387031,"y":408.2156323099839},{"x":504.13201915560404,"y":269.66380436178787},{"x":522.6670676316548,"y":520.9694385849243},{"x":531.730370940357,"y":350.364824617787},{"x":824.7356450511646,"y":487.7098041548004},{"x":631.5303218459311,"y":286.3532111779614},{"x":446.83135289649164,"y":441.3807756504265},{"x":837.1257360956081,"y":238.6631254159653},{"x":1296.2421817899187,"y":408.06183212942176},{"x":822.1702330162344,"y":199.3968298196306},{"x":1006.8173245947053,"y":510.275693426471},{"x":1016.9358374735313,"y":357.35365722670883},{"x":597.299799740336,"y":315.64959221169227},{"x":493.2597933585532,"y":410.75832264192616},{"x":865.3618413295851,"y":204.81480901606517},{"x":473.22937624395064,"y":392.37084147400867},{"x":734.0718892233247,"y":241.97666626379998},{"x":1271.3951712246153,"y":421.5587532440578},{"x":939.0449259075768,"y":456.6915910371657},{"x":1237.4708107033775,"y":501.8711613351182},{"x":499.23553916519364,"y":466.56462138117405},{"x":587.8416203831194,"y":342.4296830482079},{"x":600.8843790934669,"y":463.25069784550504},{"x":601.2285533670141,"y":254.34691794179236},{"x":537.5278564198621,"y":483.0606676795156},{"x":1180.3844527912163,"y":447.6327676729312},{"x":622.4216499379146,"y":228.25212888522077},{"x":999.6795853923612,"y":437.1924961980029},{"x":486.9361381914953,"y":523.9000280424232},{"x":1238.8494253790382,"y":381.4397070496804},{"x":733.3143147706209,"y":345.8836923353125},{"x":1134.1410387217595,"y":509.022608441361},{"x":541.5368520300716,"y":289.27161731318205},{"x":1288.064908623598,"y":443.15191271327967},{"x":955.5194860595847,"y":213.46404589630527},{"x":989.0344757948171,"y":300.07035853865153},{"x":666.4006338124381,"y":338.64631764150596},{"x":656.7581287429831,"y":444.1141079763769},{"x":791.5864346202784,"y":336.4001557474333},{"x":958.0424275420977,"y":396.2274375828804},{"x":1245.9072419944741,"y":434.6403871230429},{"x":570.5136269378543,"y":237.27936069423438},{"x":1180.8274644725327,"y":381.7052643257106},{"x":890.8022603825972,"y":456.2549560329156},{"x":665.0545645493363,"y":216.9265993080904},{"x":750.4660652721856,"y":313.55554677086064},{"x":1216.2948359051247,"y":461.05024731865893},{"x":692.7580311967606,"y":349.22531107167254},{"x":1019.9082717813451,"y":308.8237618711382},{"x":683.0348759801107,"y":301.45787265436104},{"x":1144.650586325055,"y":493.01334124014136},{"x":1254.0239724782202,"y":462.5095170808253},{"x":691.0484181937564,"y":184.9350953456969},{"x":1154.491567895195,"y":481.2150674476225},{"x":801.9816867670019,"y":168.90091373058826},{"x":1193.543204444703,"y":433.1831431173975},{"x":1192.7344256833228,"y":412.1573104950663},{"x":630.3257079119626,"y":521.2428412779847},{"x":582.8173170842724,"y":287.54374795689995},{"x":891.1799462374445,"y":347.7744735288718},{"x":915.9168026386058,"y":507.3531262685235},{"x":586.3758675919789,"y":486.8664381523685},{"x":622.7855907949358,"y":381.87134551933417},{"x":521.956775157227,"y":471.2266203663088},{"x":795.1407253082624,"y":199.98046354618936},{"x":612.8958738223457,"y":495.4857512571212},{"x":905.1204534732858,"y":376.91813709014974},{"x":938.1482752693692,"y":250.64879994263512},{"x":732.0531977150459,"y":209.07855657501113},{"x":542.4908727217282,"y":331.25457593944884},{"x":419.72379009533944,"y":411.00733295276285},{"x":866.6990533281155,"y":413.6025386987707},{"x":975.9877361845911,"y":457.64314187703263},{"x":890.0856493321049,"y":253.57031276371302},{"x":664.7365890562666,"y":407.7920754617639},{"x":766.418404229445,"y":346.9803283500968},{"x":170.60195462404232,"y":386.88066983204357},{"x":926.3043959759317,"y":217.95428282157394},{"x":324.4028712116531,"y":481.1681705267123},{"x":145.0727456111218,"y":378.6237373964456},{"x":726.4032878514396,"y":506.9315097842224},{"x":621.3908087454123,"y":477.4889196763691},{"x":753.3256988575762,"y":525.8660611148912},{"x":864.0056481173575,"y":483.6976662565744},{"x":777.4624735454695,"y":434.92924826421057},{"x":1225.6287414244948,"y":426.30583490804963},{"x":1046.7309453719279,"y":518.4958945503924},{"x":1262.5467014478374,"y":435.34031541284907},{"x":515.3822958064801,"y":299.7835767196617},{"x":1196.6682672808365,"y":491.74841009864275},{"x":659.35162712171,"y":484.41743430515885},{"x":847.6900071063664,"y":511.436391287821},{"x":1110.3897625035647,"y":523.9047582550753},{"x":1188.2658650654616,"y":514.9930401494254},{"x":704.3563755075041,"y":521.0139005558094},{"x":857.525334304787,"y":380.9493191756689},{"x":610.9969869464217,"y":361.25429860217014},{"x":1164.1329179545996,"y":512.6269677983818},{"x":1231.0398597048074,"y":447.81831497835964},{"x":170.72735897842938,"y":413.743969274254},{"x":785.1685151037714,"y":241.41712285074098},{"x":717.5632195403805,"y":291.3239817324178},{"x":658.2428751766845,"y":278.0427323676836},{"x":1212.1353153741734,"y":480.6789706837706},{"x":844.8536480774295,"y":268.49617588090547},{"x":1238.2828962156689,"y":412.84845563082735},{"x":1215.0186431602683,"y":410.001078149402},{"x":1129.8861471654325,"y":445.03367606396216},{"x":1099.0519364090133,"y":439.2266636069719},{"x":765.2656797243861,"y":275.2824504380935},{"x":1224.721314851674,"y":504.0754126735838},{"x":966.6543609443737,"y":265.4800124660484},{"x":575.8418775654198,"y":526.3242722244448},{"x":1074.4458589163207,"y":324.7415382039292}];

function setCoords(coords) {
	if(coords.length != graph.nodes.length){
		console.log("WARNING: Cannot find bijection between coords and nodes!");
	}

	for(var i = 0; i < Math.min(graph.nodes.length, coords.length); i++) {
		graph.nodes[i].x = coords[i].x;
		graph.nodes[i].y = coords[i].y;
	}
}

function initializeVWeight(n) {
	if(n.original_vweight){
		n.vweight = n.original_vweight;
	}
	else {
		n.vweight = 1;
	}
}

/* ~~~~~~~~~~~~~~ Zooming functionality ~~~~~~~~~~~~~~ */

// Zooming example with inbuilt d3 zooming: http://bl.ocks.org/eyaler/10586116

 /* ~~~~ debugging zoom  ~~~~ */
// function getClickPosition(e) {
// 	var xPosition = e.clientX;
// 	var yPosition = e.clientY;
// 	console.log({"x":xPosition,"y":yPosition});
// }

// document.onclick = getClickPosition;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function getCurrentTransformation(){
	var transform = d3.select("svg>g").attr("transform");
	transform = transform.split(" s");
	var translate = transform[0].substring(transform[0].indexOf("(")+1, transform[0].indexOf(")")).split(",").map(parseFloat);
	var scale = transform[1].substring(transform[1].indexOf("(")+1, transform[1].indexOf(")")).split(",").map(parseFloat);
	return {"dx": translate[0], "dy": translate[1], "sx":scale[0], "sy":scale[1]};
}

function translate(dx, dy){
	var t = getCurrentTransformation();
	var transformation = "translate(" + (t.dx+dx) + "," +(t.dy+dy) + ")"+" scale(" + t.sx + ","+ t.sy + ")";
	d3.select("svg > g")
	  .attr("transform", transformation);
}


function getCenterOffset(){
		var b = bBox(graph.nodes);
		var xOff = width/2-(b.ur.x - b.width/2);
		var yOff = height/2-(b.lr.y-b.height/2);
		return {"x":xOff, "y":yOff};
}

function zoom(factor){

	var center = {"x":width/2, "y":height/2};
	// transform graph
	var offset = getCenterOffset();
	var dx = -center.x*(factor-1)+offset.x+radius/2; //if radius is not fixed maxradius should be found
	var dy = -center.y*(factor-1)+offset.y+radius/2;
	var transformation = "translate(" + dx + "," + dy + ")" +
						 "scale(" + factor + ")";
	d3.select("svg > g") // document.querySelector("svg > g")
	  .transition()
	  .ease(d3.easeLinear,2)
	  .duration(1000)
	  .attr("transform", transformation);

	// keep label size the same 
	//var fontSize = nominalFontSize/factor;
	d3.selectAll(".clabel")
	  .transition()
	  .ease(d3.easeLinear,2)
	  .duration(1000)
	  .style("font-size", function(d){
	  	return d.fontSize/factor+"px";
	  });
}

/* reset zoom */
function reset() {
    var center = {"x":width/2, "y":height/2};
    svg.attr('transform', `translate(${0}, ${0}) scale(${1})`);
}

function messWithGravity() {
	d3.selectAll(".nodepoly").remove();
	cellcircle = node.append("polygon")
			.classed(".nodepoly", true)			
			.attr("points", function(d){return CalculateStarPoints(0, 0, 5, 50, 25);})
			.attr("fill", colorByMembership)
			.attr("stroke", "#8bc4d6");
	simulation.force("forceX")
        .strength(0.01)
        .x(width * 0.5);
    simulation.force("forceY")
        .strength(0.02)
        .y(height * 0.5);
	update();
	setTimeout(function() {
		zoom(getZoomFac());
	}, 5000);
	setTimeout(function(){
		simulation.force("forceX")
        .strength(0.1)
        .x(width * 0.5);
    simulation.force("forceY")
        .strength(0.2)
        .y(height * 0.5);
		update();
	}, 10000);
	setTimeout(function(){
		d3.selectAll(".nodepoly").remove();
		update();
		zoom(getZoomFac());
	}, 15000);
}

/* get dimensions of the force drawing (calculate bbox of nodes) */
var bBox = (function(vertices) {
  var maxX = Number.NEGATIVE_INFINITY;
  var maxY = Number.NEGATIVE_INFINITY;
  var minX = Number.POSITIVE_INFINITY;
  var minY = Number.POSITIVE_INFINITY;

  vertices.forEach(function(d) {
	if (d.x > maxX) maxX = d.x;
	if (d.y > maxY) maxY = d.y;
	if (d.x < minX) minX = d.x;
	if (d.y < minY) minY = d.y;   
  })
  return {
	"ul": {x: minX-radius, y: minY-radius}, 
	"ur": {x: maxX+radius, y: minY-radius}, 
	"lr": {x: maxX+radius, y: maxY+radius}, 
	"ll": {x: minX-radius, y: maxY+radius},
	"width": maxX - minX +2*radius,
	"height": maxY - minY + 2*radius
  };
});

function getZoomFac(){
	var b = bBox(graph.nodes);
	var hFac = height/b.height;
	var wFac = width/b.width;
	var zoomFac = Math.min(hFac,wFac);
	return zoomFac;
}


/* Determine which of the four corners is closest to the predicted home country
   --> new node flies in from that corner, to prevent it from getting stuck,
       which may happen when randomly picking a corner
 */
function calculateInitialCoords(membership) {
	var pos = get_cmean(clusters[membership].cluster);
	pos = {"x":pos[0], "y":pos[1]}
	var min = Number.POSITIVE_INFINITY;
	var closest;
	var corners = [{"x":0, "y":0},
				   {"x":0, "y":height},
				   {"x":width, "y":0},
				   {"x":width, "y":height}]
    corners.forEach(function(c){
    	var dist = euclidDistance(pos, c);
    	if (dist < min) {
    		min = dist;
    		closest = c;	
    	} 
    });
    return closest;
}

/* get n random elements from array */
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        return arr;
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}




