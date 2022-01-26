 /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Utility functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var numclusters = 6;
var globalFilteringConstant = 0.808;

function findAdjacentEdges(nId){
	var adjacent = graph.links.filter(function(e){
		return e.source.id === nId || e.target.id === nId;
	});
	return adjacent;
}


function get_cmeans(clusters){
    var gmeans = [];
    var totalx;
    var totaly;
    for(var i = 0; i < numclusters; i++) {
        totalx = 0;
        totaly = 0;
        for(var j = 0; j < clusters[i].length; j++) {
          totalx += clusters[i][j]["x"];
          totaly += clusters[i][j]["y"];
      }
      var mx = totalx/clusters[i].length;
      var my = totaly/clusters[i].length;
      var mean = [mx,my];
      gmeans.push({"label":clusterlabels[i], "mean":mean});
    }
    return gmeans;
}


function name(d) { return d.name; }
function group(d) { return d.group; }

function vweight(d) {
    return d['vweight'];}

function get_attribute(d, attribute) { 
    // console.log(attribute);
    // console.log(d[attribute]);
    return d[attribute]; }

function diet(d) { 
    if ( d.diet == "vegan") return 1;
    else if ( d.diet == "vegetarian") return 2;
    else if ( d.diet == "restricted") return 3;
    else if ( d.diet == "omni") return 4;
    else if ( d.diet == "none") return 5;
    else return 0;
}

function countryName(d) {
  return clusterlabels[d["membership_im"]];
}

function adjust_size(d) { 
    if ( d.membership_im == 0) return 100;
    else if ( d.membership_im == 1) return 80;
    else if ( d.membership_im == 2) return 60;
    else if ( d.membership_im == 3) return 40;
    else if ( d.membership_im == 4) return 40;
    else return 40;
}


function find_middle(ratio, male, female) {
    var hex = function(x) {
        x = x.toString(16);
        return (x.length == 1) ? '0' + x : x;
    };

    var r = Math.ceil(parseInt(male.substring(1,3), 16) * ratio + parseInt(female.substring(1,3), 16) * (1-ratio));
    var g = Math.ceil(parseInt(male.substring(3,5), 16) * ratio + parseInt(female.substring(3,5), 16) * (1-ratio));
    var b = Math.ceil(parseInt(male.substring(5,7), 16) * ratio + parseInt(female.substring(5,7), 16) * (1-ratio));

    var middle = '#' + hex(r) + hex(g) + hex(b);

    return middle;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Cleaning up functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function cleanSVG() {

    d3.selectAll(".legend").remove();

    cellcircle.attr('fill', function(d) {
        return colorByMembership(d);
    });

}


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Display of legends ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


function ageToValue(age) {
    switch (age) {
        case "12-17":
            return 0;
            break;
        case "18-24":
            return 1;
            break;
        case "25-34":
            return 2;
            break;
        case "35-44":
            return 3;
            break;
        case "45-54":
            return 4;
            break;
        case "55-64":
            return 5;
            break;
        case "65-74":
            return 6;
            break;
        default:
            return 7;
            break;
    }
}

function drawDietLegend() {

    d3.selectAll(".legend").remove();

    var legend = svg.selectAll(".legend")
        .data(["omni", "restricted", "vegetarian", "vegan", "none"])//hard coding the labels as the datset may have or may not have but legend should be complete.
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d){return diet_colors(d)});

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});
}

function drawAgeLegend() {

    //svg.selectAll(".legend").selectAll('ul').remove();
    d3.selectAll(".legend").remove();

    var legend = svg.selectAll(".legend")
        .data(["12-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-74"])//hard coding the labels as the datset may have or may not have but legend should be complete.
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d){return age_colors(d)});

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});
}

function drawGenderLegend() {

    //svg.selectAll(".legend").selectAll('ul').remove();
    d3.selectAll(".legend").remove();


    var legend = svg.selectAll(".legend")
        .data(["male", "female", "unknown"])//hard coding the labels as the datset may have or may not have but legend should be complete.
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d){return gender_colors(d)});

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;});
}



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper functions for nodes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


function findNode(id) {
        for (var i=0; i < graph.nodes.length; i++) {
            if (graph.nodes[i].id === id)
                return graph.nodes[i]
        };
    }

function findNodeIndex (id) {
        for (var i=0; i < total_graph.nodes.length; i++) {
            if (total_graph.nodes[i].id === id)
                return i
        };
    }
function handleMouseOver(d) {
    d3.selectAll(d[clusters]).attr('fill-opacity', 1);
}

function handleMouseOut(d) {
    d3.selectAll(d[clusters]).attr('fill-opacity', 0.8);
}

function calculateFit(non_sink_node, cluster) {
    var cluster_nodes = cluster.cluster;
    var cluster_edges = [];

    for (c in cluster_nodes) {
        c_e = findAdjacentEdges2(cluster_nodes[c].id);
        for (x in c_e) {
            cluster_edges.push(c_e[x]);
        }
    }

    var sum = 0;
    for (edge in cluster_edges) {
        if (cluster_edges[edge].source.id == non_sink_node.id)
            sum += cluster_edges[edge].value;
    }
    var mean = 1/ cluster_nodes.length;

    return (mean * sum);
}

function allNonSinkNodes() {
    var non_sinks = [];
    for (n in total_graph.nodes) {
        if(total_graph.nodes[n].sink == false) 
            non_sinks.push(total_graph.nodes[n]);
    }
    return non_sinks;
}

