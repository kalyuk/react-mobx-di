import { Service } from 'typedi';
import { observable } from 'mobx';
import { TodoModel } from '../models/TodoModel';
import { TodoItemDTO } from '../dto/TodoItemDTO';
import { sync } from '../annotation/sync';

@Service('DataStorage')
export class DataStorage {
  @sync
  // @observable
  public items: TodoModel[] = [];

  @observable
  public todo: TodoItemDTO = new TodoItemDTO();
}
