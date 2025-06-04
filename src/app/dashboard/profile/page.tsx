import React from 'react';
import { Metadata } from 'next';
import { getUser } from '@/services/server/auth';
import { UserProfilePage } from '@/components/profile/user-profile-page';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My Profile | Law Stack',
  description: 'Manage your profile and account settings',
};

const ProfilePage = async () => {
  const { data: user } = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-20 max-lg:mt-14">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account settings.
          </p>
        </div>

        <UserProfilePage currentUser={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
