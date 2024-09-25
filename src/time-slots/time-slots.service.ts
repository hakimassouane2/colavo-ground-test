import { Injectable } from "@nestjs/common";
import * as moment from "moment-timezone";
import { DayTimetable } from "src/types/day-timetable";
import { Event } from "src/types/event";
import { Timeslot } from "src/types/timeslot";
import { Workhour } from "src/types/workhour";
import * as events from "../database/events.json"; // Load events.json
import * as workhours from "../database/workhours.json"; // Load workhours.json
import { GetTimeSlotsDto } from "./dto/get-time-slots.dto";

@Injectable()
export class TimeSlotsService {
  private isConflictingWithEvents(
    timeslot: Timeslot,
    events: Event[],
  ): boolean {
    return events.some(
      (event) =>
        timeslot.begin_at < event.end_at && timeslot.end_at > event.begin_at,
    );
  }

  private isWithinWorkHours(timeslot: Timeslot, workhour: Workhour): boolean {
    if (workhour.is_day_off) return false;

    const workStart =
      timeslot.begin_at - (timeslot.begin_at % 86400) + workhour.open_interval;
    const workEnd =
      timeslot.begin_at - (timeslot.begin_at % 86400) + workhour.close_interval;

    return timeslot.begin_at >= workStart && timeslot.end_at <= workEnd;
  }

  async getTimeSlots(body: GetTimeSlotsDto): Promise<DayTimetable[]> {
    const {
      start_day_identifier,
      timezone_identifier,
      service_duration,
      days = !body.days || body.days <= 0 ? 1 : body.days,
      timeslot_interval = !body.timeslot_interval || body.timeslot_interval <= 0
        ? 1800
        : body.timeslot_interval,
      is_ignore_schedule = false,
      is_ignore_workhour = false,
    } = body;

    const startDate = moment
      .tz(start_day_identifier, "YYYYMMDD", timezone_identifier)
      .startOf("day");

    const dayTimetables: DayTimetable[] = [];

    for (let dayModifier = 0; dayModifier < days; dayModifier++) {
      const currentDay = startDate.clone().add(dayModifier, "days");
      const startOfDayUnix = currentDay.unix();
      const endOfDayUnix = startOfDayUnix + 86400;
      const timeslots: Timeslot[] = [];

      for (
        let time = startOfDayUnix;
        time + service_duration <= endOfDayUnix;
        time += timeslot_interval
      ) {
        const timeslot = {
          begin_at: time,
          end_at: time + service_duration,
        };

        if (
          !is_ignore_schedule &&
          this.isConflictingWithEvents(timeslot, events)
        ) {
          continue;
        }

        const workhour = workhours.find(
          (wh) => wh.weekday === currentDay.isoWeekday(),
        );

        if (
          !is_ignore_workhour &&
          workhour &&
          !this.isWithinWorkHours(timeslot, workhour)
        ) {
          continue;
        }

        timeslots.push(timeslot);
      }

      const isDayOff = workhours.some(
        (wh) => wh.weekday === currentDay.isoWeekday() && wh.is_day_off,
      );

      dayTimetables.push({
        start_of_day: startOfDayUnix,
        day_modifier: dayModifier,
        is_day_off: isDayOff,
        timeslots,
      });
    }

    return dayTimetables;
  }
}
