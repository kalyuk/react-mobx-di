import { Service, Inject } from 'typedi';
import { plainToClass, classToClass } from 'class-transformer';
import { DataStorage } from '../storage/DataStorage';
import { TodoModel } from '../models/TodoModel';
import { validate } from '../annotation/validate';
import { value } from '../annotation/value';
import { TodoItemDTO } from '../dto/TodoItemDTO';
import { ERROR_KEY } from '../component/message/Message';
import { Exception } from '../core/Exception';

const responseMock = {
  items: [
    {
      id: 1,
      isCompleted: false,
      text: 'Item 1'
    },
    {
      id: 2,
      isCompleted: true,
      text: 'Item 2'
    }
  ]
};

@Service('TodoService')
export class TodoService {
  @Inject('DataStorage')
  public dataStorage: DataStorage;

  public load = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.dataStorage.items = plainToClass(TodoModel, responseMock.items);
  };

  @validate
  public async save(@value() todo: TodoItemDTO): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (Math.random() > 0.5) {
      if (todo.id) {
        const idx = this.dataStorage.items.findIndex(
          item => todo.id === item.id
        );
        this.dataStorage.items[idx] = classToClass(todo);
      } else {
        const items = this.dataStorage.items.slice();
        todo.id = Math.floor(Math.random() * Math.floor(100000));
        items.push(classToClass(todo));
        this.dataStorage.items = items;
      }
      this.clearTodo();
    } else {
      todo.setError(ERROR_KEY, 'Record already exists');
      throw new Exception(409, 'Record already exists');
    }
  }

  public edit(todo: TodoModel): void {
    this.dataStorage.todo = new TodoItemDTO(todo);
  }

  public clearTodo(): void {
    this.dataStorage.todo = new TodoItemDTO({ text: '' });
  }
}
