define(['util', 'renderer'], function (UTIL, Renderer) {
    'use strict';

    var printBtn = document.getElementById('print-btn');
    var colorBtn = document.getElementById('color-btn');
    var generateBtn = document.getElementById('new-btn');

    var triggerRender = function () {
        Renderer.clear();
        Renderer.render();
    };

    // register listeners
    printBtn.addEventListener('click', function() {
        window.print();
    });
    colorBtn.addEventListener('click', function () {
        if(colorBtn.classList.contains('active')) {
            colorBtn.classList.remove('active');
            Renderer.setColoredMode(false);
        } else {
            colorBtn.classList.add('active');
            Renderer.setColoredMode(true);
        }
    });
    generateBtn.addEventListener('click', triggerRender);

    triggerRender();
});
