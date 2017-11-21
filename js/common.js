
var header = $('.header');

$(window).scroll(function(e){
    if(header.offset().top > 120){
        if(!header.hasClass('shadow')){
            header.addClass('shadow');
        }
    }else{
        header.removeClass('shadow');
    }
});






  $(".service-block__link").mPageScroll2id({
    offset : 150
  });