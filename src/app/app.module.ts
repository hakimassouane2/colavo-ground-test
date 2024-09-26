import { Module } from "@nestjs/common";
import { TimeSlotsModule } from "src/time-slots/time-slots.module";

@Module({
  imports: [TimeSlotsModule],
})
export class AppModule {}
