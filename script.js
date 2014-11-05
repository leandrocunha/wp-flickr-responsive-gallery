jQuery(document).ready(function($){
	var api_key	= '22f8544cfa560f0c1663b5653537f96f',
		set_id = $('.frg-gallery').data('gid'),
		gallery_wrapper = $('#flickr-responsive-gallery'),
		gallery = gallery_wrapper.find('.frg-gallery-list'),
		gallery_thumb = gallery_wrapper.find('.frg-gallery-thumb-nav'),
		tpl = '',
		total_pages = 0,
		thumb_links = undefined;

	$.post('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_id + '&format=json&nojsoncallback=1', function( data ) {

		var photos = data.photoset.photo;

  		//gallery.append( data.photoset.title );
		photos.forEach(function(photo){
    		gallery.append('<li class="item"><img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg" /></li>');
    		gallery_thumb.append('<li class="item"><a class="link" href="#"><img src="https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg" /></a></li>');
		});

		total_pages = gallery_thumb.find('li').length;
		$('.pagination-wrapper .total').html( total_pages );

		// load Owl Carousel
		$("#owl-carousel-gallery").owlCarousel({
			singleItem: true,
			navigation: true,
			afterAction : syncPosition,
    		responsiveRefreshRate : 200
		});

		gallery_thumb.owlCarousel({
			items: 3,
			navigation: true,
			scrollPerPage: true,
			rewindNav: false,
		    responsiveRefreshRate : 100,
		    afterInit : function(el){
		      el.find(".owl-item").eq(0).addClass("synced");
		    }
		});

	  	function syncPosition(el){
	    	var current = this.currentItem;
	    
	      	gallery_thumb.find(".owl-item").removeClass("synced").eq(current).addClass("synced");

	    	if(gallery_thumb.data("owlCarousel") !== undefined){
	      		center(current)
	    	}
	  	}

		gallery_thumb.on("click", ".owl-item", function(e){
		    e.preventDefault();
		    var number = $(this).data("owlItem");
		    $("#owl-carousel-gallery").trigger("owl.goTo",number);
		});

  		function center(number){
    	
    		var sync2visible = gallery_thumb.data("owlCarousel").owl.visibleItems,
    			num = number,
    			found = false,
    			current_page = 0;

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

    		current_page = num + 1;
    		$('.pagination-wrapper .current').html(current_page);
  		}
	});

});
