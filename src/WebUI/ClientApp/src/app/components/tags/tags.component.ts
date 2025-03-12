import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { TodoListDto } from 'src/app/web-api-client';

function reduceTags(list: TodoListDto): string[] {

  if (!list.items)
    return [];

  const uniqueTags = new Set<string>(
    list.items
      .map(item => item.tagList || [])
      .reduce((acc, cur) => acc.concat(cur), [])
  );

  return Array.from(uniqueTags);

}

@Component({
  selector: 'app-tags',
  imports: [],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent {

  // Input
  selectedList = input.required<TodoListDto>();
  selectedTag = input.required<string | null>();

  // Output
  tagSelected = output<string | null>();

  protected tags = computed(() => reduceTags(this.selectedList()));

  selectTag(tag: string): void {

    const newTag = this.selectedTag() === tag ? null : tag; // de-select on 2nd click
    this.tagSelected.emit(newTag);

  }

}