function assignNonSinkToCluster(non_sink) {
    max_fit = 0;
    var best_im = -1;
    for (i in clusters) {
        if (calculateFit(non_sink, clusters[i]) > max_fit){
            max_fit = calculateFit(non_sink, clusters[i]);
            best_im = parseInt(i);
        } 
    }
    total_graph.nodes[findNodeIndex(non_sink.id)].membership_im = best_im;
    return best_im;
}

function assignAllNonSinks(non_sinks) {

    for (n in non_sinks) {
        assignNonSinkToCluster(non_sinks[n]); 
    }

    return non_sinks;
}

function clusterNonSinks() {

    nonSinkClusters = [];

    nonSinks = allNonSinkNodes();

    for(var i = 0; i < numclusters; i++) {
        var c = nonSinks.filter(function(n){
            return n.membership_im==i;
        });
        nonSinkClusters.push({"label":clusterlabels[i], "cluster":c});
    }

    return nonSinkClusters;
}

function findAdjacentEdges2(nId){
	var adjacent = total_graph.links.filter(function(e){
		return e.source.id === nId || e.target.id === nId;
	});
	return adjacent;
}



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Work with claims ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


function findSupportedClaims(index) {
    n = findNode(index);
    var supportedClaims= [];

        for (var i=0; i < n.opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (!n.opinion[i].includes('!'))
                        supportedClaims.push(sentence_pool[n.opinion[i]-1][4]);
                        //supportedClaims.push({"claim":sentence_pool[n.opinion[i]-1][4],"type":sentence_pool[n.opinion[i]-1][1]}); 

        };
    
    return supportedClaims;
}

function findRejectedClaims(index) {
    var n = findNode(index);
    var rejectedClaims= [];
    var claimTexts = [];
        for (var i=0; i < n.opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (n.opinion[i].includes('!'))
                        rejectedClaims.push(n.opinion[i])
                        //supportedClaims.push({"claim":sentence_pool[n.opinion[i]-1][4],"type":sentence_pool[n.opinion[i]-1][1]}); 

        };

        for (var i=0; i < rejectedClaims.length; i++) {
            claimTexts.push(sentence_pool[rejectedClaims[i].substring(1)-1][4]);
        }

    return claimTexts;
}

function findSupportedClaimsType(index) {
    var n = findNode(index);
    var supportedClaims= [];

        for (var i=0; i < n.opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (!n.opinion[i].includes('!'))
                        //supportedClaims.push(sentence_pool[n.opinion[i]-1][4]);
                        supportedClaims.push({"claim":sentence_pool[n.opinion[i]-1][4],"type":sentence_pool[n.opinion[i]-1][1]}); 

        };
    
    return supportedClaims;
}

function findRejectedClaimsType(index) {
    var n = findNode(index);
    var rejectedClaims= [];

        for (var i=0; i < n.opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (n.opinion[i].includes('!'))
                        //supportedClaims.push(sentence_pool[n.opinion[i]-1][4]);
                        rejectedClaims.push({"claim":sentence_pool[n.opinion[i]-1][4],"type":sentence_pool[n.opinion[i]-1][1]}); 

        };
    
    return rejectedClaims;
}

// TODO: Correct total number of Proponents.
function totalNumProponents() {
    var totalNum = 0;
    var votes = getVoteCount();
    for (n in graph.nodes) {
        totalNum += votes[graph.nodes[n]["id"]];
    }
    return totalNum;
}

function allClaimsEnglish() {
    var claims =[]

    for(var i=0; i < sentence_pool.length; i++) {
        //console.log(totalSupportersClaim(sentence_pool[i][4]));
        //console.log(temp_sup);
        claims.push({"number" : sentence_pool[i][0],"claim": sentence_pool[i][4], "type" : getClaimType(sentence_pool[i][4]), "accepted": findSupportingProponentsNumber(sentence_pool[i][4]),
            "rejected":findRejectingProponentsNumber(sentence_pool[i][4])});
    }
    return claims;
}

function findSupportingProponentsNumber(claim) {
    var supportiveNodes = findSupportiveNodes(claim);
    var nodeArray = [];
    var num = 0;
    var votes = getVoteCount();
    for (s in supportiveNodes) {
        nodeArray.push(findNode(supportiveNodes[s]));
    }
    for (i in nodeArray) {
        num += votes[nodeArray[i].id];
    }
    return num;
}

function findRejectingProponentsNumber(claim) {
    var rejectingNodes = findRejectingNodes(claim);
    var nodeArray = [];
    num = 0;
    votes = getVoteCount();
    for (s in rejectingNodes) {
        nodeArray.push(findNode(rejectingNodes[s]));
    }
    for (i in nodeArray) {
        num += votes[nodeArray[i].id];
    }
    return num;
}

function findSupportedClaimsCluster(c) {
    var supportedClaims = [];

    var nodeClaims = [];

    var c_nodes = c;
    for (var n_id in c_nodes) {
       
        for (var i=0; i < c_nodes[n_id].opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (!c_nodes[n_id].opinion[i].includes('!'))
                        nodeClaims.push({"claim" :sentence_pool[c_nodes[n_id].opinion[i]-1][4], "id":n_id});
                //console.log(nodeClaims);
           
        };
        
    }
    nodeClaims.sort();

    var votes = getVoteCount();

    result = { };
    for(var i = 0; i < nodeClaims.length; ++i) {

        if(!result[nodeClaims[i]["claim"]])
            result[nodeClaims[i]["claim"]] = 0;
            result[nodeClaims[i]["claim"]] = result[nodeClaims[i]["claim"]] + votes[c_nodes[nodeClaims[i]["id"]]["id"]];
    }


    keysSorted = Object.keys(result).sort(function(a,b){return result[b]-result[a]});

    valueSorted = Object.keys(result).sort(function(a,b){return result[b]-result[a]}).map(key => result[key]);

    for (var i = 0; i < keysSorted.length; i++) {
        supportedClaims.push({"sup_claim":keysSorted[i], "sup_count":valueSorted[i] });
    };

    return supportedClaims;
}

