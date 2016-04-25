//script for back screen image
$(function () {
  $(window).on("load resize", function () {
    $(".fill-screen").css("height", window.innerHeight);
  });
});