import { observable, action } from 'mobx';

export class TodoModel {
  @observable public id: number;
  @observable public text: string = '';
  @observable public isCompleted: boolean = false;
}
