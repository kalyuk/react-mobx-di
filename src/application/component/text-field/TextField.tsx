import * as React from 'react';
import { TodoModel } from '../../models/TodoModel';
import { observer } from 'mobx-react';

interface IProps {
  name: string;
  model: TodoModel;
}
@observer
export class TextField extends React.Component<IProps> {
  public render() {
    const { name, model } = this.props;
    return (
      <textarea
        name={name}
        value={(model as any)[name]}
        onChange={e => ((model as any)[name] = e.target.value)}
      />
    );
  }
}