function findRejectedClaimsCluster(c) {
    var rejectedClaims = [];

    var nodeClaims = [];

    //var c_nodes = c["cluster"];
    var c_nodes = c;
    for (var n_id in c_nodes) {
       
        for (var i=0; i < c_nodes[n_id].opinion.length; i++) {
            //if (supportedClaims.length < 5)
                if (c_nodes[n_id].opinion[i].includes('!')) {
                    claimNo = c_nodes[n_id].opinion[i].substr(1);
                    nodeClaims.push({"claim" :sentence_pool[claimNo-1][4], "id":n_id}); 
                }        
                //console.log(nodeClaims);
           
        };
        
    }
    nodeClaims.sort();

    var votes = getVoteCount();

    result = { };
    for(var i = 0; i < nodeClaims.length; ++i) {
        if(!result[nodeClaims[i]["claim"]])
            result[nodeClaims[i]["claim"]] = 0;
            result[nodeClaims[i]["claim"]] = result[nodeClaims[i]["claim"]] + votes[c_nodes[nodeClaims[i]["id"]]["id"]];
    }

    keysSorted = Object.keys(result).sort(function(a,b){return result[b]-result[a]});

    valueSorted = Object.keys(result).sort(function(a,b){return result[b]-result[a]}).map(key => result[key]);

    for (var i = 0; i < keysSorted.length; i++) {
        rejectedClaims.push({"rej_claim":keysSorted[i], "rej_count":valueSorted[i] });
    };

    return rejectedClaims;
}

function getAllvaluesToKey(obj, key) {
    var allValues = [];
    for (o in obj) {
        allValues.push(obj[o][key]);
    }
    return allValues;
}

function getAllClaimsCluster(cluster) {

    /* non_sink_c = clusterNonSinks();
    nsc_nodes = []
    for (i in non_sink_c) {
        if(cluster.label == non_sink_c[i].label)
        nsc_nodes = non_sink_c[i].cluster;
    }

    var temp_cluster = [];
    for (i in cluster.cluster) {
        temp_cluster.push(cluster.cluster[i]);
    }
    console.log(temp_cluster);

    for (i in nsc_nodes) {
        temp_cluster.push(nsc_nodes[i]);
    }

    console.log(temp_cluster); */

 // ------------- Experiment end ------------------------------

    var allClaims = [];

    var rejected = findRejectedClaimsCluster(cluster.cluster);
    var supported = findSupportedClaimsCluster(cluster.cluster);

    //console.log(supported);
    //console.log(rejected);

    for (claim in supported){
        //console.log(claim);
        allClaims.push({"number" : getClaimID(supported[claim]["sup_claim"]),"claim" : supported[claim]["sup_claim"], "type" : getClaimType(supported[claim]["sup_claim"])  , "accepted": supported[claim]["sup_count"], "rejected": 0});
    };

    var temp = getAllvaluesToKey(allClaims, "claim");

    for (c_index in rejected) {
        if (temp.indexOf(rejected[c_index]["rej_claim"]) === -1) {
            allClaims.push({"number" : getClaimID(rejected[c_index]["rej_claim"]),"claim": rejected[c_index]["rej_claim"], "type" : getClaimType(supported[claim]["sup_claim"]) , "accepted" : 0, "rejected": rejected[c_index]["rej_count"]});
        } else {
            for (c in allClaims) {
                if (allClaims[c]["claim"] ==  rejected[c_index]["rej_claim"]) {
                    allClaims[c]["rejected"] = rejected[c_index]["rej_count"];
                }
            }
        }
    }

    /* for (a in allClaims) {
        var judgment_suspended = getPeopleInCluster(cluster) - allClaims[a]["accepted"] - allClaims[a]["rejected"]; 
        allClaims[a]["judg_susp"]= judgment_suspended;
    } */

    return allClaims;
}

function getPeopleInCluster(cluster) {
    var number = 0;
    var c_nodes = cluster["cluster"];
    var votes = getVoteCount();
    
    for (var n_id in c_nodes) {
        number = number + votes[c_nodes[n_id]["id"]];
    }
    return number;
}

/* Returns all claim types used in the debate sentences. */
function getClaimTypes() {

    claimTypes = [];

    for (var i = 0; i < sentence_pool.length; i++){
        if (!claimTypes.includes(sentence_pool[i][1])){
            claimTypes.push(sentence_pool[i][1]);
        };
    };

    return claimTypes;
}

function colorByClaimType(claimID) { return d3.scale.category10(sentence_pool[claimID][1])}

function getClaimID(claim) {
    for (var i = 0; i < sentence_pool.length; i++) {
        if (claim == sentence_pool[i][4]) {
            return i+1;
        }
    }
}

