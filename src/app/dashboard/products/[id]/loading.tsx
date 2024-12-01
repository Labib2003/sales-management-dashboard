// CREDIT: https://tailwindflex.com/@Aman300/loader
export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-row gap-2">
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-.3s]"></div>
        <div className="h-4 w-4 animate-bounce rounded-full bg-primary [animation-delay:-.5s]"></div>
      </div>
    </div>
  );
}
