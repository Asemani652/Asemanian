import { useState } from 'react';

type Props = { value: string; onChange: (value: string) => void };
const pad = (n: number) => String(n).padStart(2, '0');

export default function ClockPicker({ value, onChange }: Props) {
  const [step, setStep] = useState<'hour' | 'minute'>('hour');
  const [hour, minute] = (value || '09:00').split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const setHour = (n: number) => { onChange(`${pad((n % 12) + (period === 'PM' ? 12 : 0))}:${pad(minute)}`); setStep('minute'); };
  const setMinute = (n: number) => onChange(`${pad(hour)}:${pad(n)}`);
  const options = step === 'hour' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i * 5);
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
    <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-medium">ساعت یادآور</span><div dir="ltr" className="flex items-center gap-1 text-xl font-bold tabular-nums"><button type="button" data-testid="clock-hour-tab" onClick={() => setStep('hour')} className={`rounded-lg px-2 py-1 ${step === 'hour' ? 'bg-[#1769c2] text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{pad(hour)}</button>:<button type="button" data-testid="clock-minute-tab" onClick={() => setStep('minute')} className={`rounded-lg px-2 py-1 ${step === 'minute' ? 'bg-[#1769c2] text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{pad(minute)}</button><span className="ms-1 text-xs font-normal text-slate-500">۲۴ ساعته</span></div></div>
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      <div className="relative size-52 shrink-0 rounded-full border border-slate-200 bg-white shadow-inner dark:border-slate-700 dark:bg-[#162235]" role="group" aria-label={step === 'hour' ? 'انتخاب ساعت' : 'انتخاب دقیقه'}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold tabular-nums text-[#1769c2]" dir="ltr">{step === 'hour' ? pad(displayHour) : pad(minute)}</div>
        {options.map((n, index) => {
          const angle = (index * 30 - 60) * Math.PI / 180;
          const radius = 78;
          return <button type="button" key={n} data-testid={`clock-${step}-${n}`} aria-label={step === 'hour' ? `ساعت ${n}` : `دقیقه ${pad(n)}`} onClick={() => step === 'hour' ? setHour(n) : setMinute(n)} style={{ left: `calc(50% + ${Math.cos(angle) * radius}px)`, top: `calc(50% + ${Math.sin(angle) * radius}px)` }} className={`absolute flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#1769c2] ${(step === 'hour' ? displayHour : minute) === n ? 'bg-[#1769c2] text-white' : 'hover:bg-blue-100 dark:hover:bg-slate-700'}`}>{pad(n)}</button>;
        })}
      </div>
      <div dir="ltr" className="flex shrink-0 gap-2 sm:flex-col" aria-label="نیمه روز">{(['AM', 'PM'] as const).map(p => <button key={p} type="button" data-testid={`clock-period-${p.toLowerCase()}`} aria-pressed={period === p} onClick={() => onChange(`${pad((hour % 12) + (p === 'PM' ? 12 : 0))}:${pad(minute)}`)} className={`min-h-11 min-w-14 rounded-xl px-3 text-sm font-bold ${period === p ? 'bg-[#1769c2] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>{p}</button>)}</div>
    </div>
    {step === 'minute' && <label className="mt-3 flex items-center justify-center gap-2 text-sm">دقیقه دقیق<input data-testid="clock-exact-minute" type="number" min="0" max="59" value={minute} onChange={e => { const n = Number(e.target.value); if (e.target.value !== '' && n >= 0 && n <= 59) setMinute(n); }} dir="ltr" className="w-16 rounded-lg border border-slate-200 bg-white p-2 text-center dark:border-slate-700 dark:bg-slate-800" /></label>}
  </div>;
}
