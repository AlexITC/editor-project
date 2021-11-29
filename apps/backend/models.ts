import * as ws from 'ws';
import { NoteContent, NoteListWsClientCommand } from './shared/models';

export class AppConfig {
    constructor (public port: number) {}
}

export class SlateCollaborativeParams {
    constructor (
        public saveFrequencyMs: number,
        public defaultValue: any[],
        public loadDocument: (id: string) => Promise<NoteContent | null>,
        public saveDocument: (data: NoteContent) => Promise<void>) {}
}

export class NoteListWsParams {
    constructor (
        public subcribers: WsSubcribers,
        public commandHandler: (cmd: NoteListWsClientCommand) => void) {}
}

export class WsSubcribers {
    private subscribers: ws[] = []

    constructor (private onNewSubscriber: (ws: ws) => void) {}

    public getSubscribers: ws[] = this.subscribers

    public join(subscriber: ws): void {
        this.subscribers.push(subscriber)
        console.log('join', this.subscribers.length)
        this.onNewSubscriber(subscriber)
    }

    public leave(subscriber: ws): void {
        this.subscribers = this.subscribers.filter(it => it !== subscriber)
    }
}
