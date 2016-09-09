function switchAnnotation(navcount)
{
  // change annotation title if clicking on time series plot or the map
  if(navcount == 12) {
    $(".annotation-title").html("Number of people receiving SNAP benefits over time");
  }
  if(navcount == 13) {
    $(".annotation-title").html("SNAP Participation by County");
  }

  $(".annotation-step").hide();
  $("#step" + navcount + "-annotation").delay(300).fadeIn(500);
}

function switchGraph(navcount)
{
  $('#map_buttons').hide();
  
  // switch graphs based on what button was clicked 
  // remove the plot when switching between the circles and the time series plot or the map
  if(navcount == 1) {
    updateCircles("pctspendmore");
  }
  if(navcount == 2) { 
    updateCircles("pctfurther");
  }
  if(navcount == 3) { 
    updateCircles("pctnotenough");
  }
  if(navcount == 4) { 
    updateCircles("pctrunout");
  }
  if(navcount == 5) { 
    updateCircles("pctnofood");
  }
  if(navcount == 6) { 
    updateCircles("pctbalanced");
  }
  if(navcount == 7) { 
    updateCircles("pctcutmeals");
  }
  if(navcount == 8) { 
    updateCircles("pctateless");
  }
  if(navcount == 9) { 
    updateCircles("pcthungry");
  }
  if(navcount == 10) { 
    updateCircles("pctnoeat");
  }
  if(navcount == 11) { 
    updateCircles("pctinsecure");
  }
  if(navcount == 12) {
    $('#vis-canvas svg').remove();
    $('#vis-canvas').hide();
    drawSnapTs();
  }
  if(navcount == 13) { 
    $('#vis-canvas svg').remove();
    $('#vis-canvas').hide();

    // display map buttons
    $('#map_buttons').show();

    // set the button for "All" to active
    $('#btn-all').toggleClass("active", true);

    drawMap();
  }
  $('#vis-canvas').delay(300).fadeIn(500); 
}

$(document).ready(function() {

  // draw the first plot when the page is loaded
  drawFi_Plots();
  
  // set counter to track where we are in the story
  var navcount = 1;

  $("a.nav-button").click(function() {
    
    var id = $( this ).attr('id');

    // store "position" in story so the correct annotation and plot will be displayed
    // based on which button was clicked
    if(id == 'next') {
      navcount += 1;
    }
    else {
      navcount -= 1;
    }

    // make buttons active only when applicable
    if(navcount == 1) {
      // when page first loads or we're back on the first plot, the "next" button 
      // should be active and the "prev" button should be disabled
      $('#next').toggleClass("active", true);
      $('#next').toggleClass("disabled", false);
      $('#prev').toggleClass("active", false);
      $('#prev').toggleClass("disabled", true);
    }
    else if(navcount > 1 && navcount <= 12) {
      // both buttons should be active after the first click and before the last plot
      $('.nav-button').toggleClass("active", true);
      $('.nav-button').toggleClass("disabled", false);
    }
    else if(navcount > 12) {
      // the "next" button should be disabled when it reaches the last plot
      $('#next').toggleClass("active", false);
      $('#next').toggleClass("disabled", true);
    }
    else {
      // both buttons should be disabled all other times
      $('.nav-button').toggleClass("active", false);
      $('.nav-button').toggleClass("disabled", true);
    }

    // switch annotations and graphs based on button clicked
    switchAnnotation(navcount);
    switchGraph(navcount);
    
    console.log(navcount);

    return false;
  });

})