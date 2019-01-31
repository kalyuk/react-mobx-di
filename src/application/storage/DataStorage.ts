import { Service } from 'typedi';
import { observable } from 'mobx';
import { TodoModel } from '../models/TodoModel';

@Service('DataStorage')
export class DataStorage {
  @observable public todos: TodoModel[] = [];

  @observable public todo: TodoModel = new TodoModel();
}
