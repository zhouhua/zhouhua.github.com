(function($) {
	
	/**
	 * Twenty-Four Hour Clock Face
	 *
	 * This class will generate a twenty-four our clock for FlipClock.js
	 *
	 * @param  object  The parent FlipClock.Factory object
	 * @param  object  An object of properties to override the default	
	 */
	 
	FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({

        constructor: function(factory, options){
            this.base(factory, options);
        },

		/**
		 * Build the clock face
		 *
			time     = time ? time : this.factory.time.getHourCounter();
		 * @param  object  Pass the time that should be used to display on the clock.	
		 */
		 
		build: function(time) {
			var t        = this;
			var children = this.factory.$wrapper.find('ul');
            var lists=[];
			
			time = this.factory.time.getMilitaryTime();
			
			if(time.length > children.length) {
				$.each(time, function(i, digit) {
					lists.push(t.createList(digit));
				});
			}

            this.factory.lists = lists;

            $(this.createDivider('秒')).insertBefore(this.factory.lists[this.factory.lists.length - 2].$obj);
            $(this.createDivider('分')).insertBefore(this.factory.lists[this.factory.lists.length - 4].$obj);
            $(this.createDivider('时', true)).insertBefore(this.factory.lists[this.factory.lists.length - 6].$obj);
			
			this._clearExcessDigits();
			
			if(this.autoStart) {
				this.start();
			}
		},
		
		/**
		 * Flip the clock face
		 */
		 
		flip: function(time) {
			time = time ? time : this.factory.time.getMilitaryTime();
			this.base(time);	
		},
		
		/**
		 * Clear the excess digits from the tens columns for sec/min
		 */
		 
		_clearExcessDigits: function() {
			var tenSeconds = this.factory.lists[this.factory.lists.length - 2];
			var tenMinutes = this.factory.lists[this.factory.lists.length - 4];
			
			for(var x = 6; x < 10; x++) {
				tenSeconds.$obj.find('li:last-child').remove();
				tenMinutes.$obj.find('li:last-child').remove();
			}
		}
				
	});
	
}(jQuery));