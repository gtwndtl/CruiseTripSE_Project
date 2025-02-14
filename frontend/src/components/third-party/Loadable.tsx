import { Suspense, ComponentType } from "react";

// import Loader from "./Loader";
import LDSRing from "./LDSRing";

const Loadable =
  <P extends object>(Component: ComponentType<P>): ComponentType<P> =>
  (props: P) =>
    (
      <Suspense fallback={<LDSRing />}>
        <Component {...props} />
      </Suspense>
    );

export default Loadable;
