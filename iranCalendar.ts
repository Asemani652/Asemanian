export interface Occasion { title: string; holiday: boolean }

// Fixed dates in the Iranian solar calendar. Lunar observances can differ by a day
// from the official announcement because the beginning of lunar months is observed.
const solar: Record<string, Occasion[]> = {
  '1/1': [{ title: 'آغاز نوروز', holiday: true }],
  '1/2': [{ title: 'تعطیلات نوروز', holiday: true }],
  '1/3': [{ title: 'تعطیلات نوروز', holiday: true }],
  '1/4': [{ title: 'تعطیلات نوروز', holiday: true }],
  '1/12': [{ title: 'روز جمهوری اسلامی ایران', holiday: true }],
  '1/13': [{ title: 'روز طبیعت', holiday: true }],
  '2/10': [{ title: 'روز ملی خلیج فارس', holiday: false }],
  '2/12': [{ title: 'روز معلم', holiday: false }],
  '2/25': [{ title: 'بزرگداشت فردوسی و پاسداشت زبان فارسی', holiday: false }],
  '3/3': [{ title: 'آزادسازی خرمشهر', holiday: false }],
  '3/14': [{ title: 'رحلت امام خمینی', holiday: true }],
  '3/15': [{ title: 'قیام پانزده خرداد', holiday: true }],
  '6/31': [{ title: 'آغاز هفته دفاع مقدس', holiday: false }],
  '7/7': [{ title: 'روز آتش‌نشانی و ایمنی', holiday: false }],
  '7/20': [{ title: 'بزرگداشت حافظ', holiday: false }],
  '8/13': [{ title: 'روز دانش‌آموز', holiday: false }],
  '9/16': [{ title: 'روز دانشجو', holiday: false }],
  '9/30': [{ title: 'شب یلدا', holiday: false }],
  '11/22': [{ title: 'پیروزی انقلاب اسلامی', holiday: true }],
  '12/29': [{ title: 'روز ملی شدن صنعت نفت', holiday: true }],
};

const lunar: Record<string, Occasion[]> = {
  '1/9': [{ title: 'تاسوعای حسینی', holiday: true }],
  '1/10': [{ title: 'عاشورای حسینی', holiday: true }],
  '2/20': [{ title: 'اربعین حسینی', holiday: true }],
  '2/28': [{ title: 'رحلت پیامبر اکرم و شهادت امام حسن مجتبی', holiday: true }],
  '2/30': [{ title: 'شهادت امام رضا', holiday: true }],
  '3/8': [{ title: 'شهادت امام حسن عسکری', holiday: true }],
  '3/17': [{ title: 'میلاد پیامبر اکرم و امام جعفر صادق', holiday: true }],
  '6/3': [{ title: 'شهادت حضرت فاطمه زهرا', holiday: true }],
  '7/13': [{ title: 'میلاد امام علی', holiday: true }],
  '7/27': [{ title: 'مبعث پیامبر اکرم', holiday: true }],
  '8/15': [{ title: 'میلاد امام زمان', holiday: true }],
  '9/21': [{ title: 'شهادت امام علی', holiday: true }],
  '10/1': [{ title: 'عید سعید فطر', holiday: true }],
  '10/2': [{ title: 'تعطیلات عید فطر', holiday: true }],
  '10/25': [{ title: 'شهادت امام جعفر صادق', holiday: true }],
  '12/10': [{ title: 'عید قربان', holiday: true }],
  '12/18': [{ title: 'عید غدیر خم', holiday: true }],
};

export function iranOccasions(solarMonth: number, solarDay: number, lunarMonth: number, lunarDay: number): Occasion[] {
  return [...(solar[`${solarMonth}/${solarDay}`] ?? []), ...(lunar[`${lunarMonth}/${lunarDay}`] ?? [])];
}
