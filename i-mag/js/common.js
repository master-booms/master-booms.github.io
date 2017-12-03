


  //mobile menu
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


//Scroll to anckor
  $(".container-text a").mPageScroll2id({
    offset : 20
  });


//Fixed Header auto-height

$(".js__sticker").sticky({
  topSpacing: 0
})






;(function($) {
  $(function() {
    $('.js__click').bind('click', function(e) {
    e.preventDefault();
    $('.cart-popupW').bPopup();
 $('.cart-slider').bxSlider({


    slideWidth: 170,
    minSlides: 2,
    maxSlides: 7,
    moveSlides: 1,
    slideMargin: 30,
    pager: false,
    nextSelector: ".cart-slider__right",
    prevSelector: ".cart-slider__left",
    prevText: "",
    nextText: "",
    auto: true


  


    

    
  });    
  });

});

})(jQuery);


//banner

$(function(){
  $('.banner').bxSlider({
    mode: 'fade',
    captions: true,
    
  });
});


//Gallery

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

//CART-SLIDER


//Tabs
$(".tab__item").not(":first").hide();
$(".wrapper-tabs .tab").click(function() {
  $(".wrapper-tabs .tab").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");





//Color Pick

$(".catalog__colorItem").click(function() {
  $(this).toggleClass("active")
})



//Accordion Filter

$(".catalog-filter__title").click(function() {
  $(this).toggleClass("active");
  $(this).siblings(".catalog-filter__hidden").slideToggle();
})

//Filter Mobile Button

  var touch2 = $('.catalog-filterMobile');
  var menu2 = $('.catalog-filter');
 
  $(touch2).on('click', function(e) {
    e.preventDefault();
    menu2.slideToggle();
  });
  $(window).resize(function(){
    var w2 = $(window).width();
    if(w2 > 760 && menu2.is(':hidden')) {
      menu2.removeAttr('style');
    }
  });

//Slider range

 $( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 19940,
      max: 91250,
      values: [ 23940, 88250 ],
      slide: function( event, ui ) {
        $( "#amount" ).val("от" + " " + ui.values[ 0 ] + " " + "Р.");
        $( "#amount2" ).val("от" + " " + ui.values[ 1 ] + " " + "Р." );
      }
    });
    
  } );