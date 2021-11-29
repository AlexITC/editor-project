
export class NoteMetadata {
    constructor (public id: string, public name: string) {}
}

export class NoteContent {
    // TODO: content likely needs to be a slate node/element array
    constructor (public id: string, public content: string) {}
}