function getClaimType(claim) {
    var type;
    for (var i = 0; i < sentence_pool.length; i++) {
        if (claim == sentence_pool[i][4]){
            type = sentence_pool[i][1];
        };
    };

    if (type == "core") {
        return "Core";
    } else if (type == "cul" ) {
        return "Culinary";
    } else if (type == "health") {
        return "Health";
    } else if (type == "normal") {
        return "Normality";
    } else if (type == "climate") {
        return "Climate";
    } else if (type == "world") {
        return "World";
    } else if (type == "money") {
        return "Money";
    } else if (type == "natural"){
        return "Naturality";
    } else if (type == "nature") {
        return "Nature";
    } else if (type == "animal-rights") {
        return "Animal rights";
    } else if (type == "auto") {
        return "Autonomy";
    }
}

/* 
Checks if a claim is supported or rejected by a node.
Return 1 if supported, 0 if rejected and -1 otherwise.
*/
function checkClaimInNode(nodeIndex, claim) {
    if (graph.nodes[nodeIndex]["opinion"].indexOf(claim) >= 0) {
        return 1;
    } else if (graph.nodes[nodeIndex]["opinion"].indexOf("!" + claim) >= 0) {
        return 0;
    } else {
        return -1;
    }
}

function countSupportiveNodes(claim) {
    cID = ""+getClaimID(claim)+"";
    var count = 0;
    for (let i = 0; i < graph.nodes.length; i++) {
        if (checkClaimInNode(i, cID) == 1) {
            count+=1;
        }
    }
    return count;
}

function countRejectingNodes(claim) {
    cID = ""+getClaimID(claim)+"";
    var count = 0;
    for (let i = 0; i < graph.nodes.length; i++) {
        if (checkClaimInNode(i, cID) == 0) {
            count+=1;
        }
    }
    return count;
}

function showCountryStats(country, statType){
    return "Pie chart";
}

function getCountryStats(cluster, type){
    stats = [];
    var c_nodes = cluster["cluster"];
    
    for (var n_id in c_nodes) {
        number = number + c_nodes[n_id]["proponents"][type];
    }
    return number;
}



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ Miscellaneous ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function getNodeInfo(n){

    //for (var i = 0; i < n.proponents.length; ++)

    return "This opinion is hold by " + getVoteCount[n["id"]] + " participant(s).";
}

function createPieChart(data) {

    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.colors1;

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.csv("data.csv", function(d) {
  d.population = +d.population;
  return d;
}, function(error, data) {
  if (error) throw error;

  var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data); });

  arc.append("text")
      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data; });
});

}

 function getColors(selection) {
    var female = '#FF6600';
    var male = '#00CCFF';
    var unknown = '#009933';
    if (selection == "Gender") {
        return [female, male, unknown];
    }
    return colors1;
} 

function showCountryLegend(s){
    /* var linear = d3.scale.linear()
        .domain([0,10])
        .range(["rgb(46, 73, 123)", "rgb(71, 187, 94)"]); */
     var colors = getColors(s);

    var svg = d3.select("svg");

    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");

    var legendLinear = d3.legend.color()
        .shapeWidth(30)
        .cells([1, 2, 3, 6, 8])
        //.orient('horizontal')
        .scale(colors);

    svg.select(".legendLinear")
        .call(legendLinear);

}


/* function selectNode(n) {
    d3.select(n).classed("selected", true);
} */

/* takes cluster element and adds all nodes in the cluster to the class 'selected' */
function selectCluster(c) {
    ids = [];
    for (n_id in c["cluster"]) {
        //console.log(c["cluster"][n_id]["id"]);
        ids.push(c["cluster"][n_id]["id"]);
    };

    cellcircle.attr('fill', function(d) {
		if(ids.indexOf(d["id"]) >= 0){
			return '#f4c542';
		}
		else {
			return seq_colors[get_attribute(d, "membership_im")];
		}
	});
    //highlight(ids, 2000);
    //console.log(d);
}

function activateIcon(icon) {
    switch (icon) {
        case 'expl-mode':
            d3.select("#expl-mode").classed("activeIcon", true);
            d3.select("#cons-mode").classed("activeIcon", false);
            d3.select("#stat-mode").classed("activeIcon", false);
            break;

        case 'cons-mode':
            d3.select("#expl-mode").classed("activeIcon", false);
            d3.select("#cons-mode").classed("activeIcon", true);
            d3.select("#stat-mode").classed("activeIcon", false);
            break;
        case 'stat-mode':
            d3.select("#expl-mode").classed("activeIcon", false);
            d3.select("#cons-mode").classed("activeIcon", false);
            d3.select("#stat-mode").classed("activeIcon", true);
            break;
        default:
            console.log("Icon does not exist..");
    }
}

function showCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
    }
}

function highlightTableEntry(td) {

}

function removeAllSelectedTd() {
    d3.selectAll('td').classed("selected", false);
}

function countRowInfoNode(rows) {
    var counts = {"accepted":0, "rejected":0};
    for (var i =0; i < rows.count(); i++) {
        if (rows.data()[i]["accepted"] == true) {
            counts["accepted"] +=1;
        } else {
            counts["rejected"]+=1;
        }
    }
    return counts;
}

function countRowInfoCluster(rows) {
    var counts = {"accepted":0, "rejected":0};
    for (var i =0; i < rows.count(); i++) {
            counts["accepted"] += rows.data()[i]["accepted"];
            counts["rejected"] += rows.data()[i]["rejected"];
    }
    return counts;
}

function avgVotesPerClaim(rows) {
    var total = 0;
    var avg=0;
  
    total += countRowInfoCluster(rows)["accepted"] + countRowInfoCluster(rows)["rejected"];
    
    var div = rows.count();
    avg = total/div;
    return Number(avg.toFixed(2));
}

