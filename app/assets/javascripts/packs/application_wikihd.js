console.log('Hello World from engine Wiki hd!');
import $ from 'jquery';
window.$ = window.jQuery = require('jquery')

import React from 'react';
import ReactDOM from 'react-dom';
import MainContainer from '../components/main_container';

$(document).ready(function() {
    if($("#main_container_react").length > 0){
        ReactDOM.render(
            <MainContainer/> , $("#main_container_react")[0]
        );
    }
    
})