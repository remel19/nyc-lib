var nyc = nyc || {};
nyc.ol = nyc.ol || {};
nyc.ol.source = nyc.ol.source || {};

/**
 * @desc Class that extends ol.source.Vector for providing features decorated by an array of mixin objects
 * @public
 * @class
 * @extends {ol.source.Vector}
 * @constructor
 * @param {Object} options Vector source options
 * @param {Array<Object>}  decorationMixins An array of objects whose members will be added to all features created by this source
 * @param {nyc.ol.source.Decorating.AutoLoad=} autoLoad Object including auto loading properties
 * @fires nyc.ol.source.Decorating#change:featuresloaded
 * @fires nyc.ol.source.Decorating#change:featureloaderror
 * @see http://www.openlayers.org/
 */
nyc.ol.source.Decorating = function(options, decorationMixins, autoLoad){
	options = options || {};
	options.loader = options.loader || nyc.ol.source.Decorating.xhrLoader;
	/**
	 * @private
	 * @member {boolean}
	 */
	this.featuresloaded = false;
	/**
	 * @private
	 * @member {boolean}
	 */
	this.featureloaderror = false;
	/**
	 * @private
	 * @member {string}
	 */
	this._url = options.url;
	/**
	 * @private
	 * @member {ol.format.Feature}
	 */
	this._format = options.format;
	/**
	 * @private
	 * @member {boolean}
	 */
	this._xhrFeaturesLoaded = false;

	var proj = autoLoad ? autoLoad.projection : '';
	if (proj){
		options.strategy = function(){return []};
	}
	ol.source.Vector.call(this, options);
	this.on('addfeature', function(e){
		var feature = e.feature;
		if (!feature._decorated){
			$.each(decorationMixins, function(_, mixin){
				for (var memb in mixin){
					feature[memb] = mixin[memb];
				}
			});
			if (feature[nyc.ol.source.Decorating.AUTO_EXEC]){
				feature[nyc.ol.source.Decorating.AUTO_EXEC]();
			}
			feature._decorated = true;
		}
	});

	if (proj){
		proj = proj.getCode ? proj : new ol.proj.Projection({code: proj});
		options.loader.call(this, null, null, proj);
	}
};

ol.inherits(nyc.ol.source.Decorating, ol.source.Vector);

/**
 * @private
 * @param {ol.Extent} extent
 * @param {number} resolution
 * @param {string} projection
 */
nyc.ol.source.Decorating.xhrLoader = function(extent, resolution, projection){
	var me = this;
	if (!me._xhrFeaturesLoaded && me._url){
		$.ajax({
			url: me._url,
			dataType: 'html',
			success: function(data){
				me.addFeatures(me._format.readFeatures(data, {featureProjection: projection}));
				me._xhrFeaturesLoaded = true;
			    me.featuresloaded = true;
			    me.set('featuresloaded', true);
			},
			error: function(){
			    me.featureloaderror = true;
			    me.set('featureloaderror', true);
			}
		});
	}
};

/**
 * @desc Object type to hold the projection for auto loading of features
 * @public
 * @typedef {Object}
 * @property {ol.proj.ProjectionLike} nativeProjection The projection of the source data
 * @property {ol.proj.ProjectionLike} projection The projection of the map view in which the features of this source will be rendered
 */
nyc.ol.source.Decorating.AutoLoad;

/**
 * @desc Mixin function name to execute immediately after decorating the feature
 * @constant
 * @type {string}
 */
nyc.ol.source.Decorating.AUTO_EXEC = 'extendFeature';

/**
 * @desc Has the request for geoJSON data completed successfully
 * @public
 * @method
 * @return {boolean} The value indicating if the XHR request has successfully loaded the geoJSON data
 */
nyc.ol.source.Decorating.prototype.isXhrFeaturesLoaded = function(){
    return this._xhrFeaturesLoaded;
};

/**
 * @desc Enumeration for feature loading event type
 * @public
 * @enum {string}
 */
nyc.ol.source.Decorating.LoaderEventType = {
	/**
	 * @desc The features loaded event type
	 */
	FEATURESLOADED: 'change:featuresloaded',
	/**
	 * @desc The feature load error event type
	 */
	FEATURELOADERROR: 'change:featureloaderror'
};

/**
 * @desc The features loaded event
 * @event nyc.ol.source.Decorating#change:featuresloaded
 * @type {boolean}
 */

/**
 * @desc The feature load error event
 * @event nyc.ol.source.Decorating#change:featureloaderror
 * @type {boolean}
 */
