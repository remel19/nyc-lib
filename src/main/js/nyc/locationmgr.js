var nyc = nyc || {};

/**
 * @desc An class for managing user user-specified location information
 * @public
 * @class
 * @constructor
 * @param {nyc.LocationMgr.Options} options Constructor options
 */
nyc.LocationMgr = function(options){
	this.controls = options.controls;
	this.locate = options.locate;
	this.locator = options.locator;
	this.dialog = new nyc.Dialog();
	this.locate.on(nyc.Locate.EventType.GEOCODE, this.located, this);
	this.locate.on(nyc.Locate.EventType.GEOLOCATION, this.located, this);
	this.locate.on(nyc.Locate.EventType.AMBIGUOUS, this.ambiguous, this);
	this.controls.on(nyc.ZoomSearch.EventType.SEARCH, this.locate.search, this.locate);
	this.controls.on(nyc.ZoomSearch.EventType.GEOLOCATE, this.locate.locate, this.locate);
	this.controls.on(nyc.ZoomSearch.EventType.DISAMBIGUATED, this.located, this);
};

nyc.LocationMgr.prototype = {
	/**
	 * @private
	 * @member {nyc.ZoomSearch}
	 */
	controls: null,
	/**
	 * @private
	 * @member {nyc.Locate}
	 */
	locate: null,
	/**
	 * @private
	 * @member {nyc.Locator}
	 */
	locator: null,
	/**
	 * @private
	 * @member {nyc.Dialog}
	 */
	dialog: null,
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Ambiguous} data
	 */
	ambiguous: function(data){
		if (data.possible.length){
			this.controls.disambiguate(data);
		}else{
			this.controls.searching(false);
			this.dialog.ok('The location you entered was not understood');
		}
	},
	/**
	 * @private
	 * @method
	 * @param {nyc.Locate.Result} data 
	 */
	located: function(data, zoom){
		this.controls.val(data.type == nyc.Locate.EventType.GEOLOCATION ? '' : data.name);
		this.locator.zoomLocation(data);
	}	
};

/**
 * @desc Object type to hold constructor options for {@link nyc.LocationMgr}
 * @public
 * @typedef {Object}
 * @property {nyc.ZoomSearch} controls The UX controls for user input
 * @property {nyc.Locate} locate The geocoding and geolocation provider
 * @property {nyc.Locator} locator The locator used to manipulate a map
 */
nyc.LocationMgr.Options;
