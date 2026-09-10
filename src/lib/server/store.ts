export type SqlValue=string|number|null;
export type Statement={sql:string;params?:SqlValue[]};
export interface Store{all<T>(sql:string,params?:SqlValue[]):Promise<T[]>;run(sql:string,params?:SqlValue[]):Promise<void>;batch(statements:Statement[]):Promise<void>}
