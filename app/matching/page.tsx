"use client"
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MatchingPage() {
  const { data } = useSWR<{ matches: Array<{ user: any; score: number }> }>("/api/matching", fetcher)
  const matches = data?.matches ?? []

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid gap-4">
        {matches.map((m, idx) => (
          <Card key={m.user.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {m.user.avatarUrl ? (
                  <img src={m.user.avatarUrl} alt={m.user.displayName || 'User'} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted" />
                )}
                <span>{m.user.displayName || 'User'}</span>
                <span className="ml-auto text-sm text-muted-foreground">Score: {m.score.toFixed(2)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {m.user.bio && <p className="text-sm text-muted-foreground mb-3">{m.user.bio}</p>}
              {Array.isArray(m.user.skills) && m.user.skills.length > 0 && (
                <div className="text-xs">Skills: {m.user.skills.join(', ')}</div>
              )}
              {Array.isArray(m.user.interests) && m.user.interests.length > 0 && (
                <div className="text-xs">Interests: {m.user.interests.join(', ')}</div>
              )}
              <div className="pt-3">
                <Button asChild variant="outline"><Link href={`/instructors/${m.user.id}`}>View Profile</Link></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
