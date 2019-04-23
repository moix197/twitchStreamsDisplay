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

let App = Object.assign(Object.create(uiComponents),dataHandle);

export default App;