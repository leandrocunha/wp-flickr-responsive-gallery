jQuery(document).ready(function($){
	var api_key	= '22f8544cfa560f0c1663b5653537f96f',
		gallery_wrapper = $('#flickr-responsive-gallery'),
		gallery = gallery_wrapper.find('.frg-gallery-list'),
		gallery_thumb = gallery_wrapper.find('.frg-gallery-thumb-nav'),
		tpl = '';

	$.post('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=72157648206385098&format=json&nojsoncallback=1', function( data ) {

		var photos = data.photoset.photo;

  		//gallery.append( data.photoset.title );
		photos.forEach(function(photo){
    		gallery.append('<li class="item"><img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg" /></li>');
    		gallery_thumb.append('<li class="item"><img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg" /></li>');
		});

		// load Owl Carousel
		$("#owl-carousel-gallery").owlCarousel({
			singleItem: true,
			autoPlay: true,
			navigation: true,
			afterAction : syncPosition,
    		responsiveRefreshRate : 200
		});

		gallery_thumb.owlCarousel({
			items: 3,
		    pagination:false,
		    responsiveRefreshRate : 100,
		    afterInit : function(el){
		      el.find(".owl-item").eq(0).addClass("synced");
		    }
		});

	  function syncPosition(el){
	    var current = this.currentItem;
	    
	      gallery_thumb.find(".owl-item")
	      .removeClass("synced")
	      .eq(current)
	      .addClass("synced")
	    if(gallery_thumb.data("owlCarousel") !== undefined){
	      center(current)
	    }
	  }

  function center(number){
    var sync2visible = gallery_thumb.data("owlCarousel").owl.visibleItems;
    var num = number;
    var found = false;
    for(var i in sync2visible){
      if(num === sync2visible[i]){
        var found = true;
      }
    }
 
    if(found===false){
      if(num>sync2visible[sync2visible.length-1]){
        gallery_thumb.trigger("owl.goTo", num - sync2visible.length+2)
      }else{
        if(num - 1 === -1){
          num = 0;
        }
        gallery_thumb.trigger("owl.goTo", num);
      }
    } else if(num === sync2visible[sync2visible.length-1]){
      gallery_thumb.trigger("owl.goTo", sync2visible[1])
    } else if(num === sync2visible[0]){
      gallery_thumb.trigger("owl.goTo", num-1)
    }
    
  }

		function owl_thumb_nav(){

			var gallery_wrapper = $('#flickr-responsive-gallery');

			gallery_wrapper.append('<ul class="owl-thumb-nav-wrapper"></ul>');

	        $.each(this.owl.userItems, function (i) {

	        	var thumb_nav_wrapper = $('.owl-thumb-nav-wrapper'),
	        		img_src = $(this).find('img').attr('src');

        		thumb_nav_wrapper.append('<li class="item"><a class="item-link item-' + i + '" href="#"/></li>');

        		$('.item-' + i).css({
	                    'background': 'url(' + $(this).find('img').attr('src') + ') center center no-repeat',
	                    '-webkit-background-size': 'cover',
	                    '-moz-background-size': 'cover',
	                    '-o-background-size': 'cover',
	                    'background-size': 'cover'
	                });

	            // $(pafinatorsLink[i])
	            //     // i - counter
	            //     // Give some styles and set background image for pagination item
	            //     .css({
	            //         'background': 'url(' + $(this).find('img').attr('src') + ') center center no-repeat',
	            //         '-webkit-background-size': 'cover',
	            //         '-moz-background-size': 'cover',
	            //         '-o-background-size': 'cover',
	            //         'background-size': 'cover'
	            //     })
	            //     // set Custom Event for pagination item
	            //     .click(function () {
	            //         owl.trigger('owl.goTo', i);
	            //     });

	        });

			$('.owl-thumb-nav-wrapper').owlCarousel({
				items: 3
			});
		}
	});

});
