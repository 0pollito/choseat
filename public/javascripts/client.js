$(function() {
	var socket = io.connect('/');
	var dataTamImp;
	var idObjectImp = 0;
	var dataColores;
	var dataPrecio;

//validation de form------------------------------------------------------------

//-----------------------------------------------------------------------------

	sArt.onchange = function() {
		//socket.emit('categorias',{id: $('#sArt').val()});
		socket.emit('impresion',{id: $('#sArt').val()});
		$("#img-preview").attr("src",'images/templates/'+$("#sArt option:selected").text()+'.png');
		$('#add').removeAttr("disabled"); // active the button for impresion add
		$('.Improw').remove(); //delete all added impresion
	}

  socket.on('articulos', function(data) {
		$.each(data, function(i,item) {
			$('#sArt').append($('<option>',{
				value: item.idArticulo,
				text: item.nombre
			}));
		});
		$('#sArt').material_select();
	})

	/*socket.on('colores',function(data) {
		$('#sMat').empty();
		$.each(data, function(i,item) {
			$('#sMat').append($('<option>',{
				value: item.idMaterial,
				text: item.nombre
			}));
		});
		$('#sMat').material_select();
	})*/
	socket.on('impresion',function(data) {
		dataTamImp = data;
	})
	socket.on('colores',function(data) {
		dataColores = data;
	})
	/*socket.on('PrecioFinal',function(data) {
		dataPrecio = data;
	})*/

	$("#add").click(function() {
		idObjectImp++;
		$("#impresiones").append("<div id='l"+idObjectImp+"' class='Improw row'>"+
		"<div class='col s12 m5'>"+
			"<div class='file-field input-field'>"+
				"<div class='btn green'>"+
					"<span>diseño</span><input  id='f"+idObjectImp+"' type='file' name='files[]'></div>"+
			"<div class='file-path-wrapper'><input class='file-path validate' type='text' required></div></div></div>"+
			"<div class='input-field col s12 m2'><select id='c"+idObjectImp+"' disabled required><option value='' disabled selected>Seleccionar</option></select><label class='black-text'>Colores <span class='red-text'> *</span></label></div>"+
			"<div class='input-field col s12 m4'><select id='s"+idObjectImp+"' disabled required><option value='' disabled selected>Seleccionar</option></select><label class='black-text'>Tamaño <span class='red-text'> *</span></label></div>"+
		"<a class='secondary-content remove btn-floating red'><i class='material-icons'>close</i></a></div><div id='sep"+idObjectImp+"'class='Improw divider'></div>");

		$.each(dataTamImp, function (i, item) {
			$('#s'+idObjectImp).append($('<option>', {
					value: item.idImpresion,
					text : item.nombre+'('+item.ancho+'x'+item.alto+')'
			}));
		});
		$.each(dataColores, function (i, item) {
			$('#c'+idObjectImp).append($('<option>', {
					value: item.cantidad_colores,
					text : item.cantidad_colores
			}));
		});

	 $('#s'+idObjectImp).material_select();
	 $('#c'+idObjectImp).material_select();
	 //Cambiar tamaño de Imagen-Diseño
	 $('#s'+idObjectImp).on('change',function() {
		 var text = $("#s"+idObjectImp+" option:selected").text();
		 var alto = (text.split('x').reverse().join('')).substring(0,4);
		 $('#i'+$(this).attr("id").substring(1,2)).css({'height': alto*3+'px'});
	 });
	 document.getElementById('f'+idObjectImp).addEventListener('change', archivo, false);
	 $("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});

	});
	 $("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});
	//Remove one description impresion item
	$(document).on("click", ".remove", function() {
		//var idImagen = $(this).parent().attr("id").substring(1,2);
		var idImagen = $(this).parent().attr("id").substring(1,4);
		$("#d"+idImagen).remove();
    $("#l"+idImagen).remove();
		$("#sep"+idImagen).remove();
});

//funcion para subir un archivo imagen
function archivo(evt){
	var newId = $(this).attr("id").substring(1,2);
		var files = evt.target.files; // FileList object
		 //Obtenemos la imagen del campo "file".
		 for (var i = 0, f; f = files[i]; i++) {
				//Solo admitimos imágenes.
				if (!f.type.match('image.*')) { continue; }
				var reader = new FileReader();
				reader.onload = (function(theFile) {
						return function(e) { // Creamos la imagen.
							$("#preview").append("<div id='d"+newId+"' class='Improw draggable ui-widget-content' style='left: 104px; top: 152px;'><img id='i"+newId+"' class='thumb' src='"+e.target.result+"' title='"+escape(theFile.name)+"' /></div>");
							$(".draggable").draggable({ containment: "#preview" });
						};
				})(f);
				reader.readAsDataURL(f);
		}

		$('#s'+newId).prop("disabled",false);
		$('#c'+newId).prop("disabled",false);
		$('#s'+newId).material_select();
		$('#c'+newId).material_select();
}


//obtener precio final
//-------------------------------------------------
$("#otro").submit(function(e){
    e.preventDefault();
		var cantidad = $('#cantidad').val();
		var arreImpressions = [];
		$('select').each(function() {
			if($(this).val() != null)
				arreImpressions.push($(this).val());
		});
		if(arreImpressions.length > 1){
		var idArticulo = arreImpressions[0];
		dataPrecio = arreImpressions;
		socket.emit('tab-price',{cantidad: cantidad, idArticulo: idArticulo});
		}else {
			alert('Agrega una Impresión');
		}
  });

	socket.on('tab-price',function(data) {
		var priceTotal = 0;
		for (var j = 1; j < dataPrecio.length; j++) {
			$.each(data, function (i, item) {
				if(dataPrecio[j] == item.cantidad_colores && dataPrecio[j+1] == item.idImpresion){
					priceTotal+= item.precio;
				}
			});
			j++;
		}
		$('#AprecioUnitario').text('$'+priceTotal+'.00');
		$('#Aprecio').text('$'+priceTotal*$('#cantidad').val()+'.00');
	})


//----------------------------------------------
//Cambiar color de fondo
/*$('#bgcolor').on('change', function (e) {
	console.log(this);
		$("#preview").css("background-color", '#'+this.jscolor);
	});*/
// crear la screenshot del Domi
$("#download").click(function() {
					html2canvas($("#preview"), {
							onrendered: function(canvas) {
									theCanvas = canvas;
									document.body.appendChild(canvas);
									canvas.toBlob(function(blob) {
										saveAs(blob, "Domi.png");
									});
							}
					});
			});

});
