namespace AjaxFileKnockout {
    class FileInputWrapper {
        constructor(private input: HTMLInputElement) {
        }

        public getElement(): HTMLInputElement {
            return this.input;
        }

        public fileSelected(): boolean {
            return !!this.input.value;
        }
    }

    export function registerBindingHandler(ko: KnockoutStatic, $: JQueryStatic): void {
        ko.bindingHandlers["file"] = {
            init(element, valueAccessor) {
                $(element).change(function () {
                    const value = valueAccessor();
                    if (this.value) {
                        value(new FileInputWrapper(this));
                    } else {
                        value(undefined);
                    }
                });
            },
            update(element, valueAccessor) {
                const value = valueAccessor();
                if (!ko.unwrap(value) && element.value) {
                    const $element = $(element);
                    $element.replaceWith($element.clone(true, true));
                }
            }
        };
    }
}

AjaxFileKnockout.registerBindingHandler(ko, $);