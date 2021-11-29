import { NoteContent } from '../shared/models'

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
        console.log('save content', data.id)
        await this.collection.doc(data.id).set({
            content: data.content
        })
    }

    async find(id: string): Promise<NoteContent | null> {
        console.log('find content', id)
        const doc = await this.collection.doc(id).get()
        if (doc.exists) {
            return this.toNoteContent(doc)
        } else {
            return null
        }
    }

    private toNoteContent(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
        return {
            id: doc.id, content: doc.get('content')
        } as NoteContent
    }
}

export default NoteContentRepository
