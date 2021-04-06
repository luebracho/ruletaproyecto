


<html>
    <head>
        <title>Ruleta</title>
        <link rel="stylesheet" href="css/main.css" type="text/css" />
        <script type="text/javascript" src="js/Winwheel.js"></script>
        <script type="text/javascript" src="js/Winwheel2.js"></script>
        <script type="text/javascript" src="js/TweenMax.js"></script>
        <script type="text/javascript" src="js/form.js"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            <!-- Compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

        <!-- Compiled and minified JavaScript -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <style>
            body {
                  /* The image used */
                  background-image:url('https://i.ibb.co/VB7R0BX/BG-ruleta-1.png');
                  background-size: cover;
                  background-repeat:no-repeat;
                }


        </style>
    </head>
    <div class="">
        <div class="row">
            <div class="col-sm-6" style="" align="center" valign="center" id="">
                <img class="img-fluid mx-auto d-block" style="max-width:50%;width:auto;height:auto;" src="https://i.ibb.co/yQfPbHC/header.png" >
            </div>
        </div>
    </div>
    <body onClick="iniciarRueda(); startSpin();">
    <!-- inicio de formulario -->

        <div class="container-fluid">
            <div class="row">
                <!-- 1era Ruleta-->
                <div class="col-sm-6" style="" align="center" valign="center" id="">
                    <img src="img/Marcoruleta.png" class="" style="position: absolute; z-index: 1; margin-top: -480px; margin-left: 550px;">
                    <canvas id="canvas" width="1240" height="1240" style="position: absolute; z-index: 0; margin-top: -450px; margin-left: 600px;">
                        
                    </canvas>
                </div>
                <!-- 2da Ruleta-->
                <div class="col-sm-6" style="" align="center" valign="center" id="">
                    <img src="img/Marcoruleta2.png" class="" style="position: absolute; z-index: 1; margin-top: -58px; margin-left: -1300px;">
                    <canvas id="canvas1" width="700" height="700" style="position: absolute; z-index: 0; margin-top: -80px; margin-left: -1300px;">
                        
                    </canvas>
                </div>
            </div>

           
                <div align="center">

                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td>
                                <div class="power_controls">
                                    <br />
                                    <br />
                                    <table class="power" cellpadding="10" cellspacing="0" hidden>
                                        <tr>
                                            <th align="center">Power</th>
                                        </tr>
                                        <tr>
                                            <td width="78" align="center" id="pw3" onClick="powerSelected(3);">High</td>
                                        </tr>
                                        <tr>
                                            <td align="center" id="pw2" onClick="powerSelected(2);">Med</td>
                                        </tr>
                                        <tr>
                                            <td align="center" id="pw1" onClick="powerSelected(1);">Low</td>
                                        </tr>
                                    </table>
                                    <table class="power" cellpadding="10" cellspacing="0" hidden>
                                        <tr>
                                            <th align="center">Power</th>
                                        </tr>
                                        <tr>
                                            <td width="78" align="center" id="pd3" onClick="poderSeleccionado(3);">High</td>
                                        </tr>
                                        <tr>
                                            <td align="center" id="pd2" onClick="poderSeleccionado(2);">Med</td>
                                        </tr>
                                        <tr>
                                            <td align="center" id="pd1" onClick="poderSeleccionado(1);">Low</td>
                                        </tr>
                                    </table>
                                    <br />
                                    <button type="button" class="btn btn-danger" id="spin_button" alt="Spin" onClick="iniciarRueda();" hidden>Jugar</button>
                                    
                                    <a href="#" onClick="reiniciarRueda(); return false;" hidden>Jugar de nuevo</a>
                                </div>
                            </td>
 
                        </tr>
                    </table>
                </div>
        </div>
        

        <script>
            // Ruleta del lado derecho copia (español)
            // Create new wheel object specifying the parameters at creation time.
            let laRueda = new Ruleta({
                'numSegmentos'       : 6,         // Specify number of segments.
                'externoRadio'       : 270,       // Set outer radius so wheel fits inside the background.
                'dibujoModo'          : 'imagen',   // dibujoModo must be set to image.
                'dibujarTexto'          : true,      // Need to set this true if want code-drawn text on image wheels.
                'textoFuenteTamano'      : 12,        // Set text options as desired.
                'textoOrientacion'   : 'curved',
                'textoDireccion'     : 'reversed',
                'textoAlineacion'     : 'outer',
                'textoMargen'        : 5,
                'textoFuenteFamilia'    : 'monospace',
                'textoGolpeStyle'   : 'black',
                'textoLineaAncho'     : 2,
                'textoRellenoStyle'     : 'white',
                'segmentos'     :                // Define segments.
                [
                   {'text' : '5'},
                   {'text' : '150'},
                   {'text' : '80'},
                   {'text' : '50'},
                   {'text' : '20'},
                   {'text' : '10'}
                ],
                'animacion' :                   // Specify the animation to use.
                {
                    'type'     : 'spinToStop',
                    'duration' : 10,     // Duration in seconds.
                    'spins'    : 3,     // Number of complete spins.
                    'callbackFinished' : alertaPremio 
                },
                'pines' :                // Turn pins on.
                {
                    'number'     : 6,
                    'rellenoStyle'  : 'silver',
                    'externoRadio': 4,
                }
            });

            // Create new image object in memory.
            let cargaImg = new Image();

            // Create callback to execute once the image has finished loading.
            cargaImg.onload = function()
            {
                laRueda.ruedaImagen = cargaImg;    // Make ruedaImagen equal the loaded image object.
                laRueda.draw();                    // Also call draw function to render the wheel.
            }

            // Set the image source, once complete this will trigger the onLoad callback (above).
            cargaImg.src = "img/marco2.png";



            // Vars used by the code in this page to do power controls.
            let ruletaPoder    = 10;
            let ruedaRodamiento = false;

            // -------------------------------------------------------
            // Function to handle the onClick on the power buttons.
            // -------------------------------------------------------
            function poderSeleccionado(poderNivel)
            {
                // Ensure that power can't be changed while wheel is spinning.
                if (ruedaRodamiento == false) {
                    // Reset all to grey incase this is not the first time the user has selected the power.
                    document.getElementById('pd1').className = "";
                    document.getElementById('pd2').className = "";
                    document.getElementById('pd3').className = "";

                    // Now light up all cells below-and-including the one selected by changing the class.
                    if (poderNivel >= 1) {
                        document.getElementById('pd1').className = "pd1";
                    }

                    if (poderNivel >= 2) {
                        document.getElementById('pd2').className = "pd2";
                    }

                    if (poderNivel >= 3) {
                        document.getElementById('pd3').className = "pd3";
                    }

                    // Set ruletaPoder var used when spin button is clicked.
                    ruletaPoder = poderNivel;

                    // Light up the spin button by changing it's source image and adding a clickable class to it.
                    document.getElementById('spin_button').src = "spin_on.png";
                    document.getElementById('spin_button').className = "clickable";
                }
            }

            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function iniciarRueda()
            {
                laRueda.rotacionAngulo = 0; 
                // Ensure that spinning can't be clicked again while already running.
                if (ruedaRodamiento == false) {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (ruletaPoder == 1) {
                        laRueda.animacion.spins = 2;
                    } else if (ruletaPoder == 2) {
                        laRueda.animacion.spins = 5;
                    } else if (ruletaPoder == 3) {
                        laRueda.animacion.spins = 8;
                    }

                    // Disable the spin button so can't click again while wheel is spinning.
                    document.getElementById('spin_button').src       = "spin_off.png";
                    document.getElementById('spin_button').className = "";

                    // Begin the spin animation by calling startAnimation on the wheel object.
                    laRueda.iniciarAnimacion();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    ruedaRodamiento = true;
                }
            }

            // -------------------------------------------------------
            // Function for reset button.
            // -------------------------------------------------------
            function reiniciarRueda()
            {
                laRueda.detenerAnimacion(false);  // Stop the animation, false as param so does not call callback function.
                     // Re-set the wheel angle to 0 degrees.
                                // Call draw to render changes to the wheel.

                document.getElementById('pd1').className = "10";  // Remove all colours from the power level indicators.
                document.getElementById('pd2').className = "10";
                document.getElementById('pd3').className = "10";

                ruedaRodamiento = false;          // Reset to false to power buttons and spin can be clicked again.
            }

            // -------------------------------------------------------
            // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
            // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
            // -------------------------------------------------------
            function alertaPremio()
            {
                // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
                var winningSegmento = laRueda.getIndicatedSegment();
                
                // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
              
            }

            $('body').keyup(function(e) {
		        if(e.which == 13){
	
                laRueda.detenerAnimacion(false);  // Stop the animation, false as param so does not call callback function.
                    // Re-set the wheel angle to 0 degrees.
                               // Call draw to render changes to the wheel.

                document.getElementById('pd1').className = "10";  // Remove all colours from the power level indicators.
                document.getElementById('pd2').className = "10";
                document.getElementById('pd3').className = "10";

                ruedaRodamiento = false;          // Reset to false to power buttons and spin can be clicked again.
            

		        }
	        });

            $('body').keyup(function(e) {
		        if(e.which == 32){
	
                    // Ensure that spinning can't be clicked again while already running.
                    if (ruedaRodamiento == false) {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (ruletaPoder == 1) {
                        laRueda.animacion.spins = 2;
                    } else if (ruletaPoder == 2) {
                        laRueda.animacion.spins = 5;
                    } else if (ruletaPoder == 3) {
                        laRueda.animacion.spins = 8;
                    }

                    // Disable the spin button so can't click again while wheel is spinning.
                    document.getElementById('spin_button').src       = "spin_off.png";
                    document.getElementById('spin_button').className = "";

                    // Begin the spin animation by calling startAnimation on the wheel object.
                    laRueda.iniciarAnimacion();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    ruedaRodamiento = true;
                }
            

		        }
	        });
 
                    // Ruleta del lado iquierdo Original
                    // Create new wheel object specifying the parameters at creation time.
                    let theWheel = new Winwheel({
                    'numSegments'       : 16,         // Specify number of segments.
                    'outerRadius'       : 600,       // Set outer radius so wheel fits inside the background.
                    'drawMode'          : 'image',   // drawMode must be set to image.
                    'drawText'          : true,      // Need to set this true if want code-drawn text on image wheels.
                    'textFontSize'      : 12,        // Set text options as desired.
                    'textOrientation'   : 'curved',
                    'textDirection'     : 'reversed',
                    'textAlignment'     : 'outer',
                    'textMargin'        : 5,
                    'textFontFamily'    : 'monospace',
                    'textStrokeStyle'   : 'black',
                    'textLineWidth'     : 2,
                    'textFillStyle'     : 'white',
                    'segments'     :                // Define segments.
                    [
                        {'text' : 'GIRA GRATIS'},
                        {'text' : '100'},
                        {'text' : 'UPS'},
                        {'text' : '20'},
                        {'text' : 'GIRA GRATIS'},
                        {'text' : '400'},
                        {'text' : 'UPS'},
                        {'text' : '10'},
                        {'text' : 'GIRA GRATIS'},
                        {'text' : '90'},
                        {'text' : 'UPS'},
                        {'text' : '5000'},
                        {'text' : 'GIRA GRATIS'},
                        {'text' : '80'},
                        {'text' : 'UPS'},
                        {'text' : '30'}
                    ],
                    'animation' :                   // Specify the animation to use.
                    {
                        'type'     : 'spinToStop',
                        'duration' : 10,     // Duration in seconds.
                        'spins'    : 3,     // Number of complete spins.
                        'callbackFinished' : alertPrize 
                    },
                    'pins' :                // Turn pins on.
                    {
                        'number'     : 16,
                        'fillStyle'  : 'silver',
                        'outerRadius': 4,
                    }
                    });

                    // Create new image object in memory.
                    let loadedImg = new Image();

                    // Create callback to execute once the image has finished loading.
                    loadedImg.onload = function()
                    {
                    theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
                    theWheel.draw();                    // Also call draw function to render the wheel.
                    }

                    // Set the image source, once complete this will trigger the onLoad callback (above).
                    loadedImg.src = "img/ruleta.png";



                    // Vars used by the code in this page to do power controls.
                    let wheelPower    = 10;
                    let wheelSpinning = false;

                    // -------------------------------------------------------
                    // Function to handle the onClick on the power buttons.
                    // -------------------------------------------------------
                    function powerSelected(powerLevel)
                    {
                    // Ensure that power can't be changed while wheel is spinning.
                    if (wheelSpinning == false) {
                        // Reset all to grey incase this is not the first time the user has selected the power.
                        document.getElementById('pw1').className = "";
                        document.getElementById('pw2').className = "";
                        document.getElementById('pw3').className = "";

                        // Now light up all cells below-and-including the one selected by changing the class.
                        if (powerLevel >= 1) {
                            document.getElementById('pw1').className = "pw1";
                        }

                        if (powerLevel >= 2) {
                            document.getElementById('pw2').className = "pw2";
                        }

                        if (powerLevel >= 3) {
                            document.getElementById('pw3').className = "pw3";
                        }

                        // Set wheelPower var used when spin button is clicked.
                        wheelPower = powerLevel;

                        // Light up the spin button by changing it's source image and adding a clickable class to it.
                        document.getElementById('spin_button').src = "spin_on.png";
                        document.getElementById('spin_button').className = "clickable";
                    }
                    }

                    // -------------------------------------------------------
                    // Click handler for spin button.
                    // -------------------------------------------------------
                    function startSpin()
                    {
                        theWheel.rotationAngle = 0;
                    // Ensure that spinning can't be clicked again while already running.
                    if (wheelSpinning == false) {
                        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                        // to rotate with the duration of the animation the quicker the wheel spins.
                        if (wheelPower == 1) {
                            theWheel.animation.spins = 2;
                        } else if (wheelPower == 2) {
                            theWheel.animation.spins = 5;
                        } else if (wheelPower == 3) {
                            theWheel.animation.spins = 8;
                        }

                        // Disable the spin button so can't click again while wheel is spinning.
                        document.getElementById('spin_button').src       = "spin_off.png";
                        document.getElementById('spin_button').className = "";

                        // Begin the spin animation by calling startAnimation on the wheel object.
                        theWheel.startAnimation();

                        // Set to true so that power can't be changed and spin button re-enabled during
                        // the current animation. The user will have to reset before spinning again.
                        wheelSpinning = true;

                        
                        document.getElementById("f1t1").focus();
                            

                        
                    }
                    }

                    // -------------------------------------------------------
                    // Function for reset button.
                    // -------------------------------------------------------
                    function resetWheel()
                    {
                    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                        // Re-set the wheel angle to 0 degrees.
                                   // Call draw to render changes to the wheel.

                    document.getElementById('pw1').className = "10";  // Remove all colours from the power level indicators.
                    document.getElementById('pw2').className = "10";
                    document.getElementById('pw3').className = "10";

                    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.

                    }

                    // -------------------------------------------------------
                    // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
                    // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
                    // -------------------------------------------------------
                    function alertPrize()
                    {
                        // Get the segment indicated by the pointer on the wheel background which is at 0 degrees.
                        var winningSegment = theWheel.getIndicatedSegment();
                        var winningSegmento = laRueda.getIndicatedSegment();
                        var total = winningSegment.text*winningSegmento.text;
                       
                    

                    document.f1.f1t1.value = winningSegmento.text;
                    document.f1.f1t2.value = winningSegment.text;
                    document.f1.f1t3.value = winningSegment.text*winningSegmento.text;

                        // Do basic alert of the segment text. You would probably want to do something more interesting with this information.
                        document.getElementById("myCheck").click();
                    }

                    $('body').keyup(function(e) {
                    if(e.which == 13){

                    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                         // Re-set the wheel angle to 0 degrees.
                                    // Call draw to render changes to the wheel.

                    document.getElementById('pw1').className = "10";  // Remove all colours from the power level indicators.
                    document.getElementById('pw2').className = "10";
                    document.getElementById('pw3').className = "10";

                    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
                    
                    
                    }
                    });

              


                    $('body').keyup(function(e) {
                    if(e.which == 32){

                        // Ensure that spinning can't be clicked again while already running.
                        if (wheelSpinning == false) {
                        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                        // to rotate with the duration of the animation the quicker the wheel spins.
                        if (wheelPower == 1) {
                            theWheel.animation.spins = 2;
                        } else if (wheelPower == 2) {
                            theWheel.animation.spins = 5;
                        } else if (wheelPower == 3) {
                            theWheel.animation.spins = 8;
                        }

                        // Disable the spin button so can't click again while wheel is spinning.
                        document.getElementById('spin_button').src       = "spin_off.png";
                        document.getElementById('spin_button').className = "";

                        // Begin the spin animation by calling startAnimation on the wheel object.
                        theWheel.startAnimation();

                        // Set to true so that power can't be changed and spin button re-enabled during
                        // the current animation. The user will have to reset before spinning again.
                        wheelSpinning = true;
                    }


                    }
                    }); 
                    
                    

        </script>
        <script>
  function limpiarFormulario() {
    document.getElementById("f1").reset();
  }
</script>



<?php

include_once "modelprize.php";

?>


        </body>
        </html>
        <script>
        <?php

            $ruleta = $_POST['f1t1'];
            $wheel = $_POST['f1t2'];
            $total = $ruleta * $wheel;


            $sql = "INSERT INTO historico (ruleta, wheel, total, descripcion)
            VALUES ('$ruleta', '$wheel', '$total', '$wheel')";

            if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
            } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
            }

            $conn->close();

        ?>
        </script>