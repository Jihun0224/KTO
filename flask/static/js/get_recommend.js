function get_recommend(address) {
    $.ajax({
        url: "/recommend",
        data: { address: address },
        method: "GET",
        dataType: "json"
    })
    .done(function(json) {
        console.log(json);
        $("#firstCardAddress").html(json[0].address);
        $("#firstCardInfo").html(json[0].info);
        $("#firstCardTitle").html(json[0].travelDestination);
        $("#firstCardUrl").attr("href",json[0].infoUrl);
        $("#firstCardImg").css('background-image', 'url(' + json[0].imageUrl + ')');
       
        $("#SecondCardAddress").html(json[1][0].address);
        $("#SecondCardInfo").html(json[1][0].info);
        $("#SecondCardTitle").html(json[1][0].travelDestination);
        $("#SecondCardUrl").attr("href",json[1][0].infoUrl);
        $("#SecondCardImg").css('background-image', 'url(' + json[1][0].src + ')');
    
    })

}