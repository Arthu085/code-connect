import type { ReactNode } from 'react'
import { Sidebar } from '../../organisms/Sidebar'

type MainLayoutProps = {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-page-bg p-8 lg:p-14">
      <div className="mx-auto flex w-full max-w-[1200px] items-start gap-8">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col gap-8">{children}</main>
      </div>
    </div>
  )
}
