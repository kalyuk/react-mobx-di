declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.svg' {
  export interface ISvg {
    [className: string]: string;
    viewBox: string;
    id: string;
  }
  const content: ISvg;
  export default content;
}

// tslint:disable-next-line
declare module NodeJS {
  // tslint:disable-next-line
  interface Global {
    IS_BROWSER: boolean;
  }
}
