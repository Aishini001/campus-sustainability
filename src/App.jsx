import React, { useState } from 'react';
import { 
  Trophy, Flame, Award, Bike, Coffee, Zap, Droplets, 
  ChevronRight, Sparkles, PlusCircle, CheckCircle2, Building 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_HOSTELS = [
  { id: 'h1', name: 'Hostel H (Boys)', points: 4120, co2Saved: '320 kg', members: 450, rank: 1, color: '#10b981' },
  { id: 'h2', name: 'Hostel G (Girls)', points: 3980, co2Saved: '298 kg', members: 420, rank: 2, color: '#3b82f6' },
  { id: 'h3', name: 'Hostel B (Boys)', points: 3450, co2Saved: '260 kg', members: 390, rank: 3, color: '#f59e0b' },
  { id: 'h4', name: 'Hostel I (Girls)', points: 3120, co2Saved: '235 kg', members: 380, rank: 4, color: '#8b5cf6' },
  { id: 'h5', name: 'Hostel J (PG/Day)', points: 2890, co2Saved: '210 kg', members: 340, rank: 5, color: '#64748b' }
];

const HABIT_ACTIONS = [
  { id: 'bike', label: 'Rode Campus Bicycle', pts: 40, co2: 0.8, icon: Bike, desc: 'Avoided motorized transit' },
  { id: 'mug', label: 'Reusable Mug / Cup', pts: 20, co2: 0.3, icon: Coffee, desc: 'Saved 1 single-use cup' },
  { id: 'lights', label: 'Turned Off Dorm Lab Lights', pts: 25, co2: 0.5, icon: Zap, desc: 'Conserved idle kilowatt hours' },
  { id: 'tap', label: 'Reported / Fixed Water Leak', pts: 50, co2: 1.2, icon: Droplets, desc: 'Saved campus water wastage' },
];

const BADGES = [
  { name: 'Seedling Sprout', desc: 'Logged first eco-action', threshold: 1, unlocked: true },
  { name: 'Carbon Slasher', desc: 'Saved > 5 kg CO2', threshold: 5, unlocked: true },
  { name: 'Hostel Anchor', desc: 'Logged 10 actions for your hostel', threshold: 10, unlocked: false },
  { name: 'Eco Legend', desc: 'Reach 500 individual pts', threshold: 500, unlocked: false },
];

export default function App() {
  const [hostels, setHostels] = useState(INITIAL_HOSTELS);
  const [selectedHostel, setSelectedHostel] = useState('h1');
  const [userPoints, setUserPoints] = useState(140);
  const [userCo2, setUserCo2] = useState(3.4);
  const [logCount, setLogCount] = useState(4);
  const [recentLogs, setRecentLogs] = useState([
    { id: 1, label: 'Used Reusable Mug', pts: '+20', time: '10m ago' },
    { id: 2, label: 'Rode Campus Bicycle', pts: '+40', time: '2h ago' },
  ]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleLogHabit = (action) => {
    const nextPoints = userPoints + action.pts;
    const nextCo2 = +(userCo2 + action.co2).toFixed(1);
    const nextCount = logCount + 1;

    setUserPoints(nextPoints);
    setUserCo2(nextCo2);
    setLogCount(nextCount);

    setRecentLogs(prev => [
      { id: Date.now(), label: action.label, pts: `+${action.pts}`, time: 'Just now' },
      ...prev.slice(0, 4)
    ]);

    setHostels(prev => {
      const updated = prev.map(h => {
        if (h.id === selectedHostel) {
          const currentCo2Num = parseFloat(h.co2Saved);
          return {
            ...h,
            points: h.points + action.pts,
            co2Saved: `${(currentCo2Num + action.co2).toFixed(1)} kg`
          };
        }
        return h;
      });
      return updated.sort((a, b) => b.points - a.points).map((h, idx) => ({ ...h, rank: idx + 1 }));
    });

    triggerConfetti();
  };

  const currentHostelData = hostels.find(h => h.id === selectedHostel);
  const progressPercent = Math.min(100, Math.round((userPoints / 500) * 100));

  return (
    <div style={{ minHeight: '100vh', background: '#0b1329', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Navbar */}
      <header style={{ borderBottom: '1px solid #1e293b', background: '#0f172a', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Campus GreenPulse</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Inter-Hostel Eco Leaderboard & Habit Tracker</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>Representing:</label>
          <select 
            value={selectedHostel} 
            onChange={(e) => setSelectedHostel(e.target.value)}
            style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', padding: '6px 12px', fontSize: '13px' }}
          >
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1150px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left Column: Log Actions & Individual Stats */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* User Progress Banner */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '20px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Contribution</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: '800' }}>{userPoints}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8' }}>Total Points</span>
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
                🌱 Estimated <strong>{userCo2} kg</strong> CO2 offset for {currentHostelData?.name}
              </p>
            </div>

            {/* Circular Progress Ring */}
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="90" height="90" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray={`${progressPercent}, 100`} />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{progressPercent}%</span>
                <span style={{ display: 'block', fontSize: '9px', color: '#94a3b8' }}>To Goal</span>
              </div>
            </div>
          </div>

          {/* Quick Habit Logging Grid */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} color="#10b981" /> Log Campus Habit
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {HABIT_ACTIONS.map(action => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleLogHabit(action)}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '14px', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.1s, border-color 0.1s', display: 'flex', flexDirection: 'column', gap: '6px' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#10b981'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IconComponent size={20} color="#10b981" />
                      <span style={{ background: '#064e3b', color: '#6ee7b7', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>
                        +{action.pts} pts
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{action.label}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{action.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Badges Earned */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#f59e0b" /> Sustainability Milestones
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {BADGES.map((b, i) => (
                <div key={i} style={{ background: b.unlocked ? '#1e293b' : '#0d1527', opacity: b.unlocked ? 1 : 0.5, border: '1px solid #334155', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} color={b.unlocked ? '#10b981' : '#64748b'} />
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{b.name}</h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Hostel-vs-Hostel Leaderboard */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#f59e0b" /> Hostel Standings
              </h2>
              <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={14} /> Live Sync
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hostels.map(hostel => {
                const isSelected = hostel.id === selectedHostel;
                return (
                  <div 
                    key={hostel.id}
                    style={{
                      background: isSelected ? '#1e293b' : '#0b1329',
                      border: isSelected ? '1px solid #10b981' : '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        width: '24px', height: '24px', borderRadius: '6px', 
                        background: hostel.rank === 1 ? '#f59e0b' : hostel.rank === 2 ? '#94a3b8' : hostel.rank === 3 ? '#b45309' : '#334155',
                        color: '#fff', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        {hostel.rank}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {hostel.name}
                          {isSelected && <span style={{ fontSize: '10px', background: '#064e3b', color: '#6ee7b7', padding: '1px 6px', borderRadius: '4px' }}>You</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {hostel.members} members · {hostel.co2Saved} CO2 saved
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>{hostel.points}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '18px', border: '1px solid #1e293b' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#cbd5e1' }}>Your Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentLogs.map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#1e293b', borderRadius: '8px', fontSize: '12px' }}>
                  <span>{log.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>{log.pts}</span>
                    <span style={{ color: '#64748b' }}>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}