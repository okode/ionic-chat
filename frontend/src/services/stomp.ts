import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import * as Stomp from 'stompjs';

export type StompMessage = Stomp.Message;

type PromiseResolve = (value?: void | PromiseLike<void>) => void;

@Injectable()
export class StompService {

  private stomp: Stomp.Client;
  private wsbaseuri = 'ws://localhost:8080';
  private listeners = new Map<string, { listener: Observable<Stomp.Message>, subscriber: Subscriber<Stomp.Message> }>();

  constructor() {
    if (!isDevMode()) {
      this.wsbaseuri = `${window.location.protocol.startsWith('https') ? 'wss' : 'ws'}://${window.location.host}`;
    }
    this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
    this.connect();
  }

  private connect(resolve?: PromiseResolve) {
    this.stomp.connect({ login: '', passcode: '' },
      (frame?: Stomp.Frame) => {
        this.listeners.forEach((listener, topic) => {
          this.stomp.subscribe(topic, message => { listener.subscriber.next(message); });
        });
        if (resolve != null) resolve();
      },
      (error: string) => {
        setTimeout(() => {
          console.log('Stomp Reconnecting...');
          this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
          this.connect(resolve);
        }, 5000);
      }
    );
  }

  private ready() {
    if (this.stomp.connected) return Promise.resolve();
    return new Promise<void>(resolve => this.connect(resolve));
  }

  listen(topic: string) {
    let listener = new Observable<StompMessage>((subscriber: Subscriber<StompMessage>) => {
      this.ready().then(() => {
        this.stomp.subscribe(topic, message => { subscriber.next(message);
        this.listeners.set(topic, { listener: listener, subscriber: subscriber });
      })});
    });
    return listener;
  }

}
