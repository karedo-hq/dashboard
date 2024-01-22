import Link from 'next/link';

type SidebarListProps = {
  userId: string;
  children?: React.ReactNode;
};

const loadGuides = async (userId: string) => {
  // @todo - load guides from the server with getGuides server action.
  return [];
};

export async function SidebarList({ userId }: SidebarListProps) {
  const guides = await loadGuides(userId);

  return (
    <ul className="flex-1">
      <div className="flex-1 overflow-auto">
        {guides?.length ? (
          guides.map(({ id, title }) => (
            <li key={id} className="mb-16">
              <Link href={`/guides/${id}`}>{title}</Link>
            </li>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No saved guides</p>
          </div>
        )}
      </div>
    </ul>
  );
}
