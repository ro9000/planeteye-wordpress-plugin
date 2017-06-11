<?php /*

Plugin Name: PlanetEye Maps
Plugin URI: http://main.planeteye.com/?page_id=2190
Description: Allows a blogger to link blog posts to a google map, displaying a summary map at the top of the post.  WP 2.5+ (TinyMCE v3.x) and PHP 5+.
Version: 0.8.7
Author: Alan, Ro, Matt, Slava
Author URI: http://www.planeteye.com/member/qmnonic

*/

# Nothing to see here!

class PlanetEyePlaceLinks {

	var $mapCounter = 0;
	var $mapScriptIncluded = false;


	// constructor
	function PlanetEyePlaceLinks() {
		$mapCounter = 0;
		$mapScriptIncluded = false;

		// init process for button control
		//add_action('init', 'myplugin_addbuttons');

		// add this plugin last...
		add_action('plugins_loaded', array(&$this, 'addbuttons'));

		//add_action('wp_print_styles', array(&$this, 'addMapStyles'));
		add_action('wp_print_scripts', array(&$this, 'addMapScripts'));
		add_action('wp_head', array(&$this, 'addMapStyles'));
		add_filter('the_content', array(&$this, 'addMapToPost'));
	}






	// update cache settings for tinymce, normally used for debugging purposes
	function my_change_mce_settings( $init_array ) {
		$init_array['disk_cache'] = false; // disable caching
		$init_array['compress'] = false; // disable gzip compression
		$init_array['old_cache_max'] = 0; // keep 3 different TinyMCE configurations cached (when switching between several configurations regularly)
		return $init_array;
	}


	// add buttons to wordpress 2.5 and above
	function mce_buttons($buttons) {
		array_push($buttons, 'planeteyeplacelinks');
		return $buttons;
	}

	// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
	function mce_external_plugins($plugin_array) {
		$plugin_array['planeteyeplacelinks'] = trailingslashit( get_bloginfo('wpurl') ). PLUGINDIR . '/' .  dirname( plugin_basename(__FILE__) ) . '/editor_plugin.js';
		//$plugin_array['planeteyeplacelinks'] = '/wp-content/plugins/planeteye-maps/editor_plugin.js';

		return $plugin_array;
	}


	// trigger the addition of extra buttons to tinymce
	function addbuttons() {
		// Dont bother doing this stuff if the current user lacks permissions
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) return;

