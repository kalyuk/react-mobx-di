import { DTO } from '../core/DTO';
import { observable } from 'mobx';
import { IsBoolean, Length, IsNumber, IsOptional } from 'class-validator';

export class TodoItemDTO extends DTO {
  @IsOptional()
  @IsNumber()
  @observable
  public id: number;

  @Length(2, 20)
  @observable
  public text: string;

  @IsOptional()
  @IsBoolean()
  @observable
  public isCompleted: boolean;
}
