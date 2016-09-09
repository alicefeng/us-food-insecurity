function switchStep(newStep)
{
  $(".btn").toggleClass("active", false);
  $("#" + newStep).toggleClass("active", true);
}

function switchAnnotation(newStep)
{
  // change annotation title if clicking on time series plot or the map
  if(newStep == 'step12') {
    $(".annotation-title").html("Number of people receiving SNAP benefits over time");
  }
  if(newStep == 'step13') {
    $(".annotation-title").html("SNAP Participation by County");
  }

  $(".annotation-step").hide();
  $("#" + newStep + "-annotation").delay(300).fadeIn(500);
}

function switchGraph(newStep)
{
  // switch graphs based on what button was clicked 
  // remove the plot when switching between the circles and the time series plot or the map
  if(newStep == 'step1') {
    $('#vis-canvas svg').remove();
    $('#vis-canvas').hide();
    $('#map_buttons').hide();
    drawFi_Plots();
    $('#vis-canvas').delay(300).fadeIn(500); 
  }
  if(newStep == 'step2') { 
    $('#map_buttons').hide();
    updateCircles("pctrunout");
    $('#vis-canvas').delay(300).fadeIn(500); 
  }
  if(newStep == 'step3') { 
    $('#map_buttons').hide();
    updateCircles("pctnotenough");
    $('#vis-canvas').delay(300).fadeIn(500); 
  }



  if(newStep == 'step12') {
    $('#vis-canvas svg').remove();
    $('#vis-canvas').hide();
    $('#map_buttons').hide();
    drawSnapTs();
    $('#vis-canvas').delay(300).fadeIn(500);
  }
  if(newStep == 'step13') { 
    $('#vis-canvas svg').remove();
    $('#vis-canvas').hide();

    // display map buttons
    $('#map_buttons').show();

    // set the button for "All" to active
    $('#btn-all').toggleClass("active", true);

    drawMap();
    $('#vis-canvas').delay(300).fadeIn(500); 
  }
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
      switchGraph(clickedStep);
    }

    return false;
  });

})