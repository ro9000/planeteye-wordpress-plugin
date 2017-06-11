
var $jq = jQuery.noConflict(); 

$jq(document).ready(function() {
	$jq('.scroll-pane').jScrollPane({showArrows:true, scrollbarWidth:16});
});
