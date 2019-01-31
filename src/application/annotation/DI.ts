import { inject } from 'mobx-react';

export function DI(...classNames: string[]) {
  return (target: any) => {
    return inject((props: any) => {
      const data: any = {};
      classNames.forEach(className => {
        const name = className.charAt(0).toLowerCase() + className.slice(1);
        data[name] = props.container.get(className);
      });
      data.container = props.container;
      return data;
    })(target);
  };
}
