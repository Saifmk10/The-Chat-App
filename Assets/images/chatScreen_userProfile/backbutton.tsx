import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BackButton = (props) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 119 119"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M42.6413 59.5L72.3913 29.75L79.333 36.6917L56.5247 59.5L79.333 82.3083L72.3913 89.25L42.6413 59.5Z"
      fill="#D9D9D9"
    />
  </Svg>
);
export default BackButton;