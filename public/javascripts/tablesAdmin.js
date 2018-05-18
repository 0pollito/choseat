
$(document).ready(function(){
  $('select').material_select();
  $(".button-collapse").sideNav();
  $('#table_cont').DataTable();
  $('.materialboxed').materialbox();
  $('.modal').modal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
     opacity: .5, // Opacity of modal background
     inDuration: 300, // Transition in duration
     outDuration: 200, // Transition out duration
     startingTop: '4%', // Starting top style attribute
     endingTop: '10%', // Ending top style attribute
     });

  setTimeout(function() {
        $("#alert").fadeOut(1500);
    },3000);



$('#_Menu_').material_select();
$("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});



//  $('#alert').trigger('click');
  $('ul.tabs').tabs();


  $('.timepicker').pickatime({
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Borrar', // text for clear-button
    canceltext: 'Cancelar', // Text for cancel-button,
    container: undefined, // ex. 'body' will append picker to body
    autoclose: false, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: function(){} //Function for after opening timepicker
  });

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100, // Creates a dropdown of 15 years to control year,
    clear: 'Borrar',
    close: 'Ok',
    format: 'yy/mm/dd'
  });

});
