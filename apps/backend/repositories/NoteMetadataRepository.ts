import { v4 as uuidv4 } from 'uuid';

import { NoteMetadata } from '../models';

/**
 * This is responsibly to just store the available note definitions, which is like the
 * metadata only, the content is handled by a different repository because it will be huge
 * and this simplifies updating the actual content and the note metadata concurrently.
 * 
 * Same way, this allows to query the notes only without reading the huge content.
 */
class NoteMetadataRepository {

    // TODO: This can likely use NoteDefinitiion as the type to avoid manually mapping results
    private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

    // TODO: There should be a simple way to test this, like creating a key-value store with
    // a specific implementation just for firebase, which would simplify writing tests
    constructor(db: FirebaseFirestore.Firestore) {
        this.collection = db.collection('noteMetadata')
    }

    async create(name: string): Promise<string> {
        const id = uuidv4()
        await this.collection.doc(id).set({
            name: name
        })
    
        return id
    }

    async update(id: string, newName: string): Promise<void> {
        await this.collection.doc(id).set({
            name: newName
        })
    }

    async find(id: string): Promise<NoteMetadata | null> {
        const doc = await this.collection.doc(id).get()
        if (doc.exists) {
            return this.toNoteMetadata(doc)
        } else {
            return null
        }
    }

    async list(): Promise<NoteMetadata[]> {
        const snapshot = await this.collection.get()
        return snapshot.docs.map(this.toNoteMetadata)
    }

    private toNoteMetadata(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
        return new NoteMetadata(doc.id, doc.get('name'))
    }
}

export default NoteMetadataRepository
