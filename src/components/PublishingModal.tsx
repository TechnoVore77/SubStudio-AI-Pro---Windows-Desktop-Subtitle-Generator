import React, { useState } from 'react';
import {
  Rocket,
  DollarSign,
  Store,
  Globe,
  Github,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
  Download,
  Key,
  X,
  CreditCard,
  Zap,
  Box,
  Gift,
  HeartHandshake,
  Flame,
  RotateCcw
} from 'lucide-react';

interface PublishingModalProps {
  onClose: () => void;
}

export const PublishingModal: React.FC<PublishingModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'zero-cost' | 'store' | 'saas' | 'export' | 'checklist'>('zero-cost');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181822] border border-slate-700/80 rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#20202d] border-b border-slate-700/80 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-slate-100">Publishing & Monetization Launch Center</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-medium">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Turn SubStudio AI Pro into a revenue-generating Windows Store app or Web SaaS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#14141c] px-4 pt-2 space-x-2 overflow-x-auto text-xs select-none">
          <button
            onClick={() => setActiveTab('zero-cost')}
            className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors border-t border-x ${
              activeTab === 'zero-cost'
                ? 'bg-[#181822] text-emerald-400 border-emerald-500/40 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">$0 Zero-Budget Launch</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors border-t border-x ${
              activeTab === 'store'
                ? 'bg-[#181822] text-blue-400 border-blue-500/40 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <span>Microsoft Store (.MSIX)</span>
          </button>

          <button
            onClick={() => setActiveTab('saas')}
            className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors border-t border-x ${
              activeTab === 'saas'
                ? 'bg-[#181822] text-emerald-400 border-emerald-500/40 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Web SaaS & Stripe</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors border-t border-x ${
              activeTab === 'export'
                ? 'bg-[#181822] text-purple-400 border-purple-500/40 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-purple-400" />
            <span>Export & Build (.EXE)</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3.5 py-2 rounded-t-lg font-medium flex items-center space-x-2 transition-colors border-t border-x ${
              activeTab === 'checklist'
                ? 'bg-[#181822] text-amber-400 border-amber-500/40 border-b-transparent'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Flight Checklist</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'zero-cost' && (
            <div className="space-y-4">
              {/* Zero Dollar Guarantee Banner */}
              <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900/60 to-slate-900/80 border border-emerald-500/40 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-emerald-300 flex items-center space-x-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span>The 100% Free / $0 Upfront Launch Blueprint</span>
                    </h4>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      You do <strong>not</strong> need any money to start publishing and making money from this software. You can host, distribute, package, and sell SubStudio AI Pro with <strong>zero upfront cost, zero hosting fees, and zero developer account subscriptions</strong>.
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                    Total Cost: $0.00
                  </span>
                </div>
              </div>

              {/* Step-by-Step $0 Playbook */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Gumroad */}
                <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-[9px]">1</span>
                      <span>Sell on Gumroad (100% Free)</span>
                    </span>
                    <span className="text-[10px] text-pink-400 bg-pink-950/60 border border-pink-500/30 px-1.5 py-0.5 rounded">0 Fees to List</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Gumroad requires <strong>no credit card and no upfront money</strong>. Create a product named <em>"SubStudio AI Pro - Video Subtitle Generator"</em>. You can set the price to <strong>$9.99</strong> or <strong>"Pay What You Want" ($0+)</strong>. Gumroad only takes a small 10% cut <em>when someone actually buys</em>.
                  </p>
                  <div className="text-[11px] text-slate-400 bg-[#14141e] p-2 rounded border border-slate-800">
                    💡 <strong>What you upload:</strong> Export your project ZIP from AI Studio or a build from GitHub, and attach it to your Gumroad product download.
                  </div>
                </div>

                {/* 2. Itch.io */}
                <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px]">2</span>
                      <span>List on Itch.io (Tools & Software)</span>
                    </span>
                    <span className="text-[10px] text-red-400 bg-red-950/60 border border-red-500/30 px-1.5 py-0.5 rounded">0 Fees to List</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Itch.io has a huge community of creators, editors, and indie software enthusiasts. Publishing is 100% free with <strong>no review delays</strong> and no listing fees. You can set up tips/donations or fixed pricing, and Itch gives you your own customizable web landing page for free.
                  </p>
                  <div className="text-[11px] text-slate-400 bg-[#14141e] p-2 rounded border border-slate-800">
                    💡 You choose your own revenue split (you can keep up to 100% or give 0-10% to Itch).
                  </div>
                </div>

                {/* 3. Free Web Hosting */}
                <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[9px]">3</span>
                      <span>100% Free Hosting via AI Studio / Cloud Run</span>
                    </span>
                    <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-500/30 px-1.5 py-0.5 rounded">Free Tier</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Google Cloud Run provides a <strong>free tier of 2 million requests and 360,000 GB-seconds per month</strong>. You can deploy this app with one click directly from AI Studio without paying any server bills. Or simply share the live AI Studio link with clients!
                  </p>
                </div>

                {/* 4. Ko-fi & Buy Me a Coffee */}
                <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs flex items-center space-x-1.5">
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[9px]">4</span>
                      <span>Accept Direct Tips via Ko-fi (0% Fee)</span>
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">0% Fee</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Open a free Ko-fi page (e.g. <code>ko-fi.com/yourname</code>). It takes <strong>0% platform fee</strong>. Put a "Support SubStudio" button on your website, YouTube videos, or Reddit posts, and users can donate $3, $5, or $20 straight to your PayPal or bank.
                  </p>
                </div>
              </div>

              {/* AI Cost breakdown: How your Gemini AI is $0 */}
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2">
                <h5 className="font-semibold text-slate-100 text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>How to Keep AI Processing Costs at Literally $0</span>
                </h5>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Google AI Studio provides a <strong>free tier for Gemini models</strong> that gives you free API calls within standard rate limits (15 RPM). For personal, indie, and prototype use, this costs you <strong>$0</strong>.
                </p>
                <div className="bg-[#14141e] p-2.5 rounded border border-slate-800 text-[11px] text-emerald-300">
                  ✓ <strong>Strategy:</strong> Start with Gumroad or Itch.io at $0 cost. Once you get your first 2 or 3 paying customers ($20 - $50 in profit), you can use those earnings to pay the $19 Microsoft Partner Center fee if you want to be on the Windows Store!
                </div>
              </div>
            </div>
          )}
          {activeTab === 'store' && (
            <div className="space-y-4">
              {/* Profit & Opportunity Highlight */}
              <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900/50 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-200 flex items-center space-x-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Monetization Model for Microsoft Store</span>
                    </h4>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      You can list SubStudio AI Pro as a <strong>paid app</strong> (e.g. <strong>$14.99 - $29.99 one-time purchase</strong>) or free with an in-app subscription. Video creators, YouTubers, and podcasters actively search the Windows Store for fast subtitle generators.
                    </p>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-right">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">Cost per 10min video</span>
                    <span className="text-sm font-bold text-white">&lt; $0.003</span>
                    <span className="text-[10px] text-emerald-300 block">98%+ profit margin</span>
                  </div>
                </div>
              </div>

              {/* Method 1: PWABuilder (Fastest) */}
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                    <h5 className="font-semibold text-slate-100 text-xs">Method A: Fast-Track Store Package via Microsoft PWABuilder (Zero Code)</h5>
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">Recommended</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Microsoft created <strong>PWABuilder</strong> specifically to turn modern web apps into official Windows Store <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">.msix</code> packages. Your app already has <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">public/manifest.json</code> and <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">public/icon.svg</code> ready!
                </p>

                <div className="space-y-2 bg-[#14141e] p-3 rounded border border-slate-800">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>Step 1:</strong> Deploy your app to Cloud Run (via AI Studio Deploy menu) or your custom URL.</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>Step 2:</strong> Go to <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center space-x-0.5"><span>PWABuilder.com</span><ExternalLink className="w-3 h-3 ml-0.5" /></a> and paste your app's web address.</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>Step 3:</strong> Click <strong>"Package for Windows Store"</strong>. It compiles a signed Windows MSIX bundle.</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span><strong>Step 4:</strong> Upload the generated <code className="text-cyan-300">.msix</code> to <a href="https://partner.microsoft.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center space-x-0.5"><span>Microsoft Partner Center</span><ExternalLink className="w-3 h-3 ml-0.5" /></a>.</span>
                  </div>
                </div>
              </div>

              {/* Partner Center Setup */}
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <h5 className="font-semibold text-slate-100 text-xs">Microsoft Partner Center Requirements</h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-[#14141e] p-2.5 rounded border border-slate-800">
                    <div className="font-medium text-slate-200 mb-0.5">Developer Account</div>
                    <p className="text-[11px] text-slate-400">A one-time fee of ~$19 USD gives you lifetime publishing rights to the Microsoft Store.</p>
                  </div>
                  <div className="bg-[#14141e] p-2.5 rounded border border-slate-800">
                    <div className="font-medium text-slate-200 mb-0.5">Payout Configuration</div>
                    <p className="text-[11px] text-slate-400">Microsoft takes only 12-15% cut (compared to Apple's 30%) and deposits earnings directly to your bank account.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saas' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900/50 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-emerald-200 flex items-center space-x-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Flexible & Affordable SaaS Monetization Model</span>
                    </h4>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed">
                      Host SubStudio as a website at your own domain and charge users with low-barrier pricing, monthly/annual flexibility, or pay-as-you-go credit packs.
                    </p>
                  </div>

                  {/* Billing Cycle Switcher */}
                  <div className="flex items-center bg-[#14141e] border border-slate-700/80 rounded-lg p-1 text-xs self-start sm:self-auto">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1 rounded font-medium transition-colors ${
                        billingCycle === 'monthly'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-3 py-1 rounded font-medium flex items-center space-x-1 transition-colors ${
                        billingCycle === 'yearly'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>Yearly</span>
                      <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1 py-0.2 rounded font-bold">
                        Save 20%
                      </span>
                    </button>
                  </div>
                </div>

                {/* Flexibility Guarantee Badge */}
                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-300">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cancel anytime in 1 click</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pause subscription freely</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero contract commitments</span>
                  </span>
                </div>
              </div>

              {/* Tier Structure Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Free Starter */}
                <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-3.5 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Free Starter</div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">Lead Gen</span>
                    </div>
                    <div className="text-xl font-bold text-slate-100 mt-1">
                      $0 <span className="text-xs text-slate-400 font-normal">/ month</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Free forever, no credit card required.</p>
                    <div className="my-2 border-t border-slate-800" />
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold text-emerald-300">3 video scans per month</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold text-emerald-300">Up to 30 mins per video</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Standard SRT & VTT export</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Standard AI transcription</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="w-full py-1.5 bg-slate-800 text-slate-300 rounded text-center text-[11px] font-medium">
                      Current Default Tier
                    </div>
                  </div>
                </div>

                {/* 2. Pro (Cheaper & a bit less beneficial) */}
                <div className="bg-[#1e1e2b] border border-blue-500/40 rounded-lg p-3.5 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-blue-400 font-semibold text-[11px] uppercase tracking-wider">Creator Pro</div>
                      <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">Budget Friendly</span>
                    </div>
                    <div className="text-xl font-bold text-slate-100 mt-1">
                      {billingCycle === 'monthly' ? '$4.99' : '$3.99'}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        / mo {billingCycle === 'yearly' && '(billed $48/yr)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Affordable entry plan for active creators.</p>
                    <div className="my-2 border-t border-slate-800" />
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="font-semibold text-slate-100">15 video scans per month</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>Up to 45 mins per video</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>Dual-speaker diarization</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>5 top language translations</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>Smart Spellcheck & Polish</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="w-full py-1.5 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded text-center text-[11px] font-medium">
                      Only ~$0.16 / day
                    </div>
                  </div>
                </div>

                {/* 3. Ultra (The previous Pro tier before change, with all full benefits) */}
                <div className="bg-[#1e1e2b] border-2 border-emerald-500/60 rounded-lg p-3.5 space-y-2.5 relative shadow-lg flex flex-col justify-between">
                  <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                    Full Pro Power
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">Ultra Creator</div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">All-Inclusive</span>
                    </div>
                    <div className="text-xl font-bold text-slate-100 mt-1">
                      {billingCycle === 'monthly' ? '$9.99' : '$7.99'}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        / mo {billingCycle === 'yearly' && '(billed $96/yr)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">The complete original Pro toolset at a lower price.</p>
                    <div className="my-2 border-t border-slate-800" />
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="font-semibold text-emerald-300">Unlimited video scans</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Gemini 3.8 Flash high accuracy</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Unlimited multi-speaker diarization</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>AI translation in 20+ languages</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Social captions, summaries & censor filter</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Up to 2 hours / 4K media files</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Fast-track priority processing queue</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <div className="w-full py-1.5 bg-emerald-600 text-white rounded text-center text-[11px] font-semibold">
                      Best Value for Power Users
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay-As-You-Go Flex Option Card */}
              <div className="bg-[#1e1e2b] border border-purple-500/30 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 text-xs">Alternative: Pay-As-You-Go Flex Pass (No Recurring Fees)</span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-medium">
                        $1.99 one-time
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      For creators who only need subtitles once in a while and hate subscriptions: <strong>$1.99 for 5 Ultra video scans</strong> that never expire.
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 block">Single payment</span>
                  <span className="text-xs font-bold text-purple-300">0% commitment</span>
                </div>
              </div>

              {/* Stripe Implementation snippet */}
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">How to Connect Stripe Checkout for These Tiers:</span>
                  <button
                    onClick={() => copyToClipboard(`npm i stripe\n// In server.ts:\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\n\n// Pro: price_pro_monthly ($4.99) | Ultra: price_ultra_monthly ($9.99) | PAYG: price_payg_pack ($1.99)`, 1)}
                    className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 1 ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <div className="bg-[#14141e] p-3 rounded font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <p className="text-slate-400">// Create Checkout Session with flexible pricing in server.ts</p>
                  <p>app.post('/api/create-checkout', async (req, res) =&gt; &#123;</p>
                  <p className="pl-4">const &#123; plan, billingCycle &#125; = req.body; // 'pro' | 'ultra' | 'payg'</p>
                  <p className="pl-4">const priceMap = &#123;</p>
                  <p className="pl-8">pro: billingCycle === 'yearly' ? 'price_pro_yearly' : 'price_pro_monthly', // $3.99 vs $4.99</p>
                  <p className="pl-8">ultra: billingCycle === 'yearly' ? 'price_ultra_yearly' : 'price_ultra_monthly', // $7.99 vs $9.99</p>
                  <p className="pl-8">payg: 'price_payg_5_scans', // $1.99 one-time</p>
                  <p className="pl-4">&#125;;</p>
                  <p className="pl-4">const session = await stripe.checkout.sessions.create(&#123;</p>
                  <p className="pl-8">payment_method_types: ['card'],</p>
                  <p className="pl-8">line_items: [&#123; price: priceMap[plan], quantity: 1 &#125;],</p>
                  <p className="pl-8">mode: plan === 'payg' ? 'payment' : 'subscription',</p>
                  <p className="pl-8">success_url: `&#36;&#123;req.headers.origin&#125;?session_id=&#123;CHECKOUT_SESSION_ID&#125;`,</p>
                  <p className="pl-4">&#125;);</p>
                  <p className="pl-4">res.json(&#123; url: session.url &#125;);</p>
                  <p>&#125;);</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  <span>Build Standalone Windows Native Executable (.EXE & .MSIX)</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  We have already prepared <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">electron-main.cjs</code> and <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">electron-builder.json</code> directly inside this project repository.
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                      <span>Step 1: Export project from Google AI Studio</span>
                    </div>
                    <div className="bg-[#14141e] p-2.5 rounded border border-slate-800 text-slate-300">
                      Open top-right menu in AI Studio &rarr; <strong>Settings &rarr; Export to GitHub</strong> or <strong>Download ZIP</strong>.
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                      <span>Step 2: Install dependencies & compile Windows build</span>
                      <button
                        onClick={() => copyToClipboard('npm install\nnpm install -D electron electron-builder\nnpm run build\nnpx electron-builder --win', 2)}
                        className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
                      >
                        {copiedIndex === 2 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIndex === 2 ? 'Copied' : 'Copy Commands'}</span>
                      </button>
                    </div>
                    <div className="bg-[#14141e] p-3 rounded font-mono text-[11px] text-emerald-300 border border-slate-800 space-y-1">
                      <div>npm install</div>
                      <div>npm install -D electron electron-builder</div>
                      <div>npm run build</div>
                      <div>npx electron-builder --win</div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      This will output your compiled <strong>SubStudio AI Pro Setup.exe</strong> and <strong>.msix</strong> in the <code className="text-cyan-300">dist-electron/</code> directory!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="bg-[#1e1e2b] border border-slate-700/70 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Production Pre-Flight Verification</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2.5 bg-[#14141e] p-2.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-200">AI Core Model: Gemini 3.8 Flash</div>
                      <div className="text-[11px] text-slate-400">Configured in server.ts with ultra-fast latency and high transcription accuracy.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 bg-[#14141e] p-2.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-200">Zero-Crash Subtitle Parsing & Exporters</div>
                      <div className="text-[11px] text-slate-400">Handles BOM UTF-8, multi-line WebVTT, millisecond-less timestamps, and speaker naming.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 bg-[#14141e] p-2.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-200">Interactive DAW Timeline & Waveform Scrubbing</div>
                      <div className="text-[11px] text-slate-400">Smooth mouse and touchscreen scrubbing with boundary protection.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 bg-[#14141e] p-2.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-200">Windows Desktop Shortcuts & Audio Memory Cleanup</div>
                      <div className="text-[11px] text-slate-400">Space for Play/Pause, Ctrl+O, Ctrl+S, and object URL revoking to prevent memory leaks.</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 bg-[#14141e] p-2.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-200">Store Assets & Manifest Included</div>
                      <div className="text-[11px] text-slate-400">public/manifest.json, public/icon.svg, electron-main.cjs, and electron-builder.json ready.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#20202d] border-t border-slate-700/80 px-5 py-3 flex items-center justify-between">
          <div className="text-slate-400 text-[11px]">
            SubStudio AI Pro • Ready for Cloud Run & Microsoft Store deployment
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
