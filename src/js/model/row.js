( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );
  var nextId = 0;

  var Row = iui.sheet.model.Row = function ( info ) {
    info = info || {};

    if ( !( this instanceof Row ) ) {
      return new Row( info );
    }
    this.index = nextId;
    this.uid = info.id || "row" + nextId++;
    this.id = info.id || this.uid;
    this.height = info.height || 26;
    this.label = info.label;
    this.width = info.width || 80;
    this.className = "ui-state-default spreadsheet-row " + ( info.className || "" );
    this.ui = null;
    this._offset = {
      top: 0,
      height: this.height,
      outerHeight: 0,
      innerHeight: 0
    };
    this.cells = new iui.util.Collection().addAll( info.cells || [] );

    this.headerRenderer = info.headerRenderer || iui.sheet.renderer.RowHeader;

    this.renderer = null;
    this.editor = null;
    this.buttons = null;
  };

  $.extend( Row.prototype, iui.sheet.model.Entity, {

    setHeight: function ( height ) {
      this.height = height;
      if ( this.ui ) {
        this.ui.height( height );
      }
      this._parent._trigger( "rowChanged" );
    },

    offset: function () {
      if ( this.ui ) {
        this._offset = {
          top: this.ui[ 0 ].offsetTop,
          height: this.ui.height(),
          outerHeight: this.ui.outerHeight(),
          innerHeight: this.ui.innerHeight()
        };
      }
      return this._offset;
    }
  } );
}( jQuery, window ) );
