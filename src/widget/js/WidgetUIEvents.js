/**
 * Support for Widget UI Events (Custom Events fired by the widget, which wrap the underlying DOM events - e.g. widget:click, widget:mousedown)
 *
 * @module widget
 * @submodule widget-uievents
 */

var BOUNDING_BOX = "boundingBox",
    Widget = Y.Widget,
    RENDER = "render",
    L = Y.Lang,
    EVENT_PREFIX_DELIMITER = ":";

Y.mix(Widget.prototype, {

    /**
     * Destructor logic for UI event infrastructure,
     * invoked during Widget destruction.
     *
     * @method _destroyUIEvents
     * @for Widget
     * @private
     */
    _destroyUIEvents: function() {

        var widgetGuid = Y.stamp(this, true),
            uievts = this._uievts;

        if (uievts) {
            Y.each(uievts, function (info, key) {
                if (info.instances[widgetGuid]) {
                    //  Unregister this Widget instance as needing this delegated
                    //  event listener.
                    delete info.instances[widgetGuid];
    
                    //  There are no more Widget instances using this delegated 
                    //  event listener, so detach it.
    
                    if (Y.Object.isEmpty(info.instances)) {
                        info.handle.detach();
    
                        if (uievts[key]) {
                            delete uievts[key];
                        }
                    }
                }
            });
        }
    },

    /**
     * Map of DOM events that should be fired as Custom Events by the  
     * Widget instance.
     *
     * @property UI_EVENTS
     * @for Widget
     * @type Object
     */
    UI_EVENTS: Y.Node.DOM_EVENTS,

    /**
     * Returns the node on which to bind delegate listeners.
     *
     * @method _getUIEventNode
     * @for Widget
     * @protected
     */
    _getUIEventNode: function () {
        return this.get(BOUNDING_BOX);
    },

    /**
     * Binds a delegated DOM event listener of the specified type to the 
     * Widget's outtermost DOM element to facilitate the firing of a Custom
     * Event of the same type for the Widget instance.  
     *
     * @private
     * @for Widget 
     * @method _createUIEvent
     * @param type {String} String representing the name of the event
     */
    _createUIEvent: function (type) {

        var uiEvtNode = this._getUIEventNode(),
            key = (Y.stamp(uiEvtNode) + type),
            info,
            handle;

        this._uievts = this._uievts || {};
        info = this._uievts[key];

        //  For each Node instance: Ensure that there is only one delegated
        //  event listener used to fire Widget UI events.

        if (!info) {
            Y.log("Creating delegate for the " + type + " event.", "info", "widget");

            handle = uiEvtNode.delegate(type, function (evt) {

                var widget = Widget.getByNode(this);
                //  Make the DOM event a property of the custom event
                //  so that developers still have access to it.
                widget.fire(evt.type, { domEvent: evt });

            }, "." + Y.Widget.getClassName());

            this._uievts[key] = info = { instances: {}, handle: handle };
        }

        //  Register this Widget as using this Node as a delegation container.
        info.instances[Y.stamp(this)] = 1;
    },

    /**
     * Determines if the specified event is a UI event.
     *
     * @private
     * @method _isUIEvent
     * @for Widget 
     * @param type {String} String representing the name of the event
     * @return {String} Event Returns the name of the UI Event, otherwise 
     * undefined.
     */
    _getUIEvent: function (type) {

        if (L.isString(type)) {
            var sType = this.parseType(type)[1],
                iDelim,
                returnVal;

            if (sType) {
                // TODO: Get delimiter from ET, or have ET support this.
                iDelim = sType.indexOf(EVENT_PREFIX_DELIMITER);
                if (iDelim > -1) {
                    sType = sType.substring(iDelim + EVENT_PREFIX_DELIMITER.length);
                }

                if (this.UI_EVENTS[sType]) {
                    returnVal = sType;
                }
            }

            return returnVal;
        }
    },

    /**
     * Sets up infastructure required to fire a UI event.
     * 
     * @private
     * @method _initUIEvent
     * @for Widget
     * @param type {String} String representing the name of the event
     * @return {String}     
     */
    _initUIEvent: function (type) {
        var sType = this._getUIEvent(type),
            queue = this._uiEvtsInitQueue || {};

        if (sType && !queue[sType]) {
            Y.log("Deferring creation of " + type + " delegate until render.", "info", "widget");

            this._uiEvtsInitQueue = queue[sType] = 1;

            this.after(RENDER, function() { 
                this._createUIEvent(sType);
                delete this._uiEvtsInitQueue[sType];
            });
        }
    },

    //  Override of "on" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").
    //  Temporary solution until we have the ability to listen to when 
    //  someone adds an event listener (bug 2528230)
    on: function (type) {
        this._initUIEvent(type);
        return Widget.superclass.on.apply(this, arguments);
    },

    //  Override of "publish" from Base to facilitate the firing of Widget events
    //  based on DOM events of the same name/type (e.g. "click", "mouseover").    
    //  Temporary solution until we have the ability to listen to when 
    //  someone publishes an event (bug 2528230)     
    publish: function (type, config) {
        var sType = this._getUIEvent(type);
        if (sType && config && config.defaultFn) {
            this._initUIEvent(sType);
        }        
        return Widget.superclass.publish.apply(this, arguments);
    }

}, true); // overwrite existing EventTarget methods
