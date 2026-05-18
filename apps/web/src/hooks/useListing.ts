import { listProducts } from "../modules/marketplace/services/marketplaceService";

export function useListing() {
  return { listings: listProducts() };
}
