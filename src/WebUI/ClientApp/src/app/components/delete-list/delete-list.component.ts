import { ChangeDetectionStrategy, Component, input, OnDestroy, output } from '@angular/core';
import { TodoListDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-delete-list',
  imports: [],
  templateUrl: './delete-list.component.html',
  styleUrl: './delete-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteListComponent implements OnDestroy {

  // Input
  list = input.required<TodoListDto>();

  // Output
  confirmed = output<void>();
  rejected = output<void>();

  ngOnDestroy(): void {
    this.rejected.emit();
  }

  protected onConfirmed(): void {
    this.confirmed.emit();
  }

  protected onRejected(): void {
    this.rejected.emit();
  }

}
