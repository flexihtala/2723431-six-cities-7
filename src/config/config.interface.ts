export interface AppConfig {
  port: number;
  dbHost: string;
  salt: string;
}

export interface Config {
  get<T extends keyof AppConfig>(key: T): AppConfig[T];
}
