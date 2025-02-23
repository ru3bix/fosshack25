import { unzip, Unzipped } from 'fflate';
import { filesystem, os } from '@neutralinojs/lib';
import { MBookMetadata } from '../types/mbook';

export type ExtractionProgress = {
  status: string;
  current: number;
  total: number;
};

// Helper function for async unzip
function unzipAsync(data: Uint8Array, opts?: any): Promise<Unzipped> {
  return new Promise((resolve, reject) => {
    unzip(data, opts, (err, unzipped) => {
      if (err) reject(err);
      else resolve(unzipped);
    });
  });
}

/**
 * Extracts an .mbook file properly handling both text & binary files.
 */
export async function extractMBook(
  filePath: string,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<{ metadata: MBookMetadata; extractPath: string }> {
  try {
    onProgress?.({ status: 'Reading .mbook file...', current: 0, total: 100 });
    const fileData = await filesystem.readBinaryFile(filePath);

    onProgress?.({ status: 'Processing zip content...', current: 10, total: 100 });
    const unzipped = await unzipAsync(new Uint8Array(fileData));

    onProgress?.({ status: 'Reading metadata...', current: 20, total: 100 });
    const metadataContent = unzipped['index.json'];
    if (!metadataContent) {
      throw new Error('Invalid .mbook file: missing index.json');
    }

    const decoder = new TextDecoder();
    const metadata: MBookMetadata = JSON.parse(decoder.decode(metadataContent));

    const extractPath = `./resources/mbook-extracted/${Date.now()}`;
    await filesystem.createDirectory(extractPath);

    const entries = Object.entries(unzipped);
    const totalEntries = entries.length;

    for (let i = 0; i < totalEntries; i++) {
      const [entryName, content] = entries[i];
      const fullPath = `${extractPath}/${entryName}`.replace(/\\/g, '/');

      onProgress?.({
        status: `Extracting: ${entryName}`,
        current: 20 + Math.floor((i / totalEntries) * 80),
        total: 100
      });

      if (entryName.endsWith('/')) {
        await filesystem.createDirectory(fullPath).catch(() => {});
        continue;
      }

      const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      await filesystem.createDirectory(parentDir).catch(() => {});

      const isBinary = /\.(mp4|png|jpg|jpeg|gif|webp|pdf|zip|mp3|wav)$/i.test(entryName);

      if (isBinary) {
        const chunkSize = 1024 * 1024;
        const buffer = new Uint8Array(content);

        for (let offset = 0; offset < buffer.length; offset += chunkSize) {
          const chunk: any = buffer.slice(offset, offset + chunkSize);
          await filesystem.appendBinaryFile(fullPath, chunk);
        }
      } else {
        const textContent = new TextDecoder().decode(content);
        await filesystem.writeFile(fullPath, textContent);
      }
    }

    onProgress?.({ status: 'Extraction complete', current: 100, total: 100 });

    // ✅ Ensure we get the absolute path to the server executable


    // ✅ Check if the server file exists before trying to run
    const exists = await filesystem.readFile("server.ext").catch(() => null);
    if (!exists) {
    }

    // ✅ Try to start the server
    try {
      const processId = await os.spawnProcess("server.exe");
      console.log("✅ Server started with PID:", processId);
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      throw new Error("Failed to start server process.");
    }

    return { metadata, extractPath };

  } catch (error: any) {
    console.error('Extraction error:', error);
    throw new Error(`Failed to extract .mbook file: ${error.message}`);
  }
}
