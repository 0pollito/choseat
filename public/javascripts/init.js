
  $(document).ready(function(){

  //Materialize Components
   $('.parallax').parallax();
   $('.carousel').carousel({fullWidth: true,  duration: 10});
   $('.slider').slider();
    $(".button-collapse").sideNav();
   $('#alert').trigger("click");
   $('.tooltipped').tooltip({delay: 50});
   $('.modal').modal();
   $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 100, // Creates a dropdown of 15 years to control year,
    clear: 'Borrar',
    close: 'Ok',
    format: 'yy/mm/dd'
  });
  $('select').material_select();
  $("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});

  setTimeout(function() {
        $("#alert").fadeOut(1500);
    },3000);

  $('#table_cont').DataTable();
  $('.chips').material_chip();

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
