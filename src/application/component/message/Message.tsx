import * as React from 'react';
import { DTO } from '../../core/DTO';
import { observer } from 'mobx-react';

export const ERROR_KEY = '@message@';
interface IProps {
  model: DTO;
}

@observer
export class Message extends React.Component<IProps> {
  public render() {
    const { model } = this.props;
    const error = model.getError(ERROR_KEY);
    return error ? <div>{error}</div> : null;
  }
}
