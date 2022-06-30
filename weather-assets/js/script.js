var lookupRecords = [];

function findInfo() {
    var infoStorage = JSON.parse(localStorage.getItem("lookupRecords"));
    if (infoStorage !== null) {
        lookupRecords = infoStorage;
    };

    for (i = 0; i < lookupRecords.length; i++) {
        if (i == 8) {
            break;
          }

        lists = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });

        lists.text(lookupRecords[i]);
        $(".list-group").append(lists);
    }
};
var city;
var todayInfo = $(".card-body");

findInfo();

function getData() { 
    var uRL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c6262f2f3040da54c04ab0d1f1cd59a9" // starts call for current conditions
    todayInfo.empty();
    $("#dayByDay").empty();

    $.ajax({
        url: uRL,
        method: "GET"
    }).then(function (response) {

        var time = moment().format(" MM/DD/YYYY");
        var iconSymbol = response.weather[0].icon;
        var iconAddress = "http://openweathermap.org/img/w/" + iconSymbol + ".png";
        var cityName = $("<h3>").html(city + time);

        todayInfo.prepend(cityName);
        todayInfo.append($("<img>").attr("src", iconAddress));

        var temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        todayInfo.append($("<p>").html("Temperature: " + temp + " &#8457")); 
        var humidity = response.main.humidity;
        todayInfo.append($("<p>").html("Humidity: " + humidity)); 
        var wind = response.wind.speed;
        todayInfo.append($("<p>").html("Wind Speed: " + wind)); 

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=c6262f2f3040da54c04ab0d1f1cd59a9&lat=" + lat + "&lon=" + lon, // my api code
            method: "GET"

        }).then(function (response) {
            todayInfo.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            // 
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c6262f2f3040da54c04ab0d1f1cd59a9", // my api code
            method: "GET"

        }).then(function (response) {
            for (i = 0; i < 5; i++) { 
                var newCard = $("<div>").attr("class", "col fiveDay bg-primary text-white rounded-lg p-2");
                $("#dayByDay").append(newCard);

                var myDate = new Date(response.list[i * 8].dt * 1000);
                newCard.append($("<h4>").html(myDate.toLocaleDateString()));
                var iconSymbol = response.list[i * 8].weather[0].icon;
                var iconAddress = "http://openweathermap.org/img/w/" + iconSymbol + ".png";
                newCard.append($("<img>").attr("src", iconAddress));
                var temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);
                newCard.append($("<p>").html("Temp: " + temp + " &#8457"));
                var humidity = response.list[i * 8].main.humidity;
                newCard.append($("<p>").html("Humidity: " + humidity));
            }
        })
    })
};

$("#lookUp").click(function() {
    city = $("#city").val().trim();
    getData();
    var checkArray = lookupRecords.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        lookupRecords.push(city);
        localStorage.setItem("lookupRecords", JSON.stringify(lookupRecords));
        var lists = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        lists.text(city);
        $(".list-group").append(lists);
    };
});

$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});

$("#lookUp").keypress(function () {  
    var _val = $("#lookUp").val();  
    var _txt = _val.charAt(0).toUpperCase() + _val.slice(1);  
    $("#lookUp").val(_txt);
});

$('#purge').click( function() {
    window.localStorage.clear();
    location.reload();
    return false;
    });