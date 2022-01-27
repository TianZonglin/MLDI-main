function hoverInfo(buttonNr) {
    d3.select("#info_text").style("display", "block");

    if (buttonNr == 1) {

        d3.select("#info_text").style("right", "5%");
        d3.select("#info_text").style("top", "100%");
    } else if (buttonNr == 2) {
        d3.select("#info_text").style("right", "5%");
        d3.select("#info_text").style("top", "170%");
    } else if (buttonNr == 3) {
        d3.select("#info_text").style("right", "5%");
        d3.select("#info_text").style("top", "250%");
    }
}

function noHoverInfo() {
    d3.select("#info_text").style("display", "none");
}

function setupExploreMode() {
    
    var selectedNode = -1;
    var selectedCluster = -1;
    
    activateIcon('expl-mode');

    cleanSVG();

    d3.select("#opt").html("");
    d3.select("#info-text").html("");
    //d3.select("#opt").append("h3").text("Exploration Mode")

    d3.select("#opt").append("h4").text("More information about clusters of opinions can be accessed by clicking on cluster labels in the map.");

    //d3.select("#opt").append("p").text("More information about individual opinions and clusters of opinions can be accessed by clicking on opinions nodes or, respectively, cluster labels in the map. Double-click on background to return to the information about the whole map.");
    //d3.select("#opt").append("p").html("You can choose if you want to view information about opinions or clusters (select <b>Information</b>) or to look at the claims they made (select <b>Claims</b>).");

    d3.select("#opt").append("div").attr("id","info").html("");

    d3.select("#info").append("h4").text("All Claims");
    d3.select("#info").append("p").text("This tables shows all claims that were used in the questionnaire.");
    showAllNodeClaims();

    //document.getElementById("button1").style.visibility='hidden';
    //document.getElementById("button2").style.visibility='hidden';
    //document.getElementById("button3").style.visibility='hidden';

    boolBarChart();

    // BOOLEAN BAR CHART - filters
    d3.select("#filter_all2").on("click", function() {
        boolBarChart("SHOW ALL",'NoCountry');})
    d3.select("#filter_agreed2").on("click", function() {
        boolBarChart("SHOW MOST AGREEABLE",'NoCountry');})
    d3.select("#filter_controversial2").on("click", function() {
        boolBarChart("SHOW MOST CONTROVERSIAL",'NoCountry');})
    d3.select("#filter_positive2").on("click", function() {
        boolBarChart("SHOW MOST POSITIVE",'NoCountry');})
    d3.select("#filter_negative2").on("click", function() {
        boolBarChart("SHOW MOST NEGATIVE",'NoCountry');})


    if (selectedNode != -1) {
        showAllNodeClaims();
    }

    if (selectedCluster != -1) {
        showClusterInfo(selectedCluster);
    }

    svg.on("dblclick", function(d) {
        //document.getElementById("button1").style.visibility='hidden';
        //document.getElementById("button2").style.visibility='hidden';
        //document.getElementById("button3").style.visibility='hidden';

        d3.select("#info").html("");
        d3.select("#info").append("h4").text("All Claims");
        d3.select("#info").append("p").text("This table shows all claims that were used in the questionnaire.");
        d3.select("#info").style("background-color", "white");
        cleanSVG();
        showAllNodeClaims();

        boolBarChart();

        // BOOLEAN BAR CHART - filters
        d3.select("#filter_all2").on("click", function() {
            boolBarChart("SHOW ALL",d);
        })
        d3.select("#filter_agreed2").on("click", function() {
            boolBarChart("SHOW MOST AGREEABLE",d);
        })
        d3.select("#filter_controversial2").on("click", function() {
            boolBarChart("SHOW MOST CONTROVERSIAL",d);
        })
        d3.select("#filter_positive2").on("click", function() {
            boolBarChart("SHOW MOST POSITIVE",d);
        })
        d3.select("#filter_negative2").on("click", function() {
            boolBarChart("SHOW MOST NEGATIVE",d);
        })
    })

    /*node.on("click", function(d){
        document.getElementById("button1").style.visibility='visible';
        document.getElementById("button2").style.visibility='visible';
        document.getElementById("button3").style.visibility='visible';
        document.getElementById("button1").onclick = function() {onchange1()};
        document.getElementById("button2").onclick = function() {onchange2()};
        document.getElementById("button3").onclick = function() {onchange3()};

        votes = getVoteCount();

        d3.select("#info").html("");
        d3.select("#info").style("background-color", "rgba(244, 197, 66, 0.5)");
        d3.select("#info").append("h4").text("Node Information");
        d3.select("#info").append("p").text("The position represented by this nodes is fully endorsed by " + d.proponents.length + " proponent(s) and partly endorsed by " + votes[d.id] + ".");
        selectedNode = d;
        selectNode(d.id);

        // generate table
        //showNodeClaims(d);
        showNodeClaimsQuery(d);

        //If button is clicked, change the order in the table.
        function onchange1() {
            showNodeClaimsQuery(d);
        };
        function onchange2() {
            showNodeClaimsQuery1(d);
        };
        function onchange3() {
            showNodeClaimsQuery2(d);
        };

        // make hashtags clickable
        hashtags = d3.selectAll(".hashtag");
        hashtags.on('click', function(d) {
          text = this.innerText;
          filterTable("info_t", text);
          });

    });*/

    clabels.on('click', function(d){
        //document.getElementById("button1").style.visibility='hidden';
        //document.getElementById("button2").style.visibility='hidden';
        //document.getElementById("button3").style.visibility='hidden';

        d3.select("#info").html("");
        d3.select("#info").append("h4").text(d.label);
        //d3.select("#info").append("p").style("font-size","11px").text(d.info);
        d3.select("#info").append("p").text("The distribution of the answers given, for this country, are shown below in the bar chart. " +
            "To see this all you need to do is scroll down.")
        d3.select("#info").style("background-color", "rgba(157,155,155,0.5)");
        selectedCluster = d;
        selectedNode=-1;
        selectCluster(d);
        // generate table
        showClusterClaimsQuery(d);
        boolBarChart("SHOW ALL",d.label);
        // BOOLEAN BAR CHART - filters
        d3.select("#filter_all2").on("click", function() {
            boolBarChart("SHOW ALL",d.label);
        })
        d3.select("#filter_agreed2").on("click", function() {
            boolBarChart("SHOW MOST AGREEABLE",d.label);
        })
        d3.select("#filter_controversial2").on("click", function() {
            boolBarChart("SHOW MOST CONTROVERSIAL",d.label);
        })
        d3.select("#filter_positive2").on("click", function() {
            boolBarChart("SHOW MOST POSITIVE",d.label);
        })
        d3.select("#filter_negative2").on("click", function() {
            boolBarChart("SHOW MOST NEGATIVE",d.label);
        })
        hashtags = d3.selectAll(".hashtag");
        hashtags.on('click', function(d) {
          text = this.innerText;
          filterTable("info_t", text);
          });

        //highlightAllNodes();
    });
                           

    
    /* d3.selectAll('td').on("mouseover", function(d) {

        highlightSupRejNodes(this.innerText);
        
    }) */
    /*---------------------- Tabs --------------------------*/

    var tab = d3.select('#opt').append("div").attr("class", "tab");


}


