<?php
if (empty($wp)) {
	require_once('../../../wp-load.php');
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>{#planeteyeplacelinks.title}</title>
	<!-- script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script -->
	<script type="text/javascript" src="js/planeteyesearch.js"></script>
	<script type="text/javascript" src="http://www.google.com/jsapi?key=<?php echo get_option('pe_google_map_key'); ?>"> </script>
	<script type="text/javascript" src="js/tiny_mce_popup.js?ver=311"></script>
	<!-- script type="text/javascript" src="js/jquery-1.3.2.min.js"></script -->
	<script type="text/javascript">
		// make sure jquery has been loaded first..
			google.load("jquery", "1.3.2");
			google.load("maps", "2");
			google.load("search", "1", {"nocss":true});
			google.setOnLoadCallback(function() {
				$(document).ready(function() {
					placeSearchInitialize('document.ready');
				});
				if ($.browser.safari) { setTimeout("placeSearchInitialize('setOnLoadCallback.delay');", 200); }
				else { placeSearchInitialize('setOnLoadCallback'); }
			});
	</script>
 	<link href="css/ssbus.css" rel="stylesheet" type="text/css" />
	<base target="_self" />
</head>
<body onunload="pageUnload()">
	<form onsubmit="peSearchFormSubmit(); return false;" action="#">
		<div class="ssbus">
                <div class="ssbus_give">
                    <div class="h">
                        <div class="q">
                            <img src="img/crea_licon.gif" /></div>
                        <div class="w">
                            Give Us a Location:</div>
                        <div class="clear">
                        </div>
                    </div>
                    <div class="ssbus_gbody">
                        <div class="a">
                            <div class="v1">
                                <div class="q">
                                    Place Search:</div>
                                <div class="w">
                                    <input id="SearchText" type="text" /><a href="#" id="findlink">Find</a>
                                </div>
                            </div>
                            <!-- /v1 -->
                            <div class="v1 searchresultscontainer" style="display: none;">
                                <div class="q">
                                    Search Results (select one):</div>
                                <div class="e">
                                    <div id="searchresults">
                                    </div>
                                </div>
                                <div class="r">
                                    <div class="r0">
                                        <a id="moreresults" href="#">more results</a></div>
                                    <div class="clear">
                                    </div>
                                </div>
                                <!-- /r -->
                            </div>
                            <!-- /v1 -->
                            <div class="v2 instructions">
                                Search for the name of the location that you're looking for: "<strong>Eiffel Tower</strong>",
                                "<strong>Central Park, New York</strong>", "<strong>Old Faithful, Yellowstone</strong>",
                                etc...
                            </div>
                            <!-- /v2 -->
                            <div id="searcherror">
                            </div>
                        </div>
                        <!-- /a -->
                        <div class="b">
                            <div class="q">
                                <!--<img src="/i/selfserve/crea2_icon_drag.png" />Drag the pin to adjust the location-->
                            </div>
                            <div class="w">
                                <div id="ssbus_map">
                                </div>
                                <div class="closemapdiv">
                                    <!--<a id="closemap" href="#">cancel</a>-->
                                </div>
                            </div>
                        </div>
                        <!-- /b -->
                        <div class="clear">
                        </div>
                    </div>
                    <!-- /ssbus_gbody -->
                    <div class="additionalinfo">
                        <div class="additionaltitle">Additional Information</div>
                        <div class="additionalbody">
                            <div class="col colleft">
                                <div>
                                    <div class="inlinelabel">Location Name:</div>
                                    <input runat="server" id="locationname" type="text" /></div>
                                <div>
                                    <div class="inlinelabel">Address:</div>
                                    <input runat="server" id="locationaddress" type="hidden" /><span id="locationaddressLabel" class="latlng"></span></div>
                                <div>
                                    <div class="inlinelabel">Phone:</div>
                                    <input runat="server" id="locationphone" type="text" /></div>
                                <div>
                                    <div class="inlinelabel">Website:</div>
                                    <input runat="server" id="locationwebsite" type="text" /></div>
                                <div>
                                    <div class="inlinelabel">Latitude,Longitude:</div>
                                    <span class="latlng"><span id="locationlat">0</span>,<span id="locationlng">0</span></span></div>
														</div>
<!--
                            <div class="col">
														</div>
-->
                            <div class="clear">
                            </div>
                        </div>
                        <div class="centerbuttons">
                            <div class="ssbus_create_button">
                                <!-- asp:HiddenField ID="HiddenFieldPlaceId" runat="server" / -->
                                <!-- asp:HiddenField ID="HiddenFieldLatitude" runat="server" / -->
                                <!-- asp:HiddenField ID="HiddenFieldLongitude" runat="server" / -->
																<a id="createMapLink" href="#" onclick="linkToPlace('<?php echo get_option('pe_customer_id'); ?>', '<?php echo get_bloginfo('url'); ?>'); return false;">{#planeteyeplacelinks.button_link}</a>
                            </div>
                            <div class="clear">
                            </div>
                        </div>
                    </div>
                </div>

		</div>
	</form>
</body>
</html>
