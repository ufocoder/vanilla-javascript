(function(vanillaQuery) {

  vanillaQuery.ajax = function(url, settings) {
    var xhr = new XMLHttpRequest()

    xhr.open(settings.method || 'GET', url)

    settings.error && xhr.addEventListener('error', settings.error)
    settings.success && xhr.addEventListener('load', function(e) {
      settings.success(e.currentTarget.response)
    })

    xhr.send(settings.data || null)
  }

})(window.$)
