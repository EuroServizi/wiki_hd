console.log('Hello World from engine Wiki hd!');
import $ from 'jquery';
window.$ = window.jQuery = require('jquery')

import React from 'react';
import { render } from 'react-dom';
import ListaSegnalazioni from '../components/lista_segnalazioni';
import MainContainer from '../components/main_container';


$(document).ready(function() {
    if($("#main_container_react").length > 0){
        render(<MainContainer/> , $("#main_container_react")[0]);
    }
    
})