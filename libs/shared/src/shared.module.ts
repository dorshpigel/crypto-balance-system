import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { FileStorageService } from './file.storage.service';
import { LoggingService } from './logging.service';
import { ErrorHandlingService } from './error-handling-service';

@Module({
  providers: [
    SharedService,
    FileStorageService,
    LoggingService,
    ErrorHandlingService,
  ],
  exports: [
    SharedService,
    FileStorageService,
    LoggingService,
    ErrorHandlingService,
  ],
})
export class SharedModule {}
