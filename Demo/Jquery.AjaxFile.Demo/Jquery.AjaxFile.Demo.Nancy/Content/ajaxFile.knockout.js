(function(ko) {
    var fileInputWrapper = function (input) {
        this.element = function() {
            return input;
        };
        this.fileSelected = function() {
            return !!input.value;
        };
    };

    ko.bindingHandlers.file = {
        init: function (element, valueAccessor) {
            $(element).change(function () {
                var value = valueAccessor();
                if (this.value) {
                    value(new fileInputWrapper(this));
                } else {
                    value(undefined);
                }
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (!ko.unwrap(value) && element.value) {
                var $element = $(element);
                $element.replaceWith($element.clone(true, true));
            }
        }
    };
})(ko);