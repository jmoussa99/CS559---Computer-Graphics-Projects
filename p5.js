function setup(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var cameraSlider = document.getElementById('slider1');
    var objSlider = document.getElementById('slider2');
    var height = document.getElementById('slider3');
    cameraSlider.value = 0;
    height.value = 0;
    objSlider.value = 0;

    function draw(){
        canvas.width = canvas.width;

	    // use the sliders to get the angles
	    var tParam = objSlider.value*0.01;
        var viewAngle = cameraSlider.value*0.02*Math.PI;
        var cameraHeight = height.value*0.02*Math.PI;

	
	    function moveToTx(loc,Tx)
	    {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

	    function lineToTx(loc,Tx)
        {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}
        
        function drawBoxCar(Tx){
            context.beginPath();
            context.fillStyle = "pink";
            context.strokeStyle = "black";
            moveToTx([0,0,0], Tx);
            lineToTx([0,0,1], Tx);
            lineToTx([1,0,1], Tx);
            lineToTx([1,0,0], Tx);
            lineToTx([0,0,0], Tx);
            lineToTx([0,1,0], Tx);
            lineToTx([0,1,1], Tx);
            lineToTx([0,0,1], Tx);
            moveToTx([0,1,1], Tx);
            lineToTx([1,1,1], Tx);
            lineToTx([1,0,1], Tx);
            lineToTx([0,0,1], Tx);
            moveToTx([1,1,1], Tx);
            lineToTx([1,1,0], Tx);
            lineToTx([1,0,0], Tx);
            moveToTx([1,1,0], Tx);
            lineToTx([0,1,0], Tx);
            context.closePath();
            context.stroke();
            context.fill();

        }

        var Hermite = function(t) {
            return [
            2*t*t*t-3*t*t+1,
            t*t*t-2*t*t+t,
            -2*t*t*t+3*t*t,
            t*t*t-t*t
            ];
        }
        
        function Cubic(basis,P,t){
            var b = basis(t);
            var result=vec3.create();
            vec3.scale(result,P[0],b[0]);
            vec3.scaleAndAdd(result,result,P[1],b[1]);
            vec3.scaleAndAdd(result,result,P[2],b[2]);
            vec3.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }

        var p0 = [0,0,0];
        var d0 = [10,0,0];
        var p1 = [20,0,0];
        var d1 = d0;
        var p2 = [20,0,15];
        var d2 = [-10,0,0];
        var p3 = [0,0,15];
        var d3 = d2;

        var P0 = [p0,d0,p1,d1];
        var P1 = [p1,d1,p2,d2];
        var P2 = [p2,d2,p3,d3];
        var P3 = [p3,d3,p0,d0];

        var C0 = function(t) {return Cubic(Hermite, P0, t);}
        var C1 = function(t) {return Cubic(Hermite, P1, t);}
        var C2 = function(t) {return Cubic(Hermite, P2, t);}
        var C3 = function(t) {return Cubic(Hermite, P3, t);}

        var Ct = function(t){
            if(t < 1){
                var u = t;
                return C0(u);
            }else if(t < 2){
                var u = t - 1.0;
                return C1(u);
            }else if(t < 3){
                var u = t - 2.0;
                return C2(u);
            }else {
                var u = t - 3.0;
                return C3(u);
            }
        }

        // function from week8/demo3
        function drawTrajectory(t_begin,t_end,intervals,C,Tx) {
            context.strokeStyle='blue';
            context.beginPath();
            moveToTx(C(t_begin),Tx);

            for(var i=1;i<=intervals;i++){
                var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                lineToTx(C(t),Tx);
            }
            context.stroke();
        }

        var Tviewport = mat4.create();
        mat4.fromTranslation(Tviewport, [400,250,0]);
        mat4.scale(Tviewport, Tviewport, [200,-200,1]);

        var Tprojection = mat4.create();
        mat4.ortho(Tprojection,-10,10,-10,10,-1,1);

        var Tview_proj = mat4.create();
        mat4.multiply(Tview_proj, Tviewport, Tprojection);

        var cameraLocation = vec3.create();
        cameraLocation[0] = 40*Math.sin(viewAngle);
        cameraLocation[1] = 7*Math.cos(cameraHeight);
        cameraLocation[2] = 40*Math.cos(viewAngle);

        var cameraTarget = vec3.fromValues(10,0,7.5);
        var up = vec3.fromValues(0,1,0);
        var TlookAt = mat4.create();
        mat4.lookAt(TlookAt, cameraLocation, cameraTarget, up);

        // create a dynamic viewport based on camera position
        var Tdynamic_view = mat4.create();
        mat4.multiply(Tdynamic_view, Tview_proj, TlookAt);

        drawTrajectory(0.0,1.0,100,C0,Tdynamic_view);
        drawTrajectory(0.0,1.0,100,C1,Tdynamic_view);
        drawTrajectory(0.0,1.0,100,C2,Tdynamic_view);
        drawTrajectory(0.0,1.0,100,C3,Tdynamic_view);

        // Matrix for box car
        var Tcar = mat4.create();
        mat4.fromTranslation(Tcar, Ct(tParam));

        // connect car to viewport/camera
        var Tview_car = mat4.create();
        mat4.multiply(Tview_car, Tdynamic_view, Tcar);
        drawBoxCar(Tview_car);

    }

    cameraSlider.addEventListener("input", draw);
    objSlider.addEventListener("input",draw);
    height.addEventListener("input", draw);
    draw();
}
window.onload = setup;