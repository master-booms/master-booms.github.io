
//mobile

var touch = $('.menu__burger');
var menu = $('.menu ul');

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




//Scroll to ancor

$(document).on('click', '.menu ul a', function(event){
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
});


//Popups


//Open popup login form

;(function($) {
	$(function() {
		$('.js__enter').bind('click', function(e) {
		e.preventDefault();
		$('.popup-enter').bPopup();
	});

});

})(jQuery);


//Open popup Registrtion form

;(function($) {
	$(function() {
		$('.js__reg').bind('click', function(e) {
		e.preventDefault();
		$('.popup-reg').bPopup();
	});

});

})(jQuery);


//Open popup Recovery Password

;(function($) {
	$(function() {
		$('.js__pass').bind('click', function(e) {
		e.preventDefault();
		$('.popup-recovery').bPopup();
	});

});

})(jQuery);

                


//Open popup Thank message after recovery pass

;(function($) {
	$(function() {
		$('.js__thank-recovery').bind('click', function(e) {
		e.preventDefault();
		$('.thank-recovery').bPopup();
	});

});

})(jQuery);




//Open popup Thank message after registration

;(function($) {
	$(function() {
		$('.js__thank-reg').bind('click', function(e) {
		e.preventDefault();
		$('.thank-reg').bPopup();
	});

});

})(jQuery);


//Open popup Support
;(function($) {
	$(function() {
		$('.js__supportForm').bind('click', function(e) {
		e.preventDefault();
		$('.popup-support').bPopup();
	});

});

})(jQuery);



//Initialization slider Temp (section-five)

$('.section-five__slider').bxSlider({
  mode: 'fade',
  captions: true,
  pager: false,



});


$('.team-slider').bxSlider({
  mode: 'fade',
  captions: true,
  controls: false,



});






//Accordion Faq 

$(function() {
  var trigger = $(".faq-accordion__trigger");
  trigger
    .on("click", function(e) {
    	e.preventDefault();
      var ThisIt = $(this);
      $(".faq-accordion__trigger").not(ThisIt).removeClass("faq-accordion__trigger--active");
      $(this).toggleClass("faq-accordion__trigger--active");
      $(".faq-accordion__dropdown").not(ThisIt.next(".faq-accordion__dropdown")).slideUp(400);
      ThisIt.next(".faq-accordion__dropdown").stop( true, true ).slideToggle(400);
    })
   
    
});

$(function() {
  var trigger = $(".faq-accordionInner__trigger");
  trigger
    .on("click", function(e) {
    	e.preventDefault();
      var ThisIt = $(this);
      $(".faq-accordionInner__trigger").not(ThisIt).removeClass("faq-accordionInner__trigger--active");
      $(this).toggleClass("faq-accordionInner__trigger--active");
      $(".faq-accordionInner__dropdown").not(ThisIt.next(".faq-accordionInner__dropdown")).slideUp(400);
      ThisIt.next(".faq-accordionInner__dropdown").stop( true, true ).slideToggle(400);
    })
   
    
});


//Sidebar 


$(".sidebar-menu__title--mobile").bind('click', function(e) {
			$(this).next(".sidebar-menu__ul").slideToggle();
			$(this).toggleClass("sidebar-menu__title--mobile--active");
					});


var sidebar = $(".sidebar-menu__ul");

$(window).resize(function(){
	var w2 = $(window).width();
	if(w2 > 990 && sidebar.is(':hidden')) {
		sidebar.removeAttr('style');
	}
});
		



//Counter



function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);