function avgDegreeOfPolarization(rows) {
    var sum =0;
    for (var i =0; i < rows.count(); i++) {
        sum += 1 - Math.abs(rows.data()[i]["accepted"]-rows.data()[i]["rejected"])/Math.abs(rows.data()[i]["accepted"]+rows.data()[i]["rejected"])
    }
    return Number((sum/rows.count()).toFixed(2));
}


function getVoteCount() {
    var nodesAndVotes = {};
    //var superSets = allSuperSets();

    for (n in total_graph.nodes) {

        var node = total_graph.nodes[n];
        nodesAndVotes[node.id] = node["proponents"].length;
        /* 
        
        nodesAndVotes[node.id] = 0;
        for (s in superSets[node.id]) {
            console.log(findNodeIndex(superSets[node.id][s]));
            nodesAndVotes[node.id] = nodesAndVotes[node.id] + total_graph.nodes[findNodeIndex(superSets[node.id][s])]["proponents"].length;
        }   */ 
    }

    /* for (n in total_graph.nodes) {
        //console.log(non_sinks[n]["proponents"].length);
        for (s in total_graph.nodes[n].super) {
            if (total_graph.nodes[n].super.length > 0) {
                //console.log(total_graph.nodes[n].super[s]);
                nodesAndVotes[total_graph.nodes[n].super[s]]+=total_graph.nodes[n]["proponents"].length;
            }
        }
    } */

    /* for (n in total_graph.nodes) {
        //console.log(non_sinks[n]["proponents"].length);
        if(total_graph.nodes[n].sink == true) {
            for (s in total_graph.nodes[n].super) {
                if (total_graph.nodes[n].super.length > 0) {
                    //console.log(total_graph.nodes[n].super[s]);
                    var temp;
                    temp = nodesAndVotes[total_graph.nodes[n].super[s]]+=total_graph.nodes[n]["proponents"].length;
                }
            }
        }
        
    } */


    return nodesAndVotes;
}

// Returns for the opinion array of the given node a list of ids of nodes in the graph whose opinions are supersets of that array
// That is: returns ids of all the nodes by which the given opinion is entailed
function findSuperSets(node) {
	var ids = [];
	for(var i = 0; i < total_graph.nodes.length; i++){
		if(node["opinion"].every(function(elem) {return total_graph.nodes[i]["opinion"].indexOf(elem) >= 0;})){
			ids.push(total_graph.nodes[i]["id"]);
		}
	}
	return ids;

}

