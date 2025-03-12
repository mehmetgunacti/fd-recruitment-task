import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListContainer } from './todo-list.container';

describe('TodoListContainer', () => {
  let component: TodoListContainer;
  let fixture: ComponentFixture<TodoListContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListContainer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoListContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
