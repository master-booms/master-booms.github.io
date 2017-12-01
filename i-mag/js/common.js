


  //mobile
  var touch = $('.mobile-mnu');
  var menu = $('.filter-mnu');
 
  $(touch).on('click', function(e) {

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
  topSpacing: 0
})



$(function(){
  $('.banner').bxSlider({
    mode: 'fade',
    captions: true,
    
  });
});



$('.product-descr__slider').bxSlider({
  pagerCustom: '.product-descr__thumb',
  controls: false
});


$(document).ready(function() {
  $('.product-descr__slider').magnificPopup({

    delegate: 'a',
    type:'image',
    gallery: {
      enabled: true,
      tCounter: '' // markup of counter
    },


  });
});






