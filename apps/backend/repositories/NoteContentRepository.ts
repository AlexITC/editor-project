import { NoteContent } from '../models';

/**
 * This is responsibly to just store the content for the notes, which assumes that the necessary
 * metadata was already stored separately.
 */
class NoteContentRepository {

    // TODO: This can likely use NoteContents as the type to avoid manually mapping results
    private collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

    // TODO: There should be a simple way to test this, like creating a key-value store with
    // a specific implementation just for firebase, which would simplify writing tests
    constructor(db: FirebaseFirestore.Firestore) {
        this.collection = db.collection('noteContent')
    }

    async save(data: NoteContent): Promise<void> {
        await this.collection.doc(data.id).set({
            content: data.content
        })
    }

    async find(id: string): Promise<NoteContent> {
        const doc = await this.collection.doc(id).get()
        if (doc.exists) {
            return this.toNoteContent(doc)
        } else {
            // If we are searching for this is because the note should already exist
            return new NoteContent(id, '')
        }
    }

    private toNoteContent(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
        return new NoteContent(doc.id, doc.get('content'))
    }
}

export default NoteContentRepository
