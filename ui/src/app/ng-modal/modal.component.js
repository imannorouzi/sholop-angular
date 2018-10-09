"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ModalComponent = (function () {
    function ModalComponent(element, ngZone) {
        this.element = element;
        this.ngZone = ngZone;
        this.minWidth = 260;
        this.minHeight = 200;
        this.scrollTop = true;
        this.backdrop = true;
        this.close = new core_1.EventEmitter();
        this.resize = new core_1.EventEmitter();
    }
    Object.defineProperty(ModalComponent.prototype, "cssClass", {
        get: function () {
            var cls = 'app-modal';
            if (this.styleClass) {
                cls += ' ' + this.styleClass;
            }
            return cls;
        },
        enumerable: true,
        configurable: true
    });
    ModalComponent.prototype.ngOnInit = function () {
        if (!this.zIndex) {
            this.zIndex = this.getMaxModalIndex() + 1;
            this.zIndex = this.zIndex || 1100;
        }
        this.contentzIndex = this.zIndex + 1;
    };
    ModalComponent.prototype.ngAfterViewChecked = function () {
        if (this.executePostDisplayActions) {
            this.center();
            this.executePostDisplayActions = false;
        }
    };
    ModalComponent.prototype.addEventListeners = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            window.document.addEventListener('mousemove', _this.onMousemove.bind(_this));
            window.document.addEventListener('mouseup', _this.onMouseup.bind(_this));
            window.addEventListener('resize', _this.onWindowResize.bind(_this));
        });
    };
    ModalComponent.prototype.removeEventListener = function () {
        window.document.removeEventListener('mousemove', this.onMousemove.bind(this));
        window.document.removeEventListener('mouseup', this.onMouseup.bind(this));
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    };
    ModalComponent.prototype.onKeyDown = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
    };
    ModalComponent.prototype.onWindowResize = function () {
        this.executePostDisplayActions = true;
        this.center();
    };
    ModalComponent.prototype.onMousemove = function (event) {
        this.onDrag(event);
        this.onResize(event);
    };
    ModalComponent.prototype.onMouseup = function (event) {
        this.endDrag(event);
        this.endResize(event);
    };
    ModalComponent.prototype.show = function () {
        var _this = this;
        this.executePostDisplayActions = true;
        this.visible = true;
        setTimeout(function () {
            _this.modalRoot.nativeElement.focus();
            if (_this.scrollTop) {
                _this.modalBody.nativeElement.scrollTop = 0;
            }
        }, 1);
        this.addEventListeners();
    };
    ModalComponent.prototype.hide = function () {
        this.visible = false;
        this.close.emit(true);
        this.focusLastModal();
        this.removeEventListener();
    };
    ModalComponent.prototype.center = function () {
        var elementWidth = this.modalRoot.nativeElement.offsetWidth;
        var elementHeight = this.modalRoot.nativeElement.offsetHeight;
        if (elementWidth === 0 && elementHeight === 0) {
            this.modalRoot.nativeElement.style.visibility = 'hidden';
            this.modalRoot.nativeElement.style.display = 'block';
            elementWidth = this.modalRoot.nativeElement.offsetWidth;
            elementHeight = this.modalRoot.nativeElement.offsetHeight;
            this.modalRoot.nativeElement.style.display = 'none';
            this.modalRoot.nativeElement.style.visibility = 'visible';
        }
        var x = Math.max((window.innerWidth - elementWidth) / 2, 0);
        var y = Math.max((window.innerHeight - elementHeight) / 2, 0);
        this.modalRoot.nativeElement.style.left = x + 'px';
        this.modalRoot.nativeElement.style.top = y + 'px';
    };
    ModalComponent.prototype.initDrag = function (event) {
        if (!this.maximized) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            this.modalRoot.nativeElement.classList.add('dragging');
        }
    };
    ModalComponent.prototype.onDrag = function (event) {
        if (this.dragging) {
            var deltaX = event.pageX - this.lastPageX;
            var deltaY = event.pageY - this.lastPageY;
            var leftPos = parseInt(this.modalRoot.nativeElement.style.left, 10);
            var topPos = parseInt(this.modalRoot.nativeElement.style.top, 10);
            this.modalRoot.nativeElement.style.left = leftPos + deltaX + 'px';
            this.modalRoot.nativeElement.style.top = topPos + deltaY + 'px';
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    ModalComponent.prototype.endDrag = function (event) {
        this.dragging = false;
        this.modalRoot.nativeElement.classList.remove('dragging');
    };
    ModalComponent.prototype.initResizeS = function (event) {
        this.resizingS = true;
        this.lastPageX = event.pageX;
        this.lastPageY = event.pageY;
        this.modalRoot.nativeElement.classList.add('resizing');
    };
    ModalComponent.prototype.initResizeE = function (event) {
        this.resizingE = true;
        this.lastPageX = event.pageX;
        this.lastPageY = event.pageY;
        this.modalRoot.nativeElement.classList.add('resizing');
    };
    ModalComponent.prototype.initResizeSE = function (event) {
        this.resizingSE = true;
        this.lastPageX = event.pageX;
        this.lastPageY = event.pageY;
        this.modalRoot.nativeElement.classList.add('resizing');
    };
    ModalComponent.prototype.onResize = function (event) {
        if (this.resizingS || this.resizingE || this.resizingSE) {
            var deltaX = event.pageX - this.lastPageX;
            var deltaY = event.pageY - this.lastPageY;
            var containerWidth = this.modalRoot.nativeElement.offsetWidth;
            var containerHeight = this.modalRoot.nativeElement.offsetHeight;
            var contentHeight = this.modalBody.nativeElement.offsetHeight;
            var newWidth = containerWidth + deltaX;
            var newHeight = containerHeight + deltaY;
            if (this.resizingSE || this.resizingE) {
                if (newWidth > this.minWidth) {
                    this.modalRoot.nativeElement.style.width = newWidth + 'px';
                }
            }
            if (this.resizingSE || this.resizingS) {
                if (newHeight > this.minHeight) {
                    this.modalRoot.nativeElement.style.height = newHeight + 'px';
                    this.modalBody.nativeElement.style.height = contentHeight + deltaY + 'px';
                    this.modalBody.nativeElement.style.maxHeight = 'none';
                }
            }
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    };
    ModalComponent.prototype.endResize = function (event) {
        this.resizingS = false;
        this.resizingE = false;
        this.resizingSE = false;
        this.modalRoot.nativeElement.classList.remove('resizing');
        this.resize.emit(this.modalRoot.nativeElement.offsetWidth);
    };
    ModalComponent.prototype.calcBodyHeight = function () {
        var windowHeight = window.innerHeight;
        if (this.modalRoot.nativeElement.offsetWidth > windowHeight) {
            this.modalBody.nativeElement.style.height = (windowHeight * .75) + 'px';
        }
    };
    ModalComponent.prototype.getMaxModalIndex = function () {
        var zIndex = 0;
        var modals = document.querySelectorAll('.ui-modal');
        [].forEach.call(modals, function (modal) {
            var indexCurrent = parseInt(modal.style.zIndex, 10);
            if (indexCurrent > zIndex) {
                zIndex = indexCurrent;
            }
        });
        return zIndex;
    };
    ModalComponent.prototype.focusLastModal = function () {
        var modal = this.findAncestor(this.element.nativeElement, 'app-modal');
        if (modal && modal.children[1]) {
            modal.children[1].focus();
        }
    };
    ModalComponent.prototype.findAncestor = function (el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls)) {
        }
        return el;
    };
    ModalComponent.prototype.onIconMouseDown = function (event) {
        event.stopPropagation();
    };
    ModalComponent.prototype.toggleMaximize = function (event) {
        if (this.maximized) {
            this.revertMaximize();
        }
        else {
            this.maximize();
        }
        event.preventDefault();
    };
    ModalComponent.prototype.maximize = function () {
        this.preMaximizePageX = parseFloat(this.modalRoot.nativeElement.style.top);
        this.preMaximizePageY = parseFloat(this.modalRoot.nativeElement.style.left);
        this.preMaximizeRootWidth = this.modalRoot.nativeElement.offsetWidth;
        this.preMaximizeRootHeight = this.modalRoot.nativeElement.offsetHeight;
        this.preMaximizeBodyHeight = this.modalBody.nativeElement.offsetHeight;
        this.modalRoot.nativeElement.style.top = '0px';
        this.modalRoot.nativeElement.style.left = '0px';
        this.modalRoot.nativeElement.style.width = '100vw';
        this.modalRoot.nativeElement.style.height = '100vh';
        var diffHeight = this.modalHeader.nativeElement.offsetHeight + this.modalFooter.nativeElement.offsetHeight;
        this.modalBody.nativeElement.style.height = 'calc(100vh - ' + diffHeight + 'px)';
        this.modalBody.nativeElement.style.maxHeight = 'none';
        this.maximized = true;
    };
    ModalComponent.prototype.revertMaximize = function () {
        this.modalRoot.nativeElement.style.top = this.preMaximizePageX + 'px';
        this.modalRoot.nativeElement.style.left = this.preMaximizePageY + 'px';
        this.modalRoot.nativeElement.style.width = this.preMaximizeRootWidth + 'px';
        this.modalRoot.nativeElement.style.height = this.preMaximizeRootHeight + 'px';
        this.modalBody.nativeElement.style.height = this.preMaximizeBodyHeight + 'px';
        this.maximized = false;
    };
    ModalComponent.prototype.moveOnTop = function () {
        if (!this.backdrop) {
            var zIndex = this.getMaxModalIndex();
            if (this.contentzIndex <= zIndex) {
                this.contentzIndex = zIndex + 1;
            }
        }
    };
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "modalTitle", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "zIndex", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "minWidth", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "minHeight", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "scrollTop", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "maximizable", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "backdrop", void 0);
    __decorate([
        core_1.Input()
    ], ModalComponent.prototype, "styleClass", void 0);
    __decorate([
        core_1.Output()
    ], ModalComponent.prototype, "close", void 0);
    __decorate([
        core_1.Output()
    ], ModalComponent.prototype, "resize", void 0);
    __decorate([
        core_1.ViewChild('modalRoot')
    ], ModalComponent.prototype, "modalRoot", void 0);
    __decorate([
        core_1.ViewChild('modalBody')
    ], ModalComponent.prototype, "modalBody", void 0);
    __decorate([
        core_1.ViewChild('modalHeader')
    ], ModalComponent.prototype, "modalHeader", void 0);
    __decorate([
        core_1.ViewChild('modalFooter')
    ], ModalComponent.prototype, "modalFooter", void 0);
    __decorate([
        core_1.HostBinding('class')
    ], ModalComponent.prototype, "cssClass", null);
    __decorate([
        core_1.HostListener('keydown.esc', ['$event'])
    ], ModalComponent.prototype, "onKeyDown", null);
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'app-modal',
            templateUrl: 'modal.component.html',
            styleUrls: ['modal.component.css']
        })
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;
