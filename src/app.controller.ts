import {Controller, Get, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {AppService} from './app.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {StorageService} from "./storage/storage.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly storageService: StorageService
  ) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    const mediaId = "777";
    await this.storageService.save(
      "media/" + file.originalname,
      file.mimetype,
      file.buffer,
      [{mediaId: mediaId}]
    );
  }
}
