"use strict"
import dataHandle from './dataHandle.js';
import uiComponents from './uiComponents.js';
import './styles.css';
//using OLOO (OBJECTS LINKED TO OTHER OBJECTS)
//here we have two different objects, one for the UI
//and one for handling the data that comes from the "backend"(API)
//the good thing about OLOO is that even when the two components are
//interconnected in this example, they can be tested separately if needed
//as they really are independent objects.

//We use an IIFE to store our App to avoid poluting the global context, 
//in case we need to add this webapp to a different context.

//(function(){
//the body shows hidden from the start, to avoid showing the html 
//without the css while the bundle loads the css files
document.getElementsByTagName('body')[0].style.display = "block";

//Update, now using Webpack, for minifiying and other s
let App = Object.assign(Object.create(uiComponents),dataHandle);
App.init({
    parentElement: 'outerAppContainer',
    //loaderImage: false,
    initActiveGame: 'Dota_2',
    showGamesBar: true,
    showStreams: true,
    streamsLimit: 12,
    onStreamClick: {
        //en openIn puedes pasar en una nueva ventana o pasar el id del container donde quieres que abra el stream clickeado
        //openStreamIn: 'newTab'
        //openStreamIn: 'outerAppContainer'
    },
    //closeStreamBtn: 'closeStreamButton'
});


//})();