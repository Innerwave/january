( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );
  var nextId = 0;

  iui.sheet.model.Row = function ( info ) {
    info = info || {};

    if ( !( this instanceof iui.sheet.model.Row ) ) {
      return new iui.sheet.model.Row( info );
    }

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
    this.renderer = null;
    this.editor = null;
    this.buttons = null;
  };

  $.extend( iui.sheet.model.Row.prototype, iui.sheet.model.Entity, {
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
