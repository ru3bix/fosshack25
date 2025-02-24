<p align="center">
  <img width="280" alt="image" src="https://github.com/user-attachments/assets/1c70b17d-8a90-4a44-bece-dd353fb0d4b5" />
</p>

# ManimBooks

Students use dynamic media like videos to understand math or science concepts since the visualizations in textbooks are not enough. However, watching lengthy videos takes time. Videos cannot be quickly referred. Most teachers cannot make such engaging content are often helpless when it comes to providing high-quality animated illustrations. Hence, ManimBooks provide a hybrid solution where the scientific concepts can be animated inside the book itself using high-quality [manim](https://github.com/ManimCommunity/manim) based illustrations. ManimBook is an E-book format with basic text formatting features like other formats (like `epub`) but with the benefit of embedding manim animations. They can be referred to quickly, offline or online, and the text is readily available for citation.

## Tech Stack

The project consists of mainly 3 different software as referenced by the submodules of this repository.

1. A [service](https://github.com/ru3bix/manimbook-runner) written in Go is responsible for compiling and previewing the manimbook chapters. It uses [gin](https://github.com/gin-gonic/gin) and [manim](https://github.com/ManimCommunity/manim) to achieve desired functionality.

2. The [web-based editor](https://github.com/ru3bix/manimbook-editor) is made with [Next.js](https://github.com/vercel/next.js), [shadcn](https://github.com/shadcn-ui/ui), [blueprint](https://github.com/palantir/blueprint) and other frontend javascript libraries. It interacts with the backend service to generate previews of the current chapter.

3. Finally, there is an [offline reader](https://github.com/ru3bix/manimbook-reader) that can be used to view and read a compiled manimbook file.

## Usage

> [!TIP]
> Use our hosted editor at [https://manimbook.kush.in/ide](https://manimbook.kush.in/ide?welcome=true) to save some trouble ;)

Instructions to use individual services/software along with their architecture are provided in their respective repositories.

You can locally deploy the entire editor stack using docker compose. An example configuration is provided [here](compose.yaml).

```yaml
services:
  mbook-frontend:
    build: https://github.com/ru3bix/manimbook-editor.git
    environment:
      - BASE_URL=http://mbook-runner:8080
      - AI_KEY=<an openai compatible api key>
    ports:
      - 3000:3000

  mbook-runner:
    build: https://github.com/ru3bix/manimbook-runner.git
    ports:
      - 8080:8080
    environment:
      - BASE_DIR=/app
      - PUBLIC_HTTP_URL=http://127.0.0.1:8080
      - PUBLIC_WS_URL=ws://127.0.0.1:8080
```

> [!IMPORTANT]
> Keep in mind that the AI helper will require an OpenAI compatible API key to work.

> [!CAUTION]
> **DO NOT** use this to host your own service for public to access. Currently the project is in **VERY** early stages and the entire runner service is just one big RCE vulnerability.

To save the trouble, we have hosted the editor and runner service at [https://manimbook.kush.in/ide](https://manimbook.kush.in/ide?welcome=true) and [https://mbook-runner.kush.in](https://mbook-runner.kush.in) respectively.

## Contributors

- [Shivam Bhatt](https://github.com/shivam1608)
- [Kush Patel](https://github.com/libkush)
- [Shriansh Tripathi](https://github.com/Shriansh006)
- [Atri Mukherjee](https://github.com/rade-ark)
