$(function () {
  'use strict'

  // Load demo images from flickr:
  $.ajax({
    // Flickr API is SSL only:
    // https://code.flickr.net/2014/04/30/flickr-api-going-ssl-only-on-june-27th-2014/
    url: 'https://api.flickr.com/services/rest/',
    data: {
      format: 'json',
      method: 'flickr.photosets.getPhotos',
      api_key: '04e30e9c7310d047c08abaceb6f51e93',
	    user_id: '98045454@N07',
        photoset_id: '72157674751800490'
	  // jshint ignore:line
    },
    dataType: 'jsonp',
    jsonp: 'jsoncallback'
  }).done(function (result) {
    var linksContainer = $('#links')
    var baseUrl
    // Add the demo images as links with thumbnails to the page:
    $.each(result.photoset.photo, function (index, photo) {
      baseUrl = 'https://farm' + photo.farm + '.static.flickr.com/' +
      photo.server + '/' + photo.id + '_' + photo.secret
      $('<a/>')
        .append($('<img>').prop('src', baseUrl + '_s.jpg'))
        .prop('href', baseUrl + '_b.jpg')
        .prop('title', photo.title)
        .attr('data-gallery', '')
        .appendTo(linksContainer)
    })
  })

  $('#borderless-checkbox').on('change', function () {
    var borderless = $(this).is(':checked')
    $('#blueimp-gallery').data('useBootstrapModal', !borderless)
    $('#blueimp-gallery').toggleClass('blueimp-gallery-controls', borderless)
  })

  $('#fullscreen-checkbox').on('change', function () {
    $('#blueimp-gallery').data('fullScreen', $(this).is(':checked'))
  })

  $('#image-gallery-button').on('click', function (event) {
    event.preventDefault()
    blueimp.Gallery($('#links a'), $('#blueimp-gallery').data())
  })
})
