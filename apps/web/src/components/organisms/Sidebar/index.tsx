import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useSession } from '../../../lib/useSession'
import {
  CodeIcon,
  FeedIcon,
  InfoIcon,
  LoginIcon,
  LogoutIcon,
  ProfileIcon,
} from '../../atoms/icons'

const NAV_ITEMS = [
  { to: '/feed', label: 'Feed', icon: FeedIcon },
  { to: '/perfil', label: 'Perfil', icon: ProfileIcon },
]

export function Sidebar() {
  const { isAuthenticated, logout } = useSession()
  const location = useLocation()

  return (
    <aside className="flex w-[177px] shrink-0 flex-col items-center gap-20 self-stretch rounded-lg bg-card-bg px-4 py-10">
      <RouterLink to="/feed" className="flex flex-col items-center gap-1 text-brand">
        <CodeIcon className="size-8" />
        <span className="text-center text-sm font-bold leading-tight">
          code
          <br />
          connect
        </span>
      </RouterLink>

      <nav className="flex w-full flex-col items-center gap-10">
        <RouterLink
          to={isAuthenticated ? '/posts/novo' : '/login'}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand px-4 py-3 text-base font-semibold text-brand transition hover:bg-brand hover:text-on-brand"
        >
          Publicar
        </RouterLink>

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to)
          return (
            <RouterLink
              key={to}
              to={to}
              className={`flex w-full flex-col items-center gap-2 px-4 py-2 text-center transition ${
                isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Icon className="size-8" />
              <span className="text-base">{label}</span>
            </RouterLink>
          )
        })}

        <div className="flex w-full flex-col items-center gap-2 px-4 py-2 text-center text-text-muted">
          <InfoIcon className="size-8" />
          <span className="text-base">Sobre nós</span>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer flex-col items-center gap-2 px-4 py-2 text-center text-text-muted transition hover:text-text-primary"
          >
            <LogoutIcon className="size-8" />
            <span className="text-base">Sair</span>
          </button>
        ) : (
          <RouterLink
            to="/login"
            className="flex w-full flex-col items-center gap-2 px-4 py-2 text-center text-text-muted transition hover:text-text-primary"
          >
            <LoginIcon className="size-8" />
            <span className="text-base">Entrar</span>
          </RouterLink>
        )}
      </nav>
    </aside>
  )
}
