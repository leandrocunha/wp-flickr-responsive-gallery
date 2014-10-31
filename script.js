jQuery(document).ready(function($){
	var gallery_wrapper = $('#flickr-responsive-gallery'),
		gallery = gallery_wrapper.find('.frg-gallery'),
		gallery_id = gallery.data('gid');

	$.post('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=de7dac5b2384f700d787b0f5fd00d342&photoset_id=72157648206385098&format=json&nojsoncallback=1&api_sig=76961480c14f05e0d6ee5c01134f4fd2', function( data ) {

		var photos = data.photoset.photo;

  		gallery.append( data.photoset.title );
		photos.forEach(function(photo){
    		gallery.append('<img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg" />');
		});

  		console.log( photos );
	});

});
