import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Typography, typographyVariants } from '@/components/ui/typography';
import LogoutButton from './logout-button';
import { auth } from '../lib/utils/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DropdownMenuPortal } from '@radix-ui/react-dropdown-menu';

export default async function ProfileBadge() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-4">
          <Typography as="p" variant="small">
            {session.user.firstname}
          </Typography>
          <Avatar>
            <AvatarImage src="https://github.com/you.png" alt="User avatar" />
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={16} className="min-w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="pb-0">
            {session.user.firstname} {session.user.lastname}
          </DropdownMenuLabel>

          <DropdownMenuItem disabled className="pt-0 text-sm">
            {session.user.email}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
