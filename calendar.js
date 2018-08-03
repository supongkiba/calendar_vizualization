<script type='text/javascript'>

// <-------- Give Custom hexadecimal value for different shades (Light -> dark)----------->

var Shade1 = "#eceff1",
    Shade2 = "#cfd8dc",
    Shade3 = "#b0bec5",
    Shade4 = "#90a4ae";

// <------------------------------------------------------------------------------------>

var testValidation = document.createElement('p');
    testValidation.setAttribute("id", "validateTest");
    testValidation.setAttribute("style", "color:darkgrey");
    testValidation.innerHTML += "Please select a single test";

// Apply Critical and Warning Threshold
function applyThreshold(criVal, warVal) {
    var errorDialog = document.createElement('p');
    errorDialog.setAttribute("id", "errDialog");
    errorDialog.setAttribute("style", "color:darkgrey");
    errorDialog.innerHTML += "Critical value should be greater than Warning value";
    if ($("#errDialog").hasClass("ui-dialog-content") == true) {
        $("#errDialog").remove();
    }
    var clearMetricTile = document.getElementsByClassName("metricTile");
    for (var h = 0; h < clearMetricTile.length; h++) {
        if (clearMetricTile[h].innerText != "N/A" && (clearMetricTile[h].getAttribute("style") == "color: #b60107" || clearMetricTile[h].getAttribute("style") == "color: #b60107;") || (clearMetricTile[h].getAttribute("style") == "color: #ff8501" || clearMetricTile[h].getAttribute("style") == "color: #ff8501;")) {
            clearMetricTile[h].setAttribute("style", "color: #17202A");
        }
    }
    var extractVal;
    for (var h = 0; h < document.getElementsByClassName("metricTile").length; h++) {
        extractVal = document.getElementsByClassName("metricTile")[h].innerText.substring(0, document.getElementsByClassName("metricTile")[h].innerText.indexOf(" "));
        extractVal = parseInt(extractVal);
        if (criVal.length == 0 && warVal.length == 0) {
            break;
        }
        if (criVal.length != 0 && warVal.length != 0 && criVal <= warVal) {
            document.getElementById("threshold").append(errorDialog);
            $("#errDialog").dialog();
              document.querySelector("div[aria-describedby=errDialog]").getElementsByClassName("ui-dialog-title")[0].innerHTML="Error Message";
              document.querySelector("div[aria-describedby=errDialog]").getElementsByTagName("button")[0].innerHTML= "X"
            break;
        }
        if (extractVal >= criVal && criVal.length != 0) {
            document.getElementsByClassName("metricTile")[h].setAttribute("style", "color: #b60107");
            document.getElementsByClassName("metricTile")[h].getElementsByTagName("span")[0].setAttribute("style", "color: #17202A");
        }
        if (extractVal >= warVal && extractVal < criVal && warVal.length != 0) {
            document.getElementsByClassName("metricTile")[h].setAttribute("style", "color: #ff8501");
            document.getElementsByClassName("metricTile")[h].getElementsByTagName("span")[0].setAttribute("style", "color: #17202A");
        }
        if (extractVal >= warVal && criVal.length == 0 && warVal.length != 0) {
            document.getElementsByClassName("metricTile")[h].setAttribute("style", "color: #ff8501");
            document.getElementsByClassName("metricTile")[h].getElementsByTagName("span")[0].setAttribute("style", "color: #17202A");
        }
    }
}

// Clear Threshold Values
function clearThreshold() {
    var clearMetricTile = document.getElementsByClassName("metricTile");
    for (var h = 0; h < clearMetricTile.length; h++) {
        if (clearMetricTile[h].innerText != "N/A" && (clearMetricTile[h].getAttribute("style") == "color: #b60107" || clearMetricTile[h].getAttribute("style") == "color: #b60107;") || (clearMetricTile[h].getAttribute("style") == "color: #ff8501" || clearMetricTile[h].getAttribute("style") == "color: #ff8501;")) {
            clearMetricTile[h].setAttribute("style", "color: #17202A");
            document.getElementById('critical').value = "";
            document.getElementById('warning').value = "";
        }
    }
}


