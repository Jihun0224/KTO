function getUserParams(){
    var temp_dosi = document.getElementById('type__paldo')
    var temp_type = document.getElementById('type__people')
    var params={
        dosi:temp_dosi.options[temp_dosi.selectedIndex].value,
        type:temp_type.options[temp_type.selectedIndex].value,
        value: [],
    }
    const query = 'input[id="value_"]:checked';
    const selectedEls = 
        document.querySelectorAll(query);

        selectedEls.forEach((el) => {
        params.value.push(el.value);
    });
    if(params.dosi=='지역 선택'){
        alert("지역을 선택해 주세요.");
    }
    else if(params.type=='동반유형 선택'){
        alert("동반유형을 선택해 주세요.");
    }
    else if(params.value == ''){
        alert("1개 이상의 가치를 가치를 선택해 주세요.");
    }
    else{
        (async () => {
            const rawResponse = await fetch('/result', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params)
            });
          })();
    }
}