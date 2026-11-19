
import { useState, useEffect } from 'react'
import AuthPage from './AuthPage'
import {
  getCurrentUser,
  updateCurrentUser,
  getRewards,
  getRewardActivity,
  getAchievements
} from './api'
import {
  LayoutDashboard, UserRound, Gift, Trophy, Wallet,
  Users, Settings, Bell, Search, ChevronDown,
  Eye, EyeOff, ArrowUpRight, Sparkles, Zap,
  Menu, X, CircleHelp, Activity, Star, Gem, Coins,
  ShieldCheck, CalendarDays, Mail, Hash, Clock
} from 'lucide-react'

import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts'

import './App.css'

// Demo chart data
const chartData = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 180 },
  { day: 'Wed', xp: 150 },
  { day: 'Thu', xp: 260 },
  { day: 'Fri', xp: 220 },
  { day: 'Sat', xp: 340 },
  { day: 'Sun', xp: 390 },
]

// Sidebar navigation
const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Profile', icon: UserRound },
  { label: 'Rewards', icon: Gift },
  { label: 'Achievements', icon: Trophy },
  { label: 'Wallet', icon: Wallet },
  { label: 'Referrals', icon: Users },
]

// Demo activity data



function App() {
  console.log('VELoop App component rendered')
  const [rewardBalances, setRewardBalances] = useState(null)
  const [rewardsLoading, setRewardsLoading] = useState(false)
  const [rewardsError, setRewardsError] = useState('')
  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const [activitiesError, setActivitiesError] = useState('')
  const [achievements, setAchievements] = useState([])
  const [achievementsLoading, setAchievementsLoading] = useState(false)
  const [achievementsError, setAchievementsError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [token, setToken] = useState(() =>
    localStorage.getItem('veloop_token')
  )
  const [active, setActive] = useState('Overview')
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null)
        setAuthLoading(false)
        return
      }

      try {
        const data = await getCurrentUser(token)

        setUser(data.user)
        setProfileName(data.user.name)
        setProfileEmail(data.user.email)
      } catch (error) {
        localStorage.removeItem('veloop_token')
        setToken(null)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }


    loadUser()
  }, [token])
  useEffect(() => {
    let cancelled = false

    async function loadRewards() {
      if (!token || !user) {
        setRewardBalances(null)
        return
      }

      setRewardsLoading(true)
      setRewardsError('')

      try {
        const data = await getRewards(token)

        if (!cancelled) {
          setRewardBalances(data.rewards)
        }
      } catch (error) {
        if (!cancelled) {
          setRewardsError(error.message)
        }
      } finally {
        if (!cancelled) {
          setRewardsLoading(false)
        }
      }
    }

    loadRewards()

    return () => {
      cancelled = true
    }
  }, [token, user])
  useEffect(() => {
    let cancelled = false

    async function loadActivities() {
      if (!token || !user) {
        setActivities([])
        return
      }

      setActivitiesLoading(true)
      setActivitiesError('')

      try {
        const data = await getRewardActivity(token)

        if (!cancelled) {
          setActivities(data.activities || [])
        }
      } catch (error) {
        if (!cancelled) {
          setActivitiesError(error.message)
        }
      } finally {
        if (!cancelled) {
          setActivitiesLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      cancelled = true
    }
  }, [token, user])
  useEffect(() => {
    let cancelled = false

    async function loadAchievements() {
      if (!token || !user) {
        setAchievements([])
        return
      }

      setAchievementsLoading(true)
      setAchievementsError('')

      try {
        const data = await getAchievements(token)

        if (!cancelled) {
          setAchievements(data.achievements || [])
        }
      } catch (error) {
        if (!cancelled) {
          setAchievementsError(error.message)
        }
      } finally {
        if (!cancelled) {
          setAchievementsLoading(false)
        }
      }
    }

    loadAchievements()

    return () => {
      cancelled = true
    }
  }, [token, user])

  const handleLogin = (data) => {
    if (!data.token) {
      alert('Login response did not contain an authentication token.')
      return
    }

    localStorage.setItem('veloop_token', data.token)
    setAuthLoading(true)
    setToken(data.token)
  }

  const handleLogout = () => {
    localStorage.removeItem('veloop_token')
    setToken(null)
    setUser(null)
    setActive('Overview')
    setIsEditingProfile(false)
  }
  const handleSaveProfile = async () => {
    setProfileError('')

    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Name and email are required.')
      return
    }

    setProfileSaving(true)

    try {
      const data = await updateCurrentUser(token, {
        name: profileName.trim(),
        email: profileEmail.trim()
      })

      setUser(data.user)
      setProfileName(data.user.name)
      setProfileEmail(data.user.email)
      setIsEditingProfile(false)

      alert('Profile updated successfully!')
    } catch (error) {
      setProfileError(error.message)
    } finally {
      setProfileSaving(false)
    }
  }
  const masked = '••••'

  // Demo reward data - backend connection will be added later
  const rewards = [
    {
      name: 'VE Balance',
      key: 've_balance',
      unit: 'VE',
      icon: Coins,
      color: 'purple',
      change: '+12.5%'
    },
    {
      name: 'SVE Balance',
      key: 'sve_balance',
      unit: 'SVE',
      icon: Gem,
      color: 'blue',
      change: '+8.2%'
    },
    {
      name: 'Gems',
      key: 'gems',
      unit: 'Gems',
      icon: Sparkles,
      color: 'pink',
      change: '+18.4%'
    },
    {
      name: 'Tokens',
      key: 'tokens',
      unit: 'Tokens',
      icon: Wallet,
      color: 'orange',
      change: '+5.6%'
    },
  ]
  const handleNavigation = (page) => {
    setActive(page)
    setMobileMenu(false)
    setNotificationsOpen(false)
  }

  // Reusable reward cards
  const RewardCards = () => (
    <>
      <div className="section-heading">
        <div>
          <h2>Your rewards</h2>
          <p>Keep track of everything you've earned.</p>
        </div>

        <button
          className="text-action"
          onClick={() => setBalanceVisible(!balanceVisible)}
        >
          {balanceVisible
            ? <EyeOff size={16} />
            : <Eye size={16} />
          }
          {balanceVisible ? 'Hide balances' : 'Show balances'}
        </button>
      </div>

      {rewardsLoading && (
        <p>Loading your rewards...</p>
      )}

      {rewardsError && (
        <p style={{ color: '#ff6b81' }}>
          {rewardsError}
        </p>
      )}

      {!rewardsLoading && !rewardsError && rewardBalances && (
        <div className="rewards-grid">
          {rewards.map(reward => {
            const Icon = reward.icon

            return (
              <article className="reward-card" key={reward.key}>
                <div className="reward-card-top">
                  <div className={`reward-icon ${reward.color}`}>
                    <Icon size={20} />
                  </div>

                  <span className="growth-tag">
                    <ArrowUpRight size={13} />
                    {reward.change}
                  </span>
                </div>

                <p>{reward.name}</p>

                <div className="reward-value">
                  {balanceVisible
                    ? Number(rewardBalances[reward.key]).toLocaleString('en-IN')
                    : masked}
                  <span>{reward.unit}</span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
  // Reusable activity list
  const ActivityList = () => {
    const activityIcons = {
      zap: Zap,
      trophy: Trophy,
      users: Users,
    }

    if (activitiesLoading) {
      return <p>Loading reward activity...</p>
    }

    if (activitiesError) {
      return (
        <p style={{ color: '#ff6b81' }}>
          {activitiesError}
        </p>
      )
    }

    if (activities.length === 0) {
      return <p>No reward activity yet.</p>
    }

    return (
      <div className="activity-list">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.icon] || Activity

          return (
            <div className="activity-row" key={activity.id}>
              <div className="activity-icon">
                <Icon size={18} />
              </div>

              <div className="activity-description">
                <strong>{activity.title}</strong>
                <span>{activity.detail}</span>
              </div>

              <div className="activity-amount">
                {activity.amount}
              </div>

              <span className="activity-status">
                {activity.status}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  // Overview page
  const OverviewPage = () => (
    <>
      <section className="level-banner">
        <div className="level-content">
          <div className="level-label">
            <span className="level-star">
              <Star size={13} fill="currentColor" />
            </span>
            YOUR CURRENT JOURNEY
          </div>

          <h2>You're doing amazing!</h2>

          <p>
            Keep going. Every action takes you one step further.
          </p>

          <div className="xp-line">
            <div className="xp-track">
              <div className="xp-fill" />
            </div>
            <span>850 / 1,000 XP</span>
          </div>

          <div className="xp-footnote">
            150 XP more to reach Level 09
          </div>
        </div>

        <div className="level-visual">
          <div className="level-orbit orbit-one" />
          <div className="level-orbit orbit-two" />

          <div className="level-medal">
            <Trophy size={35} />
          </div>

          <div className="level-number">08</div>
          <div className="level-caption">CURRENT LEVEL</div>
        </div>

        <div className="banner-sparkle sparkle-one">✦</div>
        <div className="banner-sparkle sparkle-two">✧</div>
      </section>

      <section className="section-block">
        <RewardCards />
      </section>

      <section className="middle-grid">
        <article className="panel growth-panel">
          <div className="section-heading">
            <div>
              <h2>Activity overview</h2>
              <p>Your XP growth throughout the week.</p>
            </div>

            <span className="chart-period">
              This week <ChevronDown size={14} />
            </span>
          </div>

          <div className="chart-summary">
            <strong>1,660 XP</strong>
            <span>
              <ArrowUpRight size={14} />
              14.8% <small>vs last week</small>
            </span>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="xpGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8065ed"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor="#8065ed"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#9295a5',
                    fontSize: 12
                  }}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#8065ed"
                  strokeWidth={3}
                  fill="url(#xpGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel achievement-panel">
          <div className="section-heading">
            <div>
              <h2>Achievements</h2>
              <p>Celebrate your milestones.</p>
            </div>

            <button
              className="arrow-button"
              onClick={() => handleNavigation('Achievements')}
            >
              <ArrowUpRight size={18} />
            </button>
          </div>

            <div className="achievement-icon gold">
              <Trophy size={21} />
            </div>

            {achievementsLoading && <p>Loading achievements...</p>}

            {achievementsError && (
              <p style={{ color: '#ff6b81' }}>{achievementsError}</p>
            )}

            {!achievementsLoading && !achievementsError &&
              achievements.slice(0, 3).map((item) => {
                const icons = {
                  trophy: Trophy,
                  zap: Zap,
                  users: Users,
                  star: Star
                }

                const Icon = icons[item.icon] || Trophy
                const completed = item.status === 'Completed'

                return (
                  <div className="achievement-item" key={item.id}>
                    <div className="achievement-icon violet">
                      <Icon size={21} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <span className={completed ? 'earned-check' : 'progress-mini'}>
                      {completed ? '✓' : `${item.progress}/${item.target}`}
                    </span>
                  </div>
                )
              })
            }
            <button
              className="all-achievements"
              onClick={() => handleNavigation('Achievements')}
            >
              Explore all achievements
              <ArrowUpRight size={15} />
            </button>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="section-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Your latest rewards and milestones.</p>
          </div>

          <button
            className="text-action"
            onClick={() => handleNavigation('Rewards')}
          >
            View all activity
            <ArrowUpRight size={15} />
          </button>
        </div>

        <ActivityList />
      </section>
    </>
  )





  // Other section pages
  const OtherPage = ({ title, description, icon: Icon }) => (
    <section className="panel" style={{ padding: '28px' }}>
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <Icon size={28} color="#9479f5" />
      </div>

      {title === 'Rewards' && (
  <>
    <div style={{ marginTop: '25px' }}>
      <RewardCards />
    </div>

    <div style={{ marginTop: '30px' }}>
      <h3>Reward activity</h3>
      <ActivityList />
    </div>
  </>
)}
{active === 'Achievements' && (
  <OtherPage
    title="Achievements"
    description="Track your progress and completed achievements."
    icon={Trophy}
  />
)}

{title === 'Wallet' && (
  <div style={{ marginTop: '25px' }}>
    <RewardCards />
    <p style={{ color: '#9295a5', marginTop: '25px' }}>
      Withdrawal and transaction history will be connected
      to the backend later.
    </p>
  </div>
)}

      {title === 'Referrals' && (
        <div style={{ marginTop: '25px' }}>
          <h3>Your referral progress</h3>
          <p style={{ color: '#9295a5' }}>
            Invite friends and track your referral rewards here.
          </p>

          <div className="reward-card" style={{ marginTop: '20px' }}>
            <p>Successful referrals</p>
            <div className="reward-value">3 <span>Friends</span></div>
          </div>

          <p style={{ color: '#9295a5', marginTop: '20px' }}>
            Your personal referral link will be available after
            backend integration.
          </p>
        </div>
      )}

      {title === 'Settings' && (
        <div style={{ marginTop: '25px' }}>
          <div className="achievement-item">
            <ShieldCheck size={22} />
            <div>
              <strong>Account security</strong>
              <span>Security settings will be connected later.</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0e0b1a',
        color: '#ffffff'
      }}>
        Loading VELoop...
      </div>
    )
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="app-shell">


      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-symbol">V</div>
          <span>
            VE<span className="brand-light">LOOP</span>
          </span>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="side-nav">
          {navigation.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.label}
                className={`nav-item ${active === item.label ? 'active' : ''}`}
                onClick={() => handleNavigation(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.label === 'Rewards' && (
                  <span className="nav-dot" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <CircleHelp size={20} />
            </div>

            <strong>Need some help?</strong>
            <p>We're here to help you grow.</p>

            <button onClick={() => alert('Help centre coming soon!')}>
              Visit Help Centre
              <ArrowUpRight size={14} />
            </button>
          </div>

          <button
            className={`nav-item settings-link ${active === 'Settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('Settings')}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-user">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
              <button
                className="text-action"
                onClick={handleLogout}
                style={{ marginTop: '12px' }}
              >
                Sign Out
              </button>
            </div>

            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span>Level 08 Member</span>
            </div>

            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenu(true)}
            >
              <Menu />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{active}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <input placeholder="Search anything..." />
              <kbd>⌘ K</kbd>
            </div>

            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <strong>Notifications</strong>

                  <p>
                    <span className="notification-mini" />
                    Your daily reward is ready to collect!
                  </p>

                  <p>
                    <span className="notification-mini" />
                    You're 150 XP away from Level 09.
                  </p>

                  <button onClick={() => setNotificationsOpen(false)}>
                    Close
                  </button>
                </div>
              )}
            </div>

            <div className="topbar-profile">
              <div className="avatar small">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="page-container">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                YOUR REWARDS SPACE
              </div>

              <h1>
                Welcome back, {user.name} <span className="wave">✦</span>
              </h1>
              <p>
                Here's what's happening with your rewards today.
              </p>
            </div>

            <button className="date-chip">
              <Activity size={16} />
              Friday, November 13, 2026
            </button>
          </section>

          {active === 'Overview' && <OverviewPage />}

          {active === 'My Profile' && (
            <ProfilePage
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              profileName={profileName}
              setProfileName={setProfileName}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              savedProfile={user}
              onSave={handleSaveProfile}
              saving={profileSaving}
              error={profileError}
            />
          )}

          {active === 'Rewards' && (
            <OtherPage
              title="Rewards"
              description="View your reward balances and activity."
              icon={Gift}
            />
          )}

          {active === 'Achievements' && (
  <OtherPage
    title="Achievements"
    description="Track your progress and completed achievements."
    icon={Trophy}
  />
)}

    

          {active === 'Wallet' && (
            <OtherPage
              title="Wallet"
              description="View your wallet balances and transactions."
              icon={Wallet}
            />
          )}

          {active === 'Referrals' && (
            <OtherPage
              title="Referrals"
              description="Track your friends and referral rewards."
              icon={Users}
            />
          )}

          {active === 'Settings' && (
            <OtherPage
              title="Settings"
              description="Manage your account preferences."
              icon={Settings}
            />
          )}

          <footer className="footer">
            <span>© 2026 VELOOP Rewards Platform</span>
            <span>
              Made for your growth
              <span className="footer-heart"> ♥</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  )
}
// Editable profile page
const ProfilePage = ({
  isEditingProfile,
  setIsEditingProfile,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  savedProfile,
  onSave,
  saving,
  error
}) => {
  const handleCancel = () => {
    setProfileName(savedProfile.name)
    setProfileEmail(savedProfile.email)
    setIsEditingProfile(false)
  }

  return (
    <section className="panel" style={{ padding: '28px' }}>
      <div className="section-heading">
        <div>
          <h2>My Profile</h2>
          <p>Manage your personal information.</p>
        </div>

        {!isEditingProfile && (
          <button
            className="text-action"
            onClick={() => setIsEditingProfile(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <div
          className="avatar"
          style={{
            width: '70px',
            height: '70px',
            fontSize: '28px',
            marginBottom: '25px'
          }}
        >
          {savedProfile.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Full Name</label>

          {isEditingProfile ? (
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
            />
          ) : (
            <p>{savedProfile.name}</p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Email Address</label>

          {isEditingProfile ? (
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={120}
            />
          ) : (
            <p>{savedProfile.email}</p>
          )}
        </div>

        {error && (
          <p style={{ color: '#ff6b81', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        {isEditingProfile && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="text-action"
              onClick={onSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              className="text-action"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
export default App