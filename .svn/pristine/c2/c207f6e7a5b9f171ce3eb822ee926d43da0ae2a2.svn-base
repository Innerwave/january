( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.Iterator = function ( elements ) {
    this.nextIndex = 0;
    this.elements = elements || [];
  };

  $.extend( iui.util.Iterator.prototype, {
    hasNext: function () {
      return this.nextIndex < this.elements.length;
    },

    next: function () {
      if ( this.hasNext() ) {
        return this.elements[ this.nextIndex++ ];
      }
    },

    remove: function () {
      if ( this.hasNext() ) {
        this.elements.splice( this.nextIndex, 1 );
      }
    }
  } );
}( jQuery, window ) );
