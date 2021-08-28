function get_score(name) {
    $.ajax({
        url: "/score",
        data: { name: name },
        method: "GET",
        dataType: "json"
    })
    .done(function(json) {

           new Chart(document.getElementById("myChart"), {
            type: 'radar',
            data: {
              labels: ["청결", "시설만족도", "가격", "재방문", "안전","서비스"],
              datasets: [
                {
                label: json.crawling.rate==0
                    ?"OTA 리뷰: 정보없음"
                    :"OTA 리뷰 평균: "+json.crawling.rate.toFixed(1)+"점",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                data: [json.crawling.clean_score.toFixed(1),json.crawling.facility_score.toFixed(1),json.crawling.price_score.toFixed(1),json.crawling.revisit_score.toFixed(1),json.crawling.safety_score.toFixed(1),json.crawling.service_score.toFixed(1)]
                }, 
              ]
            },
            options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 5,
                    min: 0,
                    stepSize: 1
                    }
                },
            }
        }); 
            new Chart(document.getElementById("myChart_2"), {
                type: 'radar',
                data: {
                    labels: ["청결", "서비스", "시설만족도", "재방문"],
                    datasets: [
                    {
                     label: json.raw.rate==0
                              ?"만족도 조사: 정보없음"
                              :"만족도 조사 평균: "+ json.raw.rate.toFixed(1) +"점",
                     fill: true,
                     backgroundColor: "rgba(179,181,198,0.2)",
                     borderColor: "rgba(179,181,198,1)",
                     pointBorderColor: "#fff",
                     pointBackgroundColor: "rgba(179,181,198,1)",
                     pointBorderColor: "#fff",
                     data: [json.raw.facility_score.toFixed(1),json.raw.clean_score.toFixed(1),json.raw.service_score.toFixed(1),json.raw.revisit_score.toFixed(1)]
                  }
            ]
        },
                options: {
                    scale: {
                        ticks: {
                            beginAtZero: true,
                            max: 5,
                            min: 0,
                            stepSize: 1
                    },
                },
            }
        });    
    })
}