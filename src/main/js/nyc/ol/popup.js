var nyc = nyc || {};
nyc.ol = nyc.ol || {};

/**
 * @desc A class to display popups on a map
 * @public
 * @class
 * @extends {ol.Overlay}
 * @constructor
 * @param {ol.Map} map The OpenLayers map on which to display the popup
 * @param {Object} options Overlay options
 * @see http://www.openlayers.org/
 */
nyc.ol.Popup = function(map, options){
	var me = this;
	options = options || {};
	this.options = options;
	me.container = $('<div></div>');
	me.container.addClass('popup');
	me.closer = $('<a><span class="screen-reader-only">Close</span></a>');
	me.closer.addClass('popup-closer');
	me.container.append(me.closer);
	me.closer.click(function(){me.container.fadeOut();});
	me.content =  $('<div></div>');
	me.content.addClass('popup-content');
	me.container.append(me.content);
	options.element = me.container[0];
	options.stopEvent = true;
	ol.Overlay.call(this, options);
	map.addOverlay(me);
	me.container.on('mouseover mousemove', function(event){
		event.stopPropagation();
		$('.feature-tip').hide();
	});
	if (me.options.coordinates) me.show(me.options);
};
ol.inherits(nyc.ol.Popup, ol.Overlay);

/**
 * @desc Show the popup
 * @public
 * @method
 * @param {Object} options Overlay options
 */
nyc.ol.Popup.prototype.show = function(options){
	this.setOptions(options);
	this.setPosition(this.coordinates);
	if (!this.visible()) this.container.fadeIn();
	$('.feature-tip').hide();
	this.pan();
};

/**
 * @private
 * @method
 * @return {boolean} visibility
 */
nyc.ol.Popup.prototype.visible = function(){
	return this.container.css('display') == 'block';
};

/**
 * @private
 * @method
 * @return {boolean}
 */
nyc.ol.Popup.prototype.isMobile = function(){
	return navigator.userAgent.match(/(iPad|iPhone|iPod|iOS|Android)/g) != null;
}

/**
 * @desc Set popup options
 * @public
 * @method
 * @param {Oject} options Overlay options
 */
nyc.ol.Popup.prototype.setOptions = function(options){
	if (options){
		for (var o in options){
			this.options[o] = options[o];
		}
	}
	this.coordinates = this.options.coordinates;
	if (this.options.html){
		this.content.html(this.options.html).trigger('create');
	}
	if (this.isMobile()){
		this.content.find('a, button').each(function(_, n){
			if ($(n).attr('onclick')){
				$(n).bind('tap', function(){
					$(n).trigger('click');
				});
			}
		});				
	}

	this.margin = this.options.margin || [10, 10, 10, 10];
};

/**
 * @desc Hide the popup 
 * @method
 * @public
 */
nyc.ol.Popup.prototype.hide = function() {
	this.container.fadeOut();
};

/**
 * @private
 * @method
 */
nyc.ol.Popup.prototype.pan = function(){
	var n = this.getElement();
	if ($(n).css('display') == 'none') return;
	var map = this.getMap();
	var view = map.getView();
	var tailHeight = parseInt($(n).css('bottom'));
	var tailOffsetLeft = -parseInt($(n).css('left'));
	var popOffset = this.getOffset();
	var popPx = map.getPixelFromCoordinate(this.options.coordinates);
	var mapSize = map.getSize();
	var popSize = {
		width: $(n).width(),
		height: $(n).height() + tailHeight
	};
	var tailOffsetRight = popSize.width - tailOffsetLeft;
	var fromLeft = (popPx[0] - tailOffsetLeft) - this.margin[3];
	var fromRight = mapSize[0] - (popPx[0] + tailOffsetRight) - this.margin[1];
	var fromTop = popPx[1] - popSize.height + popOffset[1] - this.margin[0];
	var fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1] - this.margin[2];
	var center = view.getCenter();
	var px = map.getPixelFromCoordinate(center);
	
	if (fromRight < 0) {
		px[0] -= fromRight;
	} else if (fromLeft < 0) {
		px[0] += fromLeft;
	}
	if (fromTop < 0) {
		px[1] += fromTop;
	} else if (fromBottom < 0) {
		px[1] -= fromBottom;
	}
	view.animate({center: map.getCoordinateFromPixel(px)});
};
