/**
 * Created by pr3mar on 31.05.2015.
 */
positive = 0;
negative = 0;
neutral = 0;

var sel = document.getElementById('category-change');
for(var key in categories) {
    var opt = document.createElement('option');
    opt.innerHTML = key;
    opt.value = key;
    sel.appendChild(opt);
}
var opt = document.createElement('option');
opt.innerHTML = "other";
opt.value = "other";
sel.appendChild(opt);

var sel = document.getElementById('user-change');
countUsers = 0
for(var key in users) {
    var opt = document.createElement('option');
    opt.innerHTML = users[key]["name"];
    opt.value = key;
    sel.appendChild(opt);
    if(countUsers >= 50)
        break;
    countUsers++;
}

function getLabel(label) {
    switch(label){
        case "positive":
            return '<span style="color:green; font-weight: bold"; >positive</span>.<br> I think you will like this place!';
        case "neutral":
            return '<span style="color:yellowgreen; font-weight: bold">neutral</span>.<br> I am not sure if you will like this store, check it out!';
        case "negative":
            return '<span style="color:red; font-weight: bold">negative</span>.<br> Uuumm, I don\'t think  you will like this place :/';
    }
}

function getDesc(list) {
    var ret = "<p>";
    ret += '<div> Prediction: ' + getLabel(list["label"]) + '</div>';
    ret += '<div>Cluster: ' + list["cluster"] + '</div>';
    // categories
    ret += '<div>Categories: ';
    ret += "<ul>";
    for(var i in list["categories"]){
        if(list["majorCategories"].indexOf(list["categories"][i]) >= 0)
            ret += "<li style='font-weight: bold'>" + list["categories"][i] + "</li>";
        else
            ret += "<li>" + list["categories"][i] + "</li>";
    }
    ret += "</ul></div></p>";
    return ret;
}

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(55.9443795,-3.1968141),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
var infowindow = new google.maps.InfoWindow();

var key;
var markerDict = {};
var clusters = {"C1":new Image().src='imgs/1f78b4.png', "C2":new Image().src='imgs/6a3d9a.png', "C3":new Image().src='imgs/33a02c.png',
    "C4":new Image().src='imgs/a6cee3.png', "C5":new Image().src='imgs/b2df8a.png', "C6":new Image().src='imgs/b15928.png', "C7":new Image().src='imgs/cab2d6.png',
    "C8":new Image().src='imgs/e31a1c.png', "C9":new Image().src='imgs/fb9a99.png', "C10":new Image().src='imgs/ff7f00.png', "C11":new Image().src='imgs/ffff99.png',
    "C12":new Image().src='imgs/fdbf6f.png', "C13":new Image().src='imgs/8dd3c7.png', "C14":new Image().src='imgs/9e0142.png', "C15":new Image().src='imgs/5e4fa2.png'}
//var pinColors = ["a6cee3", "1f78b4", "b2df8a", "33a02c", "fb9a99", "e31a1c", "fdbf6f", "ff7f00", "cab2d6", "6a3d9a", "ffff99", "b15928", "8dd3c7", "9e0142", "5e4fa2"];
for (var key in business) {
    //console.log(business[key]["longitude"], business[key]["latitude"])
    //console.log(business[key]["cluster"], pinImages[clusters[business[key]["cluster"]]]);
    switch (business[key]["label"]) {
        case "positive":
            positive++;
            break;
        case "negative":
            negative++;
            break;
        case "neutral":
            neutral++;
            break;
    }
    markerDict[key] = new google.maps.Marker({
        position: new google.maps.LatLng(business[key]["latitude"], business[key]["longitude"]),
        map: map,
        icon: clusters[[business[key]["cluster"]]],
        visible: business[key].visible,
        title:business[key]["name"]
    });
    google.maps.event.addListener(markerDict[key], 'click', (function(marker, key) {
        return function() {
            //TODO add info about stars!
            infowindow.setContent("<h3>" + business[key]["name"]+ "</h3>" + getDesc(business[key]));
            infowindow.open(map, marker);
        }
    })(markerDict[key], key));
}
$("#calculate").click(function(){
    for(key in business) {
        if(markerDict[key].getVisible()) {
            markerDict[key].setVisible(false);
        } else {
            markerDict[key].setVisible(true);
        }
    }
});

$(window).resize(function() {
    google.maps.event.trigger(map, "resize");
});

