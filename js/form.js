function Hola(f1t1,f1t2,f1t3) {
    var parametros = {"Ruleta":f1t1,"Wheel":f1t2,"Total":f1t3};
$.ajax({
   data:parametros,
   url:'conexion.php',
   type: 'post',
   beforeSend: function () {
       $("#resultado").html("Procesando, espere por favor");
   },
   success: function (response) {   
       $("#resultado").html(response);
   }
});
}