
var overIntro;
  var overInfo;
  var overMehrErfahren;
  var overlay;
  var menu ;

  var mehrErfH1;
  var mehrErfP1;

  var select;
  var value;
  var text;

  var tables26;
  var tables45;
  var tables85;

  var thermometer;
  let thermoWarm;
  let thermoMittel;
  let thermoKalt;
  let thermo;


function varDekl(){
  overIntro = document.getElementById('introOverlay');
  overInfo = document.getElementById('overlayInfo');
  overMehrErfahren = document.getElementById('overlaymehrErfahren');
  overlay = document.getElementById('overlay');
  menu = document.getElementById('menu');

  mehrErfH1 = document.getElementById('mehrErfahrenH1');
  mehrErfP1 = document.getElementById('mehrErfahrenP1');

  select = document.getElementById('szenarien');
  value = select.options[select.selectedIndex].value;
  text = select.options[select.selectedIndex].text;

  tables26 = document.getElementById('table2-6');
  tables45 = document.getElementById('table4-5');
  tables85 = document.getElementById('table8-5');

  thermometer = document.getElementById('thermometer');
  thermoWarm = './images/thermo_warm.png';
  thermoMittel = './images/thermo_mittel.png';
  thermoKalt = './images/thermo_kalt.png';
  thermo = './images/thermo.png';
}




