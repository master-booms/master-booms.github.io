
var header = $('.header');

$(window).scroll(function(e){
    if(header.offset().top !== 0){
        if(!header.hasClass('shadow')){
            header.addClass('shadow');
        }
    }else{
        header.removeClass('shadow');
    }
});



// $(".header-menu a").click(function() {
//   var e = $(this).attr("href");
//   return $("body").animate({
//     scrollTop: $(e).offset().top - 70
//   }, 1e3), !1
// });


  $(".header-menu a").mPageScroll2id({
    offset : 70
  });