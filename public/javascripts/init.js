
  $(document).ready(function(){

  //Materialize Components
   $('.parallax').parallax();
   $('.carousel').carousel({fullWidth: true,  duration: 10});
   $('.slider').slider('start');
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



});
