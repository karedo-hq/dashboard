import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * @todo Continue this component with auth.
 */
export default function UserOrLogin() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/you.png" alt="User avatar" />
      <AvatarFallback>...</AvatarFallback>
    </Avatar>
  );
}
