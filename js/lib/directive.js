angular.module("directive")
.directive( 'player', function (PlaybackService) {
	return {
	    restrict: 'CA',
	    replace: false,
	    transclude: false,
	    scope: {
	            index: '=index',
	            item: '=itemdata'
	    },
	    template: '<a href="#"><img src="{{item.src}}" alt="{{item.alt}}" /></a>',
	    link: function(scope, elem, attrs) {

        	console.log("inside a directive");
        	blob=PlaybackService.playback(scope.id);
        	
		    if (parseInt(scope.index)==0) {
		      angular.element(attrs.options).css({'background-image':'url('+ scope.item.src +')'});
		    }

	      	elem.bind('click', function() {

	        	var src = elem.find('img').attr('src');

	        // call your SmoothZoom here
	       	 angular.element(attrs.options).css({'background-image':'url('+ scope.item.src +')'});
	      	});
	    }
  	}
});