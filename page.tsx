"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, Bell, ChevronDown, CircleHelp, CreditCard,
  LayoutDashboard, ListChecks, LockKeyhole, MoreHorizontal, Plus, Search,
  Settings, ShieldCheck, Target, Wallet, TrendingDown, PiggyBank, Sparkles,
  Clock3, ArrowRight, Menu, X
} from "lucide-react";

const initialTransactions = [
  { id: 1, title: "Monthly allowance", category: "Income", date: "Today, 9:14 AM", amount: 80000, type: "income" },
  { id: 2, title: "Groceries", category: "Essentials", date: "Today, 11:32 AM", amount: -8500, type: "expense" },
  { id: 3, title: "Mobile data", category: "Bills", date: "Yesterday", amount: -5000, type: "expense" },
  { id: 4, title: "Design project", category: "Freelance income", date: "Nov 13", amount: 35000, type: "income" },
];

const money = (n: number) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 0
}).format(n);

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Transactions", icon: ListChecks },
  { label: "Budgets", icon: Wallet },
  { label: "Debt centre", icon: TrendingDown },
  { label: "Savings", icon: PiggyBank },
  { label: "Spending protection", icon: ShieldCheck },
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showIncome, setShowIncome] = useState(false);
  const [income, setIncome] = useState("50000");
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const totalIncome = useMemo(() => transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0), [transactions]);
  const spendable = 18500;

  function addDemoIncome() {
    const value = Number(income);
    if (!Number.isFinite(value) || value <= 0) return;
    setTransactions(prev => [{ id: Date.now(), title: "Demo income received", category: "Other income", date: "Just now", amount: value, type: "income" }, ...prev]);
    setShowIncome(false);
    setNotice(`Demo income of ${money(value)} recorded. Suggested allocation is ready for review.`);
    window.setTimeout(() => setNotice(""), 5000);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Wallet size={19} strokeWidth={2.5}/></div>
          <div><strong>MIND<span>MONEY</span></strong><small>FINANCIAL CONTROL</small></div>
          <button className="mobile-close icon-button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.label} onClick={() => {setActive(item.label); setMobileNav(false);}} className={`nav-item ${active === item.label ? "active" : ""}`}>
              <Icon size={18}/><span>{item.label}</span>{item.label === "Spending protection" && <i className="nav-dot"/>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="lock-card">
            <div className="lock-icon"><LockKeyhole size={17}/></div>
            <strong>Protection is on</strong>
            <p>Your spending rules are ready. No bank is connected.</p>
            <button onClick={() => setActive("Spending protection")}>Review safeguards <ArrowRight size={14}/></button>
          </div>
          <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
          <div className="profile">
            <div className="avatar">MM</div>
            <div><strong>My workspace</strong><small>Demo account</small></div>
            <MoreHorizontal size={18} className="muted-icon"/>
          </div>
        </div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}

      <section className="main-area">
        <header className="topbar">
          <div className="top-left">
            <button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          </div>
          <div className="top-actions">
            <div className="demo-pill"><span/> DEMO DATA</div>
            <button className="icon-button" aria-label="Search"><Search size={18}/></button>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={18}/><i/></button>
            <div className="top-avatar">MM</div>
          </div>
        </header>

        <div className="content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">MONDAY, NOVEMBER 16, 2026</div>
              <h1>{active === "Overview" ? "Your money, in focus." : active}</h1>
              <p className="subtitle">A clear view of what you have, what you owe and what happens next.</p>
            </div>
            <div className="welcome-actions">
              <button className="button button-secondary" onClick={() => setShowIncome(true)}><Plus size={16}/> Add income</button>
              <button className="button button-primary" onClick={() => setNotice("Transaction entry is part of the next implementation milestone.")}><Plus size={16}/> Add transaction</button>
            </div>
          </div>

          {notice && <div className="notice"><ShieldCheck size={17}/>{notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}

          <section className="hero-grid">
            <div className="spend-card">
              <div className="card-top"><span>SAFE TO SPEND</span><span className="live-indicator"><i/> DEMO</span></div>
              <div className="spend-amount">{money(spendable)}</div>
              <p>Available after planned commitments</p>
              <div className="spend-divider"/>
              <div className="spend-bottom">
                <div><small>Daily guide</small><strong>{money(2500)}</strong></div>
                <div><small>Weekly budget left</small><strong>{money(8500)}</strong></div>
                <div className="spend-icon"><ShieldCheck size={22}/></div>
              </div>
            </div>
            <div className="allocation-card panel">
              <div className="section-heading"><div><h3>Income allocation</h3><p>Give every naira a job.</p></div><button className="more-button"><MoreHorizontal size={19}/></button></div>
              <div className="allocation-total"><strong>{money(80000)}</strong><span>Last income · Demo</span></div>
              <div className="allocation-bar"><span className="alloc-debt"/><span className="alloc-save"/><span className="alloc-essentials"/><span className="alloc-spend"/></div>
              <div className="allocation-legend">
                <div><i className="dot debt"/><span>Debt repayment</span><strong>40%</strong></div>
                <div><i className="dot save"/><span>Savings</span><strong>20%</strong></div>
                <div><i className="dot essentials"/><span>Essentials</span><strong>30%</strong></div>
                <div><i className="dot personal"/><span>Personal</span><strong>10%</strong></div>
              </div>
            </div>
          </section>

          <section className="metrics-grid">
            <Metric icon={<TrendingDown size={18}/>} label="Outstanding debt" value={money(800000)} foot="Starting balance · Demo" tone="red"/>
            <Metric icon={<PiggyBank size={18}/>} label="Emergency savings" value={money(45000)} foot="Starter goal: ₦100,000" tone="green"/>
            <Metric icon={<ArrowDownLeft size={18}/>} label="Income this month" value={money(totalIncome)} foot="Across recorded sources" tone="blue"/>
            <Metric icon={<ArrowUpRight size={18}/>} label="Spent this month" value={money(totalExpenses)} foot="Across recorded expenses" tone="amber"/>
          </section>

          <section className="lower-grid">
            <div className="panel transactions-panel">
              <div className="section-heading"><div><h3>Recent transactions</h3><p>Your latest money activity.</p></div><button className="text-button" onClick={() => setActive("Transactions")}>View all <ArrowRight size={14}/></button></div>
              <div className="transaction-list">
                {transactions.slice(0, 5).map(t => <div className="transaction" key={t.id}>
                  <div className={`transaction-icon ${t.amount > 0 ? "income-icon" : "expense-icon"}`}>{t.amount > 0 ? <ArrowDownLeft size={17}/> : <ArrowUpRight size={17}/>}</div>
                  <div className="transaction-info"><strong>{t.title}</strong><small>{t.category} · {t.date}</small></div>
                  <strong className={`transaction-amount ${t.amount > 0 ? "positive" : ""}`}>{t.amount > 0 ? "+" : "−"}{money(Math.abs(t.amount))}</strong>
                </div>)}
              </div>
            </div>
            <div className="panel next-panel">
              <div className="section-heading"><div><h3>Next best actions</h3><p>Small steps. Less mental load.</p></div><Sparkles size={18} className="sparkle"/></div>
              <div className="action-item"><div className="action-icon green-bg"><Target size={17}/></div><div><strong>Review your debt plan</strong><small>Confirm your next repayment amount.</small></div><ArrowRight size={16}/></div>
              <div className="action-item"><div className="action-icon purple-bg"><Clock3 size={17}/></div><div><strong>Check purchase waiting list</strong><small>1 item is waiting for a decision.</small></div><ArrowRight size={16}/></div>
              <div className="action-item"><div className="action-icon amber-bg"><CircleHelp size={17}/></div><div><strong>Complete your money check-in</strong><small>A 60-second weekly review.</small></div><ArrowRight size={16}/></div>
              <div className="gentle-note"><ShieldCheck size={16}/><span>No judgement. Just your next useful step.</span></div>
            </div>
          </section>
          <footer className="footer"><span>© 2026 MINDMONEY</span><span>Private by design <i/> Built for clearer money decisions</span></footer>
        </div>
      </section>

      {showIncome && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setShowIncome(false);}}>
        <div className="modal">
          <div className="modal-head"><div><span className="eyebrow">DEMO TRANSACTION</span><h2>Record incoming money</h2></div><button className="icon-button" onClick={() => setShowIncome(false)} aria-label="Close"><X size={18}/></button></div>
          <p className="modal-copy">This records a sample income event locally. It does not connect to a bank or move money.</p>
          <label htmlFor="income-amount">Amount (NGN)</label>
          <input id="income-amount" value={income} onChange={e => setIncome(e.target.value)} inputMode="numeric"/>
          <div className="allocation-preview"><strong>Suggested allocation preview</strong><div><span>Debt repayment · 40%</span><b>{money(Number(income || 0) * .4)}</b></div><div><span>Savings · 20%</span><b>{money(Number(income || 0) * .2)}</b></div><div><span>Essentials · 30%</span><b>{money(Number(income || 0) * .3)}</b></div><div><span>Personal · 10%</span><b>{money(Number(income || 0) * .1)}</b></div></div>
          <button className="button button-primary full-button" onClick={addDemoIncome}>Record demo income</button>
        </div>
      </div>}
    </main>
  );
}

function Metric({icon, label, value, foot, tone}: {icon: React.ReactNode; label: string; value: string; foot: string; tone: string}) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small>{foot}</small></div>;
}
