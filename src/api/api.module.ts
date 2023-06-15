import { Module } from '@nestjs/common';
import { PlantModule } from './plant/plant.module';
import { UserModule } from './user/user.module';
import { EmployeeModule } from './employee/employee.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ModelFileModule } from './model-file/model-file.module';
import { CalendarEventModule } from './calendar-event/calendar-event.module';
import { PlantDocumentModule } from '@/api/plant-document/plant-document.module';
import { SourcePointModule } from './source-point/source-point.module';
import { PositionModule } from './position/position.module';
import { PageModule } from './page/page.module';
import { Model30917Module } from './model-30917/model-30917.module';
import { Model30818Module } from './model-30818/model-30818.module';
import { Model30817Module } from './model-30817/model-30817.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from '@/service/service.module';
import { AscmeModule } from '@/api/ascme/ascme.module';
import { PlantStatusHistoryModule } from '@/api/plant-status-history/plant-status-history.module';
import { PlantsEquipmentsEventsModule } from '@/api/plant-equipments-events/plants-equipments-events.module';
import { PlantEquipmentsEventsImagesModule } from '@/api/plant-equipments-events-images/plant-equipments-events-images.module';
import { CalendarEventPauseModule } from "@/api/calendar-event-pause/calendar-event-pause.module";

@Module({
  imports: [
    ServiceModule,
    PlantModule,
    UserModule,
    EmployeeModule,
    RefreshTokenModule,
    ModelFileModule,
    CalendarEventModule,
    CalendarEventPauseModule,
    PlantDocumentModule,
    SourcePointModule,
    PositionModule,
    PageModule,
    Model30917Module,
    Model30818Module,
    Model30817Module,
    AuthModule,
    AscmeModule,
    PlantStatusHistoryModule,
    PlantsEquipmentsEventsModule,
    PlantEquipmentsEventsImagesModule,
  ],
  exports: [
    ServiceModule,
    PlantModule,
    UserModule,
    EmployeeModule,
    RefreshTokenModule,
    ModelFileModule,
    CalendarEventModule,
    CalendarEventPauseModule,
    PlantDocumentModule,
    SourcePointModule,
    PositionModule,
    PageModule,
    Model30917Module,
    Model30818Module,
    Model30817Module,
    AuthModule,
    AscmeModule,
    PlantStatusHistoryModule,
    PlantsEquipmentsEventsModule,
    PlantEquipmentsEventsImagesModule,
  ],
})
export class ApiModule {}
