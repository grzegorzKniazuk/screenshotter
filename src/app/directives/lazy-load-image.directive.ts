import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appLazyLoadImage]',
})
export class LazyLoadImageDirective implements OnInit {

    constructor(
        private readonly elementRef: ElementRef,
        private readonly renderer2: Renderer2,
    ) {
    }

    ngOnInit() {
        this.lazyLoadImage(this.elementRef.nativeElement);
    }

    private lazyLoadImage(nativeElement: HTMLImageElement): void {
        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    this.renderer2.setAttribute(nativeElement, 'src', nativeElement.dataset.src);
                    observer.disconnect();
                }
            });
        });
        observer.observe(nativeElement);
    }
}
