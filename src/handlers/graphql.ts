import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { getAddress } from "../stores/zipcodes";
import { AddressQuery, addressSchema } from "../datatypes/address";

const root = {
  address: (query: AddressQuery) => {
    if (query.zipcode === null || query.zipcode === "") {
      return;
    }
    return getAddress(query.zipcode);
  },
};

const schema = buildSchema(addressSchema);

export const handler = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});
