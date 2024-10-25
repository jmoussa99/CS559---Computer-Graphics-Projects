// JavaScript source code
function setup(){"use strict";
    var canvas = document.getElementById("canvas");
    var redSlider = document.getElementById("red");
    redSlider.value = 255;
    var greenSlider = document.getElementById("green");
    greenSlider.value = 255;
    var blueSlider = document.getElementById("blue");
    blueSlider.value = 255;

    function draw() {
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;

        // RGB values
        var r = redSlider.value;
        var g = greenSlider.value;
        var b = blueSlider.value;

        // draw face
        context.beginPath();
        context.fillStyle = 'yellow';
        context.arc(325, 300, 200, 0, 2 * Math.PI);
        context.fill();
        context.stroke();

        // draw glasses
        context.beginPath();
        context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        context.strokeStyle = "black";
        context.arc(262, 250, 50, 0, 2 * Math.PI);
        context.moveTo(438, 250);
        context.arc(388, 250, 50, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(312, 250);
        context.lineTo(338, 250);
        context.stroke();

        // draw smile
        context.beginPath();
        context.arc(325, 325, 100, Math.PI * 0.1, -Math.PI * 1.1);
        context.lineWidth = 3;
        context.stroke();
    }
    // wait for user input
    redSlider.addEventListener("input", draw);
    greenSlider.addEventListener("input", draw);
    blueSlider.addEventListener("input", draw);
    draw();
}
window.onload = setup;