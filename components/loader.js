import { CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white ">
      {/* <img src="/loading.png" alt="loading..." /> */}
      <HashLoader
        // color={maroon}
        // loading={loading}
        cssOverride={override}
        size={150}
      />
    </div>
  );
};

export default Loader;
