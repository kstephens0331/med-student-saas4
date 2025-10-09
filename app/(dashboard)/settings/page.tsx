import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*, schools(*), subscriptions(*)')
    .eq('id', session?.user?.id!)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <p className="text-lg">{profile?.full_name || 'Not set'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <p className="text-lg">{profile?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Medical School</label>
            <p className="text-lg">{profile?.schools?.name || 'Not set'}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Subscription</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">
                Current Plan: <span className="text-primary-600">{profile?.subscriptions?.tier?.toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-600">
                {profile?.subscriptions?.tier === 'free' && 'Limited to 5 RAG questions per day'}
                {profile?.subscriptions?.tier === 'individual' && 'All features unlocked'}
                {profile?.subscriptions?.tier === 'cohort' && 'Group plan with shared materials'}
              </p>
            </div>
            {profile?.subscriptions?.tier === 'free' && (
              <Link href="/pricing" className="btn-primary">
                Upgrade Plan
              </Link>
            )}
          </div>

          {profile?.subscriptions?.current_period_end && (
            <div className="text-sm text-gray-600">
              Next billing date: {new Date(profile.subscriptions.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      {profile?.subscriptions?.tier === 'free' && (
        <div className="card bg-orange-50 border border-orange-200">
          <h2 className="text-xl font-bold mb-2 text-orange-900">Free Tier Limits</h2>
          <p className="text-sm text-orange-800">
            You are limited to 5 RAG questions per day. Upgrade to Individual or Cohort plan for unlimited access.
          </p>
          <Link href="/pricing" className="btn-primary mt-4 inline-block">
            View Pricing
          </Link>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card border-2 border-red-200">
        <h2 className="text-xl font-bold mb-4 text-red-700">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Sign Out</p>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="btn-secondary">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
