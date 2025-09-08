import * as AppConstants from './app';
import * as Env from './env';
import * as KeyConfigs from './keysConfig';
import * as KeySwr from './keySwr';
import * as Message from './message';
import * as Order from './order';
import * as Routes from './routes';
import * as Slide from './slides';
import Status from './status';
import * as WebPath from './webPath';

export { AppConstants, Env, KeyConfigs, KeySwr, Message, Order, Routes, Slide, Status, WebPath };

export type StatusType = typeof Status;
export type MessageType = typeof Message;
export type MessageValueType = (typeof Message)[keyof typeof Message];
export type StatusKeyType = keyof StatusType;
export type MessageKeyType = keyof MessageType;
