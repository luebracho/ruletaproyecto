<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ruletaproyecto";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$ruleta = $_POST["Ruleta"];
$wheel = $_POST["Wheel"];
$total = $ruleta * $wheel;


$sql = "INSERT INTO historico (ruleta, wheel, total, descripcion)
VALUES ('$ruleta', '$wheel', '$total', '$wheel')";

if ($conn->query($sql) === TRUE) {
echo "New record created successfully";
} else {
echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();



echo " REGISTRO GUARDADO ";

?>