document.addEventListener('DOMContentLoaded', function(event) {
  if(document.getElementsByClassName("acomp-ctn-in")[0].getElementsByClassName("acomp-block").length==1){

    var selector = CPVisualization.getContainerSelector();
    var summary = CPVisualization.getData();

    // Get metric units
    var metricName = summary.headers.metrics[0];
    function metricMatch(){
        if(metricName.match("(?=[^ ]*$)(.*)")!=null && metricName.match("(?=[^ ]*$)(.*)")[0] == "(ms)" ){return metricName.match("(?=[^ ]*$)(.*)")[0];}
        else if(metricName.match("%")!=null && metricName.match("%")[0]){ return "%";}
        else if(metricName.match("#")!=null && metricName.match("#")[0]){ return "#";}
        else if(metricName.match("Bytes")!=null && metricName.match("Bytes")[0]){ return "Bytes";}
        else if(metricName.match("File Size")!=null && metricName.match("File Size")[0]){ return "bytes";}
        else if(metricName.match("Webpage Throughput")!=null && metricName.match("Webpage Throughput")[0]){ return "bytes/ms";}
        else if(metricName.match("Throughput")!=null && metricName.match("Throughput")[0]){ return "kb/s";}
        else{return "";}
    }
    var metricSelected = metricMatch();
    // -----------------

    // Threshold: creating the critical and warning elements
    d3.select(selector).append("div").attr("id", "threshold");

    var lblCritical = document.createElement('label');
    lblCritical.innerHTML += '<span id="criColor" style="background-color: #b60107">   </span> Critical :';
    var inpCritical = document.createElement('input');
    inpCritical.setAttribute("value", "");
    inpCritical.setAttribute("placeholder", " "+metricSelected);
    inpCritical.id += "critical";

    var lblWaring = document.createElement('label');
    lblWaring.innerHTML += '<span id="warColor" style="background-color: #ff8501">   </span> Warning :';
    var inpWarning = document.createElement('input');
    inpWarning.setAttribute("value", "");
    inpWarning.setAttribute("placeholder", " "+metricSelected);
    inpWarning.id += "warning";

    var appBtn = document.createElement('a');
    appBtn.innerHTML += "Apply";
    appBtn.className += "thres-btn";
    appBtn.setAttribute("onclick", "applyThreshold(parseInt(document.getElementById('critical').value), parseInt(document.getElementById('warning').value))");

    // Threshold: Clear 
    var clearAppBtn = document.createElement('a');
    clearAppBtn.innerHTML += "Clear";
    clearAppBtn.className += "thres-btn";
    clearAppBtn.setAttribute("onclick", "clearThreshold()");
    var lineBreak = document.createElement('br');

    // Metric label
    var metLabel = document.createElement('span');
    metLabel.setAttribute("id", "metricLabel");

//<span style="background-color: #5997d6"> </span>

    // Appending all elements
    document.getElementById("threshold").append(metLabel);
    document.getElementById("threshold").append(lblCritical);
    document.getElementById("threshold").append(inpCritical);
    document.getElementById("threshold").append(lblWaring);
    document.getElementById("threshold").append(inpWarning);
    document.getElementById("threshold").append(appBtn);
    document.getElementById("threshold").append(clearAppBtn);
    document.getElementById("threshold").append(lineBreak);

    // Main Calender 
    d3.select(selector).append("div").attr("id", "caleandar");
    document.getElementById("caleandar").setAttribute("style","min-width: 850px");
    document.getElementById("caleandar").setAttribute("style","max-width: 1600px;");

    // Parsing data from CP-Viz
    function parseData() {

        document.getElementById("metricLabel").innerHTML = summary.headers.metrics[0] + " : Average";
        var dateValuesText = '{"metrics": "' + summary.headers.metrics + '", "data": []}';
        var dateValues = JSON.parse(dateValuesText);
        for (var i = 0; i < summary.data.length; i++) {
            if (dateValues.data.length != 0) {
                for (var k = 0; k < dateValues.data.length; k++) {
                    if (dateValues.data[k].date == summary.data[i].dimension.substring(0, summary.data[i].dimension.indexOf(" "))) {
                        dateValues.data[k].value.push(summary.data[i].metrics[0]);
                        break;
                    }
                }
                if (dateValues.data.length == k) {
                    dateValues.data.push({
                        "date": summary.data[i].dimension.substring(0, summary.data[i].dimension.indexOf(" ")),
                        "value": [summary.data[i].metrics[0]]
                    });
                }
            } else {
                dateValues.data.push({
                    "date": summary.data[i].dimension.substring(0, summary.data[i].dimension.indexOf(" ")),
                    "value": [summary.data[i].metrics[0]]
                });
            }
        }
        return dateValues;
    }

    // Parsed and collated data for the respective dates
    var dateValuesCombined = parseData();

    // Aggregating parsed data to get the averaged values.
    var count;
    var addTemp;
    var avgValue;
    var aggDataText = '{"metrics": "' + dateValuesCombined.metrics + '", "data": []}';
    var aggDataObj = JSON.parse(aggDataText);
    for (var x = 0; x < dateValuesCombined.data.length; x++) {
        count = 0;
        addTemp = 0;
        avgValue = 0;
        for (var y = 0; y < dateValuesCombined.data[x].value.length; y++) {
            addTemp += dateValuesCombined.data[x].value[y];
            count++;
        }
        aggDataObj.data.push({
            "date": dateValuesCombined.data[x].date,
            "value": [Math.round(addTemp / count * 100) / 100]
        });
    }

    // Data breakdowns for coloring
    var ref_arr = [];
    for (key in aggDataObj.data) { ref_arr[key] = aggDataObj.data[key].value[0]; }
    var maxVal = Math.max.apply(Math, ref_arr);
    var minVal = Math.min.apply(Math, ref_arr);
    //Store from min to max and derive the breakdowns
    var data = [];
    var j = 0;
    do { data[j] = minVal;
        minVal++, j++ }
    while (minVal <= maxVal)

    // Breakdown into ranges[min...middle1...middle2...middle3...max]
    var first = 0;
    var last = data.length - 1;
    var mid = Math.floor((first + last) / 2);
    var middle1 = data[Math.floor(mid / 2)];
    var middle2 = data[mid];
    var first = mid + 1;
    var middle3 = data[Math.floor((first + last) / 2)];
    var end = data[last];

    // calendar.js
    var Calendar = function(model, options, date) {
        // Default Values
        this.Options = {
            Color: '',
            NavShow: true,
            DateTimeShow: true,
            DateTimeFormat: 'mmm, yyyy',
            DisabledDays: [],
        };
        // Overwriting default values
        for (var key in options) {
            this.Options[key] = typeof options[key] == 'string' ? options[key].toLowerCase() : options[key];
        }

        model ? this.Model = model : this.Model = {};
        //this.Today = new Date();
        this.Today = new Date(dateValuesCombined.data[dateValuesCombined.data.length - 1].date);
        this.Selected = this.Today
        this.Today.Month = this.Today.getMonth();
        this.Today.Year = this.Today.getFullYear();
        if (date) { this.Selected = date }
        this.Selected.Month = this.Selected.getMonth();
        this.Selected.Year = this.Selected.getFullYear();
        this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
        this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
        this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();
        this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
        if (this.Selected.Month == 0) { this.Prev = new Date(this.Selected.Year - 1, 11, 1); }
        this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
    };

    function createCalendar(calendar, element, adjuster) {
        if (typeof adjuster !== 'undefined') {
            var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
            calendar = new Calendar(calendar.Model, calendar.Options, newDate);
            element.innerHTML = '';
        } else {
            for (var key in calendar.Options) {
                typeof calendar.Options[key] != 'function' && typeof calendar.Options[key] != 'object' && calendar.Options[key] ? element.className += " " + key + "-" + calendar.Options[key] : 0;
            }
        }
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var mainSection = document.createElement('div');
        mainSection.className += "cld-main";

        function AddDateTime() {
            var datetime = document.createElement('div');
            datetime.className += "cld-datetime";
            if (calendar.Options.NavShow && !calendar.Options.NavVertical) {
                var rwd = document.createElement('div');
                rwd.className += " cld-rwd cld-nav";
                rwd.addEventListener('click', function() { createCalendar(calendar, element, -1); });
                rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
                datetime.appendChild(rwd);
            }
            var today = document.createElement('div');
            today.className += ' today';
            today.innerHTML = months[calendar.Selected.Month] + ", " + calendar.Selected.Year;
            datetime.appendChild(today);
            if (calendar.Options.NavShow && !calendar.Options.NavVertical) {
                if (calendar.Selected.Month < calendar.Today.Month || calendar.Selected.Year < calendar.Today.Year) {
                    var fwd = document.createElement('div');
                    fwd.className += " cld-fwd cld-nav";
                    fwd.addEventListener('click', function() { createCalendar(calendar, element, 1); });
                    fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
                    datetime.appendChild(fwd);
                }
            }
            if (calendar.Options.DatetimeLocation) {
                document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
                document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
            } else { mainSection.appendChild(datetime); }
        }

        //--------------------------------------------------------------------------------------------------------

        function AddLabels() {
            var labels = document.createElement('ul');
            labels.className = 'cld-labels';
            var labelsList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            for (var i = 0; i < labelsList.length; i++) {
                var label = document.createElement('li');
                label.className += "cld-label";
                label.innerHTML = labelsList[i];
                labels.appendChild(label);
            }
            mainSection.appendChild(labels);
        }

        function AddDays() {

            // Create Number Element
            function DayNumber(n) {

                var number = document.createElement('p');
                number.className += "cld-number";
                number.id += (calendar.Selected.Month + 1) + "/" + n + "/" + calendar.Selected.Year;
                number.innerHTML += n;

                var tileData = document.createElement('div');
                tileData.className += "metricTile";
                for (var s = 0; s < aggDataObj.data.length; s++) {
                    if (aggDataObj.data[s].date == (calendar.Selected.Month + 1) + "/" + n + "/" + calendar.Selected.Year) {
                        tileData.innerHTML += aggDataObj.data[s].value[0] + "<span> "+metricSelected+"</span>";
                        var temp = '<canvas class="sparkline" width="150" height="50" data-sparkline="' + dateValuesCombined.data[s].value + '"></canvas>';
                        tileData.innerHTML += temp;

                        // If metric is % Availability; Not all greater values are bad
                        if(metricName == "% Availability"){ Shade1 = "#90a4ae"; Shade2 = "#b0bec5"; Shade3 = "#cfd8dc"; Shade4 = "#eceff1"; }
                        
                        if (aggDataObj.data[s].value[0] >= 0 && aggDataObj.data[s].value[0] <= middle1) { 
                                if(middle1==middle2 && middle2==middle3){
                                    number.style.backgroundColor = Shade4; 
                                }else{
                                    number.style.backgroundColor = Shade1; 
                                }
                        } else if (aggDataObj.data[s].value[0] > middle1 && aggDataObj.data[s].value[0] <= middle2) {
                                number.style.backgroundColor = Shade2; 
                        } else if (aggDataObj.data[s].value[0] > middle2 && aggDataObj.data[s].value[0] <= middle3) {
                                number.style.backgroundColor = Shade3; 
                        } else {
                                number.style.backgroundColor = Shade4; 
                        }
                        break;
                    }
                }
                if (aggDataObj.data.length == s) {
                    number.classList.add("noData");
                    tileData.innerHTML += "N/A";
                }
                number.appendChild(tileData);

                return number;

            }
            var days = document.createElement('ul');
            days.className += "cld-days";


            //----------------------Previous Month's Days-----------------------------------//
            for (var i = 0; i < (calendar.Selected.FirstDay); i++) {
                var day = document.createElement('li');
                day.className += "cld-day prevMonth";
                //Disabled Days
                var d = i % 7;
                for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
                    if (d == calendar.Options.DisabledDays[q]) {
                        day.className += " disableDay";
                    }
                }

                var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i + 1));

                function DayInnerTag() {
                    var tag = document.createElement('div');
                    tag.className += "metricTile";
                    return tag;
                }

                var DayIT = DayInnerTag();
                number.appendChild(DayIT);

                day.appendChild(number);
                days.appendChild(day);

            }
            //--------------- Current Month's Days------------------------//
            for (var i = 0; i < calendar.Selected.Days; i++) {
                var day = document.createElement('li');
                if ((i + 1) > calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year) {
                    day.className += "cld-day currMonth currMonth-futureDays";
                } else {
                    day.className += "cld-day currMonth";
                }

                //Disabled Days
                var number = DayNumber(i + 1);

                day.appendChild(number);

                // If Today..
                if ((i + 1) == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year) {
                    day.className += " today";
                }

                days.appendChild(day);
            }



            //-------------------------------- Next Month's Days----------------------//
            // Always same amount of days in calander
            var extraDays = 13;
            if (days.children.length > 35) { extraDays = 6; } else if (days.children.length < 29) { extraDays = 20; }

            for (var i = 0; i < (extraDays - calendar.Selected.LastDay); i++) {
                var day = document.createElement('li');
                day.className += "cld-day nextMonth";
                //Disabled Days
                var d = (i + calendar.Selected.LastDay + 1) % 7;
                for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
                    if (d == calendar.Options.DisabledDays[q]) {
                        day.className += " disableDay";
                    }
                }

                var number = DayNumber(i + 1);
                day.appendChild(number);

                days.appendChild(day);
            }


            mainSection.appendChild(days);
        }
        if (calendar.Options.Color) {
            mainSection.innerHTML += '<style>.cld-main{color:' + calendar.Options.Color + ';}</style>';
        }
        element.appendChild(mainSection);

        if (calendar.Options.DateTimeShow) {
            AddDateTime();
        }
        AddLabels();
        AddDays();
        applyThreshold(parseInt(document.getElementById('critical').value), parseInt(document.getElementById('warning').value))
        spark();

    }


    function caleandar(el, data, settings) {
        var obj = new Calendar(data, settings);
        createCalendar(obj, el);
    }

    //
    //alert(JSON.stringify(summary, null, 4));

    // demo.js 
    var events = [];
    var settings = {};
    var element = document.getElementById('caleandar');
    caleandar(element, events, settings);

    // Create spark lines
    function spark() {
        for (i = 0; i < document.getElementsByClassName("sparkline").length; i++) {
            var c = document.getElementsByClassName("sparkline")[i];
            if(typeof(c)!='undefined'){
              var ctx = c.getContext("2d");
              var data = c.getAttribute("data-sparkline");
              var spark = data.split(',');
              for (a in spark) {
                  spark[a] = parseInt(spark[a], 10);
              }
              var margin = 10;
              var ratioW = ((c.width - margin * 2) * 1) / spark.length;
              var ratioH = ((c.height - margin * 2) * .4) / Math.max.apply(Math, spark);
              var x = 0;
              var y = 0;
              var grad = ctx.createLinearGradient(0, 0, c.width, c.height);
              grad.addColorStop(0, "#2F4F4F"); // Initial path colour
              grad.addColorStop(1, "#2F4F4F"); // End stroke colour

              ctx.strokeStyle = grad;
              ctx.lineWidth = "1";
              ctx.stroke();
              for (index in spark) {
                  if (index == 0) {
                      // First time
                      ctx.beginPath();
                      ctx.lineWidth = "1";
                      ctx.moveTo(margin, c.height - (spark[index] * ratioH + margin));
                  } else {
                      x = index * ratioW + margin;
                      y = c.height - (spark[index] * ratioH + margin);
                      ctx.lineTo(x, y);
                  }
              }
              ctx.stroke();
              ctx.lineWidth = "1";
              ctx.stroke();
            }
        }
    }
}else{
  document.body.append(testValidation);
  $("#validateTest").dialog();
  document.querySelector("div[aria-describedby=validateTest]").getElementsByClassName("ui-dialog-title")[0].innerHTML="Message";
  document.querySelector("div[aria-describedby=validateTest]").getElementsByTagName("button")[0].innerHTML= "X"
}
});

