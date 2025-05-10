import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  imports: [],
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent {

  // Output
  search = output<string>();

  protected onSearch(val: string): void {

    this.search.emit(val);

  }

}
