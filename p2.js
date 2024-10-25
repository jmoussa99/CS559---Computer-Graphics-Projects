function setup(){"use strict";
    // call html elements
    var canvas = document.getElementById('canvas');
    var angle = document.getElementById("angle");
    var stems = document.getElementById("stems");
    var frost = document.getElementById("frost");
    function draw(){
        var context = canvas.getContext('2d');
        canvas.width = canvas.width;
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // set values from slider info
        var maxLeaf = frost.value;
        var theta = 0.01 *2 *Math.PI * angle.value;
        var flakes = stems.value;
        var branches = 2;
        
        // move to middle of canvas
        context.translate(canvas.width / 2, canvas.height / 2);

        // recursion to build snowflake
        function drawFlakes(leaf){
            // number of times we draw the lines
            if(leaf > maxLeaf){
                return;
            }
            // draw branch
            context.strokeStyle = "lightblue";
            context.lineWidth = 5;
            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(150,0);
            context.stroke();

            for (let i = 1; i < branches + 1; i++){
                // for every branch draw more branches
                context.save();
                context.translate(150*i / (branches + 1), 0);
                context.scale(0.5,0.5);
                context.save();
                // draw right side
                context.rotate(theta);
                drawFlakes(leaf + 1);
                context.restore();
                context.save();
                // draw left side
                context.rotate(-theta);
                drawFlakes(leaf + 1);
                context.restore();
                context.restore();
            }
        }
        // draw whole tree to create full circle
        for(let i = 0; i < flakes; i++){
            drawFlakes(0);    
            context.rotate(Math.PI * 2 / flakes);
        }
    }
    // user input
    angle.addEventListener("input", draw);
    stems.addEventListener("input", draw);
    frost.addEventListener("input", draw);
    draw();
}
window.onload = setup;