import { HttpException } from "@nestjs/common";

export enum GetTimeSlotsError {
  INVALID_START_DAY_IDENTIFIER = "INVALID_START_DAY_IDENTIFIER",
  INVALID_TIMEZONE_IDENTIFIER = "INVALID_TIMEZONE_IDENTIFIER",
  INVALID_SERVICE_DURATION = "INVALID_SERVICE_DURATION",
  INVALID_DAYS = "INVALID_DAYS",
  INVALID_TIMESLOT_INTERVAL = "INVALID_TIMESLOT_INTERVAL",
}

export class GetTimeSlotsException extends HttpException {
  constructor(errorCode: number, message: string) {
    super(message, errorCode);
  }
}
