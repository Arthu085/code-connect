import { useEffect, useState } from 'react'
import { MainLayout } from '../../templates/MainLayout'
import { SearchBox } from '../../molecules/SearchBox'
import { FilterBar } from '../../molecules/FilterBar'
import { Tabs } from '../../molecules/Tabs'
import { PostFeed } from '../../organisms/PostFeed'
import { getPosts, type PostSummary, type PostsSort } from '../../../lib/posts'

export function FeedPage() {
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState<string | null>(null)
  const [sort, setSort] = useState<PostsSort>('recent')
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getPosts({ search: search || undefined, tag: tag || undefined, sort })
      .then((result) => {
        if (!cancelled) setPosts(result)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar os posts.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [search, tag, sort])

  function handleClearAll() {
    setTag(null)
    setSearch('')
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <SearchBox value={search} onChange={setSearch} />
        <FilterBar tag={tag} onRemoveTag={() => setTag(null)} onClearAll={handleClearAll} />
      </div>

      <div className="flex flex-col gap-8">
        <Tabs value={sort} onChange={setSort} />
        {error ? (
          <p role="alert" className="text-base text-error">
            {error}
          </p>
        ) : (
          <PostFeed posts={posts} isLoading={isLoading} onTagClick={setTag} />
        )}
      </div>
    </MainLayout>
  )
}
