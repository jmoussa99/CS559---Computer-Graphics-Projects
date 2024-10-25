function start() 
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    

    // with the vertex shader, we need to pass it positions
   
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    // this gives us access to the matrix uniform
    shaderProgram.ModelViewMatrix = gl.getUniformLocation(shaderProgram,"uModelView");
    shaderProgram.ModelViewNormalMatrix = gl.getUniformLocation(shaderProgram,"uModelViewNormal");
    shaderProgram.ModelViewProjMatrix = gl.getUniformLocation(shaderProgram,"uModelViewProj");

    // Attach samplers to texture units
   shaderProgram.textureSampler = gl.getUniformLocation(shaderProgram, "textureSampler");
    gl.uniform1i(shaderProgram.textureSampler, 0);
   
    // vertex positions
    var vertexPos = new Float32Array(
        [0.0,  1.0,  0.0,  -1.0, -1.0,  1.0,   1.0, -1.0,  1.0,
         0.0,  1.0,  0.0,   1.0, -1.0,  1.0,   1.0, -1.0, -1.0,
         0.0,  1.0,  0.0,   1.0, -1.0, -1.0,   -1.0, -1.0, -1.0,
         0.0,  1.0,  0.0,  -1.0, -1.0, -1.0,   -1.0, -1.0,  1.0 ]);

    var vertexNormals = new Float32Array(
        [0, 0, 1,   0, 0, 1,   0, 0, 1,   
         1, 0, 0,   1, 0, 0,   1, 0, 0,   
         0, 1, 0,   0, 1, 0,   0, 1, 0,   
         -1, 0, 0,  -1, 0, 0,  -1, 0, 0]);

        
        // vertex texture coordinates
    var vertexTextureCoords = new Float32Array(
        [0, 0,   1, 0,   1, 1,   
         0, 0,   1, 0,   1, 1, 
         0, 0,   1, 0,   1, 1,  
         0, 0,   1, 0,   1, 1]);
    
    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 12;
        
    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 12;
         
    // a buffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 12;
   
    // Set up texture
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image = new Image();

    function initTextureThenDraw()
    {
      image.onload = function() 
      {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); 
      };

      image.crossOrigin = "anonymous";
      image.src = "https://live.staticflickr.com/65535/50703977193_857cca7a2e_o.jpg";

      window.setTimeout(draw,200);
    }

    // Scene (re-)draw routine
    function draw() {
    
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
    
        // Circle around the x-axis
        var eye = [150.0,400*Math.sin(angle1),400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100,100,100]);
        mat4.rotate(tModel,tModel,angle2,[0,1,0]);
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
      
        var tModelView = mat4.create();
        var tModelViewNormal = mat3.create();
        var tModelViewProj = mat4.create();
        mat4.multiply(tModelView,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tModelViewNormal,tModelView);
        mat4.multiply(tModelViewProj,tProjection,tModelView);
      
        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.ModelViewMatrix,false,tModelView);
        gl.uniformMatrix3fv(shaderProgram.ModelViewNormalMatrix,false,tModelViewNormal);
        gl.uniformMatrix4fv(shaderProgram.ModelViewProjMatrix,false,tModelViewProj);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
          gl.FLOAT, false, 0, 0);

	    // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      

        // Do the drawing
        gl.drawArrays(gl.TRIANGLES, 0, 12);
    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    initTextureThenDraw();
}

window.onload=start;