function allSuperSets() {
    var sets = {};

    for (n in total_graph.nodes) {
        sets[total_graph.nodes[n]["id"]] = findSuperSets(total_graph.nodes[n]); 
    }
    return sets;
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Interface Helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


function showNodeClaimsQuery(node) {
    d3.select("#info-text").html("");

    //Get the color of cluster the node belongs to and make this the basecolor
    var baseColor = seq_colors[get_attribute(node, "membership_im")];

    var node_claims = getAllClaimsNode(node);

    var table = d3.select("#info-text").append('table').attr("class", "sortable");;
    table.attr('id', 'info_t')

    var colnames = Object.keys(node_claims[0]);

    var names = ["Claim", "Type", '<i class="fa fa-thumbs-up"></i>', '<i class="fa fa-thumbs-down"></i>'];

    var collapsedGroups = {};

    for (c in colnames) {
        if (colnames[c] == "type") {
            colnames[c] = {"data" : colnames[c], "title" : names[c], "visible": false};
        } else {
            colnames[c] = {"data" : colnames[c], "title" : names[c]};
        }
    }
    
    $(document).ready( function () {
        var table = $('#info_t').DataTable({
            data: node_claims,
            /* render: {
                true : '<i class="fas fa-thumbs-up"></i>'
            }, */
            scrollY:        "45vh",
            scrollCollapse: true,
            paging:         false,
            searching:      false,
            info: false,
            columns: colnames,
            columnDefs: [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data) {
                        if (data == true) {
                            return 'true';
                        } else {
                            return '';
                        }
                    },
                    "targets": [2]
                },
                {
                    "render": function (data) {
                        if (data == true) {
                            return 'false';
                        } else {
                            return '';
                        }
                    },
                    "targets": [3] 
                }],
            rowGroup: {
                dataSrc: 'type',
                startRender: function (rows, group) {

                    // start with all row-groups open
                    var collapsed = !!collapsedGroups[group];
        
                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });    
        
                    // Add category name to the <tr>. NOTE: Hardcoded colspan
                    return $('<tr/>')
                        .append('<td colspan="8">' + group + ' ( accepted: ' +countRowInfoNode(rows)["accepted"] + ', rejected: ' + countRowInfoNode(rows)["rejected"] +')</td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },
            "orderFixed" : [1, 'asc']
        });

        $('#info_t td').css({"color": "black"});

        $("td:contains(true)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor, +80)});
        });
        $("td:contains(false)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor,-30)});
        });
        $('th:nth-child(3)').hide();
        $('th:nth-child(2)').hide();
        $('td:nth-child(3)').hide();
        $('td:nth-child(2)').hide();

        $('#info_t').on('click', 'tr', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            table.draw(false);
        });
   } );
}
function showNodeClaimsQuery1(node) {
    d3.select("#info-text").html("");

    //Get the color of cluster the node belongs to and make this the basecolor
    var baseColor = seq_colors[get_attribute(node, "membership_im")];

    var node_claims = getAllClaimsNode(node);

    var table = d3.select("#info-text").append('table').attr("class", "sortable");;
    table.attr('id', 'info_t')

    var colnames = Object.keys(node_claims[0]);

    var names = ["Claim", "Type", '<i class="fa fa-thumbs-up"></i>', '<i class="fa fa-thumbs-down"></i>'];

    var collapsedGroups = {};

    for (c in colnames) {
        if (colnames[c] == "type") {
            colnames[c] = {"data" : colnames[c], "title" : names[c], "visible": true};
        } else {
            colnames[c] = {"data" : colnames[c], "title" : names[c]};
        }
    }

    $(document).ready( function () {
        var table = $('#info_t').DataTable({
            data: node_claims,
            /* render: {
                true : '<i class="fas fa-thumbs-up"></i>'
            }, */
            scrollY:        "45vh",
            scrollCollapse: true,
            paging:         false,
            searching:      false,
            info: false,
            columns: colnames,
            columnDefs: [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data) {
                        if (data == true) {
                            return 'true';
                        } else {
                            return '';
                        }
                    },
                    "targets": [2]
                },
                {
                    "render": function (data) {
                        if (data == true) {
                            return 'false';
                        } else {
                            return '';
                        }
                    },
                    "targets": [3]
                }],
            rowGroup: {
                dataSrc: 'type',
                startRender: function (rows, group) {

                    // start with all row-groups open
                    var collapsed = !!collapsedGroups[group];

                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });

                    // Add category name to the <tr>. NOTE: Hardcoded colspan
                    return $('<tr/>')
                        //.append('<td colspan="8">' + group + ' ( accepted: ' +countRowInfoNode(rows)["accepted"] + ', rejected: ' + countRowInfoNode(rows)["rejected"] +')</td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },
            "orderFixed" : [2]
        });

        $('#info_t td').css({"color": "black"});

        $("td:contains(true)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor, +80)});
        });
        $("td:contains(false)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor,-30)});
        });
        $('th:nth-child(4)').hide();
        $('th:nth-child(3)').hide();
        $('td:nth-child(4)').hide();
        $('td:nth-child(3)').hide();

        $('#info_t').on('click', 'tr', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            table.draw(false);
        });
   } );
}
function showNodeClaimsQuery2(node) {
    d3.select("#info-text").html("");

    //Get the color of cluster the node belongs to and make this the basecolor
    var baseColor = seq_colors[get_attribute(node, "membership_im")];

    var node_claims = getAllClaimsNode(node);

    var table = d3.select("#info-text").append('table').attr("class", "sortable");;
    table.attr('id', 'info_t')

    var colnames = Object.keys(node_claims[0]);

    var names = ["Claim", "Type", '<i class="fa fa-thumbs-up"></i>', '<i class="fa fa-thumbs-down"></i>'];

    var collapsedGroups = {};

    for (c in colnames) {
        if (colnames[c] == "type") {
            colnames[c] = {"data" : colnames[c], "title" : names[c], "visible": true};
        } else {
            colnames[c] = {"data" : colnames[c], "title" : names[c]};
        }
    }

    $(document).ready( function () {
        var table = $('#info_t').DataTable({
            data: node_claims,
            /* render: {
                true : '<i class="fas fa-thumbs-up"></i>'
            }, */
            scrollY:        "45vh",
            scrollCollapse: true,
            paging:         false,
            searching:      false,
            info: false,
            columns: colnames,
            columnDefs: [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data) {
                        if (data == true) {
                            return 'true';
                        } else {
                            return '';
                        }
                    },
                    "targets": [2]
                },
                {
                    "render": function (data) {
                        if (data == true) {
                            return 'false';
                        } else {
                            return '';
                        }
                    },
                    "targets": [3]
                }],
            rowGroup: {
                dataSrc: 'type',
                startRender: function (rows, group) {

                    // start with all row-groups open
                    var collapsed = !!collapsedGroups[group];

                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });

                    // Add category name to the <tr>. NOTE: Hardcoded colspan
                    return $('<tr/>')
                        //.append('<td colspan="8">' + group + ' ( accepted: ' +countRowInfoNode(rows)["accepted"] + ', rejected: ' + countRowInfoNode(rows)["rejected"] +')</td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },
            "orderFixed" : [3]
        });

        $('#info_t td').css({"color": "black"});

        $("td:contains(true)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor, +80)});
        });
        $("td:contains(false)").each(function(){
            $(this).siblings().css({"background-color": adjust(baseColor,-30)});
        });
        $('th:nth-child(4)').hide();
        $('th:nth-child(3)').hide();
        $('td:nth-child(4)').hide();
        $('td:nth-child(3)').hide();

        $('#info_t').on('click', 'tr', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            table.draw(false);
        });
} );
}

