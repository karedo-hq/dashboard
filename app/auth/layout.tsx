import Image from 'next/image';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-8 lg:flex-none lg:px-20 xl:px-24">
        {children}
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          src="/auth-bg-img.png"
          alt="Login to Karedo"
          width={1236}
          height={718}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </main>
  );
}
