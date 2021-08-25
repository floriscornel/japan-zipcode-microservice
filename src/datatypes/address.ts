export interface JpString {
  kanji: string;
  kana: string | null;
  romaji: string | null;
}

export interface Office {
  name: JpString;
  street: string;
}

export interface Address {
  zipcode: string;
  prefecture: JpString;
  city: JpString;
  town: JpString;
  govcode: string;
  office: null | Office;
}

export interface AddressQuery {
  zipcode: string
}

export const addressSchema = `
  type JpString {
    kanji: String!
    kana: String
    romaji: String
  }

  type Office {
    name: JpString!
    street: String!
  }

  type Address {
    zipcode: String!
    prefecture: JpString!
    city: JpString!
    town: JpString!
    govcode: String!
    office: Office
  }

  type Query {
    address(zipcode:String!): Address
  }
`;
