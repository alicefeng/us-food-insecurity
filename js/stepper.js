function switchStep(newStep)
{
  $(".btn").toggleClass("active", false);
  $("#" + newStep).toggleClass("active", true);
}

function switchAnnotation(newStep)
{
  $(".annotation-step").hide();
  $("#" + newStep + "-annotation").delay(300).fadeIn(500);
}

$(document).ready(function() {
  $("button.btn").click(function(e) {
    var clickedStep = $(this).attr('id');
    switchStep(clickedStep);
    switchAnnotation(clickedStep);
    return false;
  });
})