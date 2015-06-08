/*
 * Ribbon
 * State-of-the-art Ribbonbar UI (visit http://ribbonjs.com/ for complete documentation and examples)
 * @version 4.3.0 (source)
 * @namespace window.AcidJs
 * @class Ribbon
 * @requires jQuery
 * @developer Martin Ivanov
 * @url component page: http://ribbonjs.com/
 * @url developer website: http://wemakesites.net/
 * @url developer twitter: https://twitter.com/wemakesitesnet
 * @url developer blog: http://martinivanov.net/
 **/

(function() {
    
    "use strict";
    
    /*
     * @constants
     **/
    var
        trial = false,
        W = window,
        D = document,
        $ = W.jQuery,
        B = $("body"),
        /*
         * Check the domain
         * @method _checkDomain
         * @protected
         * @return {Boolean}
         **/
        _checkDomain = function() {
            if(W.location.href.indexOf("ribbonjs.com") === -1 && trial) {
                return true;
            }
            return false;
        },
        /*
         * Set trial version limitations
         * @method _setTrialLimitations
         * @protected
         * @return {Boolean}
         **/
        _setTrialLimitations = function(ribbon) {
            
            if(!_checkDomain()) {
                return;
            }
            
            var
                max = 10,
                rand = W.Math.floor((W.Math.random() * max) + 1),
                bBox = ribbon.getBoundingBox(),
                limitations = 'If you wish to remove all trial limitations and messages and use the control on a live server you should purchase a license from http://ribbonjs.com/buy.',
                messages = [
                    'The enableRibbon() method of Ribbon JS has been disabled for the trial version. ' + limitations,
                    '<p title="The trial version of this control is for personal and testing purposes only. If you want to use AcidJs.Ribbon on a live server, you should purchase the full version.">This is a trial and limited version of <a href="http://ribbonjs.com/" target="_blank">AcidJs.Ribbon</a>. Please, <a href="http://ribbonjs.com/buy">purchase</a> the full version.</p>',
                    'You are using a trial version of Ribbon JS, which is being disabled randomly. ' + limitations,
                    'Please, reload the page and try again.'
                ];
            
            W.console.info(messages[2]);
            
            bBox.append(messages[1]);
            
            if([0, 3, 9, 6, 2].indexOf(rand) !== -1) {
                this.enableRibbon = function() {
                    W.console.info(messages[0]);
                };
                
                this._later(function() {
                    W.console.info(messages[2], messages[3]);
                    ribbon.disableRibbon();
                }, 2000);
            }
        };
    
    /*
     * @namespace window.AcidJs
     **/
    if(undefined === W.AcidJs) {
        W.AcidJs = {};
    }
    
    /*
     * @class Ribbon
     * @constructor
     * @param {Object} config [required] (visit http://ribbonjs.com/docs#config for complete documentation and examples)
     * @return {Object}
     **/
    function Ribbon(config) {
        
        config = config || {};
        
        if(!config.boundingBox || !config.boundingBox.length) {
            return W.console.error(this.MESSAGES.boundingBoxIsNull);
        }
        
        for(var property in config) {
            if(config.hasOwnProperty(property)) {
                this[property] = config[property];
            }
        }
        
        if(this.loadCss) {
            this._loadStylesheet("base");
        }
    }
    
    /*
     * @namespace window.AcidJs
     * @class Ribbon
     * @prototype
     * @return Object
     **/
    Ribbon.prototype = {
        
        /*
         * Ribbon enabled flag, working with the enableRibbon() and disableRibbon() methods. If false, ribbon's "acidjs-ribbon-tool-clicked" will not be triggered
         * @private
         * @return void
         **/
        _enabled: true,
        
        /*
         * Manifest
         * @member {Object} MANIFEST
         * @public
         **/
        MANIFEST: {
            version: "4.3.0",
            name: "Ribbon JS",
            releaseDate: "2015-03-28",
            releaseNotes: "http://ribbonjs.com/release-notes",
            developer: "Martin Ivanov",
            description: "Web-based MSOffice-like ribbon toolbar, built with HTML5, JavaScript and CSS3",
            websites: {
                page: "http://ribbonjs.com/",
                portfolio: "http://wemakesites.net",
                blog: "http://martinivanov.net/",
                twitter: "https://twitter.com/wemakesitesnet",
                purchase: "http://ribbonjs.com/buy"
            },
            email: "acid_martin@yahoo.com"
        },
        
        /*
         * Command/tool custom data sets
         * @member {Object} props
         * @private
         **/
        props: {
    
        },
        
        /*
         * Tab custom data sets
         * @member {Object} props
         * @private
         **/
        tabProps: {
    
        },
        
        /*
         * Highlighted tabs cache, used by the highlightTabsGroup() and unhighlightTabsGroup() methods
         * @member {Object} highLightedTabs
         * @public
         **/
        highLightedTabs: {
    
        },
        
        /*
         * Array of custom CSS classes that can be applied to the boundingBox
         * @member {Array} cssClasses
         * @public
         **/
        cssClasses: [
            
        ],
        
        /*
         * If set to false, the stylesheet of the ribbon will not be loaded from the control, but you will have to register it on the page via the <link /> tag 
         * @member {Boolean} loadCss
         * @public
         **/
        loadCss: true,
        
        /*
         * HTML attributes used by the class
         * @member {Object} ATTRS
         * @public
         **/
        ATTRS: {
            name: "data-name",
            value: "data-value",
            type: "data-type",
            toolName: "data-tool-name",
            open: "open",
            hidden: "hidden",
            size: "data-tool-size",
            tabGroupName: "data-tab-group-name"
        },
        
        /*
         * Custom events, triggerd by the ribbon
         * @member {Array} EVENTS
         * @public
         **/
        EVENTS: [
            "acidjs-ribbon-tool-clicked",
            "acidjs-ribbon-ready",
            "acidjs-ribbon-tab-changed",
            "acidjs-ribbon-toggle" // since version 4.2.0
        ],
        
        /*
         * URLS used by the class
         * @member {Object} URLS
         * @public
         **/
        URLS: {
            base: "AcidJs.Ribbon/styles/Ribbon.css",
            icon: "{appRoot}AcidJs.Ribbon/icons/{size}/{name}.png"
        },
        
        /*
         * Path to the AcidJs.Ribbon/ folder
         * @member {String} appRoot
         * @public
         **/
        appRoot: "",
        
        /*
         * Width of the ribbon
         * @member {Number|String} width
         * @public
         **/
        width: "100%",
        
        /*
         * Error, critical and info messages
         * @member {Object} MESSAGES
         * @public
         **/
        MESSAGES: {
            boundingBoxIsNull: "Cannot render ribbon, because the specified config.boundingBox is null or undefined."
        },
        
        /*
         * CSS classes used internally
         * @member {Object} CSS_CLASSES
         * @public
         **/
        CSS_CLASSES: {
            ui: "acidjs-ui",
            base: "acidjs-ui-ribbon",
            flat: "acidjs-ui-ribbon-flat",
            ribbonDropdown: "acidjs-ui-ribbon-dropdown",
            open: "acidjs-ui-ribbon-dropdown-open",
            tabButtons: "acidjs-ui-ribbon-tab-buttons",
            ribbons: "acidjs-ui-ribbon-tab-ribbons",
            tabContent: "acidjs-ui-ribbon-tab-content",
            selected: "acidjs-ui-ribbon-tool-selected",
            dropdown: "acidjs-ui-ribbon-tool-dropdown",
            colorPicker: "acidjs-ui-ribbon-tool-color-picker",
            colorPickerDropdownArrow: ".acidjs-ui-ribbon-tool-color-picker > div:first-child .acidjs-ribbon-arrow",
            splitButton: "acidjs-ui-ribbon-tool-split-button",
            dropdownArrow: ".acidjs-ui-ribbon-tool-dropdown .acidjs-ribbon-arrow",
            splitButtonArrow: ".acidjs-ui-ribbon-tool-split-button .acidjs-ribbon-arrow",
            buttonsExclusive: "acidjs-ui-ribbon-tool-exclusive-buttons",
            toggleButtons: "acidjs-ui-ribbon-tool-toggle-buttons",
            active: "acidjs-ui-tool-active",
            quickLaunch: "acidjs-ui-ribbon-quick-launch",
            fileTabMenuPlaceholder: "acidjs-ui-ribbon-file-tab-menu",
            quickLaunchEnabled: "acidjs-ui-ribbon-quick-launch-enabled",
            tabGroup: "acidjs-ui-tabgroup"
        },
        
        /*
         * Raw HTML templates used by the class
         * @member {Object} TEMPLATES
         * @public
         **/
        TEMPLATES: {
            
            base: [
                '<div>',
                    '<div>',
                        '<button type="button" name="toggle-ribbon"></button>',
                        '<div class="acidjs-ui-ribbon-quick-launch"></div>',
                        '<div class="acidjs-ui-ribbon-file-tab-menu"></div>',
                        '<ul class="acidjs-ui-ribbon-tab-buttons"></ul>',
                    '</div>',
                    '<div class="acidjs-ui-ribbon-tabs">',
                        '<ul class="acidjs-ui-ribbon-tab-content"></ul>',
                    '</div>',
                '</div>'
            ],
            
            tabGroup: [
                '<div data-tab-group-name="<#= groupName #>" class="acidjs-ui-tabgroup" style="top: <#= top #>px; left: <#= left #>px; width: <#= width #>px; background: <#= color #>;">',
                    '<span style="border-top-color: <#= color #>;"><#= groupTitle #></span>',
                '</div>'
            ],
            
            tabButton: [
                '<li>',
                    '<a <#= ng #> data-name="<#= name #>" <#= visible #> <#= enabled #> href="#" title="<#= hint #>"><#= label #></a>',
                '</li>'
            ],
                    
            tabContent: [
                '<li>',
                    '<div data-name="<#= name #>" <#= visible #> <#= enabled #> class="acidjs-ui-ribbon-tab-ribbons">',
                        '<ul>',
                            '<#= ribbonsHtml #>',
                        '</ul>',
                    '</div>',
                '</li>'
            ],
            
            ribbon: [
                '<li <#= ng #> data-label="<#= label || "&nbsp;" #>" style="width: <#= width #>; min-width: <#= minWidth #>;">',
                    '<div class="acidjs-ui-ribbon-tab-ribbon-tools">',
                        '<#= toolsHtml #>',
                    '</div>',
                    '<h6>',
                        '<#= label || "&nbsp;" #>',
                    '</h6>',
                '</li>'
            ],
            
            buttons: [
                '<ul data-tool="<#= type #>" data-items="<#= items #>" class="acidjs-ui-ribbon-tool-strip acidjs-ui-ribbon-tool-<#= type #>" data-size="<#= size #>">',
                    '<# var icons = size === "large" ? "large" : "small"; #>',
                    '<# if(commands && commands.length) { #>',
                        '<# for(var i = 0; i < commands.length; i ++) { #>',
                        '<# var command = commands[i]; #>',
                            '<li>',
                                '<a class="acidjs-ui-ribbon-tool" href="#" data-tool-name="<#= command.name #>" name="<#= command.name #>" title="<#= command.hint #>">',
                                    '<# if(command.icon) { #>',
                                        '<img width="<#= size === "large" ? 32 : 16 #>" height="<#= size === "large" ? 32 : 16 #>" src="<#= appRoot #>AcidJs.Ribbon/icons/<#= icons #>/<#= command.icon #>" />',
                                    '<# } #>',
                                    '<# if(command.label) { #>',
                                        '<span><#= command.label #></span>',
                                    '<# } #>',
                                '</a>',
                            '</li>',
                        '<# } #>',
                    '<# } #>',
                '</ul>'
            ],
            
            dropdown: [
                '<# var items = items || [], width = width ? width + "px;" : "43px"; #>',
                '<# var selected = "acidjs-ui-ribbon-tool-selected"; #>',
                '<# if(items.length) { #>',
                    '<div data-tool="dropdown" data-tool-name="<#= name #>" class="acidjs-ui-ribbon-tool-dropdown" style="width: <#= width #>">',
                        '<div>',
                            '<div>',
                                '<a href="#" name="<#= name #>" data-value="<#= items[0].value || "" #>"><#= items[0].label || "" #></a>',
                                '<strong class="acidjs-ribbon-arrow"></strong>',
                            '</div>',
                        '</div>',
                        '<div class="acidjs-ui-ribbon-dropdown" style="width: <#= width #>">',
                            '<ul>',
                                '<# for(var i = 0; i < items.length; i ++) { #>',
                                '<# var item = items[i]; #>',
                                    '<li>',
                                        '<a class="<#= i === 0 ? selected : "" #>" href="#" name="<#= name #>" data-value="<#= item.value || "" #>">',
                                            '<span><#= item.label || "" #></span>',
                                        '</a>',
                                    '</li>',
                                '<# } #>',
                            '</ul>',
                        '</div>',
                    '</div>',
                '<# } #>'
            ],
            
            toolBreak: [
                '<div data-tool="break" class="acidjs-ui-ribbon-tool-break"></div>'
            ],
            
            separator: [
                '<div data-tool="separator" class="acidjs-ui-ribbon-tool-separator"></div>'
            ],
            
            colorPicker: [
                '<div data-tool-name="<#= name #>" data-tool="color-picker" class="acidjs-ui-ribbon-tool-color-picker">',
                    '<div>',
                        '<# var hint = hint || ""; #>',
                        '<# var label = label || "&nbsp;"; #>',
                        '<a href="#" data-value="<#= colors[0] #>" data-type="<#= type #>" name="<#= name #>" title="<#= hint #>">',
                            '<span>',
                                '<img width="14" height="14" src="<#= appRoot + "AcidJs.Ribbon/icons/small/" + icon #>" />',
                                '<span class="acidjs-ui-ribbon-color-preview" style="background: <#= colors[0] #>"></span>',
                            '</span>',
                            '<span>',
                                '<#= label #>',
                            '</span>',
                        '</a>',
                        '<# if(colors.length > 1) { #>',
                            '<strong class="acidjs-ribbon-arrow"><!-- / --></strong>',
                        '<# } #>',
                    '</div>',
                    '<# if(colors && colors.length) { #>',
                        '<# var dropdownWidth = dropdownWidth || ""; #>',
                        '<# var selected = "acidjs-ui-ribbon-tool-selected"; #>',
                        '<div class="acidjs-ui-ribbon-dropdown" style="width: <#= dropdownWidth #>px;">',
                            '<ul>',
                                '<# for(var i = 0; i < colors.length; i ++) { #>',
                                '<# var color = colors[i]; #>',
                                    '<li>',
                                        '<a class="<#= i === 0 ? selected : "" #>" style="background: <#= color #>;" title="<#= color #>" href="#" name="<#= name #>" data-value="<#= color #>"><#= color #></a>',
                                    '</li>',
                                '<# } #>',
                            '</ul>',
                        '</div>',
                    '</div>',
                '<# } #>'
            ],
            
            genericDropdown: [
                '<# var dropdownContent = dropdownContent || ""; #>',
                '<# var label = label || ""; #>',
                '<# var icon = icon || null; #>',
                '<# var hint = hint || ""; #>',
                '<div data-tool-name="<#= name #>" data-tool="<#= type #>" class="acidjs-ribbon-generic-dropdown">',
                    '<div>',
                        '<a href="#" title="<#= hint || "" #>" data-type="<#= type #>" name="<#= name #>">',
                            '<# if(icon) { #>',
                                '<img width="16" height="16" src="<#= appRoot + "AcidJs.Ribbon/icons/small/" + icon #>" />',
                            '<# } #>',
                            '<span>',
                                '<#= label #>',
                            '</span>',
                            '<strong class="acidjs-ribbon-arrow"><!-- / --></strong>',
                        '</a>',
                    '</div>',
                    '<div class="acidjs-ui-ribbon-dropdown"><#= dropdownContent #></div>',
                '</div>'
            ],
            
            toggleMenuItems: [
                '<# var items = items || []; #>',
                '<# if(items.length) { #>',
                    '<div class="acidjs-ui-ribbon-toggle-menu-items">',
                        '<form>',
                            '<ul>',
                                '<# for(var i = 0; i < items.length; i ++) { #>',
                                    '<# var item = items[i]; #>',
                                    '<li>',
                                        '<label class="acidjs-ui-ribbon-tool-checkbox-label">',
                                            '<input type="checkbox" value="<#= item.value ? item.value : "null" #>" <#= item.selected ? "checked" : "" #> name="<#= item.name #>" />',
                                            '<span href="#"><#= item.label #></span>',
                                        '</label>',
                                    '</li>',
                                '<# } #>',
                            '</ul>',
                        '</form>',
                    '</div>',
                '<# } #>'
            ],
            
            exclusiveMenuItems: [
                '<# var items = items || []; #>',
                '<# var defaultSelectedItem = defaultSelectedItem || 0; #>',
                '<# if(items.length) { #>',
                    '<div class="acidjs-ui-ribbon-exclusive-menu-items">',
                        '<form>',
                            '<ul>',
                                '<# for(var i = 0; i < items.length; i ++) { #>',
                                    '<# var item = items[i]; #>',
                                    '<li>',
                                        '<label class="acidjs-ui-ribbon-tool-checkbox-label" name="<#= name #>">',
                                            '<input <#= defaultSelectedItem === i ? "checked" : "" #> type="radio" name="<#= name #>" value="<#= item.value #>" />',
                                            '<span><#= item.label #></span>',
                                        '</label>',
                                    '</li>',
                                '<# } #>',
                            '</ul>',
                        '</form>',
                    '</div>',
                '<# } #>'
            ],
            
            checkbox: [
                '<# var value = value || ""; #>',
                '<# var hint = hint || ""; #>',
                '<# var checked = checked ? "checked" : ""; #>',
                '<div class="acidjs-ui-ribbon-tool-checkbox" data-tool-name="<#= name #>" data-tool-type="checkbox" title="<#= hint #>">',
                    '<label class="acidjs-ui-ribbon-tool-checkbox-label">',
                        '<input <#= checked #> type="checkbox" value="<#= value #>" name="<#= name #>" />',
                        '<span><#= label #></span>',
                    '</label>',
                '</div>'
            ],
            
            radios: [
                '<# var items = items || ""; #>',
                '<# var defaultSelectedItem = defaultSelectedItem || 0; #>',
                '<div class="acidjs-ui-ribbon-tool-radios" data-tool-name="<#= name #>" data-tool-type="radios">',
                    '<form>',
                        '<ul>',
                            '<# for(var i = 0; i < items.length; i ++) { #>',
                                '<# var item = items[i]; #>',
                                '<# var value = item.value || ""; #>',
                                '<li>',
                                    '<label class="acidjs-ui-ribbon-tool-checkbox-label" name="<#= name #>">',
                                        '<input <#= defaultSelectedItem === i ? "checked" : "" #> type="radio" name="<#= name #>" value="<#= item.value #>" />',
                                        '<span><#= item.label #></span>',
                                    '</label>',
                                '</li>',
                            '<# } #>',
                        '</ul>',
                    '</form>',
                '</div>'
            ],
            
            splitButton: [
                '<# var commands = commands || []; #>',
                '<# if(commands.length) { #>',
                    '<div data-tool-name="<#= commands[0].name #>" data-tool-size="<#= size || "large" #>" data-tool="<#= type #>" class="acidjs-ui-ribbon-tool-split-button acidjs-ui-ribbon-tool-split-button-<#= size || "large" #>">',
                        '<# var hint = commands[0].hint || ""; #>',
                        '<div title="<#= hint #>">',
                            '<a href="#" data-type="<#= type #>" name="<#= commands[0].name #>">',
                                '<# var headerIcon = commands[0].icon ? appRoot + "AcidJs.Ribbon/icons/" + size + "/" + commands[0].icon : appRoot + "AcidJs.Ribbon/icons/shim.png"; #>',
                                '<img width="<#= size === "large" ? 32 : 16 #>" height="<#= size === "large" ? 32 : 16 #>" src="<#= headerIcon #>" />',
                                '<span>',
                                    '<#= commands[0].label || "" #>',
                                '</span>',
                                '<# if(commands.length > 1) { #>',
                                    '<strong class="acidjs-ribbon-arrow"><!-- / --></strong>',
                                '<# } #>',
                            '</a>',
                        '</div>',
                        '<# if(commands.length > 1) { #>',
                            '<div class="acidjs-ui-ribbon-dropdown">',
                                '<# var selected = "acidjs-ui-ribbon-tool-selected"; #>',
                                '<ul>',
                                    '<# for(var i = 0; i < commands.length; i ++) { #>',
                                    '<# var command = commands[i]; #>',
                                        '<li>',
                                            '<a data-tool-name="<#= command.name #>" class="<#= i === 0 ? selected : "" #>" href="#" name="<#= command.name #>">',
                                                '<# var icon = command.icon ? appRoot + "AcidJs.Ribbon/icons/small/" + command.icon : appRoot + "AcidJs.Ribbon/icons/shim.png"; #>',
                                                '<img src="<#= icon #>" />',
                                                '<# if(command.label) { #>',
                                                    '<span>',
                                                        '<#= command.label || "" #>',
                                                    '</span>',
                                                '<# } #>',
                                            '</a>',
                                        '</li>',
                                    '<# } #>',
                                '</ul>',
                            '</div>',
                        '<# } #>',
                    '</div>',
                '<# } #>'
            ]
        },
        
        /*
         * Return ribbon's bounding box, defined in config.boundingBox
         * @method getBoundingBox
         * @public
         * @return {Object}
         **/
        getBoundingBox: function() {
            return this.boundingBox;
        },
        
        /*
         * Return ribbon's configuration object, defined in the constructor
         * @method getConfig
         * @public
         * @return {Object}
         **/
        getConfig: function() {
            return this.config;
        },
        
        /*
         * Unbind and remove the UI of the ribbon
         * @method destroy
         * @public
         * @return {Object} config
         **/
        destroy: function() {
            var
                bBox = this.getBoundingBox(),
                config = this.getConfig();
            
            bBox.removeAttr("class")
                .removeAttr("style")
                .empty();
            
            delete this.config;
            return config;
        },
        
        /*
         * Disable array of tools
         * @method disableTools
         * @param {Array} tools [required]
         * [
         *  "paste",
         *  "cut",
         *  "copy"
         * ]
         * @public
         * @return void
         **/
        disableTools: function(tools) {
            
            if(!tools || !tools.length) {
                return;
            }
            
            $.each(tools, $.proxy(function(i) {
                this.getToolsByName(tools[i]).attr("disabled", "");    
            }, this));
        },
        
        /*
         * Programmatically select dropdown value and optionally trigger ribbons's "acidjs-ribbon-tool-clicked" event 
         * @method selectDropdownValue
         * @param {String} name [required] tool name
         * @param {String} newValue [required] value of tool's dropdown to select
         * @param {Boolean} triggerToolClicked [optional] if set to true, selection will trigger ribbons's "acidjs-ribbon-tool-clicked" event 
         * @public
         * @return void
         **/
        selectDropdownValue: function(name, newValue, triggerToolClicked) {
            
            if(!name && !newValue) {
                return;
            }
            
            var
                tool = this.getToolsByName(name),
                valueAttr = this.ATTRS.value,
                selected = this.CSS_CLASSES.selected,
                newItem = tool.find('.acidjs-ui-ribbon-dropdown a[data-value="' + newValue + '"]'),
                newItemValue = newItem.attr(valueAttr),
                toolHeader = tool.find(' > div:first-child a');
            
            toolHeader.attr(valueAttr, newItemValue).html(newItem.find("span").text());
            tool.find("." + selected).removeClass(selected);
            newItem.addClass(selected);
            
            if(triggerToolClicked) {
                newItem.trigger("click");
            }
        },
        
        /*
         * Programmatically select color value from a color picker and optionally trigger ribbons's "acidjs-ribbon-tool-clicked" event 
         * @method selectColorByValue
         * @param {String} name [required] tool name
         * @param {String} newValue [required] value of tool's dropdown to select
         * @param {Boolean} triggerToolClicked [optional] if set to true, selection will trigger ribbons's "acidjs-ribbon-tool-clicked" event
         * @public
         * @return void
         **/
        selectColorByValue: function(name, newValue, triggerToolClicked) {
            if(!name && !newValue) {
                return;
            }
            
            var
                tool = this.getToolsByName(name),
                valueAttr = this.ATTRS.value,
                selected = this.CSS_CLASSES.selected,
                newItem = tool.find('.acidjs-ui-ribbon-dropdown a[data-value="' + newValue + '"]'),
                newItemValue = newItem.attr(valueAttr),
                toolHeader = tool.find(' > div:first-child a'),
                toolHeaderColorPreview = toolHeader.find(".acidjs-ui-ribbon-color-preview");
            
            toolHeader.attr(valueAttr, newItemValue);
            toolHeaderColorPreview.css({
                background: newItemValue
            });
            tool.find("." + selected).removeClass(selected);
            newItem.addClass(selected);
            
            if(triggerToolClicked) {
                newItem.trigger("click");
            }
        },
        
        /*
         * Enable array of tools
         * @method enableTools
         * @param {Array} tools [required]
         * [
         *  "paste",
         *  "cut",
         *  "copy"
         * ]
         * @public
         * @return void
         **/
        enableTools: function(tools) {
            
            if(!tools || !tools.length) {
                return;
            }
            
            $.each(tools, $.proxy(function(i) {
                this.getToolsByName(tools[i]).removeAttr("disabled");
            }, this));
        },
        
        /*
         * Set array of tools as active
         * @method setToolsActive
         * @param {Array} tools [required] tools to set as active
         * [
         *  "bold",
         *  "italic",
         *  "underline"
         * ]
         * @param {Boolean} triggerToolClicked [optional] if set to true, the tool will also trigger ribbon's "acidjs-ribbon-tool-clicked" event
         * @public
         * @return void
         **/
        setToolsActive: function(tools, triggerToolClicked) {
            
            if(!tools || !tools.length) {
                return;
            }
            
            $.each(tools, $.proxy(function(i) {
                var
                    tool = this.getToolsByName(tools[i]);
                    
                tool.addClass(this.CSS_CLASSES.active);
                
                if(triggerToolClicked) {
                    tool.trigger("click");
                    tool.addClass(this.CSS_CLASSES.active);
                }
                
            }, this));
        },
        
        /*
         * Set array of tools to inactive
         * @method setToolsInactive
         * @param {Array} tools [required] tools to set as inactive
         * [
         *  "bold",
         *  "italic",
         *  "underline"
         * ]
         * @public
         * @return void
         **/
        setToolsInactive: function(tools) {
            
            if(!tools || !tools.length) {
                return;
            }
            
            $.each(tools, $.proxy(function(i) {
                this.getToolsByName(tools[i]).removeClass(this.CSS_CLASSES.active);
            }, this));
        },
        
        /* Programmatically click array of tools
         * @method clickTools
         * @param {Array} tools [required] tools to click programmatically
         * [
         *  "bold",
         *  "italic",
         *  "underline"
         * ]
         * @public
         * @return void
         **/
        clickTools: function(tools) {
            
            if(!tools || !tools.length) {
                return;
            }
            
            $.each(tools, $.proxy(function(i) {
                this.getBoundingBox().find('[' + this.ATTRS.toolName + '="' + tools[i] + '"]:eq(0)').trigger("click");
            }, this));
        },
        
        /*
         * Get tool data (name, active, value, props)
         * @method getReleaseNotes (Since version 4.2.0)
         * @param {String} tool name
         * @public
         * @return {Object}
         * {
         *  name: {String|null}
         *  command: {String|null}
         *  active: {Boolean}
         *  props: {Object|null}
         * }
         **/
        getToolData: function(name) {
            var
                tool = $(this.getBoundingBox().find('[name="' + name + '"]').get(0)),
                data = {
                    props: this.props[name] || null,
                    command: tool.attr("name") || null,
                    active: tool.is("." + this.CSS_CLASSES.active) ? true : false,
                    value: tool.val() || null
                };
            
            return data;
        },
        
        /*
         * Get the props key of a tool
         * @method getToolProps (Since version 4.2.0)
         * @param {String} tool name
         * @public
         * @return {Object|null}
         * {
         *  props: {Object|null}
         * }
         **/
        getToolProps: function(name) {
            return this.props[name] || null;
        },
        
        /*
         * Get the props key of a tab
         * @method getTabProps (Since version 4.2.0)
         * @param {String} tab name
         * @public
         * @return {Object|null}
         **/
        getTabProps: function(name) {
            return this.tabProps[name] || null;
        },
        
        /*
         * Programmatically set props key to a tab
         * @method setToolProps (Since version 4.2.0)
         * @param {String} name of the tab
         * @param {String} key
         * @param {Any} value
         * @public
         * @return {Object|null}
         **/
        setTabProps: function(name, key, value) {
            if(!this.tabProps[name]) {
                this.props[name] = {};
            }
            this.tabProps[name][key] = value;
            
            return this.getTabProps(name);
        },
        
        /*
         * Programmatically add props key to a tool
         * @method setToolProps (Since version 4.2.0)
         * @param {String} name of the tool/command
         * @param {String} key
         * @param {Any} value
         * @public
         * @return {Object|null}
         **/
        setToolProps: function(name, key, value) {
            if(!this.props[name]) {
                this.props[name] = {};
            }
            this.props[name][key] = value;
            
            return this.getToolProps(name);
        },
        
        /*
         * Check the release notes for the current version of Ribbon JS
         * @method getReleaseNotes (Since version 4.2.0)
         * @public
         * @return void
         **/
        getReleaseNotes: function() {
            W.open(this.MANIFEST.releaseNotes, "_blank");
        },
        
        /*
         * Return tool node(s) by name
         * @method getToolsByName (Since version 4.0.1)
         * @param {String} name [required] name of the tool
         * @public
         * @return {Array}
         **/
        getToolsByName: function(name) {
            return this.getBoundingBox().find('[' + this.ATTRS.toolName + '="' + name + '"]');
        },
        
        /*
         * Disable the ribbon and make it's UI non-interactive
         * @method disableRibbon
         * @public
         * @return void
         **/
        disableRibbon: function() {
            this.getBoundingBox().attr("disabled", "");
            this._enabled = false;
        },
        
        /*
         * Enable the ribbon
         * @method enableRibbon
         * @public
         * @return void
         **/
        enableRibbon: function() {
            this.getBoundingBox().removeAttr("disabled");
            this._enabled = true;
        },
        
        /*
         * Hide the ribbon
         * @method hide
         * @public
         * @return void
         **/
        hide: function() {
            this.getBoundingBox().attr(this.ATTRS.hidden, "");
        },
        
        /*
         * Show the ribbon
         * @method hide
         * @public
         * @return void
         **/
        show: function() {
            this.getBoundingBox().removeAttr(this.ATTRS.hidden);
        },
        
        /*
         * Expand the ribbon
         * @method expand
         * @public
         * @return void
         **/
        expand: function() {
            this.getBoundingBox().attr(this.ATTRS.open, "")
                                 .trigger(this.EVENTS[3], { // "acidjs-ribbon-toggle"
                                    expanded: true
                                 });
        },
        
        /*
         * Collapse the ribbon
         * @method collapse
         * @public
         * @return void
         **/
        collapse: function() {
            this._later($.proxy(function() {
                this.getBoundingBox().removeAttr(this.ATTRS.open)
                                     .trigger(this.EVENTS[3], { // "acidjs-ribbon-toggle"
                                        expanded: false
                                     });
                
            }, this), 100);
        },
        
        /*
         * Programmatically set Office 2013+ flat styles to the ribbon
         * @mathod enableFlatStyles (since version 4.1.0)
         * @public
         * @return {Boolean} this.flat
         **/
        enableFlatStyles: function() {
            this.flat = true;
            this.getBoundingBox().addClass(this.CSS_CLASSES.flat);
            return this.flat;
        },
        
        /*
         * Programmatically set classic (before Office 2013) styles to the ribbon
         * @method disableFlatStyles (since version 4.1.0)
         * @public
         * @return {Boolean} this.flat
         **/
        disableFlatStyles: function() {
            this.flat = false;
            this.getBoundingBox().removeClass(this.CSS_CLASSES.flat);
            return this.flat;
        },
        
        /*
         * @method highlightTabsGroup (since version 4.2.0)
         * @param {Array} names [required] tab names, which will be included to the group
         * @param {String} groupName [required] name of the group
         * @param {String} groupTitle [required] title of the group
         * @param {String} color [required] color of the group
         * @return {Object} highLightedTabs
         * {
         *  "tab-name": {
         *    color: {String}
         *    groupTitle: {String}
         *    name: {String}
         *    tabs: {Array}
         *  }
         * }
         **/
        highlightTabsGroup: function(names, groupName, groupTitle, color) {
            
            if(!names || !names.length || !groupName || !groupTitle || !color) {
                return;
            }
            
            var
                bBox = this.getBoundingBox(),
                firstTab = this.getTabButtonByName(names[0]).parent(),
                offsetTop = firstTab.height() * - 1,
                classes = this.CSS_CLASSES,
                attrs = this.ATTRS,
                firstTabOffsetLeft = firstTab.position().left,
                lastTab = this.getTabButtonByName(names[names.length - 1]).parent(),
                lastTabOffsetRight = lastTab.position().left + lastTab.width(),
                tabButtonsNode = bBox.find("." + classes.tabButtons);
            
            if(bBox.find('[' + attrs.tabGroupName + '="' + groupName + '"]').length) {
                return;
            }
                        
            tabButtonsNode.prepend(this._template("tabGroup", {
                groupName: groupName,
                groupTitle: groupTitle,
                left: firstTabOffsetLeft,
                top: offsetTop,
                color: color,
                width: lastTabOffsetRight - firstTabOffsetLeft
            }));
            
            this.highLightedTabs[groupName] = {
                tabs: names,
                groupTitle: groupTitle,
                color: color,
                name: groupName
            };
            
            return this.highLightedTabs;
        },
        
        /*
         * Remove the highlighting of a tab group (cancel the highlightTabsGroup method)
         * @method unhighlightTabsGroup (since version 4.1.0)
         * @param {String} groupName [required] tab name
         * @public
         * @return {Object} highLightedTabs
         * {
         *  "tab-name": {
         *    color: {String}
         *    groupTitle: {String}
         *    name: {String}
         *    tabs: {Array}
         *  }
         * }
         **/
        unhighlightTabsGroup: function(groupName) {
            var 
                highLightedTabsGroupName = this.highLightedTabs[groupName];
            
            if(!highLightedTabsGroupName || !groupName) {
                return;
            }
            
            this.getBoundingBox().find('[' + this.ATTRS.tabGroupName + '="' + highLightedTabsGroupName.name + '"]').remove();
            
            delete this.highLightedTabs[groupName];
            
            return this.highLightedTabs;
        },
        
        /*
         * Return tab button node by name
         * @method getTabButtonByName
         * @param {String} name [required] tab name
         * @public
         * @return {Object}
         **/
        getTabButtonByName: function(name) {
            if(!name) {
                return;
            }
            
            return this.getBoundingBox().find('.acidjs-ui-ribbon-tab-buttons a[data-name="' + name + '"]');
        },
        
        /*
         * Set tab active and trigger it's "acidjs-ribbon-tab-changed" event
         * @method setTabActive
         * @param {String} name [required] the tab which will be set to active
         * @public
         * @return {Object}
         **/
        setTabActive: function(name) {
            if(!name) {
                return;
            }
            
            this.getTabButtonByName(name).trigger("click");
        },
        
        /*
         * Disable tabs by name. Only tabs, which are not active will be disabled.
         * @method disableTabs
         * @param {Array} tabs [required] the tabs, which will be disabled
         * @public
         * @return void
         **/
        disableTabs: function(tabs) {
            if(!tabs || !tabs.length) {
                return;
            }
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tabNode = this.getTabButtonByName(tabs[i]);
                
                if(tabNode.is("." + this.CSS_CLASSES.selected)) {
                    return;
                }
                
                tabNode.attr("disabled", "");
            }, this));
        },
        
        /*
         * Enabled disabled tabs by name.
         * @method enableTabs
         * @param {Array} tabs [required] the tabs, which will be enabled
         * @public
         * @return void
         **/
        enableTabs: function(tabs) {
            if(!tabs || !tabs.length) {
                return;
            }
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tabNode = this.getTabButtonByName(tabs[i]);
                
                if(tabNode.is("." + this.CSS_CLASSES.selected)) {
                    return;
                }
                
                tabNode.removeAttr("disabled");
            }, this));
        },
        
        /*
         * Remove array of tabs. Only inactive tabs can be removed
         * @method removeTabs
         * @param {Array} tabs [required] the tabs, which will be removed
         * @public
         * @return void
         **/
        removeTabs: function(tabs) {
            if(!tabs || !tabs.length) {
                return;
            }
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tab = tabs[i],
                    tabButtonNode = this.getTabButtonByName(tab);
                
                if(tabButtonNode.is("." + this.CSS_CLASSES.selected)) {
                    return;
                }
                
                tabButtonNode.parent().remove();
                this.getTabContentBoxByName(tab).parent().remove();
            }, this));
        },
        
        /*
         * Hide array of tabs. Only inactive tabs can be hidden
         * @method hideTabs
         * @param {Array} tabs [required] the tabs, which will be hidden
         * @public
         * @return void
         **/
        hideTabs: function(tabs) {
            if(!tabs || !tabs.length) {
                return;
            }
            
            var
                hidden = this.ATTRS.hidden;
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tab = tabs[i],
                    tabButtonNode = this.getTabButtonByName(tab);
                
                if(tabButtonNode.is("." + this.CSS_CLASSES.selected)) {
                    return;
                }
                
                tabButtonNode.attr(hidden, "");
                this.getTabContentBoxByName(tab).attr(hidden, "");
            }, this));
        },
        
        /*
         * Return tab's content box by name
         * @method getTabContentBoxByName
         * @param {String} tab [required] name of the tab, which content box will be queried
         * @public
         * @return {Object}
         **/
        getTabContentBoxByName: function(tab) {
            if(!tab) {
                return;
            }
            return this.getBoundingBox().find('.acidjs-ui-ribbon-tab-content [' + this.ATTRS.name + '="' + tab + '"]');
        },
        
        /*
         * Show hidden tabs
         * @method showTabs
         * @param {Array} tabs [required] the tabs, which will be shown
         * @public
         * @return void
         **/
        showTabs: function(tabs) {
            if(!tabs || !tabs.length) {
                return;
            }
            
            var
                hidden = this.ATTRS.hidden;
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tab = tabs[i],
                    tabButtonNode = this.getTabButtonByName(tab);
                
                tabButtonNode.removeAttr(hidden);
                this.getTabContentBoxByName(tab).removeAttr(hidden);
            }, this));
        },
        
        /*
         * Render tabs
         * @method renderTabs
         * @param {Array} tabs [required] the tabs, which will be rendered
         * @param {String} placement [optional] "append"|"prepend" placement of the new tabs. default: "prepend"
         * @public
         * @return void
         **/
        renderTabs: function(tabs, placement) {
    
            tabs = tabs || this.config.tabs || [];
            placement = placement || "append";
            
            var
                bBox = this.getBoundingBox(),
                classes = this.CSS_CLASSES,
                tabButtons = bBox.find("." + classes.tabButtons),
                tabContent = bBox.find("." + classes.tabContent),
                tabButtonsHtml = [],
                tabContentHtml = [];
            
            $.each(tabs, $.proxy(function(i) {
                var
                    tab = tabs[i],
                    ng = tab.ng || {},
                    guid = this._guid(),
                    ribbons = tab.ribbons || [],
                    ribbonsHtml = [],
                    tabButtonsHtmlDto = {
                        label: tab.label || "",
                        hint: tab.hint || "",
                        name: tab.name || guid,
                        visible: tab.visible === false ? "hidden" : "",
                        enabled: tab.enabled === false ? "disabled" : ""
                    };
                
                tabButtonsHtmlDto.ng = this._createNgDirectives(ng);
                
                this.tabProps[tabButtonsHtmlDto.name] = tab.props || null;
                
                if("append" === placement) {
                    tabButtonsHtml.push(this._template("tabButton", tabButtonsHtmlDto));
                } else {
                    tabButtonsHtml.unshift(this._template("tabButton", tabButtonsHtmlDto));
                }
                
                $.each(ribbons, $.proxy(function(j) {
                    var
                        ribbon = ribbons[j],
                        ribbonNg = ribbon.ng || {},
                        toolsHtml = [];
                    
                    ribbon.tools = ribbon.tools || [];
                    
                    $.each(ribbon.tools, $.proxy(function(k) {
                        var
                            tool = ribbon.tools[k];
                        
                        tool.appRoot = this.appRoot;
                        
                        switch(tool.type) {
                            case "buttons":
                            case "toggle-buttons":
                            case "exclusive-buttons":
                                    
                                    tool.items = tool.items || "floated";
                                    
                                    /*
                                     * Since version 4.2.0
                                     * Check if the command definition has a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.commands) {
                                        $.each(tool.commands, $.proxy(function(l) {
                                            var
                                                command = tool.commands[l];
                                            
                                            if(command.props) {
                                                this.props[command.name] = command.props;
                                            }    
                                        }, this));
                                    }
                                    
                                    toolsHtml.push(this._template("buttons", tool));
                                break;
                            case "dropdown":
                                    /*
                                     * Since version 4.2.0
                                     * Check if the items array items have a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.items) {
                                        this.props[tool.name] = [];
                                        $.each(tool.items, $.proxy(function(m) {
                                            var
                                                item = tool.items[m];
                                            
                                            this.props[tool.name].push(item.props || null);
                                            
                                        }, this));
                                    }
                                    
                                    toolsHtml.push(this._template("dropdown", tool));
                                break;
                            case "split-button":
                            case "menu":    
                                    /*
                                     * Since version 4.2.0
                                     * Check if the command definition has a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.commands) {
                                        $.each(tool.commands, $.proxy(function(l) {
                                            var
                                                command = tool.commands[l];
                                            
                                            if(command.props) {
                                                this.props[command.name] = command.props;
                                            }    
                                        }, this));
                                    }
                                
                                    toolsHtml.push(this._template("splitButton", tool));
                                break;
                            case "checkbox":    
                                    /*
                                     * Since version 4.2.0
                                     * Check if the checkbox item has a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    this.props[tool.name] = tool.props || null;
                                    
                                    toolsHtml.push(this._template("checkbox", tool));
                                break;
                            case "radios":  
                                    /*
                                     * Since version 4.2.0
                                     * Check if the items array items have a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.items) {
                                        this.props[tool.name] = [];
                                        $.each(tool.items, $.proxy(function(m) {
                                            var
                                                item = tool.items[m];
                                            
                                            this.props[tool.name].push(item.props || null);
                                            
                                        }, this));
                                    }
                                    
                                    toolsHtml.push(this._template("radios", tool));
                                break;
                            case "break":
                                    toolsHtml.push(this._template("toolBreak", {}));
                                break;
                            case "separator":
                                    toolsHtml.push(this._template("separator", {}));
                                break;
                            case "custom":
                                    if(tool.templateId && tool.data) {
                                        var
                                            customTemplate = $("#" + tool.templateId);
                                        
                                        this._setTemplate(tool.templateId, customTemplate.html());
                                        toolsHtml.push(this._template(tool.templateId, tool.data));
                                    }
                                break;
                            case "color-picker":
                                    /*
                                     * Since version 4.2.0
                                     * Check if the items array items have a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    this.props[tool.name] = tool.props || null;
                                    
                                    toolsHtml.push(this._template("colorPicker", tool));
                                break;
                            case "custom-dropdown":
                                    if(tool.templateId && tool.data) {
                                        var
                                            template = $("#" + tool.templateId);
                                        
                                        this._setTemplate(tool.templateId, template.html());
                                        
                                        tool.dropdownContent = this._template(tool.templateId, tool.data);
                                        
                                        toolsHtml.push(this._template("genericDropdown", tool));
                                    }
                                break;
                            case "toggle-dropdown":
                                    /*
                                     * Since version 4.2.0
                                     * Check if the items array items have a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.items) {
                                        this.props[tool.name] = [];
                                        $.each(tool.items, $.proxy(function(n) {
                                            var
                                                item = tool.items[n];
                                            
                                            this.props[tool.name].push(item.props || null);
                                            
                                        }, this));
                                    }
                                    
                                    tool.dropdownContent = this._template("toggleMenuItems", tool);
                                    toolsHtml.push(this._template("genericDropdown", tool));
                                break; 
                            case "exclusive-dropdown":
                                    /*
                                     * Since version 4.2.0
                                     * Check if the items array items have a "props" key
                                     * and set it to the props object of the ribbon instance 
                                     **/
                                    if(tool.items) {
                                        this.props[tool.name] = [];
                                        $.each(tool.items, $.proxy(function(n) {
                                            var
                                                item = tool.items[n];
                                            
                                            this.props[tool.name].push(item.props || null);
                                            
                                        }, this));
                                    }
                                
                                    tool.dropdownContent = this._template("exclusiveMenuItems", tool);
                                    toolsHtml.push(this._template("genericDropdown", tool));
                                break;
                            
                        }
                    }, this));
                    
                    ribbon.toolsHtml = toolsHtml.join("");
                    ribbon.width = ribbon.width || "auto";
                    ribbon.minWidth = ribbon.minWidth || "auto";
                    ribbon.ng = this._createNgDirectives(ribbonNg);
                    
                    ribbonsHtml.push(this._template("ribbon", ribbon));
                    
                }, this));
                
                tabContentHtml.push(this._template("tabContent", {
                    ribbonsHtml: ribbonsHtml.join(""),
                    name: tab.name || guid,
                    visible: tab.visible === false ? "hidden" : "",
                    enabled: tab.visible === false ? "hidden" : ""
                }));
                
            }, this));
            
            tabButtons[placement](tabButtonsHtml.join(""));
            tabContent[placement](tabContentHtml);
        },
        
        /*
         * Initialize the ribbon
         * @method init
         * @public
         * @return void
         **/
        init: function() {
            
            if(this.ready) {
                return;
            }
            
            var
                bBox = this.boundingBox,
                classes = this.CSS_CLASSES,
                base = classes.base,
                cssClasses = [classes.ui, base],
                ng = this.ng;
            
            /*
             * Append the "flat" style class if config.flat is true (since version 4.1.0)
             **/
            if(this.flat) {
                cssClasses.push(classes.flat);
            }
            
            /*
             * Set AngularJS directive(s) to the boundingBox if config.ng object is defined (since version 4.3.0)
             **/
            if(ng) {
                $.each(ng, function(key, value) {
                    bBox.attr(key.indexOf("data-") > -1 ? key : "ng-" + key, value);
                });
            }
            
            cssClasses = cssClasses.concat(this.cssClasses || []);
            
            bBox.addClass(cssClasses.join(" "))
                .attr("open", "")
                .html(this._template("base"))
                .css({
                    maxWidth: this.width,
                    minWidth: this.minwidth,
                    visibility: "hidden"
                });
            
            this.renderTabs();
            this.renderQuickLaunchToolbar();
            this.renderFileTabMenu();
            this._bind();
        },
        
        /*
         * Render the file tab menu
         * @method renderFileTabMenu
         * @param {Object} commands [optional] toolbar items. default: config.fileTabMenu || []
         * @public
         * @return void
         **/
        renderFileTabMenu: function(commands) {
            var
                node = this.getBoundingBox().find("." + this.CSS_CLASSES.fileTabMenuPlaceholder),
                tool = {
                    type: "menu",
                    commands: commands || this.config.fileTabMenu || [],
                    size: "small",
                    appRoot: this.appRoot
                };
            
            node.html(this._template("splitButton", tool));
        },
        
        /*
         * Render the quick launch toolbar
         * @method renderQuickLaunchToolbar
         * @param {Object} commands [optional] toolbar items. default: config.quickLaunchToolbar || []
         * @public
         * @return void
         **/
        renderQuickLaunchToolbar: function(commands) {
            var
                bBox = this.getBoundingBox(),
                classes = this.CSS_CLASSES,
                node = this.getBoundingBox().find("." + classes.quickLaunch),
                tool = {
                    type: "buttons",
                    commands: commands || this.config.quickLaunchToolbar || [],
                    items: "floated",
                    size: "small",
                    appRoot: this.appRoot
                };
            
            /*
             * add the appIconUrl if set or the Ribbon JS default appIcon (since version 4.1.0)
             **/
            tool.commands.unshift({
                name: "acidjs-ui-ribbon-app-icon",
                icon: this.appIconUrl || "acidjs-ui-ribbon-app-icon.png"
            });
            
            bBox.addClass(classes.quickLaunchEnabled);
            
            node.html(this._template("buttons", tool));
        },
        
        /*
         * Get the bounding box of a tab's ribbon
         * @method getRibbonByLabel
         * @param {String} label [required] the label of the ribbon which is queried
         * @public
         * @return {Object}
         **/
        getRibbonByLabel: function(label) {
            
            if(!label) {
                return;
            }
            
            return this.getBoundingBox().find('.acidjs-ui-ribbon-tabs [data-label="' + label + '"]');
        },
        
        /*
         * Get the content box of a tab's ribbon
         * @method getRibbonContextBoxByLabel
         * @param {String} label [required] the label of the ribbon which content box is queried
         * @public
         * @return {Object}
         **/
        getRibbonContextBoxByLabel: function(label) {
            
            if(!label) {
                return;
            }
            
            return this.getRibbonByLabel(label).find('.acidjs-ui-ribbon-tab-ribbon-tools');
        },
        
        /*
         * Set new default command to a split button and optionally trigger ribbon's "acidjs-ribbon-tool-clicked"
         * @method selectSplitButtonCommand
         * @param {String} newCommandName [required] name of the new command name (should be set in tools commands array)
         * @public {Boolean} triggerToolClicked [optional] if set to true, ribbon's "acidjs-ribbon-tool-clicked" will be triggered 
         * @public
         * @return {Object}
         **/
        selectSplitButtonCommand: function(newCommandName, triggerToolClicked) {
            if(!newCommandName) {
                return;
            }
            
            var
                bBox = this.getBoundingBox(),
                selected = this.CSS_CLASSES.selected,
                button = bBox.find('.acidjs-ui-ribbon-tool-split-button:not([data-tool="menu"]) .acidjs-ui-ribbon-dropdown a[name="' + newCommandName + '"]'),
                buttonParent = button.parents(".acidjs-ui-ribbon-tool-split-button"),
                dropdown = buttonParent.find(".acidjs-ui-ribbon-dropdown"),
                buttonHeader = buttonParent.find(" > div:first-child a"),
                buttonHeaderIcon = buttonHeader.find("img"),
                buttonHeaderLabel = buttonHeader.find("span"),
                toolSize = buttonParent.attr(this.ATTRS.size),
                newButtonLabel = button.find("span"),
                newButtonIcon = button.find("img").attr("src"),
                newButtonCommand = button.attr("name");
            
            if(!button.length) {
                return;
            }
            
            if(triggerToolClicked) {
                return button.trigger("click");
            }
            
            if("large" === toolSize) {
                newButtonIcon = newButtonIcon.replace("/small/", "/large/");
            }

            if(newButtonIcon.indexOf("shim.png")) {
                buttonHeaderIcon.attr("src", newButtonIcon);
            }

            buttonHeader.attr("name", newButtonCommand);
            buttonParent.attr(this.ATTRS.toolName, newButtonCommand);
            buttonHeaderLabel.html(newButtonLabel.html());
            dropdown.find("." + selected).removeClass(selected);
            button.addClass(selected);
        },
        
        /*
         * Execute a callback after a specified delay
         * @method later
         * @param {Function} callback
         * @param {Number} timeout in milliseconds [optional]; default: 4
         * @private
         * @return void
         **/
        _later: function(callback, timeout) {
            W.setTimeout(function() {
                callback.call(this);
            }, timeout || 4);
        },
        
        /*
         * Generate a GUID/UUID
         * @method _guid
         * @private
         * @return {String}
         **/
        _guid: function() {
            var
                d = new Date().getTime(),
                uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                    var r = (d + W.Math.random() * 16) %16 | 0;
                    d = W.Math.floor(d/16);
                    return (c === "x" ? r : (r&0x7|0x8)).toString(16);
                });
            return uuid;
        },
        
        /*
         * Compile a template, and output the replaced markup
         * @method template
         * @private
         * @param {String} view template id 
         * @param {Object} model template data
         * @return {String}
         **/
        _template: function(view, model) {
           
            if(!this.VIEWS) {
                this.VIEWS = {};
            }
           
            if(this.TEMPLATES[view] instanceof Array) {
                this.TEMPLATES[view] = this.TEMPLATES[view].join("");
            }

            var
                fn = !/\W/.test(view) ? this.VIEWS[view] = this.VIEWS[view] || this._template(this.TEMPLATES[view]) :

                new W.Function("obj",
                    "var p = [], print = function() {p.push.apply(p, arguments);};" +
 
                       "with(obj) {p.push('" +

                       view
                           .replace(/[\r\t\n]/g, " ")
                           .split("<#").join("\t")
                           .replace(/((^|#>)[^\t]*)'/g, "$\r")
                           .replace(/\t=(.*?)#>/g, "',$1,'")
                           .split("\t").join("');")
                           .split("#>").join("p.push('")
                           .split("\r").join("\\'") + "');} return p.join('');");

            return model || "" ? fn(model) : fn;
        },
        
        /*
         * Shortcut for event.preventDefault() and event.stopPropagation()
         * @method _halt
         * @param event {Object} event [required]
         * @private
         * @return void
         **/
        _halt: function(event) {
            event.preventDefault();
            event.stopPropagation();
        },
         
        /*
         * Asynchronously load a CSS file from the server
         * @method _loadStylesheet
         * @param name {String} this.URLS[name]
         * @private
         * @return void
         **/
        _loadStylesheet: function(name) {
            var
                css = D.createElement("link"),
                id = this.CSS_CLASSES.base + "-" + name.toLowerCase() + "-css";

            css.setAttribute("rel", "stylesheet");
            css.setAttribute("href", this.appRoot + this.URLS[name]);
            css.setAttribute("id", id);

            if($("#" + id).length <= 0) {
                D.getElementsByTagName("head")[0].appendChild(css);
            }
        },
        
        /*
         * Bind the UI of the ribbon
         * @method _bind
         * @private
         * @return void
         **/
        _bind: function() {
            var
                classes = this.CSS_CLASSES,
                events = this.EVENTS,
                attrs = this.ATTRS,
                active = classes.active,
                selected = classes.selected,
                ribbons = classes.ribbons,
                bBox = this.getBoundingBox();
            
            /*
             * Bind the group tab
             **/
            bBox.delegate("." + classes.tabGroup, "click", $.proxy(function(e) {
                var
                    tabGroupNode = $(e.currentTarget),
                    tabGroupData = this.highLightedTabs[tabGroupNode.attr(attrs.tabGroupName)];
                    
                this.setTabActive(tabGroupData.tabs[0]);
                
            }, this));
            
            /*
             * Bind the ribbon expand/collapse button 
             **/
            bBox.delegate('button[name="toggle-ribbon"]', "click", $.proxy(function() {
                
                if(bBox.is("[open]")) {
                    return this.collapse();
                }
                
                this.expand();
                
            }, this));
            
            /*
             * Bind the split button item selection 
             **/
            bBox.delegate('.acidjs-ui-ribbon-tool-split-button .acidjs-ui-ribbon-dropdown a[name]', "click", function() {
                var
                    tool = $(this),
                    parent = tool.parents('.acidjs-ui-ribbon-tool-split-button'),
                    toolHeader = parent.find(" > div:first-child a"),
                    toolHeaderIcon = toolHeader.find("img"),
                    toolHeaderLabel = toolHeader.find("span"),
                    name = tool.attr("name"),
                    toolSize = parent.attr("data-tool-size"),
                    label = tool.text(),
                    toolType = parent.attr("data-tool"),
                    icon = tool.find("img").attr("src");
                
                if("large" === toolSize && "menu" !== toolType) {
                    icon = icon.replace("/small/", "/large/");
                }
                
                if("menu" !== toolType) {
                    toolHeaderLabel.html(label);
                }
                
                if(icon.indexOf("shim.png") === -1 && "menu" !== toolType) {
                    toolHeaderIcon.attr("src", icon);
                }
                
                toolHeader.attr("name", name);
                parent.attr("data-tool-name", name);
                
                parent.find("." + selected).removeClass(selected);
                tool.addClass(selected);
            });
            
            /*
             * Bind the dropdown item selection 
             **/
            bBox.delegate('[data-tool="dropdown"] .acidjs-ui-ribbon-dropdown a[name]', "click", function() {
                var
                    tool = $(this),
                    parent = tool.parents('[data-tool="dropdown"]'),
                    toolHeader = parent.find(" > div:first-child a"),
                    value = tool.attr(attrs.value),
                    label = tool.text();
                
                toolHeader.attr(attrs.value, value)
                          .html(label);
                
                parent.find("." + selected).removeClass(selected);
                tool.addClass(selected);
            });
            
            /*
             * Bind the color selection 
             **/
            bBox.delegate('[data-tool="color-picker"] li a[name]', "click", function() {
                var
                    tool = $(this),
                    parent = tool.parents('[data-tool="color-picker"]'),
                    colorPreview = parent.find(".acidjs-ui-ribbon-color-preview"),
                    toolHeader = parent.find(" > div:first-child a"),
                    color = tool.attr(attrs.value);
                
                colorPreview.css({
                    background: color
                });
                
                toolHeader.attr(attrs.value, color);
                
                parent.find("." + selected).removeClass(selected);
                tool.addClass(selected);
            });
            
            /*
             * Bind the tabs 
             **/
            bBox.delegate("." + classes.tabButtons + " a", "click", $.proxy(function(e) {
                
                e.preventDefault();
                
                var
                    button = $(e.currentTarget),
                    tabName = button.attr(attrs.name),
                    tabButtons = button.parents("ul");
                
                tabButtons.find("." + selected).removeClass(selected);
                button.addClass(selected);
                
                bBox.find("." + ribbons).removeClass(selected);
                bBox.find('.' + ribbons + '['+ attrs.name +'="' + tabName + '"]').addClass(selected);
                
                // "acidjs-ribbon-tab-changed"
                bBox.trigger(events[2], {
                    name: tabName,
                    index: button.parent().index(),
                    props: this.tabProps[tabName]
                });
                
                this.expand();
                
            }, this));
            
            /*
             * Bind the checkboxes and radio buttons
             **/
            bBox.delegate('input:checkbox[name]:not([disabled]), input:radio[name]:not([disabled])', "change", $.proxy(function(e) {
                var
                    tool = $(e.currentTarget),
                    command = tool.attr("name"),
                    toolType = tool.parents("[data-tool-type]").attr("data-tool-type"),
                    eventData = {
                        command: command,
                        value: tool.val() || null,
                        active: tool.get(0).checked
                    };
                
                if(this._enabled) {
                    /*
                     * Since version 4.2.0, add the props key (if set) of the tool
                     **/
                    if(["checkbox", "radios"].indexOf(toolType) > -1) {
                        eventData.props = "checkbox" === toolType ? this.props[command] || null : 
                                          this.props[command][tool.parent().parent().index()];
                    } else {
                        // if tool is actually toggle- or exclusive-dropdown
                        if(tool.parents("[data-tool]").attr("data-tool") === "toggle-dropdown" || 
                           tool.parents("[data-tool]").attr("data-tool") === "exclusive-dropdown") {
                            if("radio" === tool.attr("type")) {
                                eventData.props = this.props[command][tool.parent().parent().index()];
                            } else {
                                var
                                    index = tool.parent().parent().index(),
                                    toolName = tool.parents("[data-tool-name]").attr("data-tool-name");
                                    
                                eventData.props = this.props[toolName][index];
                            }
                        }
                    }
                    
                    // "acidjs-ribbon-tool-clicked"
                    bBox.trigger(events[0], eventData);
                }
            }, this));
            
            /*
             * Bind the tools 
             **/
            bBox.delegate('a[name]:not([data-type="menu"]):not([disabled]):not([data-type*="-dropdown"])', "click", $.proxy(function(e) {
                
                var
                    tool = $(e.currentTarget);
                
                e.preventDefault();
                
                /*
                 * Do not fire the event if the tool is disabled or if tools is active in an exclusive buttons group 
                 **/
                if(tool.is("[disabled]") || (tool.parents("ul").is("." + classes.buttonsExclusive) && tool.is("." + active))) {
                    return;
                }
                
                if(this._enabled) {
                    // "acidjs-ribbon-tool-clicked"
                    var
                        command = tool.attr("name"),
                        index,
                        toolType = tool.parents('[data-tool]').attr("data-tool"),
                        eventData = {
                            command: command,
                            value: tool.attr(attrs.value) || null,
                            active: !tool.hasClass(active),
                            props: this.props[command] || null // Since version 4.2.0
                        };
                    
                    if("dropdown" === toolType) {
                        if(tool.parents().is(".acidjs-ui-ribbon-dropdown")) {
                            index = tool.parents("li").index();
                        } else {
                            index = tool.parents('[data-tool]').find("." + classes.selected).parent("li").index();
                        }
                        eventData.props = this.props[command][index];
                    }
                    
                    bBox.trigger(events[0], eventData);
                }
                
                tool.blur();
                
            }, this));
            
            /*
             * Bind the menu tool
             **/
            bBox.delegate('[data-tool="menu"] > div:first-child a', "click", $.proxy(function(e) {
                var
                    tool = $(e.currentTarget);
                
                this._halt(e);
                
                tool.find(".acidjs-ribbon-arrow").click();
                
            }, this));
            
            /*
             * Bind the menu tool
             **/
            bBox.delegate('.acidjs-ribbon-generic-dropdown > div:first-child a', "click", $.proxy(function(e) {
                var
                    tool = $(e.currentTarget);
                
                this._halt(e);
                
                tool.find(".acidjs-ribbon-arrow").click();
                
            }, this));
            
            /*
             * Bind the genreric dropdown arrow
             **/
            bBox.delegate(".acidjs-ribbon-generic-dropdown .acidjs-ribbon-arrow", "click", $.proxy(function(e) {
                
                this._halt(e);
                
                var
                    arrow = $(e.currentTarget),
                    dropDown = arrow.parents(".acidjs-ribbon-generic-dropdown").find("." + classes.ribbonDropdown);
                
                this._hideAllDropdowns();
                
                this._openDropdown(dropDown);
            }, this));
            
            /*
             * Bind the color picker arrow 
             **/
            bBox.delegate(classes.colorPickerDropdownArrow, "click", $.proxy(function(e) {
                
                this._halt(e);
                
                var
                    arrow = $(e.currentTarget),
                    dropDown = arrow.parents("." + classes.colorPicker).find("." + classes.ribbonDropdown);
                
                this._hideAllDropdowns();
                
                this._openDropdown(dropDown);
            }, this));
            
            /*
             * Bind the dropdown arrow 
             **/
            bBox.delegate(classes.dropdownArrow, "click", $.proxy(function(e) {
                
                this._halt(e);
                
                var
                    arrow = $(e.currentTarget),
                    dropDown = arrow.parents("." + classes.dropdown).find("." + classes.ribbonDropdown);
                
                this._hideAllDropdowns();
                
                this._openDropdown(dropDown);
            }, this));
            
            /*
             * Bind the split button arrow 
             **/
            bBox.delegate(classes.splitButtonArrow, "click", $.proxy(function(e) {
                
                this._halt(e);
                
                var
                    arrow = $(e.target),
                    dropDown = arrow.parents("." + classes.splitButton).find("." + classes.ribbonDropdown);
                
                this._hideAllDropdowns();
                
                this._openDropdown(dropDown);
            }, this));
            
            /*
             * Bind the exclusive buttons
             **/
            bBox.delegate("." + classes.buttonsExclusive + " a", "click", $.proxy(function(e) {
                
                var
                    button = $(e.currentTarget),
                    group = button.parents("." + classes.buttonsExclusive);
                
                group.find("." + active).removeClass(active);
                button.addClass(active);
                
            }, this));
            
            /*
             * Bind the toggle buttons
             **/
            bBox.delegate("." + classes.toggleButtons + " a", "click", $.proxy(function(e) {
                
                var
                    button = $(e.currentTarget);
                
                button.toggleClass(active);
                
            }, this));
            
            /*
             * Bind to the "acidjs-ribbon-ready" event
             **/
            bBox.on(events[1], $.proxy(function(e, data) {
                
                e = e || {};
                data = data || {};
                
                var
                    defaultSelectedTab = this.config.defaultSelectedTab ? this.config.defaultSelectedTab : 0;

                bBox.find("." + classes.tabButtons + " li:eq(" + defaultSelectedTab + ") a").trigger("click");
                
                this._setFontFamilies();
                this._setFontSizes();
                
                _setTrialLimitations.call(this, this);
                
            }, this));
            
            this.ready = true;
            
            bBox.trigger(events[1], {
                ready: this.ready,
                config: this.config
            });
        },
        
        /*
         * Automatically set font sizes if the tool name is "font-size"
         * @method _setFontSizes
         * @private
         * @return void
         **/
        _setFontSizes: function() {
            var
                attrs = this.ATTRS,
                nodes = this.getBoundingBox().find('div[data-tool="dropdown"][data-tool-name="font-size"] .acidjs-ui-ribbon-dropdown').find("a");
            
            nodes.each(function() {
                var
                    link = $(this),
                    fontSize = link.attr(attrs.value);
                
                link.find("span").css({
                    fontSize: fontSize + "px",
                    lineHeight: fontSize + "px"
                });
            });
        },
        
        /*
         * Automatically set font families if the tool name is "font-family"
         * @method _setFontFamilies
         * @private
         * @return void
         **/
        _setFontFamilies: function() {
            var
                attrs = this.ATTRS,
                nodes = this.getBoundingBox().find('div[data-tool="dropdown"][data-tool-name="font-family"] .acidjs-ui-ribbon-dropdown').find("a");
            
            nodes.each(function() {
                var
                    link = $(this),
                    fontFamily = link.attr(attrs.value),
                    fontFamilyArray = [];
                
                fontFamily = fontFamily.split(",");
                
                for(var i = 0; i < fontFamily.length; i ++) {
                    fontFamilyArray.push("'" + fontFamily[i].trim() + "'");
                }
                
                fontFamilyArray = fontFamilyArray.join(",");
                
                link.css({
                    fontFamily: fontFamilyArray
                });
            });
        },
        
        /*
         * Expand a dropdown
         * @method _openDropdown
         * @param {Object} dropdown [required]
         * @private
         * @return void
         **/
        _openDropdown: function(dropdown) {
            var
                classes = this.CSS_CLASSES,
                cssSelected = classes.selected,
                selectedItem = dropdown.find("." + cssSelected);
        
            dropdown.addClass(classes.open);
            
            if(!selectedItem.is(":visible")) {
                selectedItem.removeClass(cssSelected);
                selectedItem = selectedItem.parent().next().find("a");
                selectedItem.addClass(cssSelected);
            }
            
            selectedItem.focus();
        },
        
        /*
         * Hide all dropdowns on the page
         * @method _hideAllDropdowns
         * @private
         * @return void
         **/
        _hideAllDropdowns: function() {
            var
                open = this.CSS_CLASSES.open,
                dropdowns = B.find("." + open);

           dropdowns.removeClass(open);
           dropdowns.find("a").blur();
        },
        
        /*
         * Set a template from an HTML element (<template />, <script type="text/html" />, etc.)
         * @method _setTemplate
         * @param {String} name [required]
         * @param {String} html [required]
         * @public
         * @return void
         **/
        _setTemplate: function(name, html) {
            if(name && html) {
                this.TEMPLATES[name] = html.split("\n");
            }
        },
        
        /*
         * Create AngularJs directives (since version 4.3.0)
         * @method _createNgDirectives
         * @param {Object} ng AngularJS directives
         * {
         *  if: "lang == 'JavaScript' || key == 'HTML5'",
            show: ""
         * }
         * 
         * or
         * 
         * {
         *  "data-ng-if": "lang == 'JavaScript' || key == 'HTML5'",
            "data-ng-show": ""
         * }
         * @private
         * @return void
         **/
        _createNgDirectives: function(ng) {
            var
                directives = [];
            
            $.each(ng, function(key, value) {
                
                key = key.indexOf("data-") > -1 ? key : "ng-" + key;
                
                directives.push(key + '="' + value + '"');
            });
            
            return directives.join(" ");
            
        },
        
        _moveSelection: function(keyCode) {
            
            var
                classes = this.CSS_CLASSES,
                activeDropdown = $("." + classes.open),
                focusedItem = activeDropdown.find("a:focus"),
                focusedItemParent = focusedItem.parent();
            
            if(!activeDropdown.length) {
                return;
            }
            
            switch(keyCode) {
                /* Arrow Up */
                case 38:
                    focusedItemParent.prev().find("a").focus();
                break;
                /* Arrow Down */
            case 40:
                    focusedItemParent.next().find("a").focus();
                break;
            }
        }
    };
    
    /*
     * add to the window.AcidJs namespace
     **/
    W.AcidJs.Ribbon = Ribbon;
    
    var
        proto = W.AcidJs.Ribbon.prototype;
    
    /*
     * Hide all dropdowns on document.click
     **/
    $(D).bind("click", function() {
        proto._hideAllDropdowns();
    });
    
    /*
     * Up/down keyboard navigation for dropdown items and close on Esc
     **/
    $(D).keyup(function(e) {
        var
            keyCode = e.keyCode;
        
        switch(keyCode) {
            /* Esc */
            case 27:
                    proto._hideAllDropdowns();
                break;
            case 38: /* Arrow Up */
            case 40: /* Arrow Down */
                    proto._moveSelection(keyCode);
                break;
        }
    });
})();