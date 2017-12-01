


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



$('.gallery').bxSlider({
  pagerCustom: '.gallery__thumb',
  controls: false
});


$(document).ready(function() {
  $('.gallery').magnificPopup({

    delegate: 'a',
    type:'image',
    gallery: {
      enabled: true,
      tCounter: '' // markup of counter
    },


  });
});


//jQuery:
$(".tab__item").not(":first").hide();
$(".wrapper-tabs .tab").click(function() {
  $(".wrapper-tabs .tab").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");







$(".catalog__colorItem").click(function() {
  $(this).toggleClass("active")
})