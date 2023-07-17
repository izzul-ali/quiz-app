export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm md:text-base rounded-xl bg-purple-50/50 shadow-md py-6 px-4 w-[95%] h-fit mx-auto flex flex-col items-center justify-center relative z-10">
      {children}
    </div>
  );
}
