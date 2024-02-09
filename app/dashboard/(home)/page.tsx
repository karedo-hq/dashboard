import { authOptions } from '@/api/auth/[...nextauth]/route';
import { AuthProfile } from '@/auth/lib/types/profile.types';
import { getServerSession } from 'next-auth';

export default async function Homepage() {
  const session = await getServerSession(authOptions);

  const usersRes = await fetch(`${process.env.API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${session?.tokens.accessToken}`,
    },
  });

  if (usersRes.status !== 200) {
    return <div>Failed to fetch users</div>;
  }

  const users: AuthProfile[] = await usersRes.json();

  return (
    <section>
      <h1>Home page</h1>

      {users.map((user) => (
        <div key={user._id} className="flex">
          <h2>{user.firstname}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </section>
  );
}
