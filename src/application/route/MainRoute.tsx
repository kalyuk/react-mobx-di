import * as React from 'react';
import { TodoService } from '../service/TodoService';
import { observer } from 'mobx-react';
import { DI } from '../annotation/DI';
import { DataStorage } from '../storage/DataStorage';
import { Todo } from '../component/todo';
import { Form } from '../component/form/Form';
import { ContainerInstance } from 'typedi';

interface IProps {
  todoService?: TodoService;
  dataStorage?: DataStorage;
}

@DI('TodoService', 'DataStorage')
@observer
export class MainRoute extends React.Component<IProps> {
  public static async loadData(container: ContainerInstance) {
    const todoService: TodoService = container.get('TodoService');
    await todoService.load();
  }

  public componentDidMount() {
    this.props.todoService.load();
  }

  public render() {
    return (
      <div>
        <Form />
        <ul>
          {this.props.dataStorage.todos.map(item => (
            <Todo key={item.id} model={item} />
          ))}
        </ul>
      </div>
    );
  }
}
