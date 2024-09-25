import { Module } from "@nestjs/common";
import { TimeSlotsController } from "./time-slots.controller";
import { TimeSlotsService } from "./time-slots.service";

@Module({
  imports: [],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService],
})
export class TimeSlotsModule {}
