import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography } from '@/components/ui/typography';
import LogoutButton from './logout-button';
import { auth } from '../lib/utils/auth';

export default async function ProfileBadge() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <Typography as="p" variant="small">
        {session.user.firstname}
      </Typography>
      <Avatar>
        <AvatarImage src="https://github.com/you.png" alt="User avatar" />
        <AvatarFallback>...</AvatarFallback>
      </Avatar>
      <LogoutButton />
    </div>
  );
}
