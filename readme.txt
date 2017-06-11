=== PlanetEye Maps ===
Contributors: Alan Hietala, Rohan Pall, Matt MacGillivray
Tags: map, maps, google, post, context, information, info, link, geotag, geo
Requires at least: 2.5
Tested up to: 2.8.2
Stable tag: 0.9.0

Allows a blogger to link blog posts to a google map, displaying a summary map at the top of the post.


== Description ==

The PlanetEye Wordpress Google Map plug-in allows a blogger to link blog posts to any of the places on PlanetEye.com. With a growing list of hotels, restaurants, attractions, landmarks and other points of interest to the traveller, these links give the reader access to useful information related to your post while enhancing the appearance of your blog with a cool Google Map.

Requires PHP 5+, WP 2.5+.

More information is available here:
[PlanetEye Map Wordpress Plugin](http://main.planeteye.com/?page_id=2190 "Best google map wordpress plugin")


== Installation ==

This section describes how to install the plugin and get it working.

1.  Unzip to the '/wp-content/plugins' directory.
2.  Activate the plugin through the 'Plugins' menu in Wordpress.
3.  Sign up for a Google Maps API key for your blog url.
4.  Enter the Google Maps key into the 'Settings / PlanetEye' menu in Wordpress.
5.  Start posting!

Full information is available here:
[PlanetEye Map Wordpress Plugin](http://main.planeteye.com/?page_id=2190 "Best google map wordpress plugin")


== Screenshots ==

1.  What the map looks like on your blog post by default.
2.  What the map looks like on your blog post when expanded.
3.  Login to Wordpress and Start a New Post.  The first step is to make sure you are logged in to your blog and have started to write a new post.
4.  Select the Text You Want to Link.  While writing your post, highlight any text that you would like to convert into a location on the map. Usually the name of a place or a city will be a good choice.
5.  Click on the PlanetEye Icon.  Once you have selected the text you want to link back to PlanetEye, click on the PlanetEye icon to open the window where you will search for the place to which you are linking. The screenshot below shows the mouse pointer hovering over the icon you will want to click.
6.  Search for the Place to Which You Are Linking.  Now that the search window is open, you are going to want to search for the place you are writing about. You can just enter the name of the place (the example shown in the screenshot below is The Edgewater Hotel in Seattle, WA) and then click the Search button. You can add additional clarifications to ensure you receive relevant results - such as the city where the place is located, or the full address.
7.  Find the Correct Place.  Once the results appear, you can find the one you are referring to and click the “Link to This Place” button.
8.  Let PlanetEye do the work.  Once you click the “Link to This Place” button, the plug-in will insert the correct code into your post and will create a nice Google Map featuring this location. At the same time we use this opportunity to make sure the PlanetEye site is updated with any places we didn’t know about. This will only take a few seconds.
9.  Done!  You can repeat this process for as many location as you wish within your post. All of them will appear in the Google Map.



== Changelog ==

= 0.9.0 =
* Updated CSS to deal with existing floats prior to display on post page.

= 0.8.9 =
* Updated to handle pingbacks on planeteye.com (via the logo)

= 0.8.8 =
* Updated map handling to deal with webkit issues.

= 0.8.7 =
* Fixed exception that occurs when no results are found.

= 0.8.6 =
* Fixed customer urls, other customer related issues.

= 0.8.5 =
* Reworked display.
* Fixed 'address not appearing' bug.

= 0.8.4 =
* corrected encoding issue with places listed in the RSS feed.

= 0.8.3 =
* corrected encoding issue with places listed on the map

= 0.8.2 =
* corrected plugin directory issues
* investigating PHP 4 issues (SimpleXMLElement)

= 0.8.1 =
* fixed javascript error that occurs when trying to link to a place
* updated documentation so it was consistent.
* dealing with error loading tinymce button (fixed)

= 0.8 =
* Initial version uploaded to wordpress.
