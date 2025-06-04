import React, { Suspense } from 'react';
import Loader from '@/components/loader'
import NoteDetail from '@/components/notes/note-detail';
import { getNote } from '@/services/server/notes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params;
  const noteResponse = await getNote(id);
  const note = noteResponse.data;

  return {
    title: note ? `Note: ${note.title} - lawstack` : 'Note - lawstack',
    description: note ? `View your note: ${note.title}` : 'View your note in lawstack',
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const getNoteData = getNote(id);

  return (
    <div className='w-full flex flex-col gap-y-8 max-w-7xl mx-auto p-3 sm:p-8 pb-16 max-lg:mt-14 animate-fade-in relative'>
        <Suspense fallback={<Loader variant="dots" />}>
            <NoteDetail getNoteData={getNoteData} noteId={id} />;
        </Suspense>
    </div>
  )
};

export default Page;