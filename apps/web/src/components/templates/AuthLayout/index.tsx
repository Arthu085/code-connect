import type { ReactNode } from 'react'

type AuthLayoutProps = {
  banner: string
  bannerAlt: string
  bannerWidth?: number
  bannerHeight?: number
  children: ReactNode
}

export function AuthLayout({ banner, bannerAlt, bannerWidth, bannerHeight, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-4">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden bg-card-bg shadow-2xl">
        <div className="hidden md:block w-[45%] shrink-0">
          <img
            src={banner}
            alt={bannerAlt}
            width={bannerWidth}
            height={bannerHeight}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
