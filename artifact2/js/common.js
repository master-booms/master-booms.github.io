
//mobile

var touch = $('.menu__burger');
var menu = $('.header-menu__ul');

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




$(".tab__item").not(":first").hide();
$(".tab-list .tab").click(function() {
  $(".tab-list .tab").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");


$(".tab2__item").not(":first").hide();
$(".tab-list2 .tab2").click(function() {
  $(".tab-list2 .tab2").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab2__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");



$(".tab3__item").not(":first").hide();
$(".tab-list3 .tab3").click(function() {
  $(".tab-list3 .tab3").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab3__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");


$(".tab4__item").not(":first").hide();
$(".tab-list4 .tab4").click(function() {
  $(".tab-list4 .tab4").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab4__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");

$(".tab5__item").not(":first").hide();
$(".tab-list5 .tab5").click(function() {
  $(".tab-list5 .tab5").removeClass("active").eq($(this).index()).addClass("active");
  $(".tab5__item").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");

$(".search-icon").on('click', function(e) {
	e.preventDefault();
	$(".header-search").slideToggle();
});


//Button More (Abouct Section)

$(".js__about").click(function(e) {
    e.preventDefault();
  $(".js__about").toggleClass("active-btn");
  $(".js__about > .text-show").toggleClass("text-hidden");
  $(".js__about > .text-hidden").toggleClass("text-active");
 
  
  $(".js__overflowBox").toggleClass("active-height");
  });


 $('.stream-list').bxSlider({
    slideWidth: 170,
    minSlides: 2,
    maxSlides: 7,
    moveSlides: 1,
    slideMargin: 5,
    pager: false,
    nextSelector: ".arrow-right",
    prevSelector: ".arrow-left",
    auto: true


  
});



  $('.gides__slider').bxSlider({
    
    minSlides: 2,
    maxSlides: 7,
    moveSlides: 1,
    slideMargin: 5,
    pager: false,
    nextSelector: " ",
    prevSelector: "",
    auto: true


  
});


  $('.media').bxSlider({
    slideWidth: 195,
    minSlides: 1,
    maxSlides: 3,
    moveSlides: 1,
    slideMargin: 10,
    pager: false,
    nextSelector: ".arrow-right2",
    prevSelector: ".arrow-left2",
    auto: true


  
});





$(document).ready(function() {
  $('.media__img').magnificPopup({

    delegate: 'a',
    type:'image',
    gallery: {
      enabled: true,
      tCounter: '' // markup of counter
    },


  });
});