    ;(function() {


        (function() {

            var css = 'slim-component { all: inherit; }',
                head = document.head || document.getElementsByTagName('head')[0],
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            head.appendChild(style);

        })()


        window.Slim = document.registerElement.bind(document)


        var __injectors = {}

        class SlimDependencyInjection {


            define(injectorName, factory) {
                __injectors[injectorName] = factory
            }


            //noinspection JSUnusedGlobalSymbols
            inject(nodeName, factory, eventName = 'elementAdded', setter = '$dependency') {
                __factories[eventName] = __factories[eventName] || SlimDependencyInjection._createWatch(eventName)
                __factories[eventName][nodeName.toLowerCase()] = { factory: factory, setter: setter }
            }

            getInjector(name) {
                return __injectors[name]
            }

            static _createWatch(eventName) {
                document.addEventListener(eventName, (event) => {
                    this._inject(eventName, event)
                })
                return {}
            }

            static _inject(eventName, event) {
                for (let nodeName in __factories[eventName]) {
                    let target = event.srcElement || event.target
                    let injector = __factories[eventName][target.nodeName.toLowerCase()] || null
                    if (injector !== null) {
                        target[injector.setter] = injector.factory()
                    }
                }
            }
        }

        window.SlimInjector = new SlimDependencyInjection()

        function dashToCamel(dash) {
            return dash.indexOf('-') < 0 ? dash : dash.replace(/-[a-z]/g, m => {return m[1].toUpperCase()})
        }

        function camelToDash(camel) {
            return camel.replace(/([A-Z])/g, '-$1').toLowerCase();
        }


        function __describeAttribute(attribute) {
            const rxInject = /\{(.+[^(\((.+)\))])\}/.exec(attribute.nodeValue)
            const rxProp = /\[(.+[^(\((.+)\))])\]/.exec(attribute.nodeValue)
            const rxMethod = /\[(.+)(\((.+)\)){1}\]/.exec(attribute.nodeValue)

            if (rxMethod) {
                return {
                    type: 'M',
                    attribute: attribute.nodeName,
                    method: rxMethod[1],
                    properties: rxMethod[3].replace(' ','').split(',')
                }
            } else if (rxProp) {
                return {
                    type: 'P',
                    attribute: attribute.nodeName,
                    properties: [ rxProp[1] ]
                }
            } else if (rxInject) {
                return {
                    type: 'I',
                    attribute: attribute.nodeName,
                    factory: rxInject[1]
                }
            } else return {}
        }

        function __inject(descriptor, child) {
            child[dashToCamel(descriptor.attribute)] = window.SlimInjector.getInjector(descriptor.factory)()
        }

        function __bind(source, target, descriptor) {
            descriptor.properties.forEach( prop => {
                source.__bindings[prop] = source.__bindings[prop] || {
                    value: source[prop],
                    executors: []
                }
                var executor = function() {
                    var result
                    if (descriptor.type === 'M') {
                        result = source[descriptor.method]
                                .apply( source,
                                        descriptor.properties.map( prop => {
                                            return source[prop]
                                        }))
                    } else if (descriptor.type === "P") {
                        result = source[descriptor.properties[0]]
                    }
                    if (result !== undefined) {
                        target[dashToCamel(descriptor.attribute)] = result
                        target.setAttribute(camelToDash(descriptor.attribute), result)
                    }
                    
                }
                source.__bindings[prop].executors.push( executor )
                source.__defineSetter__(prop, x => {
                    source.__bindings[prop].value = x
                    source.__bindings[prop].executors.forEach( fn => { fn() })
                })
                source.__defineGetter__(prop, () => {
                    return source.__bindings[prop].value
                })
                executor()
            })
        }




        class SlimBaseElement extends HTMLElement {


            //noinspection JSMethodCanBeStatic
            /**
             * interface
             */
            get template() { return null }


            //noinspection JSMethodCanBeStatic
            get updateOnAttributes() { return [] }

            onCreated() {}
            beforeRender() {}
            render() {}
            afterRender() {}
            onAdded() {}
            update(root = false) {
                if (root) {
                    document.querySelectorAll('[root]').forEach( (element) => {
                        element.update(false)
                    })
                    return
                }
                this._applyTextBindings()
                for (let child of this.children) {
                    try {
                        child.update()
                    }
                    catch (err) {}
                }
            }
            onRemoved() {}

            //noinspection JSUnusedGlobalSymbols
            /**
             * Lifecycle
             */
            createdCallback() {
                this.__bindings = {}
                this.__bindingTree = document.createElement('slim-component')
                this._captureBindings()
                this.onCreated()
                this.dispatchEvent(new Event('elementCreated', {bubbles:true}))
                this._applyBindings()
                this._renderCycle()
            }

            _renderCycle(skipTree = false) {
                this.beforeRender()

                if (!skipTree) this.appendChild(this.__bindingTree)

                this.render()
                this.afterRender()
            }

            _applyTextBindings() {
                const x = function getDescendantProp(obj, desc) {
                    var arr = desc.split(".");
                    while(arr.length && obj) {
                            obj = obj[arr.shift()]
                    };
                    return obj;
                }

                for (let child of this.querySelectorAll('*[bind]')) {
                    var match = child.textContent.match(/\[\[([\w|.]+)\]\]/g)
                    child.sourceTextContent = child.textContent;
                    if (match) {
                        for (var i = 0; i < match.length; i++) {
                            child.innerText = child.innerText.replace(match[i], x(this, match[i].match(/([^\[].+[^\]])/)[0]))
                        }
                    }
                }
            }

            //noinspection JSUnusedGlobalSymbols
            attachedCallback() {
                this.dispatchEvent(new Event('elementAdded', {bubbles:true}))
                this.onAdded()
            }

            //noinspection JSUnusedGlobalSymbols
            attributeChangedCallback(attribute, oldValue, newValue) {
                this.onAttributeChange(attribute, oldValue, newValue)
            }

            //noinspection JSUnusedGlobalSymbols
            detachedCallback() {
                this.onRemoved()
                this._destroy()
                this.dispatchEvent(new Event('elementRemoved', {bubbles:true}))
            }

            //noinspection JSUnusedGlobalSymbols
            /**
             * Base Class
             */
            find(selector) {
                return this.querySelector(selector)
            }

            onAttributeChange(attribute, oldValue, newValue) {
                if (this.updateOnAttributes.indexOf(attribute) >= 0) {
                    this.update(attribute, oldValue, newValue)
                }
            }

            //noinspection JSUnusedGlobalSymbols
            /**
             *
             * @returns {boolean}
             */
            get isAttached() {
                let p = this
                while (p && p !== document.body) {
                    p = p.parentNode
                }
                if (p === document.body) return true
            }

            /**
             * private
             */

            _captureBindings() {
                if (this.template) {
                    this.__bindingTree.innerHTML = this.template
                } else {
                    while (this.children.length) {
                        this.__bindingTree.appendChild( this.children[0] )
                    }
                }
                for (let child of this.__bindingTree.querySelectorAll('*')) {
                    child.parentBind = this
                    if (child.attributes) for (let i = 0; i < child.attributes.length; i++) {
                        let descriptor = __describeAttribute(child.attributes[i])
                        if (descriptor.type === 'P' || descriptor.type === 'M') {
                            __bind(this, child, descriptor)
                        } else if (descriptor.type === 'I') {
                            __inject(descriptor, child)
                        }
                    }
                }
            }

            _applyBindings() {
                Object.keys(this.__bindings).forEach( (property) => {
                    this.__bindings[property].executors.forEach( executor => {
                        executor()
                    })
                })
            }

            _destroy() {
                delete this.__bindings
                delete this.__bindingTree
            }


        }

        Slim('slim-component', class extends Element{

                update() {
                        for (let child of this.children) {
                                try {
                                        child.update()
                                }
                                catch (err) {}
                        }
                }

        })
        window.SlimBaseElement = SlimBaseElement





    }())
