window.addEventListener("load", function(){
   
  let exchangeRate=document.querySelector('.exchangeRate');
  let defaultCity=document.querySelector('.defaultCity');
  let rateArr=[];
  let defaultWeathet={};
  let lat, lon;
  let selectedCities=document.querySelector('.selectedCities');
  let citiesArrey=[];
  let inputCity=document.querySelector('#city');
  let add=document.querySelector('#add');
  let refresh=document.querySelector('#refresh');

  class ViewSelectedCities{
    sow(citiesInfo){
      let row=document.createElement('tr');
      let cell1=document.createElement('td');
      let cell2=document.createElement('td');
      let cell3=document.createElement('td');
      let cell4=document.createElement('td');
      let cell5=document.createElement('td');
      cell1.innerText=citiesInfo[0];
      cell2.innerText=citiesInfo[1];
      cell3.innerText=citiesInfo[2];
      cell4.innerText=citiesInfo[3];
      cell5.innerHTML=`<button class='${citiesInfo[0]}'>Delete</button>`;
      selectedCities.appendChild(row);
      row.appendChild(cell1);
      row.appendChild(cell2);
      row.appendChild(cell3);
      row.appendChild(cell4);
      row.appendChild(cell5);
      
    }
  }
  class ViewExchangeRate{
    showRate(rateArr){
      exchangeRate.innerHTML='<h3>Exchange rate</h3>';
      for(let i=0;i<rateArr.length;i++){
        let p=document.createElement('p');
        p.innerText=
        `${rateArr[i].ccy}: buy - ${rateArr[i].buy}UAH, sale - ${rateArr[i].sale}UAH`;
        exchangeRate.appendChild(p);
      }
    }
  }
  class ViewDefaultWeathet{
    showDefaultWeathet(defaultWeathet){
      let city=document.createElement('h3');
      let weatherDesc=document.createElement('p');
      let pressure=document.createElement('p');
      let humidity=document.createElement('p');
      let clouds=document.createElement('p');
      city.innerText=`Weathet in ${defaultWeathet.name} is:`;
      weatherDesc.innerText=
      `${defaultWeathet.weather[0].description} air temperature is ${defaultWeathet.main.temp} K`;
      pressure.innerText=`pressure is ${defaultWeathet.main.pressure} Pa`;
      humidity.innerText=`humidity is ${defaultWeathet.main.humidity} %`;
      clouds.innerText=`clouds is ${defaultWeathet.clouds.all}%`
      defaultCity.appendChild(city);
      defaultCity.appendChild(weatherDesc);
      defaultCity.appendChild(pressure);
      defaultCity.appendChild(humidity);
      defaultCity.appendChild(clouds);
    }
  }

  class ModelSelectedCities{
    constructor(viewSelectedCities){
      this.viewSelectedCities=viewSelectedCities;
    }
    getWeather(){
      if(localStorage.getItem("myCities")){
        citiesArrey=JSON.parse(localStorage.getItem("myCities"));
      }else{
        citiesArrey=[];
      }
      let city=inputCity.value.toLowerCase();
      let cityIsNotInArray=true;
      if(citiesArrey){
        citiesArrey.forEach(function(element) {
          if(element[0].toLowerCase()==city){
            cityIsNotInArray=false;
          }
          return cityIsNotInArray;
        });
      }
      if (cityIsNotInArray){  
        let result=fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=694e5f0d692f8622e5ca576e4bcce755`);
        result
          .then(objectWeather => objectWeather.json())
          .then(weatherArray=>{
            let citiesInfo=[weatherArray.name,
              weatherArray.weather[0].description,
              weatherArray.main.temp,
              weatherArray.clouds.all];
            return citiesInfo
          })
          .then(citiesInfo => {
            citiesArrey.push(citiesInfo);
            localStorage.setItem('myCities', JSON.stringify(citiesArrey));
            return viewSelectedCities.sow(citiesInfo);
          })
          .catch(e=>console.log(e));
        }    
    }
    setWeather(){
      if(localStorage.getItem("myCities")){
        citiesArrey=JSON.parse(localStorage.getItem("myCities"));
        for(let i=0;i<citiesArrey.length;i++){
          viewSelectedCities.sow(citiesArrey[i]);
        }
      }else{
        citiesArrey=[];
      }
      return citiesArrey;
    }
    refresh(){
      selectedCities.innerHTML=`<tr>
        <th>City</th>
        <th>Description</th>
        <th>Air temperature, K</th>
        <th>Clouds, %</th>
        <th></th>
      </tr>`
      if(localStorage.getItem("myCities")){
        citiesArrey=JSON.parse(localStorage.getItem("myCities"));
        for(let i=0;i<citiesArrey.length;i++){
          let result=fetch(`http://api.openweathermap.org/data/2.5/weather?q=${citiesArrey[i][0]}&APPID=694e5f0d692f8622e5ca576e4bcce755`);
          result
            .then(objectWeather => objectWeather.json())
            .then(weatherArray=>{
              let citiesInfo=[weatherArray.name,
                weatherArray.weather[0].description,
                weatherArray.main.temp,
                weatherArray.clouds.all];
              return citiesInfo
            })
            .then(citiesInfo => viewSelectedCities.sow(citiesInfo))
            .catch(e=>console.log(e));
        }
      }
    }
    delete(event){
      if (event.target.localName === 'button'){
        selectedCities.innerHTML=`<tr>
          <th>City</th>
          <th>Description</th>
          <th>Air temperature, K</th>
          <th>Clouds, %</th>
          <th></th>
        </tr>`
        citiesArrey=JSON.parse(localStorage.getItem("myCities"));
        for(let i=0;i<citiesArrey.length;i++){
          if(event.target.className===citiesArrey[i][0]){
            citiesArrey.splice(i,1);
          }
        }
        for(let j=0;j<citiesArrey.length;j++){
          viewSelectedCities.sow(citiesArrey[j]);
        }
        localStorage.setItem('myCities', JSON.stringify(citiesArrey));
      }
    }
  }
  class ModelExchangeRate{
    constructor(viewExchangeRate){
        this.viewExchangeRate=viewExchangeRate;
    }
    getVal(){
        let xhttp=new XMLHttpRequest();
        xhttp.open('GET','https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
        xhttp.send();
        xhttp.addEventListener('readystatechange', function(){
          if(xhttp.readyState==4&&xhttp.status==200){
            rateArr=JSON.parse(xhttp.response);
            viewExchangeRate.showRate(rateArr);
          } else{
            console.log(xhttp.readyState, xhttp.status);
          }
          
        });
    }
 
 }

  class ModelDefaultWeathet{
    constructor(view){
        this.view=view;
    }
    getCity(){
        function success(position) {
            lat = position.coords.latitude.toFixed(2);
            lon = position.coords.longitude.toFixed(2);
            modelDefaultWeathet.getWeathet(viewDefaultWeathet);
        };
        
        function error(obj) {
            console.log(obj);
            defaultCity.innerHTML='<h3>Sorry! Your city is not defined</h3>'
        };
        navigator.geolocation.getCurrentPosition(success, error);
    }
    getWeathet(){
        let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest; 
        let xhr = new XHR(); 
        xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=694e5f0d692f8622e5ca576e4bcce755`, true); 
        xhr.onload = function() { 
            defaultWeathet=JSON.parse(xhr.response); 
            viewDefaultWeathet.showDefaultWeathet(defaultWeathet);
        } 
        xhr.onerror = function() { 
            console.log(xhr.readyState, xhr.status) 
        } 
        xhr.send();
    }
  }



 class Controller{
    constructor(modelExchangeRate, modelDefaultWeathet, modelSelectedCities){
        this.modelExchangeRate=modelExchangeRate;
        this.modelDefaultWeathet=modelDefaultWeathet;
        this.modelSelectedCities=modelSelectedCities;
    }
    makeExchangeRate(){
        modelExchangeRate.getVal();
        window.setInterval(modelExchangeRate.getVal,3600000);   
    }
    makeDefaultWeathet(){
      modelDefaultWeathet.getCity(modelDefaultWeathet.getVal);
    }
    makeSelectedCities(){
      modelSelectedCities.setWeather();
      add.addEventListener('click', modelSelectedCities.getWeather);
      refresh.addEventListener('click', modelSelectedCities.refresh);
      selectedCities.addEventListener('click', modelSelectedCities.delete);

    }
 
 }
  let viewExchangeRate = new ViewExchangeRate;
  let modelExchangeRate=new ModelExchangeRate(viewExchangeRate);
  let viewDefaultWeathet = new ViewDefaultWeathet;
  let modelDefaultWeathet=new ModelDefaultWeathet(viewDefaultWeathet);
  let viewSelectedCities = new ViewSelectedCities;
  let modelSelectedCities=new ModelSelectedCities(viewSelectedCities);
  let controller = new Controller(modelExchangeRate,modelDefaultWeathet,modelSelectedCities);
  
  controller.makeExchangeRate();
  controller.makeDefaultWeathet();
  controller.makeSelectedCities();
});
