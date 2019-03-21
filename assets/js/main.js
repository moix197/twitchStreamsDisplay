import dataHandle from './dataHandle.js';
import uiComponents from './uiComponents.js';
//using OLOO (OBJECTS LINKED TO OTHER OBJECTS)
//here we have two different objects, one for the UI
//and one for handling the data that comes from the "backend"(API)
//the good thing about OLOO is that even when the two components are
//interconnected in this example, they can be tested separately if needed
//as they really are independent objects.

(function(){
"use strict"
//We use an IIFE to store our App to avoid poluting the global context, 
//in case we need to add this webapp to a different context.
//we bundle the parts of our APP in a single object and the init it
//you can do this with a bundler, but as we don't care for backwards
//compatibility here we just imported all the parts with ES6 modules.
let App = Object.assign(Object.create(uiComponents),dataHandle);
App.init();

})(dataHandle,uiComponents);