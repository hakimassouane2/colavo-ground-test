import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { DayTimetable } from "src/types/day-timetable";
import {
  GetTimeSlotsError,
  GetTimeSlotsException,
} from "src/types/exceptions/get-time-slots-exception";
import { GetTimeSlotsDto } from "./dto/get-time-slots.dto";
import { TimeSlotsService } from "./time-slots.service";

@Controller()
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post("/getTimeSlots")
  async getTimeSlots(
    @Body() body: GetTimeSlotsDto,
  ): Promise<DayTimetable[] | GetTimeSlotsException> {
    if (!body.start_day_identifier) {
      throw new GetTimeSlotsException(
        HttpStatus.BAD_REQUEST,
        GetTimeSlotsError.INVALID_START_DAY_IDENTIFIER,
      );
    } else if (!body.timezone_identifier) {
      throw new GetTimeSlotsException(
        HttpStatus.BAD_REQUEST,
        GetTimeSlotsError.INVALID_TIMEZONE_IDENTIFIER,
      );
    } else if (!body.service_duration) {
      throw new GetTimeSlotsException(
        HttpStatus.BAD_REQUEST,
        GetTimeSlotsError.INVALID_SERVICE_DURATION,
      );
    }
    return await this.timeSlotsService.getTimeSlots(body);
  }
}
