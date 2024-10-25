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
        // this function is from Week4/Demo0
        function moveToTx(x,y,Tx){
            var res = vec2.create(); 
            vec2.transformMat3(res,[x,y], Tx);
            context.moveTo(res[0], res[1]);
        }
        
        // this function is from Week4/Demo0
        function lineToTx(x,y,Tx){
            var res = vec2.create(); 
            vec2.transformMat3(res,[x,y], Tx);
            context.lineTo(res[0], res[1]);
        }

        // move to middle of canvas
        context.translate(canvas.width / 2, canvas.height / 2);

        // recursion to build snowflake
        function drawFlakes(leaf, Tx){
            // number of times we draw the lines
            if(leaf > maxLeaf){
                return;
            }
            // draw branch
            context.strokeStyle = "lightblue";
            context.lineWidth = 5;
            context.beginPath();
            context.moveToTx(0,0,Tx);
            context.lineToTx(150,0,Tx);
            context.stroke();

            for (let i = 1; i < branches + 1; i++){
                // for every branch draw more branches
                var branchTx = mat3.create();
                mat3.fromTranslation(branchTx,[150*i / (branches + 1), 0]);
                mat3.scale(branchTx, branchTx, [0.5,0.5]);
                // context.save();
                // context.translate(150*i / (branches + 1), 0);
                // context.scale(0.5,0.5);
                // context.save();
                // draw right side
                mat3.rotate(branchTx, branchTx, theta);
                var rightLeaf = mat3.create();
                mat3.multiply(rightLeaf, Tx, branchTx)
                drawFlakes(leaf + 1, rightLeaf);
                // context.restore();
                // context.save();
                // draw left side
                mat3.rotate(branchTx, branchTx, -theta);
                var leftLeaf = mat3.create();
                mat3.multiply(leftLeaf, Tx, branchTx)
                drawFlakes(leaf + 1, leftLeaf);
                // context.restore();
                // context.restore();
            }
        }
        // draw whole tree to create full circle
        for(let i = 0; i < flakes; i++){
            var mainBranch = math.create();
            mat3.rotate(mainBranch, mainBranch, mainMath.PI * 2 / flakes);
            drawFlakes(0, mainBranch);      
        }
    }
    // user input
    angle.addEventListener("input", draw);
    stems.addEventListener("input", draw);
    frost.addEventListener("input", draw);
    draw();
}
window.onload = setup;