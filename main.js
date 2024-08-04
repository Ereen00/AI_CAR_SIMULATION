const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const şerit_sayısı = 4;
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const augmentative_fit_in_effect = 4;
const detractive_fit_in_effect = 3;

const N=50;
const cars = generateCars(N);
document.getElementById("birey_sayısı").innerHTML = "Generasyon başına üretilen birey sayısı: "+N;

let bestCar = cars[0];
let cars_count = cars.length;


if(localStorage.getItem("bestBrain")){
    for(let i=0; i<cars.length; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

let yeni_generasyon_sayısı = parseInt(localStorage.getItem("generation_count"));
localStorage.setItem("generation_count" , yeni_generasyon_sayısı +1);

//soy ağacı listesi-------------

let soyAğacı = [];

const kaydedilmisPerformans = localStorage.getItem('generasyon_performans_geçmişi');

if (kaydedilmisPerformans) {
    soyAğacı = JSON.parse(kaydedilmisPerformans);
}

function generasyonu_yazdır () {
    localStorage.setItem("generasyon_performans_geçmişi" , JSON.stringify(soyAğacı));
}

let toplam = 0;
kat_edilen_ortalama_al();

function kat_edilen_ortalama_al () {
    for(let i=1; i<soyAğacı.length; i += 3){

        toplam += parseInt(soyAğacı[i]);

    }
}

let ortalama_kat_edilen_değer = Math.floor(toplam/(soyAğacı.length/3));

//------------------------------

const kaydedilmisEnİyi = localStorage.getItem('best_of_all_time');

function en_iyi_kaydet () {
    if(Math.floor((100 - bestCar.y) / 15) > kaydedilmisEnİyi){

        localStorage.setItem("best_of_all_time" , Math.floor((100 - bestCar.y) / 15));

    }
}

//NPC spawner------------------------

const traffic = [];

let i=2;

setInterval(()=>{
    let randomLane = Math.floor(Math.random() * 4);

    if(randomLane == 0)
    {
        traffic.push(
            new Car(road.getLaneCenter(randomLane), -i*100 , 25 , 50 , "NPC" , 5 ,1 ,2 , "red")
        ); 
    }
    if(randomLane == 1)
    {
        traffic.push(
            new Car(road.getLaneCenter(randomLane), -i*100 , 25 , 50 , "NPC" , 4 ,1 ,2, "red")
        ); 
    }
    if(randomLane == 2)
    {
        traffic.push(
            new Car(road.getLaneCenter(randomLane), -i*100 , 25 , 50 , "NPC" , 3 ,1 ,2, "red")
        ); 
    }
    if(randomLane == 3)
    {
        traffic.push(
            new Car(road.getLaneCenter(randomLane), -i*100 , 25 , 50 , "NPC" , 2 ,1 ,2 , "red")
        ); 
    }    
    if(randomLane == 4)
    {
        traffic.push(
            new Car(road.getLaneCenter(randomLane), -i*100 , 30 , 80 , "NPC" , 1 ,1 ,2 , "red")
        ); 
    } 

    i++;

},700);
//NPC spawner------------------------


//car deleater------------------------
let damaged_car_count = 0;
setInterval(()=>{
    for(a=0; a<cars.length; a++){
        if(cars[a].height == 49 && cars[a].damaged && cars[a] != bestCar){
            cars.splice(a,1);
            damaged_car_count++;
        }
    }

    document.getElementById("kaza_yapanlar_göstergesi").innerHTML = "Kalan yapan yapay zeka sayısı: "+(N-damaged_car_count);
/*
    b = 2000;

    if(-bestCar.y >= b){
        traffic.splice(0,35);
        b =+ 2000;
    }
*/
},4000);

//NPC deleater------------------------

//kronometre-------------------------------------
let durdur = true;
let saat = 0;
let dakika = 0;
let saniye = 0;
let kronometreInterval;

function baslatDurdur() {

  if (durdur) {
    durdur = false;
    kronometreInterval = setInterval(kronometre, 1000);
  } else {
    durdur = true;
    clearInterval(kronometreInterval);
  }
}

function kronometre() {
  saniye++;
  document.getElementById("mesafe").innerHTML = "Anlık kat edilen mesafe: "+Math.floor((100 - bestCar.y) / 15)+"m";
  if (saniye === 60) {
    saniye = 0;
    dakika++;
        if (dakika === 60) {
            dakika = 0;
            saat++;
        }
  }
  const zamanText = (saat < 10 ? '0' + saat : saat) + ':' + (dakika < 10 ? '0' + dakika : dakika) + ':' + (saniye < 10 ? '0' + saniye : saniye);
  document.getElementById('zaman').innerText = zamanText;
}

window.onload = baslatDurdur;
//kronometre--------------------------------------------

animate();

if(parseInt(yeni_generasyon_sayısı) == 0){
    localStorage.setItem("fit-in" , 100);
}

let fit_in_reaction_perception = localStorage.getItem("fit-in");

if(parseInt(fit_in_reaction_perception) >= 100){
    fit_in_reaction_perception = 100;
}

document.getElementById("fit_in_reaction_percentage").innerHTML = "Fit-in reaction perception: %"+fit_in_reaction_perception;
let previous_best = parseInt(localStorage.getItem("Previous_best"));

let next_generation_barrage = ((Math.floor((100 - previous_best) / 15) * fit_in_reaction_perception)/100).toFixed(2);

function save(){
    if(-bestCar.y > ((-previous_best/100) * fit_in_reaction_perception)){
        localStorage.setItem("Previous_best" , JSON.stringify(parseInt(bestCar.y)));
        localStorage.setItem("bestBrain", JSON.stringify( bestCar.brain ));
        fit_in_reaction_perception += augmentative_fit_in_effect;
    }else{
        fit_in_reaction_perception -= detractive_fit_in_effect;
    }
    let generation_number = "g"+(parseInt(yeni_generasyon_sayısı) +1);
    soyAğacı.push(generation_number , Math.floor((100 - bestCar.y) / 15), next_generation_barrage);
    generasyonu_yazdır();
    en_iyi_kaydet();
    localStorage.setItem("fit-in" , fit_in_reaction_perception);
    location.reload();
}

function discard(){
    localStorage.setItem("best_of_all_time" , 0);
    localStorage.removeItem("generasyon_performans_geçmişi");
    localStorage.removeItem("bestBrain");
    localStorage.removeItem("Previous_best");
    localStorage.setItem("Previous_best" , -100);
    localStorage.setItem("generation_count" , 0);
}

function generateCars(N){
    const cars=[];
    for(let i=1; i<=N; i++){
        cars.push(new Car(100,100,25,49,"AI",3 , 0.1 , 0.1,"blue"));
    }
    //(carCanvas.width/N) * i
    return cars;
}






// en iyi araba hareketsiz olduğu halde sonraki generasyona geç
let iyiArabaKonumu = -100;

function ozellikKontrol() {

    if(bestCar.y == iyiArabaKonumu){
        save();
    }else{
        iyiArabaKonumu = bestCar.y;
    }
}
  
  
const kontrolAraligi = 10000; 
const intervalID = setInterval (ozellikKontrol , kontrolAraligi);
//_____________________________
document.getElementById("ortalama_kat_edilen_mesafe").innerHTML = "Generasyonların en iyilerinin ortalamaları: " + ortalama_kat_edilen_değer+"m";
document.getElementById("generasyon_sayısı").innerHTML = "Generasyon sayısı: " + parseInt(localStorage.getItem("generation_count"));
document.getElementById("anlık_rekor").innerHTML = "Baz alınan rekor: "+Math.floor((100 - previous_best) / 15)+"m";
document.getElementById("şerit_sayısı_göstergesi").innerHTML = "Şerit sayısı: "+şerit_sayısı;
document.getElementById("tüm_zamanların_en_iyisi").innerHTML = "Tüm zamanların en iyisi: "+kaydedilmisEnİyi+"m";
document.getElementById("sonraki_generasyon_barajı").innerHTML = "Sonraki generasyon için gereken mesafe: "+next_generation_barrage+"m";
document.getElementById("detractive_fit_in_effect").innerHTML = "Detractive fit-in effect: "+detractive_fit_in_effect;
document.getElementById("augmentative_fit_in_effect").innerHTML = "Augmentative fit-in effect: "+augmentative_fit_in_effect;

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ) 
        
        //&& !c.damaged
    );

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    
    //otomatik generation
    let previous_best = parseInt(localStorage.getItem("Previous_best"));

    if(dakika == 7){
        save();
    }
/*
    //gösterge değişkenleri
    document.getElementById("hız").innerHTML ="Hız: "+ Math.floor(bestCar.speed * 15)+"Km/h";
    document.getElementById("mesafe").innerHTML = "Anlık kat edilen mesafe: "+Math.floor((100 - bestCar.y) / 15)+"m";
    //----------------
*/
    carCtx.save();

    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}
