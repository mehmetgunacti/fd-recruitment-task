import { ChangeDetectionStrategy, Component, input, OnDestroy, output, signal } from '@angular/core';
import { interval, map, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-countdown-button',
  imports: [],
  template: `
    <button (click)="startStop()" class="btn btn-danger">
      {{ label() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountdownButtonComponent implements OnDestroy {

  // Input
  time = input<number>(3);

  // Output
  done = output<void>();

  protected label = signal<string>('Delete');
  private inProgress = false;
  private subscription = new Subscription();

  protected startStop(): void {

    if (this.inProgress) {

      this.subscription.unsubscribe();
      this.label.set('Delete');
      this.inProgress = false;
      return;

    }

    this.inProgress = true;
    const startFrom = this.time() + 1;

    this.subscription.add(

      interval(1000).pipe(
        take(startFrom),
        map(i => startFrom - i)
      ).subscribe({

        next: (secondsLeft) => this.label.set(`Deleting ${secondsLeft - 1}...`),
        complete: () => {

          this.label.set('Delete');
          this.inProgress = false;
          this.done.emit();

        },

      })

    );

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

  }

}
