import { Node } from 'slate';

export class NoteMetadata {
    constructor (public id: string, public name: string) {}
}

export class NoteContent {
    constructor (public id: string, public content: Node[]) {}
}

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
