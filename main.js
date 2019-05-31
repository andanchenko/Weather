window.addEventListener("load", function(){
var usd=document.querySelector('.usd');
var eur=document.querySelector('.eur');
var rub=document.querySelector('.rub');
var myArr;
var myObj;
var xhttp=new XMLHttpRequest();

class ViewExchangeRate{
    show(myArr){
        usd.innerHTML=myArr[0].buy;
        eur.innerHTML=myArr[1].buy;
        rub.innerHTML=myArr[2].buy;
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
            myArr=JSON.parse(xhttp.response);
            viewExchangeRate.show(myArr);
          } else{
            console.log(xhttp.readyState, xhttp.status);
          }
          
        });
    }
 
 }
 class Controller{
    constructor(modelExchangeRate){
        this.modelExchangeRate=modelExchangeRate;
    }
    makeExchangeRate(){
        modelExchangeRate.getVal();
        window.setInterval(modelExchangeRate.getVal,36000);   
    }
 
 }
  var viewExchangeRate = new ViewExchangeRate;
  var modelExchangeRate=new ModelExchangeRate(viewExchangeRate);
  var controller = new Controller(modelExchangeRate);
  controller.makeExchangeRate();
});