function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function boolBarChart(chosenOption = "SHOW ALL", chosenCountryLabel='NoCountry') {
    // Empty canvas
    d3.select("#bool_barchart").html("");

    // Set size of canvas
    var margin = {top: 20, right: 50, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Set up chart
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

//    var selectedCountry = countryInfo[exactCountry].header;
//    d3.select("#log1").append('html').text(selectedCountry)
    if (chosenCountryLabel == 'NoCountry') {
        var baseColor = "#98abc5";
    } else {
        var baseColor = seq_col_label[chosenCountryLabel];
    }
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#bool_barchart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up barchart
    var colorRange = [adjust(baseColor, +80), adjust(baseColor, -30)]
        var color = d3.scale.ordinal()
            .range(colorRange);
        // Import data
    if(chosenCountryLabel == 'Blue'){
        d3.csv("data/grey.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX + 30)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else if(chosenCountryLabel == 'Purple'){
        d3.csv("data/purple.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX + 30)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else if(chosenCountryLabel == 'Green'){
        d3.csv("data/green.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else if(chosenCountryLabel == 'Yellow'){
        d3.csv("data/yellow.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else if(chosenCountryLabel == 'Orange'){
        d3.csv("data/orange.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else if(chosenCountryLabel == 'Light Blue'){
        d3.csv("data/lightblue.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })

          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 5; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX)
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });}
    else
    {
        d3.csv("data/allclaimsandvotes.csv", function(error, data) {
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "name"; }));

          // Stack data
          data.forEach(function(d) {
            var y0 = 0;
            var myname = d.name;

            if (chosenOption == "SHOW MOST NEGATIVE") {
                var order = color.domain().slice(0).reverse().map(function(d) { return d; });
            } else {
                var order = color.domain().map(function(d) { return d; });
            }

            d.ages = order.map(function(name) { return {myname:myname,
                name: name, y0: y0, y1: y0 += +d[name], value: d[name]}; });
            d.total = d.ages[d.ages.length - 1].y1;

            // Sort data based on filter
            if (chosenOption == "SHOW MOST AGREEABLE") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return d3.descending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST CONTROVERSIAL") {
                d.totalSort = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
    //            data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                data.sort(function(a, b) { return d3.ascending(a.totalSort, b.totalSort);});
            } else if (chosenOption == "SHOW MOST POSITIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else if (chosenOption == "SHOW MOST NEGATIVE") {
                d.totalSort = d.ages[d.ages.length - 1].y0
//                data.sort(function(a, b) { return b.totalSort - a.totalSort; });
                d.totalSortSecondary = Math.abs(d.ages[d.ages.length - 1].y0 - (d.ages[d.ages.length - 1].y1 - d.ages[d.ages.length - 1].y0))
                data.sort(function(a, b) { return b.totalSort - a.totalSort || d3.descending(a.totalSortSecondary, b.totalSortSecondary); });
            } else {
                d.totalSort = d.total
            }
          })



          // Set domain of chart
          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.total + 20; })]);

          // Build chart
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "-3.51em")
              .style("text-anchor", "end")
              .text("Number of votes");

          var state = svg.selectAll(".state")
              .data(data)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) { return "translate(" + "0" + ",0)"; })


          state.selectAll("rect")
              .data(function(d) { return d.ages; })
            .enter().append("rect")
              .attr("width", x.rangeBand())
              .attr("y", function(d) {
                  return y(d.y1); })
              .attr("x",function(d) {
                  return x(d.myname)
              })
              .attr("height", function(d) { return y(0) - y(d.value); })
              .style("fill", function(d) { return color(d.name); })
              .attr("stroke","black").attr("stroke-width", .5);

            state.selectAll("rect")
            .on("mouseover", function(d){
                var diff = d.y1 - d.y0;
                var posX = parseFloat(d3.select(this).attr("x"));
                var posY = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","yellow").attr("stroke-width",3);

                svg.append("text")
                    .attr("x",posX )
                    .attr("y",posY +height/2)
                    .attr("class","tooltip")
                    .text(diff);
            })
                .on("mouseout",function(){
                    svg.select(".tooltip").remove();
                    d3.select(this).attr("stroke","pink").attr("stroke-width",0.2)
                    .attr("stroke","black").attr("stroke-width", .5);;
                })


          // Build legend
          var legend = svg.selectAll(".legend")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 40)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);


          legend.append("text")
              .attr("x", width + 50)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });

        });
    }
}


function showAllNodeClaims() {

    d3.select("#info-text").html("");

    var claims = allClaimsEnglish();

    var table = d3.select("#info-text").append('table').attr("class", "sortable");;
    table.attr('id', 'info_t')

    var colnames = Object.keys(claims[0]);

    var collapsedGroups = {};

    var names = ["Number claim","Claim", "Type", '<i class="fa fa-thumbs-up"></i>', '<i class="fa fa-thumbs-down"></i>',"Claim number"];

    for (c in colnames) {
        if (colnames[c] == "type" ) {
            colnames[c] = {"data" : colnames[c], "title" : names[c], "visible": false};    
        } else {
            colnames[c] = {"data" : colnames[c], "title" : names[c]};
        }
    }
    
    $(document).ready( function () {
        var table = $('#info_t').DataTable({
            data: claims,
            scrollY:        "45vh",
            scrollCollapse: true,
            paging:         false,
            searching:      false,
            info:   false,
            columns: colnames,
            columnDefs: [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data) {
                            return data + " " + '<i class="fa fa-thumbs-up"></i>';
                    },
                    "targets": [3]
                },
                {
                    "render": function (data) {
                            return data + " " + '<i class="fa fa-thumbs-down"></i>';
                    },
                    "targets": [4]
                }],
            rowGroup: {
                dataSrc: 'type',
                startRender: function (rows, group) {

                    // start with all row-groups collapsed, !!collapsedGroups to open all
                    var collapsed = !collapsedGroups[group];
        
                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });  
                    
                    return $('<tr/>')
                        .append('<td colspan="8">' + group + '( no. of claims: ' + rows.count() +', avg. votes/claim: '+ avgVotesPerClaim(rows)  +')</td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },
            "orderFixed" : [2, 'asc']
        });
        $('th:nth-child(3)').hide();
        $('th:nth-child(4)').hide();
        $('td:nth-child(3)').hide();
        $('td:nth-child(4)').hide();

        $('#info_t').on('click', 'tr', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            table.draw(false);
        });

    } );
}

