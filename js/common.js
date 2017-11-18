


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





//Fixed Header auto-height

$(".js__sticker").sticky({
  topSpacing: 1
})



// $(".js__select, .js__selectAside").select2({
//   minimumResultsForSearch: 1 / 0
// })