</script>
<style>
// theme1.css
.cld-main {
    width: 330px;
}

.cld-main a {
    color: #333;
    font-weight: bold;
}

.cld-datetime {
    position: relative;
    width: 66%;
    min-width: 100px;
    max-width: 300px;
    margin: auto;
    overflow: hidden;
}

.cld-datetime .today {
    position: relative;
    float: left;
    width: calc(100% - 40px);
    margin: auto;
    text-align: center;
}

.cld-nav {
    position: relative;
    width: 20px;
    height: 20px;
    margin-top: 2px;
}

.cld-nav:hover {
    cursor: pointer;
}

.cld-nav:hover svg {
    fill: #666;
}

.cld-rwd {
    float: left;
}

.cld-fwd {
    float: right;
}

.cld-nav svg:hover {}

.cld-labels,
.cld-days {
    padding-left: 0;
}

.cld-label,
.cld-day {
    display: inline-grid;
    width: 14.28%;
    text-align: center;
}

.cld-day.today .cld-number {
    /*display: inline-block;*/
    height: 120px;
    border-radius: 5px;
    border-color: #c3c5c5;
    border: solid -1px;
}

.currMonth-futureDays {
    opacity: 0.0;
    background-color: #fff;
}

.cld-day.disableDay {
    opacity: 0.0;
    background-color: #fff;
}

