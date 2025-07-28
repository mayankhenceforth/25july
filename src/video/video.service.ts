import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { CLIENT_RENEG_LIMIT } from 'tls';

@Injectable()
export class VideoService {
    async addWatermarkFromBuffers(
        videoBuffer: Buffer,
        imageBuffer: Buffer,
    ): Promise<Buffer> {
        const tempDir = '/dev/shm';
        const tempVideoPath = join(tempDir, `video-${randomUUID()}.mp4`);
        const tempImagePath = join(tempDir, `image-${randomUUID()}.png`);
        const outputPath = join(tempDir, `output-${randomUUID()}.mp4`);  

        await fs.promises.writeFile(tempVideoPath, videoBuffer);
        await fs.promises.writeFile(tempImagePath, imageBuffer);
        console.log('Temp files written to /dev/shm');
          const startExecution = Date.now()
        return new Promise((resolve, reject) => {
            ffmpeg()
                .addInput(tempVideoPath)
                .addInput(tempImagePath)
                .complexFilter([
                    '[1:v]scale=100:-1[wm]',
                    '[0:v][wm]overlay=W-w-10:10',
                ])
                .outputOptions([
                    '-preset ultrafast',
                    '-crf 28',
                    '-movflags frag_keyframe+empty_moov',
                ])
                .output(outputPath)
                .on('end', async () => {
                    try {
                        const result = await fs.promises.readFile(outputPath);
                        console.log('FFmpeg processing complete. Output file read.');

                        // Delete all temp files after successful processing
                        await fs.promises.unlink(outputPath);
                        console.log(`Deleted outputPath: ${outputPath}`);

                        await Promise.all([
                            fs.promises.unlink(tempVideoPath),
                            fs.promises.unlink(tempImagePath),
                            
                        ]);
                        console.log(`Deleted tempVideoPath: ${tempVideoPath}`);
                        console.log(`Deleted tempImagePath: ${tempImagePath}`);
                        let processEnd = Date.now()
                        let totalTime = processEnd-startExecution
                        console.log("total time " ,totalTime)
                        resolve(result);
                    } catch (err) {
                        console.error('Error after FFmpeg processing:', err);
                        reject(err);
                    }
                })
                .on('error', async (err) => {
                    console.error('FFmpeg error:', err.message);

                    // Only delete input files here; keep output for debugging if needed
                    await Promise.allSettled([
                        fs.promises.unlink(tempVideoPath),
                        fs.promises.unlink(tempImagePath),
                    ]).then((results) => {
                        console.log('Cleaned up input temp files after error:');
                        results.forEach((res, i) => {
                            const file = [tempVideoPath, tempImagePath][i];
                            if (res.status === 'fulfilled') {
                                console.log(`Deleted: ${file}`);
                            } else {
                                console.warn(`Failed to delete: ${file} - ${res.reason}`);
                            }
                        });
                    });

                    // Do not delete outputPath here
                    reject(err);
                })
                .run();
        });
    }
}


/*
import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import * as fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
@Injectable()
export class VideoService {
  async addWatermarkFromBuffers(
    videoBuffer: Buffer,
    imageBuffer: Buffer,
  ): Promise<Buffer> {
    const videoStream = Readable.from(videoBuffer);
    const imageStream = Readable.from(imageBuffer);
    const tempVideoPath = join(tmpdir(), `video-${randomUUID()}.mp4`);
    const tempImagePath = join(tmpdir(), `image-${randomUUID()}.png`);
    const outputPath = join(tmpdir(), `output-${randomUUID()}.mp4`);
    // Save buffers temporarily (ffmpeg requires file paths)

    const startTime = Date.now()
    await fs.promises.writeFile(tempVideoPath, videoBuffer);
    await fs.promises.writeFile(tempImagePath, imageBuffer);
    return new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .input(tempImagePath)
        .complexFilter(['overlay=W-w-10:10'])
        .outputOptions('-movflags frag_keyframe+empty_moov') // good for streaming
        .output(outputPath)
        .on('end', async () => {
          const outputBuffer = await fs.promises.readFile(outputPath);
          // Clean up temp files
          await fs.promises.unlink(tempVideoPath);
          await fs.promises.unlink(tempImagePath);
          await fs.promises.unlink(outputPath);

          const endTime = Date.now()
          const totalTime = endTime-startTime
          console.log("total time " ,totalTime)
          resolve(outputBuffer);
        })
        .on('error', async (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    });
  }
}*/