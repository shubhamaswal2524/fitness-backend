import express, { Application } from "express";

export interface IReturnResponsePayload<T = void> {
  message: string;
  status?: number;
  data?: T | string[];
}
export class MessageUtil {
  static success<T>(response: express.Response, responseData: T) {
    return response.send(responseData);
  }
  static error<T>(response: express.Response, responseData: any) {
    return response.status(responseData["status"]).send(responseData);
  }
}
