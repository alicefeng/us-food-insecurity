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

function switchGraph(newStep, currentActiveStep)
{
  // first remove the current graph
  $('#vis-canvas svg').remove();
  $('#vis-canvas').hide();

  // then switch graphs based on what button was clicked 
  if(newStep == 'step1') { 
    $('#map_buttons').hide();
    drawFi_Plots();
    $('#vis-canvas').delay(300).fadeIn(500); 
  }
  else if(newStep == 'step2') { 
    $('#map_buttons').hide();
    drawSnapTs();
    $('#vis-canvas').delay(300).fadeIn(500);
  }
  else if(newStep == 'step3') { 
    $('#map_buttons').show();
    $('#btn-all').toggleClass("active", true);
    drawMap();
    $('#vis-canvas').delay(300).fadeIn(500); 
  }
  else { return false; };
}

$(document).ready(function() {

  drawFi_Plots();

  $("button.btn-default").click(function(e) {
    
    // save id of currently active step so that if the same button is clicked
    // multiple times, it won't keep appending new instances of the same graph
    var currentActiveStep = $('.active').attr('id');
    
    var clickedStep = $(this).attr('id');

    if (currentActiveStep != clickedStep) {
      switchStep(clickedStep);
      switchAnnotation(clickedStep);
      switchGraph(clickedStep, currentActiveStep);
    }

    return false;
  });

})