$("#cluster-change").change(function() {
    $("#showUserStats").addClass('hide');
    $("#categoryContainer").addClass("hide");
    $("#businessContainer").addClass("hide");
    value = $("#cluster-change").val();
    //console.log(value);
    positive = 0; negative = 0; neutral = 0;
    var all = 0;
    for(el in business) {
        if(value == ""){
            markerDict[el].setVisible(true);
        } else if(business[el]["cluster"] == value) {
            markerDict[el].setVisible(true);
        } else {
            markerDict[el].setVisible(false);
            continue;
        }
        all++;
        switch (business[el]["label"]) {
            case "positive":
                positive++;
                break;
            case "negative":
                negative++;
                break;
            case "neutral":
                neutral++;
                break;
        }
    }
    if(value == "")
        $("#clus").html("all" + " (" + all + ")");
    else
        $("#clus").html(value + " (" + all + ")");
    $("#pos").html(positive);
    $("#neu").html(neutral);
    $("#neg").html(negative);
});
$("#category-change").change(function() {
    $("#showUserStats").addClass('hide');
    $("#categoryContainer").addClass("hide");
    $("#businessContainer").addClass("hide");
    value = $("#category-change").val();
    //console.log(value);
    positive = 0; negative = 0; neutral = 0;
    var all = 0;
    for(el in business) {
        if(value == ""){
            markerDict[el].setVisible(true);
        } else if(business[el]["majorCategories"].indexOf(value) >= 0) {
            markerDict[el].setVisible(true);
        } else {
            markerDict[el].setVisible(false);
            continue;
        }
        all++;
        switch (business[el]["label"]) {
            case "positive":
                positive++;
                break;
            case "negative":
                negative++;
                break;
            case "neutral":
                neutral++;
                break;
        }
    }
    if(value == "")
        $("#clus").html("all" + " (" + all + ")");
    else
        $("#clus").html(value + " (" + all + ")");
    $("#pos").html(positive);
    $("#neu").html(neutral);
    $("#neg").html(negative);
});

selectedUserID = ""
selectedThing = 1;
function showUser(userID, thing) {
    if(userID == "") {
        for(key in business) {
            markerDict[key].setVisible(true);
            all++;
            switch (business[el]["label"]) {
                case "positive":
                    positive++;
                    break;
                case "negative":
                    negative++;
                    break;
                case "neutral":
                    neutral++;
                    break;
            }
        }
        $("#clus").html("all" + " (" + all + ")");
        $("#pos").html(positive);
        $("#neu").html(neutral);
        $("#neg").html(negative);
        $("#showUserStats").addClass('hide');
        $("#categoryContainer").addClass("hide");
        $("#businessContainer").addClass("hide");
        selectedUserID = "";
        return;
    }
    if(selectedUserID == userID && thing == selectedThing) return;
    if(selectedThing != thing) selectedThing = thing;
    if(selectedUserID != userID) selectedUserID = userID;
    //console.log(userID, thing)
    positive = 0; negative = 0; neutral = 0;
    var all = 0;
    $("#showUserStats").removeClass("hide");
    $("#userName").html(users[userID]["name"]);
    insert = "";
    insert += '<li class="list-group-item"><span style="font-weight: bold;">popularity: </span>' + Math.round(users[userID]["popularity"] * 1000)/1000 + '</li>';
    insert += '<li class="list-group-item"><span style="font-weight: bold;">review count: </span>' + users[userID]["review_count"] + '</li>';
    insert += '<li class="list-group-item"><span style="font-weight: bold;">avg. stars: </span>' + users[userID]["average_stars"] + '</li>';
    insert += '<li class="list-group-item"><span style="font-weight: bold;">no. fans: </span>' + users[userID]["fans"] + '</li>';
    insert += '<li class="list-group-item"><span style="font-weight: bold;">no. friends: </span>' + users[userID]["friends"].length + '</li>';
    $("#stats").html(insert);
    insert = "";
    if(thing == 1) {
        $("#businessContainer").removeClass("hide");
        $("#categoryContainer").addClass("hide");
        for (i in users[userID]["predictions"]) {
            insert += '<li class="list-group-item">' + business[users[userID]["predictions"][i]]["name"] + '</li>';
        }
        $("#predictedBusinesses").html(insert);
    } else if(thing == 2) {
        $("#categoryContainer").removeClass("hide");
        $("#businessContainer").addClass("hide");
        for (i in users[userID]["predictedCategories"]) {
            insert += '<li class="list-group-item">' + users[userID]["predictedCategories"][i] + '</li>';
        }
        $("#predictedCategories").html(insert);
    }
    for(el in business) {
        if(users[userID]["predictions"].indexOf(el) >= 0 && thing == 1) {
            markerDict[el].setVisible(true);
        } else if( thing == 2) {
            var show = false;
            for (cat in business[el]["majorCategories"]) {
                if (users[userID]["predictedCategories"].indexOf(business[el]["majorCategories"][cat]) >= 0) {
                    show = true;
                    break;
                }
            }
            if (show) {
                markerDict[el].setVisible(true);
            } else {
                markerDict[el].setVisible(false);
                continue;
            }
        } else {
            markerDict[el].setVisible(false);
            continue;
        }
        switch (business[el]["label"]) {
            case "positive":
                positive++;
                break;
            case "negative":
                negative++;
                break;
            case "neutral":
                neutral++;
                break;
        }
        all++;
    }
    $("#clus").html(users[userID]["name"] + " (" + all + ")");
    $("#pos").html(positive);
    $("#neu").html(neutral);
    $("#neg").html(negative);

}

$("#user-change").change(function() {
    var thing = $('#radioUser .active').children("input").val();
    var user = $(this).val();
    showUser(user, thing);
});

$("#busRad").click(function() {
    var selected = $(this).children("input").val();
    var user = $("#user-change").val();
    showUser(user, selected);
});

$("#catRad").click(function() {
    var selected = $(this).children("input").val();
    var user = $("#user-change").val();
    showUser(user, selected);
});

google.maps.event.addListenerOnce(map, 'idle', function(){
    $("#clus").html("all" + " (" +(positive + negative + neutral) +")");
    $("#pos").html(positive);
    $("#neu").html(neutral);
    $("#neg").html(negative);
});
