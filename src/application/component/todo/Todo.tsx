import * as React from 'react';
import { TodoModel } from '../../models/TodoModel';
import { TodoService } from '../../service/TodoService';
import { DI } from '../../annotation/DI';
import { observer } from 'mobx-react';

interface IProps {
  model: TodoModel;
  todoService?: TodoService;
}

@DI('TodoService')
@observer
export class Todo extends React.Component<IProps> {
  public render() {
    const { model, todoService } = this.props;
    return (
      <>
        <input
          type='checkbox'
          checked={model.isCompleted}
          onChange={e => model.set('isCompleted', e.target.checked)}
        />
        <h4>{model.text}</h4>
        <button type='button' onClick={() => todoService.edit(model)}>Edit</button>
      </>
    );
  }
}
