


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