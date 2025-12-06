export default function Layout({children}: {children: React.ReactNode}) {
  return (
  <main className='flex-1 flex items-center justify-center bg-muted'>
    <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-[20px]">IQ</span>
          </div>
          <span className="text-gray-900 text-xl font-bold">InternQuest</span>
        </div>
       {children}
    </div>
  </main>
  )
}