		//if ( get_user_option('rich_editing') == 'true' && $this->wpversion >= 2.5) {
			add_filter('mce_external_plugins', array(&$this, 'mce_external_plugins'));
			add_filter('mce_buttons_3', array(&$this, 'mce_buttons'));
		//}
	}





	function addMapScripts() {
		$wp_pe_plugin_url = trailingslashit( get_bloginfo('wpurl') ).PLUGINDIR.'/'. dirname( plugin_basename(__FILE__) );

		if (!is_admin()) {
			wp_enqueue_script('jquery');
			//wp_enqueue_script("pe-maps", $wp_pe_plugin_url."/js/wpp-map.js", array('google-maps','jquery'), '');
			wp_enqueue_script("google-maps", "http://maps.google.com/maps?file=api&amp;v=2&amp;key=" . get_option('pe_google_map_key'), array(), '');
			wp_enqueue_script("pe-blog-maps", $wp_pe_plugin_url."/js/wpp-blog-maps.js", array('google-maps','jquery'), '');
			wp_enqueue_script("jq-mouse",  $wp_pe_plugin_url . '/js/jquery.mousewheel.js', array(), '');
			wp_enqueue_script("jq-em",  $wp_pe_plugin_url . '/js/jquery.em.js', array(), '');
			wp_enqueue_script("jq-scrollpane",  $wp_pe_plugin_url . '/js/jScrollPane.js', array(), '');
		}
	}

	function addMapStyles() {
			$wp_pe_plugin_url = trailingslashit( get_bloginfo('wpurl') ).PLUGINDIR.'/'. dirname( plugin_basename(__FILE__) );

			// works in all versions of wordpress (but bad form)
			if (!is_admin()) {
				echo '<link type="text/css" rel="stylesheet" href="' . $wp_pe_plugin_url . '/css/wpp-map.css" />' . "\n";
				echo '<!--[if IE]><link type="text/css" rel="stylesheet" href="' . $wp_pe_plugin_url . '/css/wpp-map-ie.css" /><![endif]-->' . "\n";
				echo '<link type="text/css" rel="stylesheet" href="' . $wp_pe_plugin_url . '/css/jScrollPane.css" />' . "\n";
				
			}

			// only works in wp 2.7
			if (!is_admin()) {
				//wp_register_style('pe_map_styles', $wp_pe_plugin_url."/css/wpp-map.css");
		        //wp_enqueue_style( 'pe_map_styles');
		        //wp_enqueue_style('pe-map-style', $wp_pe_plugin_url."/css/wpp-map.css", array(), '');
			}

	}


	// this code is executed prior to displaying every post
	// code that searches the existing post for planeteye place links, then
	// generates the code required to display it on a map.
	function addMapToPost($content) {
		$returnValue = "";

    		$pe_customer_id = get_option( 'pe_customer_id' );

		$wp_pe_plugin_url = trailingslashit( get_bloginfo('wpurl') ).PLUGINDIR.'/'. dirname( plugin_basename(__FILE__) );


		// make sure this has the 'Ungreedy' modifier, so it matches multiple per line..
		// find all planeteye place links on the page..
		// look for all links on a page, that have a 'title'
		$regex_pattern = "/<a\s[^>]*title=\"___name___(.*)___desc___(.*)___lat___(.*)___(lng|lon)___(.*)(___address___(.*)){0,1}\"[^>]*>(.*)<\/a>/siU";
		preg_match_all($regex_pattern,$content,$matches);

		// make sure there are results..
		$matches_count = count($matches[0]);
		//if (count($matches[0]) > 0) {
		if ($matches_count > 0) {
		if (is_feed()) {
			$returnValue = "<p><em>This post mentions: ";

			$last_match = end($matches[0]);

			// iterate over the set of a tags
			foreach ($matches[0] as $match) {

				// extract what we're looking for - href and title (which contains encoded
				// information necessary to display the map)
				$xml = new SimpleXMLElement($match);
				$href = $xml->xpath("//a/@href");
				// if there is a customerid option, and it's not already in the url, add it
				if (!empty($pe_customer_id) && strpos($href[0], "/" . $pe_customer_id . ".aspx") == false) {
					$href[0] = str_replace(".aspx", "/" . $pe_customer_id . ".aspx", $href[0]);
				}
				$titledescgeo = $xml->xpath("//a/@title");

				$pieces = split("___", $titledescgeo[0]);

				// last element in the array
				if ($match == $last_match) {
					// make sure this isn't a list of 1 element
					if ($matches_count > 1) {
						$returnValue .= "and ";
					}
					$returnValue .= "<a href='". $href[0] . "'>" . trim(urldecode($pieces[2])) . "</a>.</em></p>";
				} else {
					$returnValue .= "<a href='". $href[0] . "'>" . trim(urldecode($pieces[2])) . "</a>, ";
				}
			}

		} else {
			$returnValue = "<div class='expoi clear'>"."\n";
			$returnValue .= "  <div class='expoi_lhs'>"."\n";

			$returnValue .= '    <div class="expoi_top">'."\n";
			
			$returnValue .= '      <div class="e">'."\n";
			//$returnValue .= '        <span class="x1">' . count($matches[0]) . '</span>'."\n";
			//$returnValue .= '        <span class="x2">places are mentioned in this post!</span>'."\n";
			$returnValue .= '        <span><strong>Related places:</strong></span>'."\n";
			$returnValue .= '      </div>'."\n";
			$returnValue .= '      <div class="clear"></div>'."\n";
			$returnValue .= '    </div> <!-- /expoi_top -->'."\n";


			$returnValue .= "  <div class='expoi_content scroll-pane'>"."\n";
			$returnValue .= "    <ol class='expoi_content_list' type='A'>"."\n";


			$arr = array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"); 
			$n_count = 0;
			// iterate over the set of a tags
			foreach ($matches[0] as $match) {

				// extract what we're looking for - href and title (which contains encoded
				// information necessary to display the map)
				$xml = new SimpleXMLElement($match);
				$href = $xml->xpath("//a/@href");
				// if there is a customerid option, and it's not already in the url, add it
				if (!empty($pe_customer_id) && strpos($href[0], "/" . $pe_customer_id . ".aspx") == false) {
					$href[0] = str_replace(".aspx", "/" . $pe_customer_id . ".aspx", $href[0]);
				}

				$titledescgeo = $xml->xpath("//a/@title");

				$pieces = split("___", $titledescgeo[0]);


				$returnValue .= "        <li>"."\n";
				$returnValue .= "          <div class='pin'>". $arr[$n_count] ."</div>"."\n";
				$returnValue .= "          <div class='q'>"."\n";
				$returnValue .= "            <div class='ttl'>" . trim(urldecode($pieces[2])) . "</div>" . "\n";
				if (trim($pieces[10]) != 'null') {
					$returnValue .= "            <div class='adr'>" . trim(urldecode($pieces[10])) . "</div>" . "\n";
				}
				$returnValue .= "            <a href='" . $href[0] . "'>View Details and Book</a>"."\n";
				$returnValue .= "          </div>"."\n";
				$returnValue .= '          <div class="w">'."\n";
				/**
				if (trim($pieces[4]) != 'null') {
					$returnValue .= "            " . trim(urldecode($pieces[4])); // description
				}
				**/
				$returnValue .= '          </div>'."\n";
				$returnValue .= "          <div class='clear'></div>";
				$returnValue .= "        </li>"."\n";


				// remember the lat/long values so we can create pins
				// in the google map.
				$coords[trim($pieces[6])] = trim($pieces[8]);
				$n_count ++;

/**
				// link looks like: <a href="#" title="title___desc___lat___lng">...</a>
				$returnValue .= "href: " . $href[0] . "<br/>";
				$returnValue .= "title: " . trim($pieces[0]) . "<br/>";
				$returnValue .= "desc: " . trim($pieces[1]) . "<br/>";
				$returnValue .= "lat: " . trim($pieces[2]) . "<br/>";
				$returnValue .= "lng: " . trim($pieces[3]) . "<br/><br/>";
**/
			}
			$returnValue .= "      </ol><!-- expoi_content_list --> "."\n";
			$returnValue .= "    </div> <!-- expoi_content -->"."\n";
			//$returnValue .= "    <div class='expoi_bot'>";
			//$returnValue .= "      <div class='expoi_bot_contracted'>";
			//$returnValue .= '            <div class="q"><a href="#" class="expoi_link_do_expand">View Details on the Map</a></div>'."\n";
			//$returnValue .= "      </div> <!-- expoi_bot_contracted -->";
			//$returnValue .= "      <div class='expoi_bot_expanded'>";
			//$returnValue .= '            <div class="q">Click on the place name to learn more</div>' . "\n";
			//$returnValue .= '            <div class="w"><a href="#" class="expoi_link_do_contract">Close</a></div>' . "\n";
			//$returnValue .= '            <div class="clear"></div>'."\n";
			//$returnValue .= "      </div> <!-- expoi_bot_expanded -->";
			//$returnValue .= "    </div><!-- expoi_bot -->"."\n";
			$returnValue .= "  </div> <!-- expoi_lhs -->"."\n";
			$returnValue .= "  <div class='expoi_rhs' id='places_map" . $this->mapCounter . "'>"."\n";
			$returnValue .= "   <script type='text/javascript'>";
			
			$returnValue .= "     if (GBrowserIsCompatible()) {";
			$returnValue .= "       map = new GMap2(document.getElementById('places_map" . $this->mapCounter . "'));";
			$returnValue .= "       var bb = null;";
			$returnValue .= "       map.setCenter(new GLatLng(34,0), 1);";
			$returnValue .= "       map.clearOverlays();";
			

			$i = 0;
			foreach ($coords as $lat => $lng) {
				$returnValue .= "       point = new GLatLng(" . $lat . "," . $lng . ");";
				$returnValue .= "       letter = String.fromCharCode(\"A\".charCodeAt(0) + ". $i .");";
				$returnValue .= "       markerIcon = new GIcon(G_DEFAULT_ICON, \"http://www.google.com/mapfiles/marker\" + letter + \".png\");";
				$returnValue .= "       markerOptions = { icon:markerIcon };";

				$returnValue .= "       marker = new GMarker(point, markerOptions);";
				$returnValue .= "       map.addOverlay(marker);";
				$returnValue .= "       map.labelText = letter;";

				// calculate the bounding box
				$returnValue .= "       if (bb == null) { bb = new GLatLngBounds(point, point); }";
				$returnValue .= "       else { bb.extend(point); }";
				$i += 1;
			}

			$returnValue .= "       map.setCenter(bb.getCenter(), map.getBoundsZoomLevel(bb) - 1);";

			$returnValue .= "       map._lastCenter=map.getCenter();";
			$returnValue .= "       GEvent.addListener(map,'moveend', function() { map._lastCenter=map.getCenter(); });";
			$returnValue .= "       GEvent.addListener(map,'resize', function() { map.setCenter(map._lastCenter); });";
			$returnValue .= "     }";
			$returnValue .= "   </script>";
			$returnValue .= "  </div> <!-- expoi_rhs -->";
			$returnValue .= "  <div class='clear'></div>";
			$returnValue .= '  <div class="q1"><a href="http://www.planeteye.com?refcon=wp"><img src="http://www.planeteye.com/services/m/avatar/pe-maps/' . (($pe_customer_id == '') ? '0' : $pe_customer_id) . '.jpg" /></a></div>'."\n";
			$returnValue .= "  <div class='clear'></div>";
			$returnValue .= "</div> <!-- expoi -->";
		}
		}
		$this->mapCounter ++;
		
		
		
		// this is the rss feed..
		if (is_feed()) {
			// add rss summary after post
			return $content.$returnValue;

		// this isn't the RSS feed..
		} else {
			// add map stuff before the existing content..
			return $content.$returnValue;
		}
	}

}


