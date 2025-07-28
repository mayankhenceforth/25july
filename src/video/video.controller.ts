import {
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { Response } from 'express';
import * as multer from 'multer';

@Controller('video')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @Post('buffer-watermark')
    @UseInterceptors(
        FilesInterceptor('files', 2, {
            storage: multer.memoryStorage(), // Store uploaded files in memory as buffers
        }),
    )
    async handleBufferUpload(
        @UploadedFiles() files: Express.Multer.File[],
        @Res() res: Response,
    ) {
        // Extract video and watermark image from uploaded files
        const videoFile = files.find((file) => file.mimetype.startsWith('video/'));
        const imageFile = files.find((file) => file.mimetype.startsWith('image/'));

        if (!videoFile || !imageFile) {
            throw new HttpException(
                'Both a video file and a watermark image are required',
                HttpStatus.BAD_REQUEST,
            );
        }

        try {
            const outputBuffer = await this.videoService.addWatermarkFromBuffers(
                videoFile.buffer,
                imageFile.buffer,
            );

            // Send the processed video buffer as a response
            res.set({
                'Content-Type': 'video/mp4',
                'Content-Disposition': 'inline; filename=watermarked.mp4',
            });
            return res.send(outputBuffer);
        } catch (err) {
            console.error('Error applying watermark:', err);
            throw new HttpException(
                'Failed to process video with watermark',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
