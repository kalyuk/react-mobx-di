import * as React from 'react';
import { observer } from 'mobx-react';
import { DI } from '../../annotation/DI';
import { TodoService } from '../../service';
import { DataStorage } from '../../storage';
import { TextField } from '../text-field';

interface IProps {
  todoService?: TodoService;
  dataStorage?: DataStorage;
}
@DI('TodoService', 'DataStorage')
@observer
export class Form extends React.Component<IProps> {
  public handleSave = (e: any) => {
    e.preventDefault();
    this.props.todoService.save(this.props.dataStorage.todo);
  };

  public handleClear = () => {
    this.props.todoService.clearTodo();
  };
  public render() {
    const { dataStorage } = this.props;

    return (
      <form onSubmit={this.handleSave}>
        <TextField name='text' model={dataStorage.todo} />
        <button>{dataStorage.todo.id ? 'Save' : 'Create'}</button>
        <button type='button' onClick={this.handleClear}>
          Clear
        </button>
      </form>
    );
  }
}