function move(){
    var down = '../images/arrow_down.png';
    var up = '../images/arrow_top.png';
    
    if(menu.style.top == '68%'){
      menu.style.top = "96%";
      document.querySelector('#pfeil').setAttribute('src', up);
    }else{
      menu.style.top = '68%';
      document.querySelector('#pfeil').setAttribute('src', down);
      }
    }
  
     function showOverlay(){
  overlay.style.display = 'flex';
}

 function disableOverlay(){
  overlay.style.display = 'none';
}

 function onoverlay() {
    document.getElementById('overlaymehrErfahren').style.display = "block";
    document.getElementById('overlaymehrErfahren').style.top = "25%";
    overMehrErfahren.scrollTo(0, 0);
    //offoverlayInfo();
  }
  
   function offoverlay() {
    document.getElementById('overlaymehrErfahren').style.display = "none";
    document.getElementById('overlaymehrErfahren').style.top = "100%";
    
  }
  
   function onoverlayInfo() {
    document.getElementById('overlayInfo').style.display = "block";
    document.getElementById('overlayInfo').style.top = "25%";
    //offoverlay();
  }
  
   function offoverlayInfo() {
    document.getElementById('overlayInfo').style.display = "none";
    document.getElementById('overlayInfo').style.top = "100%";
  }
  
   function onIntro() {
    document.getElementById('introOverlay').style.display = "block";
    document.getElementById('introOverlay').style.top = "25%";
    document.getElementById('radioSecond').checked = true;
    //offoverlay();
  }
  
   function offIntro() {
    document.getElementById('introOverlay').style.display = "none";
    document.getElementById('introOverlay').style.top = "100%";
  }

   function show1(){//Tomorrow
    document.getElementById('str').style.display = 'none';
    document.getElementById('tmr').style.display = 'block';
    document.getElementById('klm').style.display = 'none';
    document.getElementById('introUeberschrift').innerHTML = "Tomorrow";
  }
   function show2(){//Steuerung
      document.getElementById('str').style.display = 'block';
      document.getElementById('tmr').style.display = 'none';
      document.getElementById('klm').style.display = 'none';
      document.getElementById('introUeberschrift').innerHTML = "Steuerung";
      document.getElementById('overlayInfo').style.display = 'none';
  }
   function show3(){//Klimaszenarien
    document.getElementById('str').style.display = 'none';
    document.getElementById('tmr').style.display = 'none';
    document.getElementById('klm').style.display = 'block';
    document.getElementById('introUeberschrift').innerHTML = "Klimaszenarien";
    document.getElementById('overlayInfo').style.display = 'none';
}


  
 function bodyLoad(){
    varDekl();
    var radiobtn = document.getElementById('radioFirst');
    radiobtn.checked = true;
    document.getElementById('tmr').style.display = "block";
    overInfo.style.display = 'none';
    overlay.style.display = 'flex';
    document.getElementById('szenarien').value = '0';
  }

   function szenarienText(){
    var select = document.getElementById('szenarien');
    var value = select.options[select.selectedIndex].value;
    var text = select.options[select.selectedIndex].text;
    
    if(value == '0'){
    thermometer.setAttribute('src', thermo);
    document.getElementById('middle-info').innerHTML = 
    "Willkommen bei Tomorrow! <br> Wähle ein Szenario aus und beginne damit, das mögliche Lübeck der Zukunft zu erkunden!";
    mehrErfH1.innerHTML = "Szenario wählen";
    mehrErfP1.innerHTML = "Willkommen bei Tomorrow! Wähle ein Szenario aus und beginne damit, das mögliche <b>Lübeck der Zukunft</b> zu erkunden! " +
    "<br>Sobald ein <b>Szenario gewählt</b> ist, scrolle hier nach unten um weitere Daten einsehen zu können."
    tables45.style.display = "none";
    tables85.style.display = "none";
    tables26.style.display = "none";
    } 
    if(value == '2.6'){
    thermometer.setAttribute('src', thermoKalt);
    document.getElementById('middle-info').innerHTML = "Das Szenario Utopie ist das mit den geringsten spürbaren Folgen für unsere Region. Die Veränderungen sind hier so minimal, dass sie wahrscheinlich den meisten Personen gar nicht wirklich auffallen würden. Allerdings ist der Handlungsbedarf dafür auch besonders hoch. Erfahre unten mehr!";
    mehrErfH1.innerHTML = "Utopie | RCP 2.6";
    mehrErfP1.innerHTML = "Das Szenario Utopie ist das mit den geringsten spürbaren Folgen für unsere Region. " + 
    "Die Veränderungen sind hier so minimal, dass sie wahrscheinlich den meisten Personen "+
    "gar nicht wirklich auffallen würden. Allerdings ist der Handlungsbedarf dafür auch besonders hoch. <br>"+ 
    "Um dies zu erreichen, müssten wir überall auf der Welt jeden Moment starten und massive Veränderungen"+ 
    "in unserem täglichen Handeln vornehmen. Es müssten massive Anstrengungen beim Klimaschutz vorgenommen werden, "+ 
    "die vor allem auch Anstrengungen im Bereich negativer Emissionen einschließen, "+
    "also der Entnahme von Treibhausgasen aus der Atmosphäre durch die Errichtung von CO2-Speichern in Form von beispielsweise Wäldern. "+
    "Der gesamte ICPP-Bericht findet sich <a href='https://www.ipcc.ch/sr15/chapter/spm/' target='_blank' rel='noopener noreferrer'>hier</a>."
    tables45.style.display = "none";
    tables85.style.display = "none";
    tables26.style.display = "block";
    //rcp26();
    } 
    if(value == '4.5'){
    thermometer.setAttribute('src', thermoMittel);
    document.getElementById('middle-info').innerHTML = "Bei Eintritt des Szenario Realismus würden viele Städte und Regionen in eine andere Klimazone wandern. So wäre im Jahr 2050 in Stockholm ein Klima wie beispielsweise in Madrid vorzufinden. Auch für Lübeck würde sich das Klima in weitere Extreme bewegen. Erfahre unten mehr!";
    mehrErfH1.innerHTML = "Realismus | RCP 4.5";
    mehrErfP1.innerHTML = "Bei Eintritt des Szenario Realismus würden viele Städte und Regionen in eine andere Klimazone wandern. So wäre im Jahr 2050 in Stockholm ein Klima wie beispielsweise in Madrid vorzufinden. Auch für Lübeck würde sich das Klima in weitere Extreme bewegen. "+
    "Dieses Szenario wird von Experten noch als ziemlich optimistisch eingeschätzt, denn auch hier wären strenge Klimapolitische Maßnahmen notwendig, die schnellstmöglich umgesetzt werden müssten. "+
    "Der gesamte ICPP-Bericht findet sich <a href='https://www.ipcc.ch/sr15/chapter/spm/' target='_blank' rel='noopener noreferrer'>hier</a>."
    tables26.style.display = "none";
    tables85.style.display = "none";
    tables45.style.display = "block";
    //rcp45();
    } 
    if(value == '8.5'){
    thermometer.setAttribute('src', thermoWarm);
    document.getElementById('middle-info').innerHTML = "Beim Szenario Dystopie wird davon ausgegangen, dass die Klimapolitik von 2010 unverändert fortgesetzt wird und dass die Förderung der immer knapper werdenden fossilen Energieträger noch lange Zeit weiter wirtschaftlich attraktiv bleibt. <br> Erfahre unten mehr!";
    mehrErfH1.innerHTML = "Dystopie | RCP 8.5";
    mehrErfP1.innerHTML = "Beim Szenario Dystopie wird davon ausgegangen, dass die Klimapolitik von 2010 unverändert fortgesetzt wird und dass die Förderung der immer knapper werdenden fossilen Energieträger noch lange Zeit weiter wirtschaftlich attraktiv bleibt. Es wird auch als „Weiter-so-wie -bisher“-Szenario bezeichnet, da hier keine großartigen Veränderungen in der Klimapolitik vorgesehen sind. "+
    "Die Auswirkungen dieses Szenarios sind enorm und auch in Lübeck wären sie spürbar. Auch wenn sie im weltweiten Vergleich verhältnismäßig gering ausfallen, zeichnen sie ein Bild, welches von den wenigsten gern gesehen wird. "+
    "<br>Der gesamte ICPP-Bericht findet sich <a href='https://www.ipcc.ch/sr15/chapter/spm/' target='_blank' rel='noopener noreferrer'>hier</a>."
    tables26.style.display = "none"; 
    tables45.style.display = "none";
    tables85.style.display = "block";
    //rcp85();
    } 
  }