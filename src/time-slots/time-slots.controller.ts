import { Body, Controller, Post } from "@nestjs/common";
import { DayTimetable } from "src/types/day-timetable";
import { GetTimeSlotsDto } from "./dto/get-time-slots.dto";
import { TimeSlotsService } from "./time-slots.service";

@Controller()
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post("/getTimeSlots")
  async getTimeSlots(@Body() body: GetTimeSlotsDto): Promise<DayTimetable[]> {
    return await this.timeSlotsService.getTimeSlots(body);
  }
}
