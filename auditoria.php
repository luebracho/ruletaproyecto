

<!doctype html>
<html lang="en">
  <head>
  <title>Grupo Sorte</title>
  <link rel="Shortcut Icon" href="img/logo.png" type="image/x-icon" />
  
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css?family=Mansalva&display=swap" rel="stylesheet">
  
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
  </head>
  <style type="text/css">
  #myBtn {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 50%;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: #ffcc00;
  color: black;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
}

#myBtn:hover {
  background-color: blue;
}
</style>
  <body>
  <style>
p.mansalva {
  font-family: "Mansalva", cursive;
  font-size: 40px;
}
p.mansalva1 {
  font-family: "Mansalva", cursive;
  font-size: 20px;
}
</style>      


<div class="container">
          <br>
         <img src="img/sorte.png" class="img-responsive" alt="Grupo Sorte" style="width:10%;height:10%;">
         <p class="mansalva1">Grupo Sorte S.A.S.</p>
        <p>TEXTO</p>
        <p>TEXTO</p>
    </div>
  

<?php  
    //conexion a la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "ruletaproyecto";

    $conn= new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die ("conexion fallida: " . $conn->connect_error);
    }

    $registros = mysqli_query($conn,"SELECT * FROM historico order by id desc");

    
?>


<div class="container mt-3">
<div class="row">
<div class="col">
      
    </div>
    <div class="col">
      <h1><center>Listado de Jugadas</center></h1>
    </div>
    <div class="col">
        <center>
          <a href="index.php" class="btn btn-outline-primary" role="button"><i class="fas fa-home" style="font-size:18px"></i></a>
        </center>
    </div>
  </div>
<div class="row">
<div class="col">
<h3><center></center></h3>
</div>
<div class="col">
<h3><center></center></h3>
</div>
<div class="col"><h3>

</h3>
</div>
</div>
<input class="form-control" id="myInput" type="text" placeholder="Buscar..">
<br>
<table class="table table-bordered"> 
<thead>
  <tr>
    <th>id</th>
    <th>RULETA CREDITOS</th>
    <th>RULETA PREMIOS</th>
    <th>TOTAL</th>
    <th>DESCRIPCION</th>
    <th>fecha</th>
  </tr>
</thead>
<tbody id="myTable">
<?php 
while ($reg = mysqli_fetch_array($registros)) {

?>
 
  <tr>
    <td><?php echo $reg['id']; ?></td>
    <td><?php echo $reg['ruleta']; ?></td>
    <td><?php echo $reg['wheel']; ?></td>
    <td><?php echo $reg['total']; ?></td>
    <td><?php echo $reg['descripcion']; ?></td>
    <td><?php echo $reg['fecha']; }?></td>
  </tr>
  </tbody>
</table>


</div>


<script>
$(document).ready(function(){
$("#myInput").on("keyup", function() {
var value = $(this).val().toLowerCase();
$("#myTable tr").filter(function() {
  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
});
});
});
</script>

<script>
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
document.getElementById("myBtn").style.display = "block";
} else {
document.getElementById("myBtn").style.display = "none";
}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
}
</script>

	<!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>

	</body>
</html>