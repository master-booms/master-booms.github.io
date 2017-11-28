function synchronizeValues() {
	this.setAttribute("data-value", this.value)
}
$(".js__cityClick").click(function() {
	$(".header__city").addClass("city-active"), $(".header__cityItem").addClass("active");
	var e = $(".city__popup").css("display");
	return "none" == e ? ($(".city__popup").show(), $(".overflow-body").show(), $("body").addClass("city-overflow"), $(".wrapper").addClass("overflow-scroll")) : ($(".city__popup").hide(), $(".overflow-body").hide(), $(".header__city").removeClass("city-active"), $("body").removeClass("city-overflow"), $(".header__cityItem").removeClass("active"), $(".wrapper").removeClass("overflow-scroll")), $(".overflow-body").click(function() {
		$(".city__popup").hide(), $(".overflow-body").hide(), $(".header__city").removeClass("city-active"), $("body").removeClass("city-overflow"), $(".header__cityItem").removeClass("active"), $(".wrapper").removeClass("overflow-scroll")
	}), !1
}), $(".header__spoilerItem").click(function() {
	$(this).children(".header__middleDropdown.header__middleDropdown--inner").toggleClass("active"), $(this).children(".header__spoilerList.header__spoilerList--bottom li a.header__middleLink--arrow").toggleClass("active")
}), $(".menu-right a").click(function() {
	var e = $(this).attr("href");
	return $("body").animate({
		scrollTop: $(e).offset().top - 70
	}, 1e3), !1
}), $("form[name='order-form'] ").validate({
	rules: {
		firstname: "required",
		phone: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".aside-subscr__form").validate({
	rules: {
		firstname: "required",
		phone: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".cro-form__form ").validate({
	rules: {
		firstname: "required",
		phone: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".advice-form__form").validate({
	rules: {
		phone: "required"
	},
	messages: {
		phone: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".doc-cro__orderForm ").validate({
	rules: {
		firstname: "required",
		phone: "required",
		name: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		name: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".cro-dop__orderForm ").validate({
	rules: {
		firstname: "required",
		phone: "required",
		name: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		name: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".step-form__form ").validate({
	rules: {
		firstname: "required",
		phone: "required",
		name: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		name: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show()
	}
}), $(".btn-big").click(function(e) {
	e.preventDefault(), $(".popup-form").show()
}), $(".popup-close").click(function(e) {
	e.preventDefault(), $(".popup-form").hide()
}), $("#main-form").validate({
	rules: {
		firstname: "required",
		phone: "required",
		name: "required",
		phone1: "required",
		text: "required",
		email: {
			required: !0,
			email: !0
		}
	},
	messages: {
		firstname: "",
		phone: "",
		name: "",
		email: "",
		text: ""
	},
	submitHandler: function(e) {
		$(".thank-popup").show(), $(".popup-form").hide()
	}
}), $(".js__thankClose").click(function() {
	$(".thank-popup").hide()
}), $(".js__sticker").sticky({
	topSpacing: 0
}), $(".js__stickerSidebar").sticky({
	topSpacing: 70,
	bottomSpacing: 1161
}), $(".float-label-control label").click(function() {
	$(this).siblings(".float-label-control input, .float-label-control textarea").focus()
});
for (var flc_inputs = document.querySelectorAll(".float-label-control > input"), flc_textareas = document.querySelectorAll(".float-label-control > textarea"), i = 0; i < flc_inputs.length; i++) flc_inputs[i].addEventListener("keyup", synchronizeValues);
for (var j = 0; j < flc_textareas.length; j++) flc_textareas[j].addEventListener("keyup", synchronizeValues);
if (jQuery(function(e) {
		e.mask.definitions["~"] = "[+-]", e("#phone, #phone-subscr, #phone-subscrCRO, #phon-advice, #doc-phone, #cro-dop-phone, #cro-step__form").mask("+7(999) 999-9999")
	}), $(document).ready(function() {
		$(".js__galleryNews, .license-block1__img, .registration-slider__item ").magnificPopup({
			delegate: "a",
			type: "image",
			gallery: {
				enabled: !1,
				tCounter: ""
			}
		})
	}), $(function() {
		$(".js__calendar").datepicker({
			changeMonth: !0,
			changeYear: !0
		})
	}), $(".js__calendarClick").click(function(e) {
		e.preventDefault();
		var r = $(".aside-calendar").css("display");
		return "none" == r ? ($(".js__calendar").show(), $(".js__calendarClick  li a").addClass("active")) : ($(".js__calendar").hide(), $(".js__calendarClick  li a").removeClass("active")), !1
	}), $(".js__calendarClose").click(function() {
		$(".js__calendar").hide()
	}), $("[data-toggle]").on("click", function() {
		var e = $(this).data("toggle");
		$(this).toggleClass(e)
	}), $(".step-form")) {
	$(".progress-bar").each(function() {
		var e = $(this).data("progress");
		$(this).find(".line").width(e + "%"), 100 == e && $(this).addClass("progress-bar__white")
	});
	var nextStep = function() {
			$(".step").addClass("hidden"), step++, $('[data-step="' + step + '"]').removeClass("hidden")
		},
		prevStep = function() {
			$(".step").addClass("hidden"), step--, $('[data-step="' + step + '"]').removeClass("hidden")
		},
		step = 0,
		result = [];
	$(".step .btn").on("click", function() {
		nextStep(), result[step] = $(this).data("value"), $('.step [name="result"]').val(result), $(".result-heading").html(""), $(".result-row").html(""), result.forEach(function(e, r) {
			$(".result-heading").append("<th>" + $('[data-step="' + (r - 1) + '"]').find(".step-form_heading").text() + "</th>"), $(".result-row").append("<td>" + e + "</td>")
		})
	}), $(".step .btn-prev").on("click", prevStep), $(".step .btn-next").on("click", nextStep)
}
$(document).ready(function() {
	$(".cro-block11__slider").bxSlider({
		controls: !1,
		adaptiveHeight: !0,
		auto: !0,
		speed: 2e3
	})
}), $(document).ready(function() {
	$(".registration-slider__carousel").bxSlider({
		controls: !1,
		adaptiveHeight: !0,
		slideWidth: 180,
		minSlides: 4,
		maxSlides: 4,
		moveSlides: 1,
		slideMargin: 20,
		auto: !0,
		pager: !1,
		autoHover: !0,
		touchEnabled: !1
	})
}), $(".js__select").select2({
	minimumResultsForSearch: 1 / 0
}), jQuery("#my-slider").slick({
	dots: !0,
	infinite: !0,
	centerMode: !0,
	slidesToShow: 3,
	autoplay: !0,
	autoplaySpeed: 5e3,
	slidesToScroll: 1,
	appendDots: $(".my-dotts")
}), jQuery(window).on("resize", function() {
	var e = jQuery(window).width(),
		e = parseInt(e),
		r = jQuery(window).width(),
		r = parseInt(e);
	if (1164 > e) {
		var e = 1164,
			t = (3600 - e) / 2,
			t = -1 * t;
		jQuery("#my-slider").css("margin-left", t), jQuery("#my-slider .padding").css("width", r)
	} else {
		var t = (3600 - e) / 2,
			t = -1 * t;
		jQuery("#my-slider").css("margin-left", t)
	}
}).resize();
