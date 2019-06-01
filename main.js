window.addEventListener("load", function(){
var usd=document.querySelector('.usd');
var eur=document.querySelector('.eur');
var rub=document.querySelector('.rub');
var defaultCity=document.querySelector('.defaultCity');
var rateArr=[];
var xhttp=new XMLHttpRequest();
var defaultWeathet={};
var lat, lon;

class ViewExchangeRate{
    showRate(rateArr){
        usd.innerHTML=rateArr[0].buy;
        eur.innerHTML=rateArr[1].buy;
        rub.innerHTML=rateArr[2].buy;
    }
 }
 class ViewDefaultWeathet{
  showDefaultWeathet(defaultWeathet){
      console.log(defaultWeathet);
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


class ModelExchangeRate{
    constructor(viewExchangeRate){
        this.viewExchangeRate=viewExchangeRate;
    }
    getVal(){
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
  getCity(getVal){
      function success(position, getVal) {
          lat = position.coords.latitude.toFixed(2);
          lon = position.coords.longitude.toFixed(2);
          modelDefaultWeathet.getVal();
      };
       
      function error(obj) {
          console.log("Ошибка при определении положения");
      };
      navigator.geolocation.getCurrentPosition(success, error);
  }
  getVal(){
      var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest; 
      var xhr = new XHR(); 
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
    constructor(modelExchangeRate, modelDefaultWeathet){
        this.modelExchangeRate=modelExchangeRate;
        this.modelDefaultWeathet=modelDefaultWeathet;
    }
    makeExchangeRate(){
        modelExchangeRate.getVal();
        window.setInterval(modelExchangeRate.getVal,36000);   
    }
    makeDefaultWeathet(){
      modelDefaultWeathet.getCity(modelDefaultWeathet.getVal);
    }
 
 }
  var viewExchangeRate = new ViewExchangeRate;
  var modelExchangeRate=new ModelExchangeRate(viewExchangeRate);
  var viewDefaultWeathet = new ViewDefaultWeathet;
  var modelDefaultWeathet=new ModelDefaultWeathet(viewDefaultWeathet);
  var controller = new Controller(modelExchangeRate,modelDefaultWeathet);
  controller.makeExchangeRate();
  controller.makeDefaultWeathet();
});
