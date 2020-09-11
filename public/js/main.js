AOS.init();

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )
  
  FilePond.setOptions({
    stylePanelAspectRatio: 200 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 200
  })
  
  FilePond.parse(document.body);

setTimeout(function() {
  $('.loader_bg').fadeToggle()
}, 500)



