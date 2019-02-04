import * as React from 'react';
import { observer } from 'mobx-react';
import { DTO } from '../../core/DTO';

interface IProps {
  name: string;
  model: DTO;
}
@observer
export class TextField extends React.Component<IProps> {
  public render() {
    const { name, model } = this.props;
    const error = model.getError(name);
    return (
      <>
        <textarea
          name={name}
          value={(model as any)[name]}
          onChange={e => ((model as any)[name] = e.target.value)}
        />
        {error && <span>{error}</span>}
      </>
    );
  }
}
