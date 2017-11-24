


  //mobile
  var touch = $('.js__searchBurger');
  var menu = $('.header__bottom');
 
  $(touch).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
  });
  $(window).resize(function(){
    var w = $(window).width();
    if(w > 760 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }
  });


  //mobile
  var touch = $('.burger-menu');
  var menu = $('.header-mnu.js__mnu');
 
  $(touch).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
  });
  $(window).resize(function(){
    var w = $(window).width();
    if(w > 760 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }
  });




//Fixed Header auto-height

$(".js__sticker").sticky({
  topSpacing: 1
})

//jQuery:
$(".tab__item").not(":first").hide();
$(".wrapper-tabs .tab").click(function() {
  $(".wrapper-tabs .tab").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");



$(".tabHospital__item").not(":first").hide();
$(".tabHospital-list .tabHospital").click(function() {
$(".tabHospital-list .tabHospital").removeClass("active").eq($(this).index()).addClass("active");
$(".tabHospital__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");





(function() {
  
  'use strict';

  $('.input-file').each(function() {
    var $input = $(this),
        $label = $input.next('.js-labelFile'),
        labelVal = $label.html();
    
   $input.on('change', function(element) {
      var fileName = '';
      if (element.target.value) fileName = element.target.value.split('\\').pop();
      fileName ? $label.addClass('has-file').find('.js-fileName').html(fileName) : $label.removeClass('has-file').html(labelVal);
   });
  });

})();



// $(document).ready(function() {
//     $('#registerForm').bootstrapValidator({
//         message: 'This value is not valid',
//         feedbackIcons: {
//             valid: 'glyphicon glyphicon-ok',
//             invalid: 'glyphicon glyphicon-remove',
//             validating: 'glyphicon glyphicon-refresh'
//         },
//         fields: {
//             username: {
//                 message: 'The username is not valid',
//                 validators: {
//                     notEmpty: {
//                         message: 'Поле имя не может быть пустым'
//                     },
//                     stringLength: {
//                         min: 6,
//                         max: 30,
//                         message: 'The username must be more than 6 and less than 30 characters long'
//                     },
//                     regexp: {
//                         regexp: /^[a-zA-Z0-9_]+$/,
//                         message: 'The username can only consist of alphabetical, number and underscore'
//                     }
//                 }
//             },
//             email: {
//                 validators: {
//                     notEmpty: {
//                         message: 'The email is required and cannot be empty'
//                     },
//                     emailAddress: {
//                         message: 'The input is not a valid email address'
//                     }
//                 }
//             }
//         }
//     });
// });