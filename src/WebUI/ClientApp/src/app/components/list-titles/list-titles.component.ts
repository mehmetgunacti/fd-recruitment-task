import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListTitle } from 'src/app/models/list-title.model';
import { SortByKeyPipe } from 'src/app/pipes/sort-by-key.pipe';

@Component({
  selector: 'app-list-titles',
  imports: [SortByKeyPipe],
  templateUrl: './list-titles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTitlesComponent {

  // Input
  titles = input.required<ListTitle[]>();
  selectedListId = input<number>();

  // Output
  titleClicked = output<number>();

  protected titleClick(id: number): void {

    this.titleClicked.emit(id);

  }

}
