import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-purple-500 hover:bg-purple-600',
            footerActionLink: 'text-purple-500 hover:text-purple-600',
          },
        }}
      />
    </div>
  );
}