function getAllClaimsNode(d) {
    var allClaims = [];
    var supportedClaims = findSupportedClaims(d.id);
    var rejectedClaims = findRejectedClaims(d.id);

    for (claim in supportedClaims) {
        allClaims.push({"claim" : supportedClaims[claim], "type" : getClaimType(supportedClaims[claim]), "accepted" : true, "rejected" : false});
    } 

    for (claim in rejectedClaims) {
        allClaims.push({"claim": rejectedClaims[claim], "type" : getClaimType(rejectedClaims[claim]) , "accepted" : false, "rejected": true})
    }

    return allClaims;
};


function showClusterInfo(d) {
    d3.select("#info-text").html("");

    d3.select("#info-text")
        .append('h4')
        .text(d["label"]);

    d3.select("#info-text")
        .append('p')
        .text(d["info"]);


}

function showClusterClaimsQuery(cluster) {
    d3.select("#info-text").html("");

    var cluster_claims = getAllClaimsCluster(cluster);

    var table = d3.select("#info-text").append('table').attr("class", "sortable");;
    table.attr('id', 'info_t')


    var colnames = Object.keys(cluster_claims[0]);

    var names = ["Number claim","Claim", "Type", '<i class="fa fa-thumbs-up"></i>', '<i class="fa fa-thumbs-down"></i>'];

    var collapsedGroups = {};

    for (c in colnames) {
        if (colnames[c] == "type") {
            colnames[c] = {"data" : colnames[c], "title" : names[c], "visible" : false};
        } else {
            colnames[c] = {"data" : colnames[c], "title" : names[c]};
        }
    }

    $(document).ready( function () {
        var table = $('#info_t').DataTable({
            scrollY:        "45vh",
            scrollCollapse: true,
            paging:         false,
            searching:      false,
            hover: true,
            info:   false,
            data: cluster_claims,
            columns: colnames,
            columnDefs: [
                {
                    // The `data` parameter refers to the data for the cell (defined by the
                    // `data` option, which defaults to the column being worked with, in
                    // this case `data: 0`.
                    "render": function (data) {
                        return data + " " +'<i class="fa fa-thumbs-up"></i>';
                    
                    },
                    "targets": [3]
                },
                {
                    "render": function (data) {
                            return data + " " + '<i class="fa fa-thumbs-down"></i>';
                    },
                    "targets": [4]
                }],
            rowGroup: {
                dataSrc: 'type',
                startRender: function (rows, group) {

                    // start with all row-groups collapsed, !!collapsedGroups to open all
                    var collapsed = !collapsedGroups[group];
        
                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });    
        
                    // Add category name to the <tr>. NOTE: Hardcoded colspan
                    return $('<tr/>')
                        .append('<td colspan="8">' + group + ' ( no. of claims: ' + rows.count() +', avg. votes/claim: '+ avgVotesPerClaim(rows) +', avg. degree of polarization: ' + avgDegreeOfPolarization(rows) + ')</td>')
                        .attr('data-name', group)
                        .toggleClass('collapsed', collapsed);
                }
            },
            "orderFixed" : [2, 'asc']
        });
        $('th:nth-child(3)').hide();
        $('th:nth-child(4)').hide();
        $('td:nth-child(3)').hide();
        $('td:nth-child(4)').hide();


        $('#info_t').on('click', 'tr', function () {
            var name = $(this).data('name');
            collapsedGroups[name] = !collapsedGroups[name];
            table.draw(false);
        });
    } );
}

function tableShowAll(table_id) {
    table = document.getElementById(table_id);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("TD")[0];
      if (td) {
          tr[i].style.display = "";
      }       
    }
}

function filterTable(table_id, filterValue) {
    var filter, tr, td, i;

    //input = document.getElementById("myInput");
    filter = filterValue;
    table = document.getElementById(table_id);
    theader = table.getElementsByTagName("th");
    first_header = theader[0];
    first_header.innerText = filterValue;
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("TD")[0];
      if (td) {
        if (td.innerText.includes(filterValue)) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

function getColIndex(table, dataTablesCell) {
    return table.cell(dataTablesCell).index().column;
}

function getColName(table, colIndex) {
    var columns = table.settings().init().columns;
    return columns[colIndex].data;
}

function highlightAllNodes(table, dataTablesCell) {

    var rowData = table.row(table.cell(dataTablesCell)[0][0].row).data();

    //var columnName = getColName(getColIndex(table, dataTablesCell));

    var columns = table.settings().init().columns;
    var colIndex = table.cell(dataTablesCell).index().column;
    var columnName = columns[colIndex].data;

    if (columnName == "accepted") {
        highlightSupportiveNodes(rowData.claim);
    } else if (columnName == "rejected") {
        highlightRejectingNodes(rowData.claim);
    }

    //console.log(columnName);
    //trs = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    //console.log(rowData);

}

function highlightAllNodesForOneCountry(table, dataTablesCell, country) {

    var rowData = table.row(table.cell(dataTablesCell)[0][0].row).data();

    //var columnName = getColName(getColIndex(table, dataTablesCell));

    var columns = table.settings().init().columns;
    var colIndex = table.cell(dataTablesCell).index().column;
    var columnName = columns[colIndex].data;

    if (columnName == "accepted") {
        highlightSupportiveNodesInOneCluster(rowData.claim, country);
    } else if (columnName == "rejected") {
        highlightRejectingNodesInOneCluster(rowData.claim, country);
    }

    //console.log(columnName);
    //trs = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    //console.log(rowData);

}


