$(document).ready(function(){

  // activate dropdown
  $('.dropdown-button').dropdown({
    hover: true,
    constrain_width: false
  });

  // activate mobile menu
  $('.button-collapse').sideNav();

  // activate parallax
  $('.parallax').parallax();

  //activate image enlargement
  $('.materialboxed').materialbox();

  //activate scrollspy(tracks certain elements and which element the user's screen is currently centered on)
  $('body').scrollSpy();

});
