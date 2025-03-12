import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

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
  selectedTag = input.required<string | null>();

  // Output
  tagClick = output<string | null>();

  protected filteredTags = computed(() => this.stats().filter(stat => stat.count > 1));

  protected selectTag(tag: string): void {

    if (this.selectedTag() === tag) // unselect if tag is clicked twice
      this.tagClick.emit(null);
    else
      this.tagClick.emit(tag);

  }

}
