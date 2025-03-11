import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ListTitle {

    id: number;
    name: string;
    count: number;
    selected: boolean;

}

@Component({
  selector: 'app-list-titles',
  imports: [],
  templateUrl: './list-titles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListTitlesComponent {

  // Input
  titles = input.required<ListTitle[]>();

  // Output
  titleClicked = output<number>();

  protected titleClick(id: number): void {

    this.titleClicked.emit(id);

  }

}
