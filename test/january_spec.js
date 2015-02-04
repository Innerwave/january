( function ( $ ) {
  var options = {
    'themes': 'redmond',
    'showTitle': false,
    'showColumnGroup': false,
    'showColumnHeader': false,
    'showRowHeader': false,
    'numberOfColumns': 20,
    'numberOfRows': 100,
    'numberOfFixedRows': 0,
    'numberOfFixedColumns': 0,
    'dataParseUnit': 10,
    'showValueEditor': false,
    'showDefaultGrid': false,
    'defaultGridLineColor': '#CCC',
  };


  function mkColumn( size ) {
    var columns = [];
    for ( var i = 0; i < size; i++ ) {
      columns.push( {
        id: 'col' + i,
        label: undefined, //i < 5 ? 'Col ' + (i + 1) : undefined,
        width: 80,
        className: 'sheet-column-text',
      } );
    }
    return columns;
  }

  function mkData( columns, rows ) {
    var data = [];
    var row;
    for ( var i = 0; i < rows; i++ ) {
      row = {};
      row.id = 'row' + i;
      //      if (i % 2 !== 0) {
      for ( var j = 0, l = columns; j < l; j += 1 ) {
        // TODO 컬럼 값에 데이터 뿐 아니라. 스패닝, 스타일(CSS) 등을 저장할 수 있도록 object 타입으로 수정할 필요가 있다.
        /**
         * var cell = {value: '', css: '', colspan:1, rowspan: 1, className:'spreadsheet-cell cell-format-text', formular:formular };
         */
        row[ /*columnId*/ 'col' + j ] = {
          value: j + ', ' + i,
          //            rows: ['row' + i, 'row' + (i + 1)]
        };
      }
      //      }
      data.push( row );
    }
    return data;
  }


  var $fixture;

  QUnit.module( 'iui.january', {
    setup: function () {
      $fixture = $( '#qunit-fixture' );
    },
    teardown: function () {
      $fixture.empty();
    }
  } );


  QUnit.test( "january", function ( assert ) {
    var $div = $( "<div id='grid'></div>" ).appendTo( $fixture );
    assert.ok( $div, 'Div 생성' );


    var columns = mkColumn( options.numberOfColumns );

    //    columns[6].label = '일곱번째 컬럼명'
    // 컬럼 그룹핑은 그룹 명을 동일하게 지정합니다.
    // 그룹으로 묶을 컬럼은 붙어 있어야 합니다.
    columns[ 0 ].group = '그룹 0';
    columns[ 1 ].group = '그룹 1';
    columns[ 2 ].group = '그룹 1';
    columns[ 3 ].group = '그룹 1';
    // columns[4].group = 'Group 2';
    columns[ 5 ].group = 'Group 2';
    columns[ 6 ].group = 'Group 2';
    // columns[7].group = 'Group 3';
    columns[ 8 ].group = 'Group 3';
    columns[ 9 ].group = 'Group 3';
    columns[ 10 ].group = 'Group 3';
    //  columns[20].group = 'Group 4';
    columns[ 11 ].group = 'Group 4';
    // columns[12].group = 'Group 4';
    columns[ 13 ].group = 'Group 5';
    columns[ 14 ].group = 'Group 5';
    columns[ 15 ].group = 'Group 5';

    var data = mkData( columns.length, options.numberOfRows );


    var $uiProgressLabel = $( '<div class="spreadsheet-progress-label">' ).text( 'Loading......' );
    var $uiProgressBar = $( '<div class="spreadsheet-progress">' )
      .progressbar( {
        value: false,
        change: function () {
          $uiProgressLabel.text( $uiProgressBar.progressbar( "value" ) + "% plugin" )
            .css( 'left', ( $uiProgressBar.width() - $uiProgressLabel.outerWidth() ) / 2 + 'px' );
        },
        complete: function () {
          $uiProgressLabel.text( "100%" );
          $uiProgressLabel.css( 'left', ( $uiProgressBar.width() - $uiProgressLabel.outerWidth() ) / 2 + 'px' );
          $uiProgressBar.hide( 'slow' );
        }
      } )
      .append( $uiProgressLabel );


    var $sheet = $div.january( {
      // 태그에 속성으로 설정된 것보다 우선한다.
      // 'width': 400,
      // 'height': 300,
      //'title' : 'test example',
      'columns': columns,
      //     'data': data, // 옵션으로 주입하면 모든 데이터를 파싱한 후 디스플레이한다.

      'progressBar': $uiProgressBar,

      // 'numberOfColumns': 100,
      // 'numberOfRows': 500,

      'dataParseUnit': options.dataParseUnit,

      // 행 고정: 상단에 고정으로 보일 행의 갯수를 지정합니다.
      // sheet.rows 상의 인덱스에 따릅니다.
      'numberOfFixedRows': options.numberOfFixedRows,

      // 열 고정 : 좌측에 고정할 열의 갯수를 지정합니다.
      // sheet.columns의 인덱스 순서에 따릅니다.
      'numberOfFixedColumns': options.numberOfFixedColumns,

      'showTitle': options.showTitle,
      'showRowHeaders': options.showRowHeader,
      'showColumnGroups': options.showColumnGroup,
      'showColumnHeaders': options.showColumnHeader,
      'showValueWindow': options.showValueWindow,
      'showDefaultGrid': options.showDefaultGrid,
      'defaultGridLineColor': options.defaultGridLineColor,

      //callback
      'create': function ( event, ui ) {
        // console.log('create complete');
        //loadData(event, ui);
        //$(this).spreadsheet('data', data);
      }
    } );

    $sheet.january( 'data', data );
    var rd = $sheet.january( 'data' );
    assert.equal( rd.length, data.length, '생성된 데이터 수와 삽입된 수 비교' );



  } );

}( jQuery ) );
