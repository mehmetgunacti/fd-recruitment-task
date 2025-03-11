import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

export interface TagStat {

  tag: string;
  count: number;

}

@Component({
  selector: 'app-most-used-tags',
  imports: [],
  templateUrl: './most-used-tags.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostUsedTagsComponent {

  // Input
  stats = input.required<TagStat[]>();

  // Output
  tagClick = output<string | null>();

  protected selectedTag = signal<string | null>(null);

  selectTag(tag: string): void {

    if (this.selectedTag() === tag) { // unselect if tag is clicked twice

      this.selectedTag.set(null);
      this.tagClick.emit(null);

    } else {

      this.selectedTag.set(tag);
      this.tagClick.emit(tag);

    }

  }

}
