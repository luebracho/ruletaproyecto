
  <!-- Button to Open the Modal -->
  <button type="button" class="btn btn-primary" id="myCheck" data-toggle="modal" data-target="#myModal" style="position: absolute; z-index: 0; margin-top: -80px; margin-left: -1300px;">
    Open modal
  </button>

  <!-- The Modal -->
  <div class="modal fade" id="myModal" ">
    <div class="modal-dialog">
      <div class="modal-content">
      
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">TITULO PREMIO</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        
        <!-- Modal body -->
        <div class="modal-body">
        <div id="premio_form">
            <form name="f1" id="f1" action="">
                    <div class="form-group">
                        <label for="r1">Ruleta pequeña</label>
                        <input type="text" name="f1t1" id="f1t1">
                    </div>
                    <div class="form-group">
                        <label for="r2">Ruleta grande</label>
                        <input type="text" name="f1t2" id="f1t2">
                    </div>
                    <div class="form-group">
                        <label for="t1">Total premio</label>
                        <input type="text" name="f1t3" id="f1t3">
                    </div>

                    <input id="boton" class="close" data-dismiss="modal" type="button" name="enviar" value="Enviar" href="javascript:;" onclick="Hola($('#f1t1').val(),$('#f1t2').val(),$('#f1t3').val());">
            </form>
            <!--<div id="resultado"></div> -->
        </div>


        </div>
        
        <!-- Modal footer -->
        <div class="modal-footer">
        </div>
        
      </div>
    </div>
  </div>
  
</div>