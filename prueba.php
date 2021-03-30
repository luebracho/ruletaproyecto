<?php
echo "<script language='javascript'>
	var la_cantidad;
	la_cantidad=prompt('Introduce la cantidad',1);
     </script> ";
 
//Ya tenemos capturada la variable con javascript
 
echo "<form action=$_SERVER[PHP_SELF] method=post name=enviar>
              <input type=hidden name=var_php></form>";
 
echo "<script language='javascript'>
              document.enviar.var_php.value=la_cantidad;
              document.enviar.submit();
</script>";
?>