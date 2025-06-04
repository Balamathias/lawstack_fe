import { Metadata } from 'next';
import { getNote } from '@/services/server/notes';
import { notFound } from 'next/navigation';
import NoteForm from '@/components/notes/note-form';

interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditNotePageProps): Promise<Metadata> {
  const noteResponse = await getNote((await params).id);
  const note = noteResponse.data;

  return {
    title: note ? `Edit: ${note.title} - lawstack` : 'Edit Note - lawstack',
    description: note ? `Edit your note: ${note.title}` : 'Edit your note in lawstack',
  };
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const noteResponse = await getNote((await params).id);
  
  if (noteResponse.error || !noteResponse.data) {
    notFound();
  }

  return (
    <div className='max-w-7xl mx-auto w-full px-4 pb-20 pt-4 md:pt-8 lg:pt-12 max-lg:mt-14 animate-fade-in'>
      <NoteForm note={noteResponse.data} />
    </div>
  );
}