.cld-day.nextMonth {
    opacity: 0.0;
    background-color: #fff;
}

.cld-day.prevMonth {
    opacity: 0.0;
    background-color: #fff;
}

.cld-number {
    position: relative;
    margin: 5px;
    padding: 5px;
    height: 120px;
    width: relative;
    background-color: #cfd8dc;
    border-radius: 5px;
    border: solid 1px;
    border-color: #90a4ae;
    text-align: right;
    font-size: large;
}

.cld-number:hover {
    box-shadow: 0px 3px 5px darkgrey;
    display: block;
}

.cld-number.eventday:hover {
    cursor: pointer;
    background: #eee;
}

.today .cld-number.eventday:hover {
    background: #888;
}

.metricTile {
    padding-top: 10px;
    margin: 0px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
}

.metricTile>span {
    background: none;
    font-weight: normal;
    font-size: smaller;
}

.noData {
    background-color: white;
    color: darkgrey;
}

.critical {
    color: #b60107
}

.warning {
    color: #ff8501
}

#threshold {
    margin-bottom: 18px;
    display: flex;
    max-width: 1600px;
}

#threshold>input {
    text-indent: 6px;
    margin-left: 4px;
    height: 16px;
}

#threshold>label:nth-of-type(2) {
    margin-left: 10px;
}

#threshold>label:nth-of-type(1) {
    margin-left: auto;
    margin-right: 0;
}

.thres-btn {
    margin-left: 10px;
    background-color: #FBFBFB;
    border: 1px solid #CCCCCC;
    border-radius: 2px;
    text-decoration: none;
    padding: 0px 20px;
    font-weight: bold;
    color: #006cb1;
    cursor: pointer;
}

.thres-btn:nth-of-type(2) {
    color: grey;
}

.thres-btn:nth-of-type(2):hover {
    border-color: #CCCCCC;
    background-color: transparent;
    color: grey;
}

.thres-btn:hover {
    border-color: #12497F;
    background-color: #006CB1;
    color: #fff;
}

.sparkline {
    height: 100%;
    width: 100%;
    margin-top: 0;
}
#criColor,#warColor{
    margin: 0px 5px 0px 2px;
    line-height: 0.5;
    border: 1px solid #505050;
    height: 9px;
    vertical-align: middle;
    display: inline-block;
}
</style>