/* -------------------- Consideration Modus ----------------------- */
/* In this mode you can explore the different Types of considerations..
---
----
----
-----
 */

function setupConsMode() {

    cleanSVG();

    activateIcon('cons-mode');

    d3.select("#opt").html("");
    d3.select("#opt").append("h4").text("Considerations")


    d3.select("#info-text").html("");

    d3.select("#opt").append('p')
                        .append("text")
                        .html("In this mode you can explore the different claims that were considered in the survey. By clicking on the claims below you will see how their <font color='#48f442'>acceptance</font> or <font color='#FF00FF'>rejection</font> is distributed in the map.");

    claim_table = d3.select("#info-text").append("table").attr("id", "claims");

    claims = allClaimsEnglish();

    var tr = claim_table.append('tr');

                // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < claims.length; i++) {

        tr = claim_table.append('tr');
            
        var tabCell = tr.append('td')
                    .append("text")
                    .text(claims[i])
                    //.style("color", colorByClaimType(getClaimID(supportedClaims[i])));
    };

    d3.selectAll('td').on("click", function(d) {

        removeAllSelectedTd();
        d3.select(this).classed('selected', true);
        /* highlightSupRejNodes(this.innerText); */
        
    })


    var select = d3.select("#opt")
    .append('select')
        .attr('class','select')
        .on('change',onchange)

    /* select.append('option')
    .text("- show all -") */

    claimTypes = ["-Show all-", "Core", "Culinary", "Health", "Normality", "Climate", "World", "Money", "Naturality", "Nature", "Animal rights", "Autonomy"]
    
    var options = select
    .selectAll('option')
        .data(claimTypes).enter()
        .append('option')
            .text(function (d) { return d; });
    
    
    function onchange() {
        selectValue = d3.select('select').property('value')
        /* d3.select("#info-text")
            .append('p')
            .text(selectValue + ' is the last selected option.') */
        if (selectValue == "-Show all-"){
            tableShowAll("claims");
        } else {
            filterTable("claims", selectValue);
        }
       
    };

    node.on("click", function(d){
        
    })

    clabels.on("click", function(d){
    })

    

    
}

