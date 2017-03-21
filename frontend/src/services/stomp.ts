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

  private isReadyInProgress = false;
  private readyPromiseResolved: PromiseResolve;
  private readyPromise: Promise<void>;

  constructor() {
    if (!isDevMode()) {
      this.wsbaseuri = `${window.location.protocol.startsWith('https') ? 'wss' : 'ws'}://${window.location.host}`;
    }
    this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
    this.ready();
  }

  private connect() {
    this.stomp.connect({ login: '', passcode: '' },
      (frame?: Stomp.Frame) => {
        this.listeners.forEach((listener, topic) => {
          this.stomp.subscribe(topic, message => { listener.subscriber.next(message); });
        });
        if (this.readyPromiseResolved != null) {
          this.readyPromiseResolved();
        }
        this.isReadyInProgress = false;
      },
      (error: string) => {
        setTimeout(() => {
          console.log('Stomp Reconnecting...');
          this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
          this.connect();
        }, 5000);
      }
    );
  }

  private ready() {
    if (this.stomp.connected) return Promise.resolve();
    if (!this.isReadyInProgress) {
      this.isReadyInProgress = true;
      this.readyPromise = new Promise<void>((resolve, reject) => {
        this.readyPromiseResolved = resolve;
      });
      this.connect();
    }
    return this.readyPromise;
  }

  listen(topic: string) {
    let listener = new Observable<StompMessage>((subscriber: Subscriber<StompMessage>) => {
      this.ready().then(() => {
        this.listeners.set(topic, { listener: listener, subscriber: subscriber });
        this.stomp.subscribe(topic, message => { subscriber.next(message); });
      });
    });
    return listener;
  }

}
