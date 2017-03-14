import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import * as Stomp from 'stompjs';

export type StompMessage = Stomp.Message;

type PromiseResolve = (value?: void | PromiseLike<void>) => void;

@Injectable()
export class StompService {

  public static readonly MESSAGES_CHANNEL = "/topic/messages";

  private stomp: Stomp.Client;

  private readyPromiseResolve: PromiseResolve[] = [];
  private connecting = false;

  constructor() {
    let wsbaseuri = 'ws://localhost:8080';
    if (!isDevMode()) {
      wsbaseuri = `${window.location.protocol.startsWith('http') ? 'ws' : 'wss'}://${window.location.host}`;
    }
    this.stomp = Stomp.client(`${wsbaseuri}/chat/websocket`);
  }

  private ready() {
    if(this.stomp.connected) return Promise.resolve();
    if(!this.connecting) this.initStomp();
    return new Promise<void>((resolve, reject) => {
      this.readyPromiseResolve.push(resolve);
    });
  }

  private initStomp() {
    this.connecting = true
    this.stomp.connect({ login: '', passcode: '' },
      (frame?: Stomp.Frame) => {
        console.log('WS Connected: ' + frame);
        for (let promiseResolve of this.readyPromiseResolve) {
          promiseResolve();
        }
        this.connecting = false;
        this.readyPromiseResolve = [];
      },
      (error: string) => {
        console.log('WS Error: ' + error);       
      }
    );
  }

  listen(topic: string, headers?: {}) {
    return new Observable<StompMessage>((subscriber: Subscriber<StompMessage>) => {
      this.ready().then(() => { this.stomp.subscribe(topic, message => { subscriber.next(message); }, headers); });
    });
  }

}
