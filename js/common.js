


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




