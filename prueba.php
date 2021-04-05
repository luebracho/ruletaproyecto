<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
       <!-- jQuery library -->
       <script type="text/javascript" src="js/form.js"></script>
       <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
       
 
</head>
<body>
Nombre: <input type="text" id="nombre"> <br>
Mensaje: <input type="text" id="mensaje"> <br>
<input type="button" name="enviar" value="Enviar" href="javascript:;" onclick="Hola($('#nombre').val(),$('#mensaje').val());">
<div id="resultado"></div>
</body>
</html>