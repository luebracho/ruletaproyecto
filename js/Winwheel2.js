/*
    Winwheel.js, by Douglas McKechie @ www.dougtesting.net
    See website for tutorials and other documentation.

    The MIT License (MIT)

    Copyright (c) 2012-2019 Douglas McKechie

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

// ====================================================================================================================
// The constructor for the WinWheel object, a JSON-like array of opciones can be passed in.
// By default the wheel is drawn if canvas1 object exists on the page, but can pass false as second parameter if don't want this to happen.
// ====================================================================================================================
function Ruleta(opciones, lienzoRuleta)
{
    opcionesDefecto = {
        'canvasCc'          : 'canvas1',     // Id of the canvas1 which the wheel is to draw on to.
        'centroX'           : null,         // X position of the center of the wheel. The default of these are null which means will be placed in center of the canvas1.
        'centroY'           : null,         // Y position of the wheel center. If left null at time of construct the center of the canvas1 is used.
        'externoRadio'       : null,         // The radius of the outside of the wheel. If left null it will be set to the radius from the center of the canvas1 to its shortest side.
        'internoRadio'       : 0,            // Normally 0. Allows the creation of rings / doughnuts if set to value > 0. Should not exceed outer radius.
        'numSegmentos'       : 1,            // The number of segmentos. Need at least one to draw.
        'dibujoModo'          : 'code',       // The draw mode. Possible values are 'code', 'imagen', 'segmentImage'. Default is code which means segmentos are drawn using canvas1 arc() function.
        'rotacionAngulo'     : 0,            // The angle of rotation of the wheel - 0 is 12 o'clock position.
        'textoFuenteFamilia'    : 'Arial',      // Segment text font, you should use web safe fonts.
        'textoFuenteTamano'      : 20,           // Size of the segment text.
        'textoFuenteAncho'    : 'bold',       // Font weight.
        'textoOrientacion'   : 'horizontal', // Either horizontal, vertical, or curved.
        'textoAlineacion'     : 'center',     // Either center, inner, or outer.
        'textoDireccion'     : 'normal',     // Either normal or reversed. In normal mode for horizontal text in segment at 3 o'clock is correct way up, in reversed text at 9 o'clock segment is correct way up.
        'textoMargen'        : null,         // Margin between the inner or outer of the wheel (depends on textoAlineacion).
        'textoRellenoStyle'     : 'black',      // This is basically the text colour.
        'textoGolpeStyle'   : null,         // Basically the line colour for segment text, only looks good for large text so off by default.
        'textoLineaAncho'     : 1,            // Width of the lines around the text. Even though this defaults to 1, a line is only drawn if textoGolpeStyle specified.
        'rellenoStyle'         : 'silver',     // The segment background colour.
        'golpeStyle'       : 'black',      // Segment line colour. Again segment lines only drawn if this is specified.
        'lineaAncho'         : 1,            // Width of lines around segmentos.
        'limpiarElCanvas'    : true,         // When set to true the canvas1 will be cleared before the wheel is drawn.
        'imageCubrir'      : false,        // If set to true in imagen drawing mode the outline of the segmentos will be displayed over the imagen. Does nothing in code dibujoModo.
        'dibujarTexto'          : true,         // By default the text of the segmentos is rendered in code dibujoModo and not in imagen dibujoModo.
        'punteroAngulo'      : 270,            // Location of the pointer that indicates the prize when wheel has stopped. Default is 0 so the (corrected) 12 o'clock position.
        'ruedaImagen'        : null,         // Must be set to imagen data in order to use imagen to draw the wheel - dibujoModo must also be 'imagen'.
        'imagenDireccion'    : 'N',          // Used when dibujoModo is segmentImage. Default is north, can also be (E)ast, (S)outh, (W)est.
        'responsivo'        : false,        // If set to true the wheel will resize when the window first loads and also onResize.
        'scalaFactor'       : 1,            // Set by the responsivo function. Used in many calculations to scale the wheel.
    };

    // -----------------------------------------
    // Loop through the default opciones and create properties of this class set to the value for the option passed in
    // or if not value for the option was passed in then to the default.
    for (let llave in opcionesDefecto) {
        if ((opciones != null) && (typeof(opciones[llave]) !== 'undefined')) {
            this[llave] = opciones[llave];
        } else {
            this[llave] = opcionesDefecto[llave];
        }
    }

    // Also loop though the passed in opciones and add anything specified not part of the class in to it as a property.
    if (opciones != null) {
        for (let llave in opciones) {
            if (typeof(this[llave]) === 'undefined') {
                this[llave] = opciones[llave];
            }
        }
    }


    // ------------------------------------------
    // If the id of the canvas1 is set, try to get the canvas1 as we need it for drawing.
    if (this.canvasCc) {
        this.canvas1 = document.getElementById(this.canvasCc);

        if (this.canvas1) {
            // If the centroX and centroY have not been specified in the opciones then default to center of the canvas1
            // and make the externoRadio half of the canvas1 width - this means the wheel will fill the canvas1.
            if (this.centroX == null) {
                this.centroX = this.canvas1.width / 2;
            }

            if (this.centroY == null) {
                this.centroY = this.canvas1.height / 2;
            }

            if (this.externoRadio == null) {
                // Need to set to half the width of the shortest dimension of the canvas1 as the canvas1 may not be square.
                // Minus the line segment line width otherwise the lines around the segmentos on the top,left,bottom,right
                // side are chopped by the edge of the canvas1.
                if (this.canvas1.width < this.canvas1.height) {
                    this.externoRadio = (this.canvas1.width / 2) - this.lineaAncho;
                } else {
                    this.externoRadio = (this.canvas1.height / 2) - this.lineaAncho;
                }
            }

            // Also get a 2D context to the canvas1 as we need this to draw with.
            this.xtc = this.canvas1.getContext('2d');
        } else {
            this.canvas1 = null;
            this.xtc = null;
        }
    } else {
        this.canvas1 = null;
        this.xtc = null;
    }

    // ------------------------------------------
    // Add array of segmentos to the wheel, then populate with segmentos if number of segmentos is specified for this object.
    this.segmentos = new Array(null);

    for (let x = 1; x <= this.numSegmentos; x++) {
        // If opciones for the segmentos have been specified then create a segment sending these opciones so
        // the specified values are used instead of the defaults.
        if ((opciones != null) && (opciones['segmentos']) && (typeof(opciones['segmentos'][x-1]) !== 'undefined')) {
            this.segmentos[x] = new Segment(opciones['segmentos'][x-1]);
        } else {
            this.segmentos[x] = new Segment();
        }
    }

    // ------------------------------------------
    // Call function to update the segment sizes setting the starting and ending angles.
    this.actualizarSegmentosTamano();

    // If the text margin is null then set to same as font size as we want some by default.
    if (this.textoMargen === null) {
        this.textoMargen = (this.textoFuenteTamano / 1.7);
    }

    // ------------------------------------------
    // If the animacion opciones have been passed in then create animacion object as a property of this class
    // and pass the opciones to it so the animacion is set. Otherwise create default animacion object.
    if ((opciones != null) && (opciones['animacion']) && (typeof(opciones['animacion']) !== 'undefined')) {
        this.animacion = new Animation(opciones['animacion']);
    } else {
        this.animacion = new Animation();
    }

    // ------------------------------------------
    // If some pin opciones then create create a pin object and then pass them in.
    if ((opciones != null) && (opciones['pines']) && (typeof(opciones['pines']) !== 'undefined')) {
        this.pines = new Pin(opciones['pines']);
    }

    // ------------------------------------------
    // If the dibujoModo is imagen change some defaults provided a value has not been specified.
    if ((this.dibujoModo == 'imagen') || (this.dibujoModo == 'segmentImage')) {
        // Remove grey rellenoStyle.
        if (typeof(opciones['rellenoStyle']) === 'undefined') {
            this.rellenoStyle = null;
        }

        // Set golpeStyle to red.
        if (typeof(opciones['golpeStyle']) === 'undefined') {
            this.golpeStyle = 'red';
        }

        // Set dibujarTexto to false as we will assume any text is part of the imagen.
        if (typeof(opciones['dibujarTexto']) === 'undefined') {
            this.dibujarTexto = false;
        }

        // Also set the lineaAncho to 1 so that segment overlay will look correct.
        if (typeof(opciones['lineaAncho']) === 'undefined') {
            this.lineaAncho = 1;
        }

        // Set lienzoRuleta to false as normally the imagen needs to be loaded first.
        if (typeof(lienzoRuleta) === 'undefined') {
            lienzoRuleta = false;
        }
    } else {
        // When in code dibujoModo the default is the wheel will draw.
        if (typeof(lienzoRuleta) === 'undefined') {
            lienzoRuleta = true;
        }
    }

    // Create pointer guide.
    if ((opciones != null) && (opciones['punteroGuia']) && (typeof(opciones['punteroGuia']) !== 'undefined')) {
        this.punteroGuia = new PunteroGuia(opciones['punteroGuia']);
    } else {
        this.punteroGuia = new PunteroGuia();
    }

    // Check if the wheel is to be responsivo, if so then need to save the original size of the canvas1
    // and also check for data- attributes on the canvas1 which help control the scaling.
    if (this.responsivo) {
        ruletaParaDibujarDuranteAnimacion = this;

        // Save the original defined width and height of the canvas1, this is needed later to work out the scaling.
        this._originalCanvasWidth = this.canvas1.width;
        this._originalCanvasHeight = this.canvas1.height;

        // Get data-attributes on the canvas1.
        this._responsiveScaleHeight = this.canvas1.dataset.responsivescaleheight;
        this._responsiveMinWidth = this.canvas1.dataset.responsiveminwidth;
        this._responsiveMinHeight = this.canvas1.dataset.responsiveminheight;
        this._responsiveMargin = this.canvas1.dataset.responsivemargin;

        // Add event listeners for onload and onresize and call a function defined at the bottom
        // of this script which will handle that and work out the scale factor.
        window.addEventListener("load", ruletaRedimension);
        window.addEventListener("resize", ruletaRedimension);
    }

    // Finally if lienzoRuleta is true then call function to render the wheel, segment text, overlay etc.
    if (lienzoRuleta == true) {
        this.draw(this.limpiarElCanvas);
    } else if (this.dibujoModo == 'segmentImage') {
        // If segment imagen then loop though all the segmentos and load the images for them setting a callback
        // which will call the draw function of the wheel once all the images have been loaded.
        ruletaParaDibujarDuranteAnimacion = this;
        ruletaYaDibujada = false;

        for (let y = 1; y <= this.numSegmentos; y ++) {
            if (this.segmentos[y].imagen !== null) {
                this.segmentos[y].imgData = new Image();
                this.segmentos[y].imgData.onload = ruletaCargadaImagen;
                this.segmentos[y].imgData.src = this.segmentos[y].imagen;
            }
        }
    }
}

// ====================================================================================================================
// This function sorts out the segment sizes. Some segmentos may have set sizes, for the others what is left out of
// 360 degrees is shared evenly. What this function actually does is set the start and end angle of the arcs.
// ====================================================================================================================
Ruleta.prototype.actualizarSegmentosTamano = function()
{
    // If this object actually contains some segmentos
    if (this.segmentos) {
        // First add up the arc used for the segmentos where the size has been set.
        let arcUsed = 0;
        let numSet  = 0;

        // Remember, to make it easy to access segmentos, the position of the segmentos in the array starts from 1 (not 0).
        for (let x = 1; x <= this.numSegmentos; x ++) {
            if (this.segmentos[x].size !== null) {
                arcUsed += this.segmentos[x].size;
                numSet ++;
            }
        }

        let arcLeft = (360 - arcUsed);

        // Create variable to hold how much each segment with non-set size will get in terms of degrees.
        let degreesEach = 0;

        if (arcLeft > 0) {
            degreesEach = (arcLeft / (this.numSegmentos - numSet));
        }

        // ------------------------------------------
        // Now loop though and set the start and end angle of each segment.
        let currentDegree = 0;

        for (let x = 1; x <= this.numSegmentos; x ++) {
            // Set start angle.
            this.segmentos[x].startAngle = currentDegree;

            // If the size is set then add this to the current degree to get the end, else add the degreesEach to it.
            if (this.segmentos[x].size) {
                currentDegree += this.segmentos[x].size;
            } else {
                currentDegree += degreesEach;
            }

            // Set end angle.
            this.segmentos[x].endAngle = currentDegree;
        }
    }
}

// ====================================================================================================================
// This function clears the canvas1. Will wipe anything else which happens to be drawn on it.
// ====================================================================================================================
Ruleta.prototype.limpiarCanvas = function()
{
    if (this.xtc) {
        this.xtc.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
    }
}

// ====================================================================================================================
// This function draws / re-draws the wheel on the canvas1 therefore rendering any changes.
// ====================================================================================================================
Ruleta.prototype.draw = function(limpiarElCanvas)
{
    // If have the canvas1 context.
    if (this.xtc) {
        // Clear the canvas1, unless told not to.
        if (typeof(limpiarElCanvas) !== 'undefined') {
            if (limpiarElCanvas == true) {
                this.limpiarCanvas();
            }
        } else {
            this.limpiarCanvas();
        }

        // Call functions to draw the segmentos and then segment text.
        if (this.dibujoModo == 'imagen') {
            // Draw the wheel by loading and drawing an imagen such as a png on the canvas1.
            this.dibujarRuedaImagen();

            // If we are to draw the text, do so before the overlay is drawn
            // as this allows the overlay to be used to create some interesting effects.
            if (this.dibujarTexto == true) {
                this.dibujarSegmentoTexto();
            }

            // If imagen overlay is true then call function to draw the segmentos over the top of the imagen.
            // This is useful during development to check alignment between where the code thinks the segmentos are and where they appear on the imagen.
            if (this.imageCubrir == true) {
                this.drawSegments();
            }
        } else if (this.dibujoModo == 'segmentImage') {
            // Draw the wheel by rendering the imagen for each segment.
            this.drawSegmentImages();

            // If we are to draw the text, do so before the overlay is drawn
            // as this allows the overlay to be used to create some interesting effects.
            if (this.dibujarTexto == true) {
                this.dibujarSegmentoTexto();
            }

            // If imagen overlay is true then call function to draw the segmentos over the top of the imagen.
            // This is useful during development to check alignment between where the code thinks the segmentos are and where they appear on the imagen.
            if (this.imageCubrir == true) {
                this.drawSegments();
            }
        } else {
            // The default operation is to draw the segmentos using code via the canvas1 arc() method.
            this.drawSegments();

            // The text is drawn on top.
            if (this.dibujarTexto == true) {
                this.dibujarSegmentoTexto();
            }
        }

        // If this class has pines.
        if (typeof this.pines !== 'undefined') {
            // If they are to be visible then draw them.
            if (this.pines.visible == true) {
                this.drawPins();
            }
        }

        // If pointer guide is display property is set to true then call function to draw the pointer guide.
        if (this.punteroGuia.display == true) {
            this.drawPointerGuide();
        }
    }
}

// ====================================================================================================================
// Draws the pines around the outside of the wheel.
// ====================================================================================================================
Ruleta.prototype.drawPins = function()
{
    if ((this.pines) && (this.pines.number)) {
        // Get scaled centroX and centroY to use in the code below so pines will draw responsively too.
        let centroX = (this.centroX * this.scalaFactor);
        let centroY = (this.centroY * this.scalaFactor);
        let externoRadio = (this.externoRadio * this.scalaFactor);

        // Check if the pin's size is to be responsivo too, if so set the pinOuterRadius to a scaled version number.
        let pinOuterRadius = this.pines.externoRadio;
        let pinMargin = this.pines.margin;

        if (this.pines.responsivo) {
            pinOuterRadius = (this.pines.externoRadio * this.scalaFactor);
            pinMargin = (this.pines.margin * this.scalaFactor);
        }

        // Work out the angle to draw each pin a which is simply 360 / the number of pines as they space evenly around.
        //++ There is a slight oddity with the pines in that there is a pin at 0 and also one at 360 and these will be drawn
        //++ directly over the top of each other. Also pines are 0 indexed which could possibly cause some confusion
        //++ with the getCurrentPin function - for now this is just used for audio so probably not a problem.
        let pinSpacing = (360 / this.pines.number);

        for(let i=1; i<=this.pines.number; i ++) {
            this.xtc.save();

            // Set the stroke style and line width.
            this.xtc.golpeStyle = this.pines.golpeStyle;
            this.xtc.lineaAncho = this.pines.lineaAncho;
            this.xtc.rellenoStyle = this.pines.rellenoStyle;

            // Move to the center.
            this.xtc.translate(centroX, centroY);

            // Rotate to to the pin location which is i * the pinSpacing.
            this.xtc.rotate(this.degToRad(i * pinSpacing + this.rotacionAngulo));

            // Move back out.
            this.xtc.translate(-centroX, -centroY);

            // Create a path for the pin circle.
            this.xtc.beginPath();
            // x, y, radius, startAngle, endAngle.
            this.xtc.arc(centroX,(centroY - externoRadio) + pinOuterRadius + pinMargin, pinOuterRadius, 0, 2*Math.PI);

            if (this.pines.rellenoStyle) {
                this.xtc.fill();
            }

            if (this.pines.golpeStyle) {
                this.xtc.stroke();
            }

            this.xtc.restore();
        }
    }
}

// ====================================================================================================================
// Draws a line from the center of the wheel to the outside at the angle where the code thinks the pointer is.
// ====================================================================================================================
Ruleta.prototype.drawPointerGuide = function()
{
    // If have canvas1 context.
    if (this.xtc) {
        // Get scaled center x an y and also the outer radius.
        let centroX = (this.centroX * this.scalaFactor);
        let centroY = (this.centroY * this.scalaFactor);
        let externoRadio = (this.externoRadio * this.scalaFactor);

        this.xtc.save();

        // Rotate the canvas1 to the line goes towards the location of the pointer.
        this.xtc.translate(centroX, centroY);
        this.xtc.rotate(this.degToRad(this.punteroAngulo));
        this.xtc.translate(-centroX, -centroY);

        // Set line colour and width.
        this.xtc.golpeStyle = this.punteroGuia.golpeStyle;
        this.xtc.lineaAncho = this.punteroGuia.lineaAncho;

        // Draw from the center of the wheel outwards past the wheel outer radius.
        this.xtc.beginPath();
        this.xtc.moveTo(centroX, centroY);
        this.xtc.lineTo(centroX, -(externoRadio / 4));

        this.xtc.stroke();
        this.xtc.restore();
    }
}

// ====================================================================================================================
// This function takes an imagen such as PNG and draws it on the canvas1 making its center at the centroX and center for the wheel.
// ====================================================================================================================
Ruleta.prototype.dibujarRuedaImagen = function()
{
    // Double check the ruedaImagen property of this class is not null. This does not actually detect that an imagen
    // source was set and actually loaded so might get error if this is not the case. This is why the initial call
    // to draw() should be done from a ruedaImagen.onload callback as detailed in example documentation.
    if (this.ruedaImagen != null) {
        // Get the centroX and centroY in to variables, adjust by the scalaFactor.
        let centroX = (this.centroX * this.scalaFactor);
        let centroY = (this.centroY * this.scalaFactor);

        // Get the scaled width and height of the imagen.
        let scaledWidth = (this.ruedaImagen.width * this.scalaFactor);
        let scaledHeight = (this.ruedaImagen.height * this.scalaFactor);

        // Work out the correct X and Y to draw the imagen at. We need to get the center point of the imagen
        // aligned over the center point of the wheel, we can't just place it at 0, 0.
        let imageLeft = (centroX - (scaledWidth / 2));
        let imageTop  = (centroY - (scaledHeight / 2));

        // Rotate and then draw the wheel.
        // We must rotate by the rotacionAngulo before drawing to ensure that imagen wheels will spin.
        this.xtc.save();
        this.xtc.translate(centroX, centroY);
        this.xtc.rotate(this.degToRad(this.rotacionAngulo));
        this.xtc.translate(-centroX, -centroY);

        // Draw the imagen passing the scaled width and height which will ensure the imagen will be responsivo.
        this.xtc.drawImage(this.ruedaImagen, imageLeft, imageTop, scaledWidth, scaledHeight);

        this.xtc.restore();
    }
}

// ====================================================================================================================
// This function draws the wheel on the canvas1 by rendering the imagen for each segment.
// ====================================================================================================================
Ruleta.prototype.drawSegmentImages = function()
{
    // Again check have context in case this function was called directly and not via draw function.
    if (this.xtc) {
        // Get the centroX and centroY of the wheel adjusted with the scale factor.
        let centroX = (this.centroX * this.scalaFactor);
        let centroY = (this.centroY * this.scalaFactor);

        // Draw the segmentos if there is at least one in the segmentos array.
        if (this.segmentos) {
            // Loop though and output all segmentos - position 0 of the array is not used, so start loop from index 1
            // this is to avoid confusion when talking about the first segment.
            for (let x = 1; x <= this.numSegmentos; x ++) {
                // Get the segment object as we need it to read opciones from.
                let seg = this.segmentos[x];

                // Check imagen has loaded so a property such as height has a value.
                if (seg.imgData.height) {
                    // Work out the correct X and Y to draw the imagen at which depends on the direction of the imagen.
                    // Images can be created in 4 directions. North, South, East, West.
                    // North: Outside at top, inside at bottom. Sits evenly over the 0 degrees angle.
                    // South: Outside at bottom, inside at top. Sits evenly over the 180 degrees angle.
                    // East: Outside at right, inside at left. Sits evenly over the 90 degrees angle.
                    // West: Outside at left, inside at right. Sits evenly over the 270 degrees angle.
                    let imageLeft = 0;
                    let imageTop = 0;
                    let imageAngle = 0;
                    let imagenDireccion = '';

                    // Get scaled width and height of the segment imagen.
                    let scaledWidth = (seg.imgData.width * this.scalaFactor);
                    let scaledHeight = (seg.imgData.height * this.scalaFactor);

                    if (seg.imagenDireccion !== null) {
                        imagenDireccion = seg.imagenDireccion;
                    } else {
                        imagenDireccion = this.imagenDireccion;
                    }

                    if (imagenDireccion == 'S') {
                        // Left set so imagen sits half/half over the 180 degrees point.
                        imageLeft = (centroX - (scaledWidth / 2));

                        // Top so imagen starts at the centroY.
                        imageTop = centroY;

                        // Angle to draw the imagen is its starting angle + half its size.
                        // Here we add 180 to the angle to the segment is poistioned correctly.
                        imageAngle = (seg.startAngle + 180 + ((seg.endAngle - seg.startAngle) / 2));
                    } else if (imagenDireccion == 'E') {
                        // Left set so imagen starts and the center point.
                        imageLeft = centroX;

                        // Top is so that it sits half/half over the 90 degree point.
                        imageTop = (centroY - (scaledHeight / 2));

                        // Again get the angle in the center of the segment and add it to the rotation angle.
                        // this time we need to add 270 to that to the segment is rendered the correct place.
                        imageAngle = (seg.startAngle + 270 + ((seg.endAngle - seg.startAngle) / 2));
                    } else if (imagenDireccion == 'W') {
                        // Left is the centroX minus the width of the imagen.
                        imageLeft = (centroX - scaledWidth);

                        // Top is so that it sits half/half over the 270 degree point.
                        imageTop = (centroY - (scaledHeight / 2));

                        // Again get the angle in the center of the segment and add it to the rotation angle.
                        // this time we need to add 90 to that to the segment is rendered the correct place.
                        imageAngle = (seg.startAngle + 90 + ((seg.endAngle - seg.startAngle) / 2));
                    } else {
                        // North is the default.
                        // Left set so imagen sits half/half over the 0 degrees point.
                        imageLeft = (centroX - (scaledWidth / 2));

                        // Top so imagen is its height out (above) the center point.
                        imageTop = (centroY - scaledHeight);

                        // Angle to draw the imagen is its starting angle + half its size.
                        // this sits it half/half over the center angle of the segment.
                        imageAngle = (seg.startAngle + ((seg.endAngle - seg.startAngle) / 2));
                    }

                    // --------------------------------------------------
                    // Rotate to the position of the segment and then draw the imagen.
                    this.xtc.save();
                    this.xtc.translate(centroX, centroY);

                    // So math here is the rotation angle of the wheel plus half way between the start and end angle of the segment.
                    this.xtc.rotate(this.degToRad(this.rotacionAngulo + imageAngle));
                    this.xtc.translate(-centroX, -centroY);

                    // Draw the imagen passing the scaled width and height so that it can be responsivo.
                    this.xtc.drawImage(seg.imgData, imageLeft, imageTop, scaledWidth, scaledHeight);

                    this.xtc.restore();
                } else {
                    console.log('Segment ' + x + ' imgData is not loaded');
                }
            }
        }
    }
}

// ====================================================================================================================
// This function draws the wheel on the page by rendering the segmentos on the canvas1.
// ====================================================================================================================
Ruleta.prototype.drawSegments = function()
{
    // Again check have context in case this function was called directly and not via draw function.
    if (this.xtc) {
        // Draw the segmentos if there is at least one in the segmentos array.
        if (this.segmentos) {
            // Get scaled centroX and centroY and also scaled inner and outer radius.
            let centroX = (this.centroX * this.scalaFactor);
            let centroY = (this.centroY * this.scalaFactor);
            let internoRadio = (this.internoRadio * this.scalaFactor);
            let externoRadio = (this.externoRadio * this.scalaFactor);

            // Loop though and output all segmentos - position 0 of the array is not used, so start loop from index 1
            // this is to avoid confusion when talking about the first segment.
            for (let x = 1; x <= this.numSegmentos; x ++) {
                // Get the segment object as we need it to read opciones from.
                let seg = this.segmentos[x];

                let rellenoStyle;
                let lineaAncho;
                let golpeStyle;

                // Set the variables that defined in the segment, or use the default opciones.
                if (seg.rellenoStyle !== null) {
                    rellenoStyle = seg.rellenoStyle;
                } else {
                    rellenoStyle = this.rellenoStyle;
                }

                this.xtc.rellenoStyle = rellenoStyle;

                if (seg.lineaAncho !== null) {
                    lineaAncho = seg.lineaAncho;
                } else {
                    lineaAncho = this.lineaAncho;
                }

                this.xtc.lineaAncho = lineaAncho;

                if (seg.golpeStyle !== null) {
                    golpeStyle = seg.golpeStyle;
                } else {
                    golpeStyle = this.golpeStyle;
                }

                this.xtc.golpeStyle = golpeStyle;


                // Check there is a golpeStyle or rellenoStyle, if not the segment is invisible so should not try to draw it otherwise a path is began but not ended.
                if ((golpeStyle) || (rellenoStyle)) {
                    // Begin a path as the segment consists of an arc and 2 lines.
                    this.xtc.beginPath();

                    // If don't have an inner radius then move to the center of the wheel as we want a line out from the center
                    // to the start of the arc for the outside of the wheel when we arc. Canvas will draw the connecting line for us.
                    if (!this.internoRadio) {
                        this.xtc.moveTo(centroX, centroY);
                    } else {
                        // Work out the x and y values for the starting point of the segment which is at its starting angle
                        // but out from the center point of the wheel by the value of the internoRadio. Some correction for line width is needed.
                        let iX = Math.cos(this.degToRad(seg.startAngle + this.rotacionAngulo - 90)) * (internoRadio - lineaAncho / 2);
                        let iY = Math.sin(this.degToRad(seg.startAngle + this.rotacionAngulo - 90)) * (internoRadio - lineaAncho / 2);

                        // Now move here relative to the center point of the wheel.
                        this.xtc.moveTo(centroX + iX, centroY + iY);
                    }

                    // Draw the outer arc of the segment clockwise in direction -->
                    this.xtc.arc(centroX, centroY, externoRadio, this.degToRad(seg.startAngle + this.rotacionAngulo - 90), this.degToRad(seg.endAngle + this.rotacionAngulo - 90), false);

                    if (this.internoRadio) {
                        // Draw another arc, this time anticlockwise <-- at the internoRadio between the end angle and the start angle.
                        // Canvas will draw a connecting line from the end of the outer arc to the beginning of the inner arc completing the shape.
                        this.xtc.arc(centroX, centroY, internoRadio, this.degToRad(seg.endAngle + this.rotacionAngulo - 90), this.degToRad(seg.startAngle + this.rotacionAngulo - 90), true);
                    } else {
                        // If no inner radius then we draw a line back to the center of the wheel.
                        this.xtc.lineTo(centroX, centroY);
                    }

                    // Fill and stroke the segment. Only do either if a style was specified, if the style is null then
                    // we assume the developer did not want that particular thing.
                    // For example no stroke style so no lines to be drawn.
                    if (rellenoStyle) {
                        this.xtc.fill();
                    }

                    if (golpeStyle) {
                        this.xtc.stroke();
                    }
                }
            }
        }
    }
}

// ====================================================================================================================
// This draws the text on the segmentos using the specified text opciones.
// ====================================================================================================================
Ruleta.prototype.dibujarSegmentoTexto = function()
{
    // Again only draw the text if have a canvas1 context.
    if (this.xtc) {
        // Declare variables to hold the values. These are populated either with the value for the specific segment,
        // or if not specified then the global default value.
        let fontFamily;
        let fontSize;
        let fontWeight;
        let orientation;
        let alignment;
        let direction;
        let margin;
        let rellenoStyle;
        let golpeStyle;
        let lineaAncho;
        let fontSetting;

        // Get the centroX and centroY scaled with the scale factor, also the same for outer and inner radius.
        let centroX = (this.centroX * this.scalaFactor);
        let centroY = (this.centroY * this.scalaFactor);
        let externoRadio = (this.externoRadio * this.scalaFactor);
        let internoRadio = (this.internoRadio * this.scalaFactor);

        // Loop though all the segmentos.
        for (let x = 1; x <= this.numSegmentos; x ++) {
            // Save the context so it is certain that each segment text option will not affect the other.
            this.xtc.save();

            // Get the segment object as we need it to read opciones from.
            let seg = this.segmentos[x];

            // Check is text as no point trying to draw if there is no text to render.
            if (seg.text) {
                // Set values to those for the specific segment or use global default if null.
                if (seg.textoFuenteFamilia  !== null)   fontFamily  = seg.textoFuenteFamilia;  else fontFamily  = this.textoFuenteFamilia;
                if (seg.textoFuenteTamano    !== null)   fontSize    = seg.textoFuenteTamano;    else fontSize    = this.textoFuenteTamano;
                if (seg.textoFuenteAncho  !== null)   fontWeight  = seg.textoFuenteAncho;  else fontWeight  = this.textoFuenteAncho;
                if (seg.textoOrientacion !== null)   orientation = seg.textoOrientacion; else orientation = this.textoOrientacion;
                if (seg.textoAlineacion   !== null)   alignment   = seg.textoAlineacion;   else alignment   = this.textoAlineacion;
                if (seg.textoDireccion   !== null)   direction   = seg.textoDireccion;   else direction   = this.textoDireccion;
                if (seg.textoMargen      !== null)   margin      = seg.textoMargen;      else margin      = this.textoMargen;
                if (seg.textoRellenoStyle   !== null)   rellenoStyle   = seg.textoRellenoStyle;   else rellenoStyle   = this.textoRellenoStyle;
                if (seg.textoGolpeStyle !== null)   golpeStyle = seg.textoGolpeStyle; else golpeStyle = this.textoGolpeStyle;
                if (seg.textoLineaAncho   !== null)   lineaAncho   = seg.textoLineaAncho;   else lineaAncho   = this.textoLineaAncho;

                // Scale the font size and the margin by the scale factor so the text can be responsivo.
                fontSize = (fontSize * this.scalaFactor);
                margin = (margin * this.scalaFactor);

                // ------------------------------
                // We need to put the font bits together in to one string.
                let fontSetting = '';

                if (fontWeight != null) {
                    fontSetting += fontWeight + ' ';
                }

                if (fontSize != null) {
                    fontSetting += fontSize + 'px ';    // Fonts on canvas1 are always a px value.
                }

                if (fontFamily != null) {
                    fontSetting += fontFamily;
                }

                // Now set the canvas1 context to the decided values.
                this.xtc.font        = fontSetting;
                this.xtc.rellenoStyle   = rellenoStyle;
                this.xtc.golpeStyle = golpeStyle;
                this.xtc.lineaAncho   = lineaAncho;

                // Split the text in to multiple lines on the \n character.
                let lines = seg.text.split('\n');

                // Figure out the starting offset for the lines as when there are multiple lines need to center the text
                // vertically in the segment (when thinking of normal horozontal text).
                let lineOffset = 0 - (fontSize * (lines.length / 2)) + (fontSize / 2);

                // The offset works great for horozontal and vertial text, also centered curved. But when the text is curved
                // and the alignment is outer then the multiline text should not have some text outside the wheel. Same if inner curved.
                if ((orientation == 'curved') && ((alignment == 'inner') || (alignment == 'outer'))) {
                    lineOffset = 0;
                }

                for (let i = 0; i < lines.length; i ++) {
                    // If direction is reversed then do things differently than if normal (which is the default - see further down)
                    if (direction == 'reversed') {
                        // When drawing reversed or 'upside down' we need to do some trickery on our part.
                        // The canvas1 text rendering function still draws the text left to right and the correct way up,
                        // so we need to overcome this with rotating the opposite side of the wheel the correct way up then pulling the text
                        // through the center point to the correct segment it is supposed to be on.
                        if (orientation == 'horizontal') {
                            if (alignment == 'inner') {
                                this.xtc.textAlign = 'right';
                            } else if (alignment == 'outer') {
                                this.xtc.textAlign = 'left';
                            } else {
                                this.xtc.textAlign = 'center';
                            }

                            this.xtc.textBaseline = 'middle';

                            // Work out the angle to rotate the wheel, this is in the center of the segment but on the opposite side of the wheel which is why do -180.
                            let textAngle = this.degToRad((seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) + this.rotacionAngulo - 90) - 180);

                            this.xtc.save();
                            this.xtc.translate(centroX, centroY);
                            this.xtc.rotate(textAngle);
                            this.xtc.translate(-centroX, -centroY);

                            if (alignment == 'inner') {
                                // In reversed state the margin is subtracted from the innerX.
                                // When inner the inner radius also comes in to play.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX - internoRadio - margin, centroY + lineOffset);
                                }

                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX - internoRadio - margin, centroY + lineOffset);
                                }
                            } else if (alignment == 'outer') {
                                // In reversed state the position is the center minus the radius + the margin for outer aligned text.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX - externoRadio + margin, centroY + lineOffset);
                                }

                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX - externoRadio + margin, centroY + lineOffset);
                                }
                            } else {
                                // In reversed state the everything in minused.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX - internoRadio - ((externoRadio - internoRadio) / 2) - margin, centroY + lineOffset);
                                }

                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX - internoRadio - ((externoRadio - internoRadio) / 2) - margin, centroY + lineOffset);
                                }
                            }

                            this.xtc.restore();

                        } else if (orientation == 'vertical') {
                            // See normal code further down for comments on how it works, this is similar by plus/minus is reversed.
                            this.xtc.textAlign = 'center';

                            // In reversed mode this are reversed.
                            if (alignment == 'inner') {
                                this.xtc.textBaseline = 'top';
                            } else if (alignment == 'outer') {
                                this.xtc.textBaseline = 'bottom';
                            } else {
                                this.xtc.textBaseline = 'middle';
                            }

                            let textAngle = (seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) - 180);
                            textAngle += this.rotacionAngulo;

                            this.xtc.save();
                            this.xtc.translate(centroX, centroY);
                            this.xtc.rotate(this.degToRad(textAngle));
                            this.xtc.translate(-centroX, -centroY);

                            //++ @TODO double-check the default of 0 is correct.
                            let yPos = 0;
                            if (alignment == 'outer') {
                                yPos = (centroY + externoRadio - margin);
                            } else if (alignment == 'inner') {
                                yPos = (centroY + internoRadio + margin);
                            }

                            // I have found that the text looks best when a fraction of the font size is shaved off.
                            let yInc = (fontSize - (fontSize / 9));

                            // Loop though and output the characters.
                            if (alignment == 'outer') {
                                // In reversed mode outer means text in 6 o'clock segment sits at bottom of the wheel and we draw up.
                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            } else if (alignment == 'inner') {
                                // In reversed mode inner text is drawn from top of segment at 6 o'clock position to bottom of the wheel.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            } else if (alignment == 'center') {
                                // Again for reversed this is the opposite of before.
                                // If there is more than one character in the text then an adjustment to the position needs to be done.
                                // What we are aiming for is to position the center of the text at the center point between the inner and outer radius.
                                let centerAdjustment = 0;

                                if (lines[i].length > 1) {
                                    centerAdjustment = (yInc * (lines[i].length -1) / 2);
                                }

                                let yPos = (centroY + internoRadio + ((externoRadio - internoRadio) / 2)) + centerAdjustment + margin;

                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            }

                            this.xtc.restore();

                        } else if (orientation == 'curved') {
                            // There is no built in canvas1 function to draw text around an arc,
                            // so we need to do this ourselves.
                            let radius = 0;

                            // Set the alignment of the text - inner, outer, or center by calculating
                            // how far out from the center point of the wheel the text is drawn.
                            if (alignment == 'inner') {
                                // When alignment is inner the radius is the internoRadio plus any margin.
                                radius = internoRadio + margin;
                                this.xtc.textBaseline = 'top';
                            } else if (alignment == 'outer') {
                                // Outer it is the externoRadio minus any margin.
                                radius = externoRadio - margin;
                                this.xtc.textBaseline = 'bottom';

                                // We need to adjust the radius in this case to take in to multiline text.
                                // In this case the radius needs to be further out, not at the inner radius.
                                radius -= (fontSize * (lines.length - 1));
                            } else if (alignment == 'center') {
                                // When center we want the text halfway between the inner and outer radius.
                                radius = internoRadio + margin + ((externoRadio - internoRadio) / 2);
                                this.xtc.textBaseline = 'middle';
                            }

                            // Set the angle to increment by when looping though and outputting the characters in the text
                            // as we do this by rotating the wheel small amounts adding each character.
                            let anglePerChar = 0;
                            let drawAngle = 0;

                            // If more than one character in the text then...
                            if (lines[i].length > 1) {
                                // Text is drawn from the left.
                                this.xtc.textAlign = 'left';

                                // Work out how much angle the text rendering loop below needs to rotate by for each character to render them next to each other.
                                // I have discovered that 4 * the font size / 10 at 100px radius is the correct spacing for between the characters
                                // using a monospace font, non monospace may look a little odd as in there will appear to be extra spaces between chars.
                                anglePerChar = (4 * (fontSize / 10));

                                // Work out what percentage the radius the text will be drawn at is of 100px.
                                let radiusPercent = (100 / radius);

                                // Then use this to scale up or down the anglePerChar value.
                                // When the radius is less than 100px we need more angle between the letters, when radius is greater (so the text is further
                                // away from the center of the wheel) the angle needs to be less otherwise the characters will appear further apart.
                                anglePerChar = (anglePerChar * radiusPercent);

                                // Next we want the text to be drawn in the middle of the segment, without this it would start at the beginning of the segment.
                                // To do this we need to work out how much arc the text will take up in total then subtract half of this from the center
                                // of the segment so that it sits centred.
                                let totalArc = (anglePerChar * lines[i].length);

                                // Now set initial draw angle to half way between the start and end of the segment.
                                drawAngle = seg.startAngle + (((seg.endAngle - seg.startAngle) / 2) - (totalArc / 2));
                            } else {
                                // The initial draw angle is the center of the segment when only one character.
                                drawAngle = (seg.startAngle + ((seg.endAngle - seg.startAngle) / 2));

                                // To ensure is dead-center the text alignment also needs to be centered.
                                this.xtc.textAlign = 'center';
                            }

                            // ----------------------
                            // Adjust the initial draw angle as needed to take in to account the rotacionAngulo of the wheel.
                            drawAngle += this.rotacionAngulo;

                            // And as with other 'reverse' text direction functions we need to subtract 180 degrees from the angle
                            // because when it comes to draw the characters in the loop below we add the radius instead of subtract it.
                            drawAngle -= 180;

                            // ----------------------
                            // Now the drawing itself.
                            // In reversed direction mode we loop through the characters in the text backwards in order for them to appear on screen correctly
                            for (let c = lines[i].length; c >= 0; c--) {
                                this.xtc.save();

                                let character = lines[i].charAt(c);

                                // Rotate the wheel to the draw angle as we need to add the character at this location.
                                this.xtc.translate(centroX, centroY);
                                this.xtc.rotate(this.degToRad(drawAngle));
                                this.xtc.translate(-centroX, -centroY);

                                // Now draw the character directly below the center point of the wheel at the appropriate radius.
                                // Note in the reversed mode we add the radius to the this.centroY instead of subtract.
                                if (golpeStyle) {
                                    this.xtc.strokeText(character, centroX, centroY + radius + lineOffset);
                                }

                                if (rellenoStyle) {
                                    this.xtc.fillText(character, centroX, centroY + radius + lineOffset);
                                }

                                // Increment the drawAngle by the angle per character so next loop we rotate
                                // to the next angle required to draw the character at.
                                drawAngle += anglePerChar;

                                this.xtc.restore();
                            }
                        }
                    } else {
                        // Normal direction so do things normally.
                        // Check text orientation, of horizontal then reasonably straight forward, if vertical then a bit more work to do.
                        if (orientation == 'horizontal') {
                            // Based on the text alignment, set the correct value in the context.
                            if (alignment == 'inner') {
                                this.xtc.textAlign = 'left';
                            } else if (alignment == 'outer') {
                                this.xtc.textAlign = 'right';
                            } else {
                                this.xtc.textAlign = 'center';
                            }

                            // Set this too.
                            this.xtc.textBaseline = 'middle';

                            // Work out the angle around the wheel to draw the text at, which is simply in the middle of the segment the text is for.
                            // The rotation angle is added in to correct the annoyance with the canvas1 arc drawing functions which put the 0 degrees at the 3 oclock
                            let textAngle = this.degToRad(seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) + this.rotacionAngulo - 90);

                            // We need to rotate in order to draw the text because it is output horizontally, so to
                            // place correctly around the wheel for all but a segment at 3 o'clock we need to rotate.
                            this.xtc.save();
                            this.xtc.translate(centroX, centroY);
                            this.xtc.rotate(textAngle);
                            this.xtc.translate(-centroX, -centroY);

                            // --------------------------
                            // Draw the text based on its alignment adding margin if inner or outer.
                            if (alignment == 'inner') {
                                // Inner means that the text is aligned with the inner of the wheel. If looking at a segment in in the 3 o'clock position
                                // it would look like the text is left aligned within the segment.

                                // Because the segmentos are smaller towards the inner of the wheel, in order for the text to fit is is a good idea that
                                // a margin is added which pushes the text towards the outer a bit.

                                // The inner radius also needs to be taken in to account as when inner aligned.

                                // If fillstyle is set the draw the text filled in.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX + internoRadio + margin, centroY + lineOffset);
                                }

                                // If stroke style is set draw the text outline.
                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX + internoRadio + margin, centroY + lineOffset);
                                }
                            } else if (alignment == 'outer') {
                                // Outer means the text is aligned with the outside of the wheel, so if looking at a segment in the 3 o'clock position
                                // it would appear the text is right aligned. To position we add the radius of the wheel in to the equation
                                // and subtract the margin this time, rather than add it.

                                // I don't understand why, but in order of the text to render correctly with stroke and fill, the stroke needs to
                                // come first when drawing outer, rather than second when doing inner.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX + externoRadio - margin, centroY + lineOffset);
                                }

                                // If fillstyle the fill the text.
                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX + externoRadio - margin, centroY + lineOffset);
                                }
                            } else {
                                // In this case the text is to drawn centred in the segment.
                                // Typically no margin is required, however even though centred the text can look closer to the inner of the wheel
                                // due to the way the segmentos narrow in (is optical effect), so if a margin is specified it is placed on the inner
                                // side so the text is pushed towards the outer.

                                // If stoke style the stroke the text.
                                if (rellenoStyle) {
                                    this.xtc.fillText(lines[i], centroX + internoRadio + ((externoRadio - internoRadio) / 2) + margin, centroY + lineOffset);
                                }

                                // If fillstyle the fill the text.
                                if (golpeStyle) {
                                    this.xtc.strokeText(lines[i], centroX + internoRadio + ((externoRadio - internoRadio) / 2) + margin, centroY + lineOffset);
                                }
                            }

                            // Restore the context so that wheel is returned to original position.
                            this.xtc.restore();

                        } else if (orientation == 'vertical') {
                            // If vertical then we need to do this ourselves because as far as I am aware there is no option built in to html canvas1
                            // which causes the text to draw downwards or upwards one character after another.

                            // In this case the textAlign is always center, but the baseline is either top or bottom
                            // depending on if inner or outer alignment has been specified.
                            this.xtc.textAlign = 'center';

                            if (alignment == 'inner') {
                                this.xtc.textBaseline = 'bottom';
                            } else if (alignment == 'outer') {
                                this.xtc.textBaseline = 'top';
                            } else {
                                this.xtc.textBaseline = 'middle';
                            }

                            // The angle to draw the text at is halfway between the end and the starting angle of the segment.
                            let textAngle = seg.endAngle - ((seg.endAngle - seg.startAngle) / 2);

                            // Ensure the rotation angle of the wheel is added in, otherwise the test placement won't match
                            // the segmentos they are supposed to be for.
                            textAngle += this.rotacionAngulo;

                            // Rotate so can begin to place the text.
                            this.xtc.save();
                            this.xtc.translate(centroX, centroY);
                            this.xtc.rotate(this.degToRad(textAngle));
                            this.xtc.translate(-centroX, -centroY);

                            // Work out the position to start drawing in based on the alignment.
                            // If outer then when considering a segment at the 12 o'clock position want to start drawing down from the top of the wheel.
                            //++ TODO check this as yPos did not seem to have a defualt before.
                            let yPos = 0;

                            if (alignment == 'outer') {
                                yPos = (centroY - externoRadio + margin);
                            } else if (alignment == 'inner') {
                                yPos = (centroY - internoRadio - margin);
                            }

                            // We need to know how much to move the y axis each time.
                            // This is not quite simply the font size as that puts a larger gap in between the letters
                            // than expected, especially with monospace fonts. I found that shaving a little off makes it look "right".
                            let yInc = (fontSize - (fontSize / 9));

                            // Loop though and output the characters.
                            if (alignment == 'outer') {
                                // For this alignment we draw down from the top of a segment at the 12 o'clock position to simply
                                // loop though the characters in order.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            } else if (alignment == 'inner') {
                                // Here we draw from the inner of the wheel up, but in order for the letters in the text text to
                                // remain in the correct order when reading, we actually need to loop though the text characters backwards.
                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            } else if (alignment == 'center') {
                                // This is the most complex of the three as we need to draw the text top down centred between the inner and outer of the wheel.
                                // So logically we have to put the middle character of the text in the center then put the others each side of it.
                                // In reality that is a really bad way to do it, we can achieve the same if not better positioning using a
                                // variation on the method used for the rendering of outer aligned text once we have figured out the height of the text.

                                // If there is more than one character in the text then an adjustment to the position needs to be done.
                                // What we are aiming for is to position the center of the text at the center point between the inner and outer radius.
                                let centerAdjustment = 0;

                                if (lines[i].length > 1) {
                                    centerAdjustment = (yInc * (lines[i].length -1) / 2);
                                }

                                // Now work out where to start rendering the string. This is half way between the inner and outer of the wheel, with the
                                // centerAdjustment included to correctly position texts with more than one character over the center.
                                // If there is a margin it is used to push the text away from the center of the wheel.
                                let yPos = (centroY - internoRadio - ((externoRadio - internoRadio) / 2)) - centerAdjustment - margin;

                                // Now loop and draw just like outer text rendering.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (rellenoStyle) {
                                        this.xtc.fillText(character, centroX + lineOffset, yPos);
                                    }

                                    if (golpeStyle) {
                                        this.xtc.strokeText(character, centroX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            }

                            this.xtc.restore();

                        } else if (orientation == 'curved') {
                            // There is no built in canvas1 function to draw text around an arc, so
                            // we need to do this ourselves.
                            let radius = 0;

                            // Set the alignment of the text - inner, outer, or center by calculating
                            // how far out from the center point of the wheel the text is drawn.
                            if (alignment == 'inner') {
                                // When alignment is inner the radius is the internoRadio plus any margin.
                                radius = internoRadio + margin;
                                this.xtc.textBaseline = 'bottom';

                                // We need to adjust the radius in this case to take in to multiline text.
                                // In this case the radius needs to be further out, not at the inner radius.
                                radius += (fontSize * (lines.length - 1));
                            } else if (alignment == 'outer') {
                                // Outer it is the externoRadio minus any margin.
                                radius = externoRadio - margin;
                                this.xtc.textBaseline = 'top';
                            } else if (alignment == 'center') {
                                // When center we want the text halfway between the inner and outer radius.
                                radius = internoRadio + margin + ((externoRadio - internoRadio) / 2);
                                this.xtc.textBaseline = 'middle';
                            }

                            // Set the angle to increment by when looping though and outputting the characters in the text
                            // as we do this by rotating the wheel small amounts adding each character.
                            let anglePerChar = 0;
                            let drawAngle = 0;

                            // If more than one character in the text then...
                            if (lines[i].length > 1) {
                                // Text is drawn from the left.
                                this.xtc.textAlign = 'left';

                                // Work out how much angle the text rendering loop below needs to rotate by for each character to render them next to each other.
                                // I have discovered that 4 * the font size / 10 at 100px radius is the correct spacing for between the characters
                                // using a monospace font, non monospace may look a little odd as in there will appear to be extra spaces between chars.
                                anglePerChar = (4 * (fontSize / 10));

                                // Work out what percentage the radius the text will be drawn at is of 100px.
                                let radiusPercent = (100 / radius);

                                // Then use this to scale up or down the anglePerChar value.
                                // When the radius is less than 100px we need more angle between the letters, when radius is greater (so the text is further
                                // away from the center of the wheel) the angle needs to be less otherwise the characters will appear further apart.
                                anglePerChar = (anglePerChar * radiusPercent);

                                // Next we want the text to be drawn in the middle of the segment, without this it would start at the beginning of the segment.
                                // To do this we need to work out how much arc the text will take up in total then subtract half of this from the center
                                // of the segment so that it sits centred.
                                let totalArc = (anglePerChar * lines[i].length);

                                // Now set initial draw angle to half way between the start and end of the segment.
                                drawAngle = seg.startAngle + (((seg.endAngle - seg.startAngle) / 2) - (totalArc / 2));
                            } else {
                                // The initial draw angle is the center of the segment when only one character.
                                drawAngle = (seg.startAngle + ((seg.endAngle - seg.startAngle) / 2));

                                // To ensure is dead-center the text alignment also needs to be centred.
                                this.xtc.textAlign = 'center';
                            }

                            // ----------------------
                            // Adjust the initial draw angle as needed to take in to account the rotacionAngulo of the wheel.
                            drawAngle += this.rotacionAngulo;

                            // ----------------------
                            // Now the drawing itself.
                            // Loop for each character in the text.
                            for (let c = 0; c < (lines[i].length); c++) {
                                this.xtc.save();

                                let character = lines[i].charAt(c);

                                // Rotate the wheel to the draw angle as we need to add the character at this location.
                                this.xtc.translate(centroX, centroY);
                                this.xtc.rotate(this.degToRad(drawAngle));
                                this.xtc.translate(-centroX, -centroY);

                                // Now draw the character directly above the center point of the wheel at the appropriate radius.
                                if (golpeStyle) {
                                    this.xtc.strokeText(character, centroX, centroY - radius + lineOffset);
                                }

                                if (rellenoStyle) {
                                    this.xtc.fillText(character, centroX, centroY - radius + lineOffset);
                                }

                                // Increment the drawAngle by the angle per character so next loop we rotate
                                // to the next angle required to draw the character at.
                                drawAngle += anglePerChar;

                                this.xtc.restore();
                            }
                        }
                    }

                    // Increment this ready for the next time.
                    lineOffset += fontSize;
                }
            }

            // Restore so all text opciones are reset ready for the next text.
            this.xtc.restore();
        }
    }
}

// ====================================================================================================================
// Converts degrees to radians which is what is used when specifying the angles on HTML5 canvas1 arcs.
// ====================================================================================================================
Ruleta.prototype.degToRad = function(d)
{
    return d * 0.0174532925199432957;
}

// ====================================================================================================================
// This function sets the center location of the wheel, saves a function call to set x then y.
// ====================================================================================================================
Ruleta.prototype.setCenter = function(x, y)
{
    this.centroX = x;
    this.centroY = y;
}

// ====================================================================================================================
// This function allows a segment to be added to the wheel. The position of the segment is optional,
// if not specified the new segment will be added to the end of the wheel.
// ====================================================================================================================
Ruleta.prototype.addSegment = function(opciones, position)
{
    // Create a new segment object passing the opciones in.
    let newSegment = new Segment(opciones);

    // Increment the numSegmentos property of the class since new segment being added.
    this.numSegmentos ++;
    let segmentPos;

    // Work out where to place the segment, the default is simply as a new segment at the end of the wheel.
    if (typeof position !== 'undefined') {
        // Because we need to insert the segment at this position, not overwrite it, we need to move all segmentos after this
        // location along one in the segmentos array, before finally adding this new segment at the specified location.
        for (let x = this.numSegmentos; x > position; x --) {
            this.segmentos[x] = this.segmentos[x -1];
        }

        this.segmentos[position] = newSegment;
        segmentPos = position;
    } else {
        this.segmentos[this.numSegmentos] = newSegment;
        segmentPos = this.numSegmentos;
    }

    // Since a segment has been added the segment sizes need to be re-computed so call function to do this.
    this.actualizarSegmentosTamano();

    // Return the segment object just created in the wheel (JavaScript will return it by reference), so that
    // further things can be done with it by the calling code if desired.
    return this.segmentos[segmentPos];
}

// ====================================================================================================================
// This function must be used if the canvasId is changed as we also need to get the context of the new canvas1.
// ====================================================================================================================
Ruleta.prototype.setCanvasCc = function(canvasCc)
{
    if (canvasCc) {
        this.canvasCc = canvasCc;
        this.canvas1 = document.getElementById(this.canvasCc);

        if (this.canvas1) {
            this.xtc = this.canvas1.getContext('2d');
        }
    } else {
        this.canvasCc = null
        this.xtc = null;
        this.canvas1 = null;
    }
}

// ====================================================================================================================
// This function deletes the specified segment from the wheel by removing it from the segmentos array.
// It then sorts out the other bits such as update of the numSegmentos.
// ====================================================================================================================
Ruleta.prototype.deleteSegment = function(position)
{
    // There needs to be at least one segment in order for the wheel to draw, so only allow delete if there
    // is more than one segment currently left in the wheel.

    //++ check that specifying a position that does not exist - say 10 in a 6 segment wheel does not cause issues.
    if (this.numSegmentos > 1) {
        // If the position of the segment to remove has been specified.
        if (typeof position !== 'undefined') {
            // The array is to be shortened so we need to move all segmentos after the one
            // to be removed down one so there is no gap.
            for (let x = position; x < this.numSegmentos; x ++) {
                this.segmentos[x] = this.segmentos[x + 1];
            }
        }

        // Unset the last item in the segmentos array since there is now one less.
        this.segmentos[this.numSegmentos] = undefined;

        // Decrement the number of segmentos,
        // then call function to update the segment sizes.
        this.numSegmentos --;
        this.actualizarSegmentosTamano();
    }
}

// ====================================================================================================================
// This function takes the x an the y of a mouse event, such as click or move, and converts the x and the y in to
// co-ordinates on the canvas1 as the raw values are the x and the y from the top and left of the user's browser.
// ====================================================================================================================
Ruleta.prototype.windowToCanvas = function(x, y)
{
    let bbox = this.canvas1.getBoundingClientRect();

    return {
        x: Math.floor(x - bbox.left * (this.canvas1.width / bbox.width)),
        y: Math.floor(y - bbox.top *  (this.canvas1.height / bbox.height))
    };
}

// ====================================================================================================================
// This function returns the segment object located at the specified x and y coordinates on the canvas1.
// It is used to allow things to be done with a segment clicked by the user, such as highlight, display or change some values, etc.
// ====================================================================================================================
Ruleta.prototype.getSegmentAt = function(x, y)
{
    let foundSegment = null;

    // Call function to return segment number.
    let segmentNumber = this.getSegmentNumberAt(x, y);

    // If found one then set found segment to pointer to the segment object.
    if (segmentNumber !== null) {
        foundSegment = this.segmentos[segmentNumber];
    }

    return foundSegment;
}

// ====================================================================================================================
// Returns the number of the segment clicked instead of the segment object.
// This does not work correctly if the canvas1 width or height is altered by CSS but does work correctly with the scale factor.
// ====================================================================================================================
Ruleta.prototype.getSegmentNumberAt = function(x, y)
{
    // Call function above to convert the raw x and y from the user's browser to canvas1 coordinates
    // i.e. top and left is top and left of canvas1, not top and left of the user's browser.
    let loc = this.windowToCanvas(x, y);

    // ------------------------------------------
    // Now start the process of working out the segment clicked.
    // First we need to figure out the angle of an imaginary line between the centroX and centroY of the wheel and
    // the X and Y of the location (for example a mouse click).
    let topBottom;
    let leftRight;
    let adjacentSideLength;
    let oppositeSideLength;
    let hypotenuseSideLength;

    // Get the centroX and centroY scaled with the scale factor, also the same for outer and inner radius.
    let centroX = (this.centroX * this.scalaFactor);
    let centroY = (this.centroY * this.scalaFactor);
    let externoRadio = (this.externoRadio * this.scalaFactor);
    let internoRadio = (this.internoRadio * this.scalaFactor);

    // We will use right triangle maths with the TAN function.
    // The start of the triangle is the wheel center, the adjacent side is along the x axis, and the opposite side is along the y axis.

    // We only ever use positive numbers to work out the triangle and the center of the wheel needs to be considered as 0 for the numbers
    // in the maths which is why there is the subtractions below. We also remember what quadrant of the wheel the location is in as we
    // need this information later to add 90, 180, 270 degrees to the angle worked out from the triangle to get the position around a 360 degree wheel.
    if (loc.x > centroX) {
        adjacentSideLength = (loc.x - centroX);
        leftRight = 'R';    // Location is in the right half of the wheel.
    } else {
        adjacentSideLength = (centroX - loc.x);
        leftRight = 'L';    // Location is in the left half of the wheel.
    }

    if (loc.y > centroY) {
        oppositeSideLength = (loc.y - centroY);
        topBottom = 'B';    // Bottom half of wheel.
    } else {
        oppositeSideLength = (centroY - loc.y);
        topBottom = 'T';    // Top Half of wheel.
    }

    // Now divide opposite by adjacent to get tan value.
    let tanVal = oppositeSideLength / adjacentSideLength;

    // Use the tan function and convert results to degrees since that is what we work with.
    let result = (Math.atan(tanVal) * 180/Math.PI);
    let locationAngle = 0;

    // We also need the length of the hypotenuse as later on we need to compare this to the externoRadio of the segment / circle.
    hypotenuseSideLength = Math.sqrt((oppositeSideLength * oppositeSideLength) + (adjacentSideLength * adjacentSideLength));

    // ------------------------------------------
    // Now to make sense around the wheel we need to alter the values based on if the location was in top or bottom half
    // and also right or left half of the wheel, by adding 90, 180, 270 etc. Also for some the initial locationAngle needs to be inverted.
    if ((topBottom == 'T') && (leftRight == 'R')) {
        locationAngle = Math.round(90 - result);
    } else if ((topBottom == 'B') && (leftRight == 'R')) {
        locationAngle = Math.round(result + 90);
    } else if ((topBottom == 'B') && (leftRight == 'L')) {
        locationAngle = Math.round((90 - result) + 180);
    } else if ((topBottom == 'T') && (leftRight == 'L')) {
        locationAngle = Math.round(result + 270);
    }

    // ------------------------------------------
    // And now we have to adjust to make sense when the wheel is rotated from the 0 degrees either
    // positive or negative and it can be many times past 360 degrees.
    if (this.rotacionAngulo != 0) {
        let rotatedPosition = this.getRotationPosition();

        // So we have this, now we need to alter the locationAngle as a result of this.
        locationAngle = (locationAngle - rotatedPosition);

        // If negative then take the location away from 360.
        if (locationAngle < 0) {
            locationAngle = (360 - Math.abs(locationAngle));
        }
    }

    // ------------------------------------------
    // OK, so after all of that we have the angle of a line between the centroX and centroY of the wheel and
    // the X and Y of the location on the canvas1 where the mouse was clicked. Now time to work out the segment
    // this corresponds to. We can use the segment start and end angles for this.
    let foundSegmentNumber = null;

    for (let x = 1; x <= this.numSegmentos; x ++) {
        // Due to segmentos sharing start and end angles, if line is clicked will pick earlier segment.
        if ((locationAngle >= this.segmentos[x].startAngle) && (locationAngle <= this.segmentos[x].endAngle)) {
            // To ensure that a click anywhere on the canvas1 in the segment direction will not cause a
            // segment to be matched, as well as the angles, we need to ensure the click was within the radius
            // of the segment (or circle if no segment radius).

            // If the hypotenuseSideLength (length of location from the center of the wheel) is with the radius
            // then we can assign the segment to the found segment and break out the loop.

            // Have to take in to account hollow wheels (doughnuts) so check is greater than internoRadio as
            // well as less than or equal to the externoRadio of the wheel.
            if ((hypotenuseSideLength >= internoRadio) && (hypotenuseSideLength <= externoRadio)) {
                foundSegmentNumber = x;
                break;
            }
        }
    }

    // Finally return the number.
    return foundSegmentNumber;
}

// ====================================================================================================================
// Returns a reference to the segment that is at the location of the pointer on the wheel.
// ====================================================================================================================
Ruleta.prototype.getIndicatedSegment = function()
{
    // Call function below to work this out and return the prizeNumber.
    let prizeNumber = this.getIndicatedSegmentNumber();

    // Then simply return the segment in the segmentos array at that position.
    return this.segmentos[prizeNumber];
}

// ====================================================================================================================
// Works out the segment currently pointed to by the pointer of the wheel. Normally called when the spinning has stopped
// to work out the prize the user has won. Returns the number of the segment in the segmentos array.
// ====================================================================================================================
Ruleta.prototype.getIndicatedSegmentNumber = function()
{
    let indicatedPrize = 0;
    let rawAngle = this.getRotationPosition();

    // Now we have the angle of the wheel, but we need to take in to account where the pointer is because
    // will not always be at the 12 o'clock 0 degrees location.
    let relativeAngle = Math.floor(this.punteroAngulo - rawAngle);

    if (relativeAngle < 0) {
        relativeAngle = 360 - Math.abs(relativeAngle);
    }

    // Now we can work out the prize won by seeing what prize segment startAngle and endAngle the relativeAngle is between.
    for (let x = 1; x < (this.segmentos.length); x ++) {
        if ((relativeAngle >= this.segmentos[x]['startAngle']) && (relativeAngle <= this.segmentos[x]['endAngle'])) {
            indicatedPrize = x;
            break;
        }
    }

    return indicatedPrize;
}

// ====================================================================================================================
// Works out what Pin around the wheel is considered the current one which is the one which just passed the pointer.
// Used to work out if the pin has changed during the animacion to tigger a sound.
// ====================================================================================================================
Ruleta.prototype.getCurrentPinNumber = function()
{
    let currentPin = 0;

    if (this.pines) {
        let rawAngle = this.getRotationPosition();

        // Now we have the angle of the wheel, but we need to take in to account where the pointer is because
        // will not always be at the 12 o'clock 0 degrees location.
        let relativeAngle = Math.floor(this.punteroAngulo - rawAngle);

        if (relativeAngle < 0) {
            relativeAngle = 360 - Math.abs(relativeAngle);
        }

        // Work out the angle of the pines as this is simply 360 / the number of pines as they space evenly around.
        let pinSpacing = (360 / this.pines.number);
        let totalPinAngle = 0;

        // Now we can work out the pin by seeing what pines relativeAngle is between.
        for (let x = 0; x < (this.pines.number); x ++) {
            if ((relativeAngle >= totalPinAngle) && (relativeAngle <= (totalPinAngle + pinSpacing))) {
                currentPin = x;
                break;
            }

            totalPinAngle += pinSpacing;
        }

        // Now if rotating clockwise we must add 1 to the current pin as we want the pin which has just passed
        // the pointer to be returned as the current pin, not the start of the one we are between.
        if (this.animacion.direction == 'clockwise') {
            currentPin ++;

            if (currentPin > this.pines.number) {
                currentPin = 0;
            }
        }
    }

    return currentPin;
}

// ==================================================================================================================================================
// Returns the rotation angle of the wheel corrected to 0-360 (i.e. removes all the multiples of 360).
// ==================================================================================================================================================
Ruleta.prototype.getRotationPosition = function()
{
    let rawAngle = this.rotacionAngulo;  // Get current rotation angle of wheel.

    // If positive work out how many times past 360 this is and then take the floor of this off the rawAngle.
    if (rawAngle >= 0) {
        if (rawAngle > 360) {
            // Get floor of the number of times past 360 degrees.
            let timesPast360 = Math.floor(rawAngle / 360);

            // Take all this extra off to get just the angle 0-360 degrees.
            rawAngle = (rawAngle - (360 * timesPast360));
        }
    } else {
        // Is negative, need to take off the extra then convert in to 0-360 degree value
        // so if, for example, was -90 then final value will be (360 - 90) = 270 degrees.
        if (rawAngle < -360) {
            let timesPast360 = Math.ceil(rawAngle / 360);   // Ceil when negative.

            rawAngle = (rawAngle - (360 * timesPast360));   // Is minus because dealing with negative.
        }

        rawAngle = (360 + rawAngle);    // Make in the range 0-360. Is plus because raw is still negative.
    }

    return rawAngle;
}

// ==================================================================================================================================================
// This function starts the wheel's animacion by using the properties of the animacion object of of the wheel to begin the a greensock tween.
// ==================================================================================================================================================
Ruleta.prototype.iniciarAnimacion = function()
{
    if (this.animacion) {
        // Call function to compute the animacion properties.
        this.computoAnimacion();

        // Set this global variable to this object as an external function is required to call the draw() function on the wheel
        // each loop of the animacion as Greensock cannot call the draw function directly on this class.
        ruletaParaDibujarDuranteAnimacion = this;

        // Put together the properties of the greesock animacion.
        let properties = new Array(null);
        properties[this.animacion.propertyName] = this.animacion.propertyValue; // Here we set the property to be animated and its value.
        properties['yoyo']       = this.animacion.yoyo;     // Set others.
        properties['repeat']     = this.animacion.repeat;
        properties['ease']       = this.animacion.easing;
        properties['onUpdate']   = winwheelAnimationLoop;   // Call function to re-draw the canvas1.
        properties['onComplete'] = winwheelStopAnimation;   // Call function to perform actions when animacion has finished.

        // Do the tween animacion passing the properties from the animacion object as an array of llave => value pairs.
        // Keep reference to the tween object in the wheel as that allows pausing, resuming, and stopping while the animacion is still running.
        this.tween = TweenMax.to(this, this.animacion.duration, properties);
    }
}

// ==================================================================================================================================================
// Use same function which needs to be outside the class for the callback when it stops because is finished.
// ==================================================================================================================================================
Ruleta.prototype.detenerAnimacion = function(canCallback)
{
    // @TODO as part of multiwheel, need to work out how to stop the tween for a single wheel but allow others to continue.

    // We can kill the animacion using our tween object.
    if (ruletaParaDibujarDuranteAnimacion) {
        // If the wheel has a tween animacion then kill it.
        if (ruletaParaDibujarDuranteAnimacion.tween) {
            ruletaParaDibujarDuranteAnimacion.tween.kill();
        }

        // Call the callback function.
        winwheelStopAnimation(canCallback);
    }

    // Ensure the ruletaParaDibujarDuranteAnimacion is set to this class.
    ruletaParaDibujarDuranteAnimacion = this;
}

// ==================================================================================================================================================
// Pause animacion by telling tween to pause.
// ==================================================================================================================================================
Ruleta.prototype.pauseAnimation = function()
{
    if (this.tween) {
        this.tween.pause();
    }
}

// ==================================================================================================================================================
// Resume the animacion by telling tween to continue playing it.
// ==================================================================================================================================================
Ruleta.prototype.resumeAnimation = function()
{
    if (this.tween) {
        this.tween.play();
    }
}

// ====================================================================================================================
// Called at the beginning of the iniciarAnimacion function and computes the values needed to do the animacion
// before it starts. This allows the developer to change the animacion properties after the wheel has been created
// and have the animacion use the new values of the animacion properties.
// ====================================================================================================================
Ruleta.prototype.computoAnimacion = function()
{
    if (this.animacion) {
        // Set the animacion parameters for the specified animacion type including some sensible defaults if values have not been specified.
        if (this.animacion.type == 'spinOngoing') {
            // When spinning the rotacionAngulo is the wheel property which is animated.
            this.animacion.propertyName = 'rotacionAngulo';

            if (this.animacion.spins == null) {
                this.animacion.spins = 5;
            }

            if (this.animacion.repeat == null) {
                this.animacion.repeat = -1;           // -1 means it will repeat forever.
            }

            if (this.animacion.easing == null) {
                this.animacion.easing = 'Linear.easeNone';
            }

            if (this.animacion.yoyo == null) {
                this.animacion.yoyo = false;
            }

            // We need to calculate the propertyValue and this is the spins * 360 degrees.
            this.animacion.propertyValue = (this.animacion.spins * 360);

            // If the direction is anti-clockwise then make the property value negative.
            if (this.animacion.direction == 'anti-clockwise') {
                this.animacion.propertyValue = (0 - this.animacion.propertyValue);
            }
        } else if (this.animacion.type == 'spinToStop') {
            // Spin to stop the rotation angle is affected.
            this.animacion.propertyName = 'rotacionAngulo';

            if (this.animacion.spins == null) {
                this.animacion.spins = 5;
            }

            if (this.animacion.repeat == null) {
                this.animacion.repeat = 0;        // As this is spin to stop we don't normally want it repeated.
            }

            if (this.animacion.easing == null) {
                this.animacion.easing = 'Power3.easeOut';     // This easing is fast start and slows over time.
            }

            if (this.animacion.stopAngle == null) {
                // If the stop angle has not been specified then pick random between 0 and 359.
                this.animacion._stopAngle = Math.floor((Math.random() * 359));
            } else {
                // We need to set the internal to 360 minus what the user entered because the wheel spins past 0 without
                // this it would indicate the prize on the opposite side of the wheel. We aslo need to take in to account
                // the punteroAngulo as the stop angle needs to be relative to that.
                this.animacion._stopAngle = (360 - this.animacion.stopAngle + this.punteroAngulo);
            }

            if (this.animacion.yoyo == null) {
                this.animacion.yoyo = false;
            }

            // The property value is the spins * 360 then plus or minus the stopAngle depending on if the rotation is clockwise or anti-clockwise.
            this.animacion.propertyValue = (this.animacion.spins * 360);

            if (this.animacion.direction == 'anti-clockwise') {
                this.animacion.propertyValue = (0 - this.animacion.propertyValue);

                // Also if the value is anti-clockwise we need subtract the stopAngle (but to get the wheel to stop in the correct
                // place this is 360 minus the stop angle as the wheel is rotating backwards).
                this.animacion.propertyValue -= (360 - this.animacion._stopAngle);
            } else {
                // Add the stopAngle to the propertyValue as the wheel must rotate around to this place and stop there.
                this.animacion.propertyValue += this.animacion._stopAngle;
            }
        } else if (this.animacion.type == 'spinAndBack') {
            // This is basically is a spin for a number of times then the animacion reverses and goes back to start.
            // If a repeat is specified then this can be used to make the wheel "rock" left and right.

            // Again this is a spin so the rotacionAngulo the property which is animated.
            this.animacion.propertyName = 'rotacionAngulo';

            if (this.animacion.spins == null) {
                this.animacion.spins = 5;
            }

            if (this.animacion.repeat == null) {
                this.animacion.repeat = 1;          // This needs to be set to at least 1 in order for the animacion to reverse.
            }

            if (this.animacion.easing == null) {
                this.animacion.easing = 'Power2.easeInOut';     // This is slow at the start and end and fast in the middle.
            }

            if (this.animacion.yoyo == null) {
                this.animacion.yoyo = true;       // This needs to be set to true to have the animacion reverse back like a yo-yo.
            }

            if (this.animacion.stopAngle == null) {
                this.animacion._stopAngle = 0;
            } else {
                // We need to set the internal to 360 minus what the user entered
                // because the wheel spins past 0 without this it would indicate the
                // prize on the opposite side of the wheel.
                this.animacion._stopAngle = (360 - this.animacion.stopAngle);
            }

            // The property value is the spins * 360 then plus or minus the stopAngle depending on if the rotation is clockwise or anti-clockwise.
            this.animacion.propertyValue = (this.animacion.spins * 360);

            if (this.animacion.direction == 'anti-clockwise') {
                this.animacion.propertyValue = (0 - this.animacion.propertyValue);

                // Also if the value is anti-clockwise we need subtract the stopAngle (but to get the wheel to stop in the correct
                // place this is 360 minus the stop angle as the wheel is rotating backwards).
                this.animacion.propertyValue -= (360 - this.animacion._stopAngle);
            } else {
                // Add the stopAngle to the propertyValue as the wheel must rotate around to this place and stop there.
                this.animacion.propertyValue += this.animacion._stopAngle;
            }
        } else if (this.animacion.type == 'custom') {
            // Do nothing as all values must be set by the developer in the parameters
            // especially the propertyName and propertyValue.
        }
    }
}

// ====================================================================================================================
// Calculates and returns a random stop angle inside the specified segment number. Value will always be 1 degree inside
// the start and end of the segment to avoid issue with the segment overlap.
// ====================================================================================================================
Ruleta.prototype.getRandomForSegment = function(segmentNumber)
{
    let stopAngle = 0;

    if (segmentNumber) {
        if (typeof this.segmentos[segmentNumber] !== 'undefined') {
            let startAngle = this.segmentos[segmentNumber].startAngle;
            let endAngle = this.segmentos[segmentNumber].endAngle;
            let range = (endAngle - startAngle) - 2;

            if (range > 0) {
                stopAngle = (startAngle + 1 + Math.floor((Math.random() * range)));
            } else {
               console.log('Segment size is too small to safely get random angle inside it');
            }
        } else {
            console.log('Segment ' + segmentNumber + ' undefined');
        }
    } else {
        console.log('Segment number not specified');
    }

    return stopAngle;
}

// ====================================================================================================================
// Class for the wheel pines.
// ====================================================================================================================
function Pin(opciones)
{
    let opcionesDefecto = {
        'visible'        : true,     // In future there might be some functionality related to the pines even if they are not displayed.
        'number'         : 36,       // The number of pines. These are evenly distributed around the wheel.
        'externoRadio'    : 3,        // Radius of the pines which determines their size.
        'rellenoStyle'      : 'grey',   // Fill colour of the pines.
        'golpeStyle'    : 'black',  // Line colour of the pines.
        'lineaAncho'      : 1,        // Line width of the pines.
        'margin'         : 3,        // The space between outside edge of the wheel and the pines.
        'responsivo'     : false,    // If set to true the diameter of the pin will resize when the wheel is responsivo.
    };

    // Now loop through the default opciones and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let llave in opcionesDefecto) {
        if ((opciones != null) && (typeof(opciones[llave]) !== 'undefined')) {
            this[llave] = opciones[llave];
        } else {
            this[llave] = opcionesDefecto[llave];
        }
    }

    // Also loop though the passed in opciones and add anything specified not part of the class in to it as a property.
    if (opciones != null) {
        for (let llave in opciones) {
            if (typeof(this[llave]) === 'undefined') {
                this[llave] = opciones[llave];
            }
        }
    }
}

// ====================================================================================================================
// Class for the wheel spinning animacion which like a segment becomes a property of the wheel.
// ====================================================================================================================
function Animation(opciones)
{
    // Most of these opciones are null because the defaults are different depending on the type of animacion.
    let opcionesDefecto = {
        'type'              : 'spinOngoing',   // For now there are only supported types are spinOngoing (continuous), spinToStop, spinAndBack, custom.
        'direction'         : 'clockwise',     // clockwise or anti-clockwise.
        'propertyName'      : null,            // The name of the winning wheel property to be affected by the animacion.
        'propertyValue'     : null,            // The value the property is to be set to at the end of the animacion.
        'duration'          : 10,              // Duration of the animacion.
        'yoyo'              : false,           // If the animacion is to reverse back again i.e. yo-yo.
        'repeat'            : null,            // The number of times the animacion is to repeat, -1 will cause it to repeat forever.
        'easing'            : null,            // The easing to use for the animacion, default is the best for spin to stop. Use Linear.easeNone for no easing.
        'stopAngle'         : null,            // Used for spinning, the angle at which the wheel is to stop.
        'spins'             : null,            // Used for spinning, the number of complete 360 degree rotations the wheel is to do.
        'limpiarElCanvas'    : null,            // If set to true the canvas1 will be cleared before the wheel is re-drawn, false it will not, null the animacion will abide by the value of this property for the parent wheel object.
        'callbackFinished'  : null,            // Function to callback when the animacion has finished.
        'callbackBefore'    : null,            // Function to callback before the wheel is drawn each animacion loop.
        'callbackAfter'     : null,            // Function to callback after the wheel is drawn each animacion loop.
        'callbackSound'     : null,            // Function to callback if a sound should be triggered on change of segment or pin.
        'soundTrigger'      : 'segment'        // Sound trigger type. Default is segment which triggers when segment changes, can be pin if to trigger when pin passes the pointer.
    };

    // Now loop through the default opciones and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let llave in opcionesDefecto) {
        if ((opciones != null) && (typeof(opciones[llave]) !== 'undefined')) {
            this[llave] = opciones[llave];
        } else {
            this[llave] = opcionesDefecto[llave];
        }
    }

    // Also loop though the passed in opciones and add anything specified not part of the class in to it as a property.
    if (opciones != null) {
        for (let llave in opciones) {
            if (typeof(this[llave]) === 'undefined') {
                this[llave] = opciones[llave];
            }
        }
    }
}

// ====================================================================================================================
// Class for segmentos. When creating a json of opciones can be passed in.
// ====================================================================================================================
function Segment(opciones)
{
    // Define default opciones for segmentos, most are null so that the global defaults for the wheel
    // are used if the values for a particular segment are not specifically set.
    let opcionesDefecto = {
        'size'              : null, // Leave null for automatic. Valid values are degrees 0-360. Use percentToDegrees function if needed to convert.
        'text'              : '',   // Default is blank.
        'rellenoStyle'         : null, // If null for the rest the global default will be used.
        'golpeStyle'       : null,
        'lineaAncho'         : null,
        'textoFuenteFamilia'    : null,
        'textoFuenteTamano'      : null,
        'textoFuenteAncho'    : null,
        'textoOrientacion'   : null,
        'textoAlineacion'     : null,
        'textoDireccion'     : null,
        'textoMargen'        : null,
        'textoRellenoStyle'     : null,
        'textoGolpeStyle'   : null,
        'textoLineaAncho'     : null,
        'imagen'             : null, // Name/path to the imagen
        'imagenDireccion'    : null, // Direction of the imagen, can be set globally for the whole wheel.
        'imgData'           : null  // Image object created here and loaded with imagen data.
    };

    // Now loop through the default opciones and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let llave in opcionesDefecto) {
        if ((opciones != null) && (typeof(opciones[llave]) !== 'undefined')) {
            this[llave] = opciones[llave];
        } else {
            this[llave] = opcionesDefecto[llave];
        }
    }

    // Also loop though the passed in opciones and add anything specified not part of the class in to it as a property.
    // This allows the developer to easily add properties to segmentos at construction time.
    if (opciones != null) {
        for (let llave in opciones) {
            if (typeof(this[llave]) === 'undefined') {
                this[llave] = opciones[llave];
            }
        }
    }

    // There are 2 additional properties which are set by the code, so need to define them here.
    // They are not in the default opciones because they are not something that should be set by the user,
    // the values are updated every time the actualizarSegmentosTamano() function is called.
    this.startAngle = 0;
    this.endAngle   = 0;
}

// ====================================================================================================================
// Changes an imagen for a segment by setting a callback to render the wheel once the imagen has loaded.
// ====================================================================================================================
Segment.prototype.changeImage = function(imagen, imagenDireccion)
{
    // Change imagen name, blank imagen data.
    this.imagen = imagen;
    this.imgData = null;

    // Set direction.
    if (imagenDireccion) {
        this.imagenDireccion = imagenDireccion;
    }

    // Set imgData to a new imagen object, change set callback and change src (just like in wheel constructor).
    ruletaYaDibujada = false;
    this.imgData = new Image();
    this.imgData.onload = ruletaCargadaImagen;
    this.imgData.src = this.imagen;
}

// ====================================================================================================================
// Class that is created as property of the wheel. Draws line from center of the wheel out to edge of canvas1 to
// indicate where the code thinks the pointer location is. Helpful to get alignment correct esp when using images.
// ====================================================================================================================
function PunteroGuia(opciones)
{
    let opcionesDefecto = {
        'display'     : false,
        'golpeStyle' : 'red',
        'lineaAncho'   : 3
    };

    // Now loop through the default opciones and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let llave in opcionesDefecto) {
        if ((opciones != null) && (typeof(opciones[llave]) !== 'undefined')) {
            this[llave] = opciones[llave];
        } else {
            this[llave] = opcionesDefecto[llave];
        }
    }
}

// ====================================================================================================================
// This function takes the percent 0-100 and returns the number of degrees 0-360 this equates to.
// ====================================================================================================================
function winwheelPercentToDegrees(percentValue)
{
    let degrees = 0;

    if ((percentValue > 0) && (percentValue <= 100)) {
        let divider = (percentValue / 100);
        degrees = (360 * divider);
    }

    return degrees;
}

// ====================================================================================================================
// In order for the wheel to be re-drawn during the spin animacion the function greesock calls needs to be outside
// of the class as for some reason it errors if try to call winwheel.draw() directly.
// ====================================================================================================================
function winwheelAnimationLoop()
{
    if (ruletaParaDibujarDuranteAnimacion) {
        // Check if the limpiarElCanvas is specified for this animacion, if not or it is not false then clear the canvas1.
        if (ruletaParaDibujarDuranteAnimacion.animacion.limpiarElCanvas != false) {
            ruletaParaDibujarDuranteAnimacion.xtc.clearRect(0, 0, ruletaParaDibujarDuranteAnimacion.canvas1.width, ruletaParaDibujarDuranteAnimacion.canvas1.height);
        }

        let callbackBefore = ruletaParaDibujarDuranteAnimacion.animacion.callbackBefore;
        let callbackAfter = ruletaParaDibujarDuranteAnimacion.animacion.callbackAfter;

        // If there is a callback function which is supposed to be called before the wheel is drawn then do that.
        if (callbackBefore != null) {
            // If the property is a function then call it, otherwise eval the proptery as javascript code.
            if (typeof callbackBefore === 'function') {
                callbackBefore();
            } else {
                eval(callbackBefore);
            }
        }

        // Call code to draw the wheel, pass in false as we never want it to clear the canvas1 as that would wipe anything drawn in the callbackBefore.
        ruletaParaDibujarDuranteAnimacion.draw(false);

        // If there is a callback function which is supposed to be called after the wheel has been drawn then do that.
        if (callbackAfter != null) {
            // If the property is a function then call it, otherwise eval the proptery as javascript code.
            if (typeof callbackAfter === 'function') {
                callbackAfter();
            } else {
                eval(callbackAfter);
            }
        }

        // If there is a sound callback then call a function which figures out if the sound should be triggered
        // and if so then call the function specified by the developer.
        if (ruletaParaDibujarDuranteAnimacion.animacion.callbackSound) {
            winwheelTriggerSound();
        }
    }
}

// ====================================================================================================================
// This function figures out if the callbackSound function needs to be called by working out if the segment or pin
// has changed since the last animacion loop.
// ====================================================================================================================
function winwheelTriggerSound()
{
    // If this property does not exist then add it as a property of the winwheel.
    if (ruletaParaDibujarDuranteAnimacion.hasOwnProperty('_lastSoundTriggerNumber') == false) {
        ruletaParaDibujarDuranteAnimacion._lastSoundTriggerNumber = 0;
    }

    let callbackSound = ruletaParaDibujarDuranteAnimacion.animacion.callbackSound;
    let currentTriggerNumber = 0;

    // Now figure out if the sound callback should be called depending on the sound trigger type.
    if (ruletaParaDibujarDuranteAnimacion.animacion.soundTrigger == 'pin') {
        // So for the pin type we need to work out which pin we are between.
        currentTriggerNumber = ruletaParaDibujarDuranteAnimacion.getCurrentPinNumber();
    } else {
        // Check on the change of segment by working out which segment we are in.
        // We can utilise the existing getIndiatedSegmentNumber function.
        currentTriggerNumber = ruletaParaDibujarDuranteAnimacion.getIndicatedSegmentNumber();
    }

    // If the current number is not the same as last time then call the sound callback.
    if (currentTriggerNumber != ruletaParaDibujarDuranteAnimacion._lastSoundTriggerNumber) {
        // If the property is a function then call it, otherwise eval the proptery as javascript code.
        if (typeof callbackSound === 'function') {
            callbackSound();
        } else {
            eval(callbackSound);
        }

        // Also update the last sound trigger with the current number.
        ruletaParaDibujarDuranteAnimacion._lastSoundTriggerNumber = currentTriggerNumber;
    }
}

// ====================================================================================================================
// This function is called-back when the greensock animacion has finished.
// ====================================================================================================================
let ruletaParaDibujarDuranteAnimacion = null;  // This global is set by the winwheel class to the wheel object to be re-drawn.

function winwheelStopAnimation(canCallback)
{
    // When the animacion is stopped if canCallback is not false then try to call the callback.
    // false can be passed in to stop the after happening if the animacion has been stopped before it ended normally.
    if (canCallback != false) {
        let callback = ruletaParaDibujarDuranteAnimacion.animacion.callbackFinished;

        if (callback != null) {
            // If the callback is a function then call it, otherwise evaluate the property as javascript code.
            if (typeof callback === 'function') {
                // Pass back the indicated segment as 99% of the time you will want to know this to inform the user of their prize.
                callback(ruletaParaDibujarDuranteAnimacion.getIndicatedSegment());
            } else {
                eval(callback);
            }
        }
    }
}

// ====================================================================================================================
// Called after the imagen has loaded for each segment. Once all the images are loaded it then calls the draw function
// on the wheel to render it. Used in constructor and also when a segment imagen is changed.
// ====================================================================================================================
let ruletaYaDibujada = false;

function ruletaCargadaImagen()
{
    // Prevent multiple drawings of the wheel which ocurrs without this check due to timing of function calls.
    if (ruletaYaDibujada == false) {
        // Set to 0.
        let winwheelImageLoadCount = 0;

        // Loop though all the segmentos of the wheel and check if imagen data loaded, if so increment counter.
        for (let i = 1; i <= ruletaParaDibujarDuranteAnimacion.numSegmentos; i ++) {
            // Check the imagen data object is not null and also that the imagen has completed loading by checking
            // that a property of it such as the height has some sort of true value.
            if ((ruletaParaDibujarDuranteAnimacion.segmentos[i].imgData != null) && (ruletaParaDibujarDuranteAnimacion.segmentos[i].imgData.height)) {
                winwheelImageLoadCount ++;
            }
        }

        // If number of images loaded matches the segmentos then all the images for the wheel are loaded.
        if (winwheelImageLoadCount == ruletaParaDibujarDuranteAnimacion.numSegmentos) {
            // Call draw function to render the wheel.
            ruletaYaDibujada = true;
            ruletaParaDibujarDuranteAnimacion.draw();
        }
    }
}

// ====================================================================================================================
// Called when the wheel is to resize. This is normally called from a onresize of the window, also called from onload
// so the initial size is correct. Here we must re-size the canvas1 and work out the scalaFactor for the wheel.
// ====================================================================================================================
function ruletaRedimension()
{
    // By default set the margin to 40px, this can be overridden if needed.
    // This is to stop the canvas1 going right to the right edge of the screen and being overlayed by a scrollbar though
    // if the canvas1 is center aligned, half the magin will be applied to each side since the margin actually reduces the width of the canvas1.
    let margin = 40;

    // If a value has been specified for this then update the margin to it.
    if (typeof(ruletaParaDibujarDuranteAnimacion._responsiveMargin) !== 'undefined') {
        margin = ruletaParaDibujarDuranteAnimacion._responsiveMargin;
    }

    // Get the current width and also optional min and max width properties.
    let width = window.innerWidth - margin;
    let minWidth = ruletaParaDibujarDuranteAnimacion._responsiveMinWidth;
    let minHeight = ruletaParaDibujarDuranteAnimacion._responsiveMinHeight;

    // Adjust the width as it cannot be larger than the original size of the wheel and we don't want
    // the canvas1 and wheel inside it to be too small so check the min width.
    if (width < minWidth) {
        width = minWidth;
    } else if (width > ruletaParaDibujarDuranteAnimacion._originalCanvasWidth) {
        width = ruletaParaDibujarDuranteAnimacion._originalCanvasWidth;
    }

    // Work out the percent the new width is smaller than the original width.
    let percent = (width / ruletaParaDibujarDuranteAnimacion._originalCanvasWidth);

    // Set the canvas1 width to the width to a percentage of the original width.
    ruletaParaDibujarDuranteAnimacion.canvas1.width = (ruletaParaDibujarDuranteAnimacion._originalCanvasWidth * percent);

    // Scale the height if we are supposed to but ensure it does not go below the minHeight.
    if (ruletaParaDibujarDuranteAnimacion._responsiveScaleHeight) {
        let height = (ruletaParaDibujarDuranteAnimacion._originalCanvasHeight * percent);

        if (height < minHeight) {
            height = minHeight;
        } else if (height > ruletaParaDibujarDuranteAnimacion._originalCanvasHeight) {
            height = ruletaParaDibujarDuranteAnimacion._originalCanvasHeight;
        }

        ruletaParaDibujarDuranteAnimacion.canvas1.height = height;
    }

    // OK so now we have the percent, set the scalaFactor of the wheel to this.
    ruletaParaDibujarDuranteAnimacion.scalaFactor = percent;

    // Now re-draw the wheel to ensure the changes in size are rendered.
    ruletaParaDibujarDuranteAnimacion.draw();
}
