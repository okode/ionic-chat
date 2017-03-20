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
  private wsbaseuri = 'ws://localhost:8080';

  constructor() {
    if (!isDevMode()) {
      this.wsbaseuri = `${window.location.protocol.startsWith('http') ? 'ws' : 'wss'}://${window.location.host}`;
    }
    this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
  }

  connect(reconnectCallback?: () => void) {
    this.stomp.connect({ login: '', passcode: '' },
      (frame?: Stomp.Frame) => {
        console.log(`WS Connected: ${frame}`);
        if (reconnectCallback != null) reconnectCallback();
      },
      (error: string) => {
        console.log(`WS Error: ${error}`);
        console.log('WS Reconnecting in 5 seconds...');
        setTimeout(() => {
          console.log('WS Reconnecting now');
          this.stomp = Stomp.client(`${this.wsbaseuri}/chat/websocket`);
          this.connect(reconnectCallback);
        }, 5000);
      }
    );
  }

  listen(topic: string, headers?: {}) {
    return new Observable<StompMessage>((subscriber: Subscriber<StompMessage>) => {
      this.stomp.subscribe(topic, message => { subscriber.next(message); }, headers);
    });
  }

}
