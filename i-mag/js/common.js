


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


//Spoile Catalog

 $(".js__spoilerMore").on('click', function(e) {
   e.preventDefault();
    $(".js__spoiler").slideToggle(1000);
  });



//CART POPUP AND SLIDER


// ;(function($) {
//   $(function() {
//     $('.js__click').bind('click', function(e) {
//       e.preventDefault();
//     $('.cart-popupW').bPopup();
//  $('.cart-slider').bxSlider({


//     slideWidth: 160,
//     minSlides: 2,
//     maxSlides: 7,
//     moveSlides: 1,
//     slideMargin: 30,
//     pager: false,
//     nextSelector: ".cart-slider__right",
//     prevSelector: ".cart-slider__left",
//     prevText: "",
//     nextText: "",
//     auto: true

    
//   });    
//   });

// });

// })(jQuery);

 $('.cart-slider').bxSlider({


    slideWidth: 160,
    minSlides: 6,
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



//banner

$(function(){
  $('.banner').bxSlider({
    mode: 'fade',
    captions: true,
    controls: false,    
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

//Order RADIO-BUTTONS

$(".js__clickActive").on("click", function() {
    $(".js__clickActive").removeClass("active");
    $(this).find("input[type='radio']").prop("checked", true);
    $(this).addClass("active");


});




// $(".js__sortClick").click(function() {
//   $(this).toggleClass("active")
// })





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


$(document).ready(function() {
    $("#slider-range").slider({
        range: true,
        min: 19940,
        max: 91250,
        step: 1,
        values: [ 23940, 88250 ],
        animate: 300,
        slide: function(event, ui) {
            for (var i = 0; i < ui.values.length; ++i) {
                $("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
            }
        }
    });

    $("input.sliderValue").change(function() {
        var $this = $(this);
        $("#slider-range").slider("values", $this.data("index"), $this.val());
    });
});