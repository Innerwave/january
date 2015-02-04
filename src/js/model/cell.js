( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );

  // private 
  var nextId = 0;

  iui.sheet.model.Cell = function ( info ) {

    info = info || {};

    if ( !( this instanceof iui.sheet.model.Cell ) ) {
      return new iui.sheet.model.Cell( info );
    }

    this.uid = info.id || "cell" + nextId++;
    this.id = info.id || this.uid;
    this.value = info.value;
    this.formula = info.formula;
    this.className = "spreadsheet-cell " + ( info.classname || "" );
    this.renderer = info.renderer;
    this.editor = info.editor;

    //  this.rows = /*info.rows || */ []; 
    //  this.columns = /*info.columns || */ [];
    this.rows = ( new iui.util.Collection() ).addAll( info.rows || [] );
    this.columns = ( new iui.util.Collection() ).addAll( info.columns || [] );

    // privileged method

  };

  // public methods
  $.extend( iui.sheet.model.Cell.prototype, iui.sheet.model.Entity, {
    edit: function () {},
    render: function () {},
    refresh: function () {},
    commit: function () {}
  } );

}( jQuery, window ) );
