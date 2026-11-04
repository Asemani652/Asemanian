export type Frequency = 'monthly' | 'every2months' | 'quarterly';
export type InstallmentStatus = 'paid' | 'unpaid';
export type CalendarKind = 'jalali' | 'gregorian' | 'lunar';
export interface Installment { id: string; number: number; dueDate: string; amount: number; status: InstallmentStatus; paymentDate?: string; notes: string; }
export interface Loan { id: string; name: string; bank: string; totalAmount: number; installmentAmount: number; installmentCount: number; firstDate: string; frequency: Frequency; notes: string; createdAt: string; installments: Installment[]; }
export interface LedgerEntry { id: string; person: string; kind: 'receivable' | 'payable'; movement?: 'received' | 'paid'; amount: number; date: string; notes: string; settled: boolean; }
export interface Reminder { id: string; title: string; date: string; time?: string; notes: string; }
export interface AppSettings { theme: 'light' | 'dark' | 'system'; calendarKind: CalendarKind; chartPaidColor: string; chartRemainingColor: string; reminderDays: number[]; loanSort: 'newest' | 'oldest' | 'name' | 'remaining'; showSettledLoans: boolean; showWeather: boolean; weatherSource: 'open-meteo' | 'met-no' | '7timer'; }
export interface Note { id: string; text: string; createdAt: string; updatedAt?: string; }
export interface SavedState { loans: Loan[]; ledger: LedgerEntry[]; reminders?: Reminder[]; notes?: Note[]; settings: AppSettings; }
const DB = 'asemanian-loan-db';
const STORE = 'state';
const KEY = 'app-state';
export const defaultSettings: AppSettings = { theme: 'system', calendarKind: 'jalali', chartPaidColor: '#172554', chartRemainingColor: '#dc2626', reminderDays: [0, 1, 3, 7], loanSort: 'newest', showSettledLoans: true, showWeather: true, weatherSource: 'open-meteo' };
function openDb(): Promise<IDBDatabase> { return new Promise((resolve, reject) => { const request = indexedDB.open(DB, 4); request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); }; request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
function normalize(value: Partial<SavedState> | null | undefined): SavedState { const old = value?.settings as Partial<AppSettings> & { chartColor?: string } | undefined; return { loans: value?.loans ?? [], ledger: value?.ledger ?? [], reminders: value?.reminders ?? [], notes: value?.notes ?? [], settings: { ...defaultSettings, ...old, chartPaidColor: old?.chartPaidColor ?? old?.chartColor ?? defaultSettings.chartPaidColor } }; }
export async function loadState(): Promise<SavedState> { try { const db = await openDb(); const saved = await new Promise<SavedState | undefined>((resolve, reject) => { const request = db.transaction(STORE).objectStore(STORE).get(KEY); request.onsuccess = () => resolve(request.result as SavedState | undefined); request.onerror = () => reject(request.error); }); return normalize(saved); } catch { try { return normalize(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch { return normalize(null); } } }
let pendingSave: Promise<void> = Promise.resolve();
export function saveState(state: SavedState): Promise<void> {
  pendingSave = pendingSave.catch(() => {}).then(async () => {
    let localSaved = false;
    try { localStorage.setItem(KEY, JSON.stringify(state)); localSaved = true; } catch { /* IndexedDB may still work */ }
    try {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(state, KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
      db.close();
    } catch (error) { if (!localSaved) throw error; }
  });
  return pendingSave;
}
