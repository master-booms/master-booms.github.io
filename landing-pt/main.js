$(document).ready(function() {
	$(".q1option").click(function() {
		$("#q1").hide();
		$("#terms").hide();
		$("#q2").fadeIn()
	});
	$(".q2option").click(function() {
		$("#q2").hide();
		$("#q3").fadeIn()
	});
	$(".q3option").click(function() {
		$("#q3").hide();
		$("#q4").fadeIn()
	});
	$(".q4option").click(function() {
		$("#q4").hide();
		$("#q5").fadeIn()
	});	
	$(".q5option").click(function() {
		$("#q5").hide();
		$("#q6").fadeIn()
	});	


	$(".q6option").click(function() {
		$("#q6").hide();
		$("#audio").hide();
		$("#process1").show();
		setTimeout(function() {
			$("#process1").hide();
			$("#process2").show()
		}, 1500);
		setTimeout(function() {
			$("#process2").hide();
			$("#process3").show()
		}, 3e3);
		setTimeout(function() {
			$("#process2").hide();
			$("#process3").show()
		}, 4500);
		setTimeout(function() {
			$("#process3").hide();
			$(".container1").slideDown();
			$(".survey-container").hide();
		}, 6e3)
	});
	$(".option").mouseenter(function() {
		$(this).css("background-color", "#bababa");
		$(this).css("cursor", "pointer")
	});
	$(".option").mouseleave(function() {
		$(this).css("background-color", "white")
	});
	$(".container1").mouseenter(function() {
		$(this).css("background-color", "#c6c6c6");
		$(this).css("cursor", "pointer")
	});
	$(".final").mouseleave(function() {
		$(this).css("background-color", "white")
	})
})