function getSimilar(similar){
    document.getElementById("similar1-name").innerHTML=similar[0].name.split('[')[0];
    document.getElementById("similar1-addr").innerHTML=similar[0].address;
    document.getElementById("similar1-num").innerHTML=similar[0].phoneNumber;
    $("#similar1-img").attr("src",similar[0].src);
    $("#similar1-url").attr("href",similar[0].infoUrl);

    // 두번째 유사숙소
    document.getElementById("similar2-name").innerHTML=similar[1].name.split('[')[0];
    document.getElementById("similar2-addr").innerHTML=similar[1].address;
    document.getElementById("similar2-num").innerHTML=similar[1].phoneNumber;
    $("#similar2-img").attr("src",similar[1].src);
    $("#similar2-url").attr("href",similar[1].infoUrl);
}