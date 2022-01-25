import { zurueck } from "./threejsscripts.js";
import { rcp26 } from "./threejsscripts.js";
import { rcp45 } from "./threejsscripts.js";
import { rcp85 } from "./threejsscripts.js";
import { rcpNone } from "./threejsscripts.js";
import { winter } from "./threejsscripts.js";
import { sommer } from "./threejsscripts.js";

var szenarien;
var body = document.getElementsByTagName('body')[0];
body.addEventListener('load', listeners(), false);

function listeners(){
    document.getElementById('sommer').addEventListener('click', sommer);
    document.getElementById('winter').addEventListener('click', winter);
    document.getElementById('zurueck').addEventListener('click', zurueck);
    szenarien = document.getElementById('szenarien');
    szenarien.addEventListener('change', szenChange);
}

function szenChange(){
    if(szenarien.value == 0){
        rcpNone();
    }
    if(szenarien.value == 2.6){
        rcp26();
    }
    if(szenarien.value == 4.5){
        rcp45();
    }
    if(szenarien.value == 8.5){
        rcp85();
    }
}



