
var EXPOI_HEIGHT_CONTRACTED = '70px';
var EXPOI_HEIGHT_EXPANDED = '275px';

var $jq = jQuery.noConflict(); 


$jq(document).ready(function() {

  $jq('.expoi_link_do_expand').click(function() {
    expoi_please_expand($jq(this));
    return false;
  });

  $jq('.expoi_link_do_contract').click(function() {
    expoi_please_contract($jq(this));
    return false;
  });

});



function expoi_please_expand(x) {
  var root = x.parents('.expoi');
  expoi_now_expand(root);
  /** this doesn't work...
  var t = root.children('.expoi_rhs');
  var t2 = document.getElementById(t.attr("id"));
  map = new GMap2(t2);
  map.checkResize();
  **/
}

function expoi_now_expand(root) {

  var cbar = root.find('.expoi_bot_contracted');
  var ebar = root.find('.expoi_bot_expanded');

  var content = root.find('.expoi_content');

  var lhs = root.find('.expoi_lhs');
  var rhs = root.find('.expoi_rhs');


  cbar.hide();
  ebar.show();

  content.show();

  lhs.css('height', EXPOI_HEIGHT_EXPANDED);
  rhs.css('height', EXPOI_HEIGHT_EXPANDED);

}




function expoi_please_contract(x) {
  var root = x.parents('.expoi');
  expoi_now_contract(root);
}

function expoi_now_contract(root) {

  var cbar = root.find('.expoi_bot_contracted');
  var ebar = root.find('.expoi_bot_expanded');

  var content = root.find('.expoi_content');

  var lhs = root.find('.expoi_lhs');
  var rhs = root.find('.expoi_rhs');


  cbar.show();
  ebar.hide();

  content.hide();

  lhs.css('height', EXPOI_HEIGHT_CONTRACTED);
  rhs.css('height', EXPOI_HEIGHT_CONTRACTED);

}

