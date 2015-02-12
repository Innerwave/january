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

  var Cell = iui.sheet.model.Cell = function ( info ) {

    info = info || {};

    if ( !( this instanceof Cell ) ) {
      return new Cell( info );
    }

    for ( var key in info ) {
      this[ key ] = info[ key ];
    }

    this.index = nextId;
    this.uid = info.id || "cell" + nextId++;
    this.id = info.id || this.uid;
    this.value = info.value;
    this.formula = info.formula;
    this.className = "spreadsheet-cell " + ( info.classname || "" );
    this.renderer = info.renderer; // iui.sheet.renderer.String;
    this.editor = info.editor;

    // 성능상 배열을 사용하는 것이 좋겠다.... 파싱이 넘 느려...  
    //  this.rows = /*info.rows || */ []; 
    //  this.columns = /*info.columns || */ [];
    this.rows = ( new iui.util.Collection() ).addAll( info.rows || [] );
    this.columns = ( new iui.util.Collection() ).addAll( info.columns || [] );

    // privileged method
    this.ui = null;

  };

  // public methods
  $.extend( Cell.prototype, iui.sheet.model.Entity, {
    getRenderer: function () {
      return this.renderer ? this.renderer :
        this.columns.length > 0 ? this.columns.get( 0 ).renderer :
        iui.sheet.renderer.String;
    }
  } );

}( jQuery, window ) );
