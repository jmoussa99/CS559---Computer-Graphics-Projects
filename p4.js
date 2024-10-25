function setup() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = -25;

    function draw() {
	canvas.width = canvas.width;
	// use the sliders to get the angles
	var tParam = slider1.value*0.1;
	
	function moveToTx(loc,Tx) {
        var res=vec2.create(); 
        vec2.transformMat3(res,loc,Tx); 
        context.moveTo(res[0],res[1]);
    }

	function lineToTx(loc,Tx) {
        var res=vec2.create(); 
        vec2.transformMat3(res,loc,Tx); 
        context.lineTo(res[0],res[1]);
    }
	
	function drawObject(color,Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-.5,-.5],Tx);
	    lineToTx([-.5,.5],Tx);
	    lineToTx([.5,.5],Tx);
	    lineToTx([.5,-.5],Tx);
	    context.closePath();
	    context.fill();
	}
	

	var C_linear = function(t, a, b) {
            var x = t;
            var y = a*t + b;
            return [x,y];
	}

	var C_quadratic = function(t, a, b, c) { // discontinuity at t=1
            var x = t
            var y = a*t*t + b*t + c;
            return [x,y];
	}

	var C_ln = function(t) { // C0 continuity at t=1
            var x = t;
            var y = (1/3) * Math.log(-t - 27.43) - 12.275 ;
            return [x,y];
	}

	var C_curve = function(t, Rx, Ry, a, b) { // C1 continuity at t=1
            var x = Rx * Math.cos(2 * Math.PI * t) + a;
            var y = Ry * Math.sin(2 * Math.PI * t) + b;
            return [x,y];
	}

	
	var Ccomp = function(t) {
        if(t >= -29.122 && t <= -27.457) return C_ln(t);
        if(t >= -26.713 && t <= -23.795) return C_linear(t,0, -14.1);
        if(t >= -23.795 && t <= -21.134) return C_linear(t,1.498, 31.74);
        if(t >= -21.135 && t <= -16.52) return C_linear(t,0.2538, 5.445);
        if(t >= -16.521 && t <= -15.7) return C_linear(t,-5.1, -83);
        if(t >= -16.521 && t<= -15.7) return C_linear(t,-5.1, -83);
        if(t >= -15.704 && t <= -12.772) return C_linear(t,0, -2.91);
        
        // if(t >= -12.562 && t <= -11.401 ){
        //     C_linear(t,-6.7, -76.92)
        // }
        if(t >= -12.562 && t <= -7.504)
            return C_linear(t,0.57, 14.4);
        
        if(t >= -7.504 && t <= -6.297){
            return C_linear(t,0.262, 12.089)
        }else if(-5.4112 && t <= -5.16){
            return  C_curve(t+5.4336,1,1,-6.15,9.45);
        }else if(t >= -5.16 && t <= -5.1){
            return C_linear(t, -18.683, -86.813);
        }else if(t >= -5.1 && t <= -2.708) {
		    return C_linear(t, -6.7, -25.7);
        }else if(t >= -2.708 && t <= -1.317){
		    return C_quadratic(t, 0.72, 2.2, -6.877);
        }else if(t >= -1.317 && t <= 5.868){
            return C_linear(t, 0.27, -8.17);
        }else if(t >= 5.868 && t <= 9.56){
            return C_quadratic(t, -0.4, 7.84, -38.816);
        }else if(t >= 9.56 && t <= 11.302){
            return C_linear(t, 0.15, -1.857);
        }else if(t >= 11.302 && t <= 17.488){
            return C_linear(t, -0.207, 2.178);
        }else if(t >= 17.488 && t <= 24.674){
            return C_linear(t, 0.12, -3.54);
        }else if(t >= 24.674 && t <= 25.294){
            return C_linear(t, 3, -74.6);
        }else if(t >= 25.294 && t <= 29.464){
            return C_linear(t, -0.294, 8.718);
        }else if(t >= 29.464 && t <= 29.962){
            return C_curve(t-28.75, 0.4, 0.622, 29.55, 0.663);
        }else if(t >= 29.962 && t <= 68.877){
            return C_linear(-(t-59.61),-0.33,11.05);
        }
	}

	function drawLinear(t_begin,t_end,intervals,C,a,b,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin,a,b),Tx);

        for(var i=1;i<=intervals;i++){
		    var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		    lineToTx(C(t,a,b),Tx);
        }
        context.stroke();
    }

    function drawQuadratic(t_begin,t_end,intervals,C,a,b,c,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin,a,b,c),Tx);
        for(var i=1;i<=intervals;i++){
		    var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		    lineToTx(C(t,a,b,c),Tx);
        }
        context.stroke();
    }

    function drawCurve(t_begin,t_end,intervals,C,Rx,Ry,a,b,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin,Rx,Ry,a,b),Tx);
        for(var i=1;i<=intervals;i++){
		    var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		    lineToTx(C(t,Rx,Ry,a,b),Tx);
        }
        context.stroke();
    }

    function drawln(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin),Tx);
        for(var i=1;i<=intervals;i++){
		    var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		    lineToTx(C(t),Tx);
        }
        context.stroke();
    }
    
	var Tcircuit_to_canvas = mat3.create();
	mat3.fromTranslation(Tcircuit_to_canvas,[400,250]);
	mat3.scale(Tcircuit_to_canvas,Tcircuit_to_canvas,[12,-12]); // Flip the Y-axis
    // draw track
    drawCurve(0.4382,0.7032,100,C_curve,0.9,0.7,-28.86,-11.43,Tcircuit_to_canvas,"blue");
    drawln(-29.122,-27.457,100,C_ln,Tcircuit_to_canvas,"blue");
    drawCurve(0.5332,0.7449,100, C_curve, 0.7874,0.7874, -26.687,-13.313, Tcircuit_to_canvas, "blue");
    drawLinear(-26.713, -22.365, 100, C_linear,0, -14.1, Tcircuit_to_canvas, "blue");
    drawLinear(-23.795, -22.366, 100, C_linear,-7.14, -173.8, Tcircuit_to_canvas, "blue");
    drawLinear(-23.795, -21.134, 100, C_linear,1.498, 31.74, Tcircuit_to_canvas, "blue");
    drawLinear(-21.135, -16.52, 100, C_linear,0.2538, 5.445, Tcircuit_to_canvas, "blue");
    drawLinear(-16.521, -15.7, 100, C_linear,-5.1, -83, Tcircuit_to_canvas, "blue");
    drawLinear(-15.704, -11.772, 100, C_linear,0, -2.91, Tcircuit_to_canvas, "blue");
    drawLinear(-11.74,-11.401, 100, C_linear,6.41, 72.5, Tcircuit_to_canvas, "blue");
    drawLinear(-12.562, -11.401, 100, C_linear,-6.7, -76.92, Tcircuit_to_canvas, "blue");
    drawLinear(-12.562,-7.504, 100, C_linear,0.57, 14.4, Tcircuit_to_canvas, "blue");
    drawLinear(-7.504,-6.297, 100, C_linear,0.262, 12.089, Tcircuit_to_canvas, "blue");
    drawCurve(0.0224,0.2736, 100, C_curve, 1,1,-6.15,9.45, Tcircuit_to_canvas, "blue");
    drawLinear(-5.16, -5.1, 100, C_linear,-18.683, -86.813, Tcircuit_to_canvas, "blue");
	drawLinear(-5.1,-2.708,100,C_linear,-6.7, -25.7,Tcircuit_to_canvas,"red");
    drawQuadratic(-2.708,-1.317,100,C_quadratic,0.72,2.2,-6.877,Tcircuit_to_canvas,"blue");
    drawLinear(-1.317, 5.868,100,C_linear,0.27,-8.17,Tcircuit_to_canvas,"blue");
    drawQuadratic( 5.868, 9.56,100,C_quadratic,-0.4, 7.84,-38.816,Tcircuit_to_canvas,"blue");
    drawLinear(9.56,11.302,100,C_linear,0.15, -1.857,Tcircuit_to_canvas,"blue");
    drawLinear(11.302,17.488, 100, C_linear,-0.207, 2.178,Tcircuit_to_canvas,"blue");
    drawLinear(17.488, 24.674,100,C_linear,0.12, -3.54,Tcircuit_to_canvas,"blue");
    drawLinear(24.674,25.294, 100,C_linear,3, -74.6,Tcircuit_to_canvas,"blue");
    drawLinear(25.294, 29.464,100,C_linear,-0.294, 8.718,Tcircuit_to_canvas,"blue");
    drawCurve(0.71388,1.21162,100,C_curve,0.4, 0.622, 29.55, 0.663,Tcircuit_to_canvas,"blue");
    drawLinear(-9.27, 29.647,100,C_linear,-0.33,11.05,Tcircuit_to_canvas,"blue");
    drawLinear(-9.47,-9.268,100,C_linear,11.955,124.931,Tcircuit_to_canvas,"blue");
    drawCurve(0.2711,0.3688,100,C_curve,Math.sqrt(200),Math.sqrt(200),-7.6,-2.3,Tcircuit_to_canvas,"blue");
    drawLinear(-25.5,-17.2,100,C_linear,1.241,29.43,Tcircuit_to_canvas,"blue");
    drawLinear(-29.694,-25.5,100,C_linear,2.134,52.2,Tcircuit_to_canvas,"blue");

    // draw car and give it direction
	var Tcar_to_circuit = mat3.create();
	mat3.fromTranslation(Tcar_to_circuit,Ccomp(tParam));
	var Tcar_to_canvas = mat3.create();
	mat3.multiply(Tcar_to_canvas, Tcircuit_to_canvas, Tcar_to_circuit);
	drawObject("green",Tcar_to_canvas);
    }

    slider1.addEventListener("input",draw);
    draw();
}
window.onload = setup;