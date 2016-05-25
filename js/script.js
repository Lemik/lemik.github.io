//script for back screen image
$(function () {
  $(window).on("load resize", function () {
    $(".fill-screen").css("height", window.innerHeight);
  });
//video 
//  $("#video-wallpaper").wallpaper({
//    source: {
//        poster: "images/2x1200x600.jpg",
//        mp4: "video.mp4"
//       // video: "//www.youtube.com/embed/plW58zpcmpk"
//    }
//   });

});