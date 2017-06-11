
(function(){

	tinymce.PluginManager.requireLangPack('planeteyeplacelinks');

	tinymce.create('tinymce.plugins.PlanetEyeMapsPlugin', {

		init :  function(ed,url) {
			this.editor=ed;
			ed.addCommand('mcePlanetEyePlaceLink', function(){
				var se=ed.selection;
				if (se.isCollapsed() && !ed.dom.getParent(se.getNode(),'A')) return;
				ed.windowManager.open({
					file:url+'/planeteye-place-link-popup.php',
					width:673+parseInt(ed.getLang('advlink.delta_width',0)),
					height:703+parseInt(ed.getLang('advlink.delta_height',0)),
					inline:1
				}, {
				plugin_url:url
				});
			});

			ed.addButton('planeteyeplacelinks',{
				title:'advlink.link_desc',
				cmd:'mcePlanetEyePlaceLink',
				image:url+'/img/editor-button-16x16.png'
			});

			// keyboard shortcut - 'control + l' (L)
			ed.addShortcut('ctrl+l','advlink.advlink_desc','mcePlanetEyePlaceLink');

			// disable the button if nothing is selected in the editor.
			ed.onNodeChange.add(function(ed,cm,n,co){
				cm.setDisabled('planeteyeplacelinks',co&&n.nodeName!='A');
				cm.setActive('planeteyeplacelinks',n.nodeName=='A'&&!n.name);
			});
		},
		getInfo:function(){
			return{
				longname:'PlanetEye Maps',
				author:'Alan, Ro, Matt',
				authorurl:'http://www.planeteye.com/member/qmnonic',
				infourl:'http://main.planeteye.com/?page_id=2190',
				version: '0.9.0'
			};
		}
	});
	tinymce.PluginManager.add('planeteyeplacelinks',tinymce.plugins.PlanetEyeMapsPlugin);

})();
