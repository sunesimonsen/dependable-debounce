import unexpected from "unexpected";
import unexpectedDependable from "unexpected-dependable";
import unexpectedSinon from "unexpected-sinon";

export const expect = unexpected
  .clone()
  .use(unexpectedDependable)
  .use(unexpectedSinon);