function setupStatMode() {

    activateIcon('stat-mode');

    cleanSVG();

    d3.select("#opt").html("");

    d3.select("#opt").append("h5").text("Statistics");

    d3.select("#info-text").html("");
    
    drawDietLegend();
    cellcircle.attr('fill', function(d) {
        return diet_colors(d["proponents"][0]["diet"]); 
    });

    /* form = d3.select("#info-text").append("form");

            form.append("input")
                            .attr("type", "radio")
                            .attr("class", "colorselect")
                            .attr("value","group")
                            .attr("id", "ref-cluster")
                            .property("checked", true);
            
            form.append("label")
                            .attr("for", "ref-cluster")
                            .text("Color by Cluster")
                            .append("br");

            form.append("input")
                            .attr("type", "radio")
                            .attr("class", "colorselect")
                            .attr("value","group")
                            .attr("id", "ref-diet");
            
            form.append("label")
                            .attr("for", "ref-cluster")
                            .text("Color by diet")
                            .append("br");
    
    document.getElementById("ref-cluster").addEventListener("click", setupExploreMode); */
    d3.select("#opt").append('p')
        .append("text")
        .html("You can select if you want to color the map by gender, age or diet. To investigate a country click on its label.");

    var select = d3.select("#opt")
        .append('select')
            .attr('class','select')
            .on('change',onchange2)

        /* select.append('option')
        .text("- show all -") */

        color_option = ["Diet", "Gender", "Age", "None"];
        
        var options = select
        .selectAll('option')
            .data(color_option).enter()
            .append('option')
            .attr("id", function (d) { return d; })
                .text(function (d) { return d; });
        
        options.select("#Diet").property("checked", true);
        
        /* select.append('option')
                .text("- show all -").attr('selected') */
        
        function onchange2() {

            //node = d3.selectAll('.node');
            /* d3.select("#info-text")
                .append('p')
                .text(selectValue + ' is the last selected option.') */

            selectValue = d3.select('select').property('value')

            cellcircle.attr('fill', colorByChoice2);
            //(selectValue);
        };

    node.on("click", function(d){

    })


    clabels.on("click", function(d){
        ids = [];
        for (n_id in d["cluster"]) {
        //console.log(c["cluster"][n_id]["id"]);
            ids.push(d["cluster"][n_id]["id"]);
        };

        cellcircle.attr('fill', function(d) {
            if(ids.indexOf(d["id"]) >= 0){
                return colorByChoice2(d);
            }
            else {
                return colorByMembership(d);
            }
	    });

        showCountryStats(d, d3.select('select').property('value'));
      });
    
}

