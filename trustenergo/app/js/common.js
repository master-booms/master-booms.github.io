




//Catalog Tabs

$(".catalog__tabItem").not(":first").hide();
$(".wrapper .catalog__tab").click(function() {
    $(".catalog>.wrapper .catalog__tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".catalog__tabItem").hide().eq($(this).index()).fadeIn()
}).eq(0).addClass("active");





//Catalog MAnufacturer (Checkbox Hidden-Visible)

$(".js__manufacturer").click(function(e) {
    e.preventDefault();
  $(".catalog__popular").toggleClass("block-hidden");
  $(".catalog__all").toggleClass("block-show");
  $(".js__manufacturer > .text-show").toggleClass("text-hidden");
  $(".js__manufacturer > .text-hidden").toggleClass("text-active");
 
  
 
  });


//ScrollBar Style

$(".rtable__scroll").niceScroll({cursorcolor: '#cc0000',touchbehavior: true, cursoropacitymin: '0', cursorwidth: '10px', cursorminheight: 10, cursormaxheight: 10,  background: "#e1e8ee", cursorfixedheight: 40, cursorborder: false, sensitiverail: true });



   


//Catalog Search (hidden-visible)

$(".js__search").click(function(e) {
    e.preventDefault();
  $(".catalog__select.block-hidden").toggleClass("block-show");
  $(".catalog__text.block-hidden").toggleClass("block-show");
  $(".catalog__select.block-off").toggleClass("block-hidden");
  $(".catalog__input").toggleClass("block-show");
  $(".js__search > .text-show").toggleClass("text-hidden");
  $(".js__search > .text-hidden").toggleClass("text-active");
 
  
 
  });


//Select
  $('.js__select').select2({
  minimumResultsForSearch: Infinity,
});



//Catalog-full  Row - Column (hidden-visible)

 $(".sort-sect__sortRow").click(function (e) {
    e.preventDefault();
    $(".sort-sect__sortCol").removeClass("active");
    $(".sort-sect__sortRow").addClass("active");   
    $(".catalog-full__list").removeClass("catalog__column");
    $(".catalog-full__list").addClass("catalog__rows");
    $(".catalog-full__list").addClass("catalog__opacity");
     $(".catalog-full__list.catalog__column").css({"display" : "none"});
    $(".catalog__opacity").animate({
        opacity: 1

    }, 1000);



  });

$(".sort-sect__sortCol").click(function (e) {
    e.preventDefault();
    $(".sort-sect__sortRow").removeClass("active");
    $(".sort-sect__sortCol").addClass("active");  
    $(".catalog-full__list").removeClass("catalog__rows");
    $(".catalog-full__list").removeClass("catalog__opacity");
   
    $(".catalog-full__list").addClass("catalog__column");
    $(".catalog-full__list.catalog__opacity").css({"display" : "none"});
    $(".catalog__column").animate({
        opacity: 1

    }, 1000);



  });


  //mobile menu

 
  $(".mobile-mnu").click(function (e) {
     e.preventDefault();
  $(".menu").slideToggle(200 , function() {
      if ($(this).css('display') === 'none') {
        $(this).removeAttr('style');
      };
  });

});


$(".menu li.dropdown").click(function (e) {

    var openLink = $(this).children(".sub-menu").css("display");
  
    if (openLink == "none") {
     $('.sub-menu').slideUp(200);
      $(this).children(".sub-menu").slideDown(200);
      $(this).children('a.triangle').addClass("active");
      
  } else if (openLink == "block") {
    $('a.triangle').removeClass("active");
    



  }

});

// Код благодаря которому диалоговые окна закрываются по клику на все окно браузера
jQuery(function($){
  $(document).mouseup(function (e){ // событие клика по веб-документу
    var div = $(".sub-menu"); // тут указываем ID элемента
    if (!div.is(e.target) // если клик был не по нашему блоку
        && div.has(e.target).length === 0) { // и не по его дочерним элементам
      div.slideUp(600); // скрываем его
      $('a.triangle').removeClass("active");

  }
});
});







//Slider Main

$('.slider-sect__list').owlCarousel({
    loop:true,
    margin:10,
    dots: true,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            
        },
        600:{
            items:1,
        },
        1000:{
            items:1,
            
            loop:false
        }
    }
})


var owl2 = $('.slider-sect__list.owl-carousel');
owl2.owlCarousel();

$('.slider-sect__arrowR').click(function() {
    owl2.trigger('next.owl.carousel');
})

$('.slider-sect__arrowL').click(function() {
    owl2.trigger('prev.owl.carousel', [300]);
})


///



//Slider Spec-sect

$('.slider-spec').owlCarousel({
    loop:true,
    margin:12,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false,
            margin:12
        },
        600:{
            items:2,
            nav:false,
            margin:12

        },
        1000:{
            items:3,
            nav:false,
            
        }
    }
})



var owl = $('.slider-spec.owl-carousel');
owl.owlCarousel();

$('.spec-sect__arrowL').click(function() {
    owl.trigger('next.owl.carousel');
})

$('.spec-sect__arrowR').click(function() {
    owl.trigger('prev.owl.carousel', [300]);
})



//Button More (Abouct Section)

$(".about-sect__btn > .js__about").click(function(e) {
    e.preventDefault();
  $(".about-sect__btn > .js__about").toggleClass("active-btn");
  $(".about-sect__btn > .js__about > .text-show").toggleClass("text-hidden");
  $(".about-sect__btn > .js__about > .text-hidden").toggleClass("text-active");
 
  
  $(".about-sect__right").toggleClass("active-height");
  });


//Slider Gallery

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

$(document).ready(function() {
  $('.landing-constr__text').magnificPopup({

    delegate: 'a',
    type:'image',
    gallery: {
      enabled: true,
      tCounter: '' // markup of counter
      
    },


  });
});


$(document).ready(function() {
  $('.landing-gallery').magnificPopup({

    delegate: 'a',
    type:'image',
    gallery: {
      enabled: true,
      tCounter: '' // markup of counter
     
    },


  });
});



//Popup ORDER-CALL

;(function($) {
  $(function() {
    $('.js__orderCall').bind('click', function(e) {
      e.preventDefault();
      $('.order-popupW').bPopup({
      });
      $('.order-popup__form form').ajaxForm(function() { 
        $(".success").bPopup({
          autoClose: 1000
        }); 
        var bPopupW = $('.order-popupW').bPopup();
        bPopupW.close();
      });       
    });

  });

})(jQuery);






$('#circles > .landing-gen__circle').click(function (){  

        var i = $(this).data('id');
        var visibleBlock = $(".landing-gen__circleDescr:visible");

        // есть ли вообще открытые блоки
        if(visibleBlock.length > 0) {
            
            // если клик по уже открытому блоку, просто его скрываем
            if($("#circle-descr" + i).is(":visible")) {
                $("#circle-descr" + i).slideUp();
            }
            // иначе скрываем все блоки, и потом открываем нужный
            else {
                $('.landing-gen__circleDescr').slideUp();
                $("#circle-descr" + i).slideDown();
            }
        }
        // если открытых нет, то  открываем нужный
        else {
            var circleDescr = $('#circle-descr'+i); 
            circleDescr.slideDown(); 
        }        
    }); 








                   