// initialize and start this plugin
global $PlanetEyePlaceLinks;
$PlanetEyePlaceLinks = new PlanetEyePlaceLinks();



add_action('admin_menu', 'init_pe_options');




function init_pe_options() {
	add_options_page('PlanetEye Maps Plugin', 'PlanetEye', 7, __FILE__, 'pe_options_page');
}



/**
 * ADMINISTRATION PAGE - Appears in the OPTIONS / PlanetEye tab within the wordpress config
 */
// mt_options_page() displays the page content for the Test Options submenu
function pe_options_page() {

    // variables for the field and option names
    $opt_name = 'pe_google_map_key';
    $hidden_field_name = 'pe_submit_hidden';
    $data_field_name = 'pe_google_map_key';

    $name_pe_google_map_key = 'pe_google_map_key';
    $name_pe_customer_id = 'pe_customer_id';

    // Read in existing option value from database
//    $opt_val = get_option( $opt_name );
    $value_pe_google_map_key = get_option( $name_pe_google_map_key );
    $value_pe_customer_id = get_option( $name_pe_customer_id );

    // See if the user has posted us some information
    // If they did, this hidden field will be set to 'Y'
    if( $_POST[ $hidden_field_name ] == 'Y' ) {
		check_admin_referer( 'planeteye-place-links_update' ); // Verify the nonce. http://markjaquith.wordpress.com/2006/06/02/wordpress-203-nonces/
        // Read their posted value
        //$opt_val = stripslashes( $_POST[ $data_field_name ] ); // Get rid of MCGPC slashing
        $value_pe_google_map_key = stripslashes( $_POST[ $name_pe_google_map_key ] ); // Get rid of MCGPC slashing
        $value_pe_customer_id = stripslashes( $_POST[ $name_pe_customer_id ] ); // Get rid of MCGPC slashing

        // Save the posted value in the database
        //update_option( $opt_name, $opt_val );
        update_option( $name_pe_google_map_key, $value_pe_google_map_key );
        update_option( $name_pe_customer_id, $value_pe_customer_id );

        // Put an options updated message on the screen
?>
<div class="updated"><p><strong><?php _e('Options saved.', 'pe_google_map_key' ); ?></strong></p></div>
<?php

    }

    // Now display the options editing screen
    echo '<div class="wrap">';

    // header
    echo "<h2>" . __( 'PlanetEye Maps Plugin Options', 'pe_google_map_key' ) . "</h2>";

    // options form
    ?>

<form name="form1" method="post" action=""><?php // Blank action means current page. Avoid $_SERVER XSS exploits ?>
<input type="hidden" name="<?php echo $hidden_field_name; ?>" value="Y">
<?php wp_nonce_field( 'planeteye-place-links_update' ); // Set the nonce. http://markjaquith.wordpress.com/2006/06/02/wordpress-203-nonces/ ?>

<p><?php _e("Google Map Key:", $name_pe_google_map_key ); ?>
<input type="text" name="<?php echo $name_pe_google_map_key; ?>" value="<?php echo attribute_escape($value_pe_google_map_key); // Use attribute_escape() to avoid XSS ?>" size="20">
</p>
<p>
<?php _e("PlanetEye Customer ID (optional):", $name_pe_customer_id ); ?>
<input type="text" name="<?php echo $name_pe_customer_id; ?>" value="<?php echo attribute_escape($value_pe_customer_id); // Use attribute_escape() to avoid XSS ?>" size="20">
</p>

<p class="submit">
<input type="submit" name="Submit" value="<?php _e('Update Options', 'pe_google_map_key' ) ?>" />
</p>

</form>
</div>

<?php
}
?>
