import * as React from 'react';
import { observer } from 'mobx-react';
import { DI } from '../../annotation/DI';
import { TodoService } from '../../service';
import { DataStorage } from '../../storage';
import { TextField } from '../text-field';
import { Message } from '../message/Message';

interface IProps {
  todoService?: TodoService;
  dataStorage?: DataStorage;
}
@DI('TodoService', 'DataStorage')
@observer
export class Form extends React.Component<IProps> {
  public handleSave = (e: any) => {
    e.preventDefault();
    try {
      this.props.todoService.save(this.props.dataStorage.todo);
    } catch (e) {
      console.log(e);
    }
  };

  public handleClear = () => {
    this.props.todoService.clearTodo();
  };
  public render() {
    const {
      dataStorage: { todo }
    } = this.props;

    return (
      <form onSubmit={this.handleSave}>
        <Message model={todo} />
        <TextField name='text' model={todo} />
        <button>{todo.id ? 'Save' : 'Create'}</button>
        <button type='button' onClick={this.handleClear}>
          Clear
        </button>
      </form>
    );
  }
}
