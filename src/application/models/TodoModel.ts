import { observable, action } from 'mobx';

export class TodoModel {
  @observable public id: number;
  @observable public text: string = '';
  @observable public isCompleted: boolean = false;

  @action
  public set = (key: 'text' | 'isCompleted', value: any): void => {
    this[key] = value;
  };
}
