import { Module } from "@nestjs/common";
import { TimeSlotsModule } from "src/time-slots/time-slots.module";
import { AppController } from "./app.controller";

@Module({
  imports: [TimeSlotsModule],
  controllers: [AppController],
})
export class AppModule {}
