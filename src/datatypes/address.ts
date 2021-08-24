export interface Address {
  zipcode: string;
  prefectureKana: string;
  prefectureKanji: string;
  cityKana: string;
  cityKanji: string;
  townKana: string;
  townKanji: string;
  govcode: string;
}

export interface AddressQuery {
  zipcode: string
}

export const addressSchema = `
  type Address {
    zipcode: String!
    prefectureKana: String
    prefectureKanji: String
    cityKana: String
    cityKanji: String
    townKana: String
    townKanji: String
    govcode: String
  }

  type Query {
    address(zipcode:String!): Address
  }
`;
