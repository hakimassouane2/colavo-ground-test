enum Weekday {
  SUNDAY = 1,
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
}

export interface Workhour {
  is_day_off: boolean;
  open_interval: number;
  close_interval: number;
  weekday: Weekday;
}
