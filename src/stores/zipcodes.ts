import { Address, JpString } from "../datatypes/address";
import { loadCSVs } from "./load-csv";

export interface zipcodeStore {
  addresses: Map<string, Address>;
  prefectures: Map<string, JpString>;
  cities: Map<string, JpString>;
  towns: Map<string, JpString>;
}

const store: zipcodeStore = {
  addresses: new Map<string, Address>(),
  prefectures: new Map<string, JpString>(),
  cities: new Map<string, JpString>(),
  towns: new Map<string, JpString>(),
};

loadCSVs(store);

/**
 * This function looks up an Address by zipcode string.
 */
export function getAddress(zipcode: string): Address | null {
  zipcode = zipcode.replace("-", "");
  return store.addresses.get(zipcode) ?? null;
}
