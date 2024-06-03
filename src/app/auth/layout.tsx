import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-3">
      <aside className="flex items-center bg-primary-foreground">
        <Image
          src={"/assets/illustrations/data_trends.png"}
          alt=""
          width={611}
          height={408}
          className="drop-shadow"
        />
      </aside>
      <main className="col-span-2 grid place-items-center">{children}</main>
    </div>
  );
}
