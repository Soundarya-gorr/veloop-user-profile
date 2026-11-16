
import { useState } from 'react'
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
const activities = [
  {
    title: 'Daily login reward',
    detail: 'Today · 9:30 AM',
    amount: '+25 XP',
    icon: Zap
  },
  {
    title: 'Achievement unlocked',
    detail: 'Yesterday · 4:15 PM',
    amount: '+50 Gems',
    icon: Trophy
  },
  {
    title: 'Referral joined',
    detail: 'Yesterday · 11:20 AM',
    amount: '+100 XP',
    icon: Users
  },
]


function App() {
  const [active, setActive] = useState('Overview')
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileName, setProfileName] = useState('Soundarya')
  const [profileEmail, setProfileEmail] = useState('')
  const [savedProfile, setSavedProfile] = useState({
    name: 'Soundarya',
    email: ''
  })

  const masked = '••••'

  // Demo reward data - backend connection will be added later
  const rewards = [
    {
      name: 'VE Balance',
      value: '2,450',
      unit: 'VE',
      icon: Coins,
      color: 'purple',
      change: '+12.5%'
    },
    {
      name: 'SVE Balance',
      value: '850',
      unit: 'SVE',
      icon: Gem,
      color: 'blue',
      change: '+8.2%'
    },
    {
      name: 'Gems',
      value: '1,280',
      unit: 'Gems',
      icon: Sparkles,
      color: 'pink',
      change: '+18.4%'
    },
    {
      name: 'Tokens',
      value: '560',
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

      <div className="rewards-grid">
        {rewards.map(reward => {
          const Icon = reward.icon

          return (
            <article className="reward-card" key={reward.name}>
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
                {balanceVisible ? reward.value : masked}
                <span>{reward.unit}</span>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )

  // Reusable activity list
  const ActivityList = () => (
    <div className="activity-list">
      {activities.map((activity, index) => {
        const Icon = activity.icon

        return (
          <div className="activity-row" key={index}>
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
              Completed
            </span>
          </div>
        )
      })}
    </div>
  )

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

          <div className="achievement-item">
            <div className="achievement-icon gold">
              <Trophy size={21} />
            </div>

            <div>
              <strong>Early Bird</strong>
              <span>Logged in 7 days in a row</span>
            </div>

            <span className="earned-check">✓</span>
          </div>

          <div className="achievement-item">
            <div className="achievement-icon violet">
              <Zap size={21} />
            </div>

            <div>
              <strong>Fast Learner</strong>
              <span>Earned 500 XP</span>
            </div>

            <span className="earned-check">✓</span>
          </div>

          <div className="achievement-item">
            <div className="achievement-icon teal">
              <Users size={21} />
            </div>

            <div>
              <strong>Team Player</strong>
              <span>Invite 5 friends</span>
            </div>

            <span className="progress-mini">3/5</span>
          </div>

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

      {title === 'Achievements' && (
        <div style={{ marginTop: '25px' }}>
          {[
            ['Early Bird', 'Logged in 7 days in a row', 'Completed'],
            ['Fast Learner', 'Earned 500 XP', 'Completed'],
            ['Team Player', 'Invite 5 friends', '3 of 5'],
            ['XP Champion', 'Reach 2,000 XP', 'In progress'],
          ].map(item => (
            <div className="achievement-item" key={item[0]}>
              <div className="achievement-icon violet">
                <Trophy size={20} />
              </div>
              <div>
                <strong>{item[0]}</strong>
                <span>{item[1]}</span>
              </div>
              <span className="progress-mini">{item[2]}</span>
            </div>
          ))}
        </div>
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
            <div className="avatar">S</div>

            <div className="sidebar-user-info">
              <strong>Soundarya</strong>
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
              <div className="avatar small">S</div>
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
                Welcome back, Soundarya <span className="wave">✦</span>
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
    savedProfile={savedProfile}
    setSavedProfile={setSavedProfile}
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
              description="Track your badges and milestones."
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
  setSavedProfile
}) => {
  const handleSave = () => {
    setSavedProfile({
      name: profileName,
      email: profileEmail
    })
    setIsEditingProfile(false)
  }

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
        <div className="avatar" style={{
          width: '70px',
          height: '70px',
          fontSize: '28px',
          marginBottom: '25px'
        }}>
          {savedProfile.name.charAt(0).toUpperCase()}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Full Name</label>
          {isEditingProfile ? (
            <input
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter your name"
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
            />
          ) : (
            <p>{savedProfile.email || 'No email added yet'}</p>
          )}
        </div>

        {isEditingProfile && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="text-action" onClick={handleSave}>
              Save Changes
            </button>
            <button className="text-action" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default App
