import React, { useState } from 'react';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Flame,
  X,
  ExternalLink,
  Key,
  CheckCircle2,
  Gift
} from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
  scansRemaining: number;
  isProUser: boolean;
  onActivateProKey: (key: string) => boolean;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  onClose,
  scansRemaining,
  isProUser,
  onActivateProKey,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [licenseInput, setLicenseInput] = useState('');
  const [licenseStatus, setLicenseStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState(() => {
    return localStorage.getItem('substudio_checkout_url') || 'https://gumroad.com';
  });

  const handleApplyLicense = () => {
    if (!licenseInput.trim()) return;
    const success = onActivateProKey(licenseInput.trim());
    if (success) {
      setLicenseStatus('success');
    } else {
      setLicenseStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181822] border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#20202d] border-b border-slate-700/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-100">Upgrade SubStudio AI Pro</h3>
                {isProUser ? (
                  <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>PRO ACTIVATED</span>
                  </span>
                ) : (
                  <span className="text-[11px] bg-blue-950 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-medium">
                    {scansRemaining} Free Scans Left
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Unlock lightning-fast AI subtitle scanning, speaker diarization, and 50+ languages</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center space-x-3">
            <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 flex items-center border border-slate-700 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-blue-500 transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center space-x-1.5">
              <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                Yearly
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                SAVE 20%
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Free Starter */}
            <div className="bg-[#14141c] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Starter</div>
                <div className="text-2xl font-extrabold text-white mb-1">$0</div>
                <div className="text-[11px] text-slate-400 mb-4">Free lifetime trial</div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>3 video scans / month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Max 30 min per video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Standard SRT / VTT export</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-medium">Current Free Tier</span>
              </div>
            </div>

            {/* Flex Pass */}
            <div className="bg-[#14141c] border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between relative">
              <div className="absolute -top-2.5 right-3 bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
                NO SUBSCRIPTION
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Flex Pass</div>
                <div className="text-2xl font-extrabold text-white mb-1">$1.99</div>
                <div className="text-[11px] text-slate-400 mb-4">One-time payment • Never expires</div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>5 Ultra Video Scans pack</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>Up to 2 hours per video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>Speaker Diarization</span>
                  </div>
                </div>
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 py-2 px-3 rounded-lg bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-300 font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Buy Flex Pack</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Creator Pro */}
            <div className="bg-[#1c1a2e] border-2 border-indigo-500 rounded-xl p-4 flex flex-col justify-between relative shadow-lg shadow-indigo-950/40">
              <div className="absolute -top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                <Flame className="w-3 h-3" />
                <span>POPULAR</span>
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Creator Pro</div>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-2xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$4.99' : '$3.99'}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-4">For active creators & editors</div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="font-semibold text-white">15 video scans / month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>45 min max per video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>Dual-Speaker Diarization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>Smart Grammar & Spellcheck</span>
                  </div>
                </div>
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/30"
              >
                <span>Upgrade to Pro</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Ultra Creator */}
            <div className="bg-[#14141c] border border-purple-500/40 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Ultra Creator</div>
                <div className="flex items-baseline space-x-1 mb-1">
                  <span className="text-2xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$9.99' : '$7.99'}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </div>
                <div className="text-[11px] text-slate-400 mb-4">Unlimited power for studios</div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span className="font-bold text-purple-300">Unlimited video scans</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>Up to 2 hours (4K videos)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>20+ Language AI Translation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>TikTok / Shorts Auto-Format</span>
                  </div>
                </div>
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 py-2 px-3 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Get Ultra</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* License Key Redemption Box */}
          <div className="bg-[#121218] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                <Key className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Already bought on Gumroad or have a Pro Key?</div>
                <div className="text-[11px] text-slate-400">Enter your license code below to unlock Pro instantly on this device</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <input
                type="text"
                value={licenseInput}
                onChange={e => setLicenseInput(e.target.value)}
                placeholder="PRO-XXXX-XXXX-XXXX"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleApplyLicense}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Activate Key
              </button>
            </div>
          </div>

          {licenseStatus === 'success' && (
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>License verified! Unlimited Pro features are unlocked.</span>
            </div>
          )}

          {licenseStatus === 'error' && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              Invalid key. Please check your Gumroad purchase email for your license code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
