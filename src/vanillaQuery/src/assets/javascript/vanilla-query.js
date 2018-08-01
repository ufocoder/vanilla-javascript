(function(window) {
  var DOMReadyStack = []

  function handleDOMReady(fn) {
    window.document.readyState === 'complete' ? fn.call(document) : DOMReadyStack.push(fn)
  }

  window.document.addEventListener('DOMContentLoaded', function DOMReady() {
    window.document.removeEventListener('DOMContentLoaded', DOMReady)
    while(DOMReadyStack.length) {
      DOMReadyStack.shift().call(document)
    }
  })

  function vanillaQuery(selector) {
    if (typeof selector === 'function') {
      return handleDOMReady(selector)
    }

    if (!(this instanceof vanillaQuery)) {
      return new vanillaQuery(selector)
    }

    if (selector instanceof HTMLElement) {
      this.nodes = [selector]
    } else if (selector instanceof NodeList) {
      this.nodes = [].slice.call(selector)
    } else {
      this.nodes = [].slice.call(document.querySelectorAll(selector))
    }

    this.nodes.forEach(function(node) {
      if (!node.eventHandlers) {
        node.eventHandlers = []
      }
    })
  }


  vanillaQuery.fn = vanillaQuery.prototype

  /**
   * CSS manipulation
   */

  vanillaQuery.fn.css = function(propertyName, value) {
    this.nodes.forEach(function(node) {
      node.style[propertyName] = value
    })

    return this
  }

  /**
   * CSS class manipulation
   */

  vanillaQuery.fn.addClass = function(className) {
    this.nodes.forEach(function(node) {
      node.classList.add(className)
    })

    return this
  }

  vanillaQuery.fn.removeClass = function(className) {
    this.nodes.forEach(function(node) {
      node.classList.remove(className)
    })

    return this
  }

  /**
   * DOM manipultion
   */
  vanillaQuery.fn.remove = function() {
    this.nodes.forEach(function(node) {
      node.parentNode.removeChild(node)
    })

    return this
  }

  vanillaQuery.fn.html = function(newValue) {
    if (newValue) {
      this.nodes.forEach(function(node) {
        node.innerHTML = newValue
      })

      return this
    }

    return this.nodes[0] && this.nodes[0].innerHTML
  }

  vanillaQuery.fn.text = function(newValue) {
    if (newValue) {
      this.nodes.forEach(function(node) {
        node.textContent = newValue
      })

      return this
    }

    return this.nodes[0] && this.nodes[0].textContent
  }

  /**
   * Event handling
   */

  vanillaQuery.fn.on = function(eventName, callback) {
    this.nodes.forEach(function(node) {
      node.addEventListener(eventName, callback, false)
      node.eventHandlers.push({
        type: eventName,
        callback: callback
      })
    })
  }

  vanillaQuery.fn.off = function(eventName, callback) {
    this.nodes.forEach(function(node) {
      node
        .eventHandlers
        .filter(function(eventHandler) {
          var hasEvent = eventHandler.type === eventName
          if (callback) {
            return hasEvent && eventHandler.callback === callback
          }
          return hasEvent
        })
        .forEach(function(eventHandler) {
          node.removeEventListener(eventHandler.type, eventHandler.callback, false)
        })
    })
  }

  window.$ = vanillaQuery

})(window);
