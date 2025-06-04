import { Metadata } from 'next';
import NoteForm from '@/components/notes/note-form';

export const metadata: Metadata = {
  title: 'Create New Note - LawStack',
  description: 'Create a new note to organize your thoughts, insights, and legal research.',
};

export default function CreateNotePage() {
  return (
    <div className='w-full flex flex-col gap-y-8 max-w-7xl mx-auto p-3 sm:p-8 pb-16 max-lg:mt-14 animate-fade-in relative'>
      <NoteForm />
    </div>
  );
}
