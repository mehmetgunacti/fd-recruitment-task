import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
    selector: '[setFocus]'
})
export class SetFocusDirective {

    setFocus = input.required<boolean>();

    private el = inject(ElementRef);

    constructor() {

        effect(() => {

            if (this.setFocus())
                this.el.nativeElement.focus();

        });

    }

}
