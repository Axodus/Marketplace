import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { MarketplaceController } from "./modules/marketplace/controllers/marketplaceController.js";
import { FileMarketplaceRepository } from "./modules/marketplace/repositories/marketplaceRepository.js";
import { MarketplaceApiService } from "./modules/marketplace/services/marketplaceApiService.js";
import { envelope } from "./common/types.js";

export interface ApiServerOptions {
  storePath?: string;
}

export async function createApiServer(options: ApiServerOptions = {}) {
  const repository = new FileMarketplaceRepository(options.storePath);
  const marketplaceService = new MarketplaceApiService(repository);
  await marketplaceService.init();
  const marketplaceController = new MarketplaceController(marketplaceService);

  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (url.pathname === "/healthz") {
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.writeHead(200);
      res.end(JSON.stringify(envelope({ ok: true, service: "axodus-marketplace-api" })));
      return;
    }

    if (marketplaceController.canHandle(url)) {
      await marketplaceController.handle(req, res, url);
      return;
    }

    res.setHeader("content-type", "application/json; charset=utf-8");
    res.writeHead(404);
    res.end(JSON.stringify({ error: { code: "ROUTE_NOT_FOUND", message: "Route was not found." } }));
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.API_PORT ?? 4000);
  const server = await createApiServer();
  server.listen(port, () => {
    console.log(`Axodus Marketplace API listening on http://localhost:${port}`);
  });
}
