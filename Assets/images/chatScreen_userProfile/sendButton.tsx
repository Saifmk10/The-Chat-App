import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SendButton = (props) => (
  <Svg
    width={35}
    height={35}
    viewBox="0 0 78 78"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.75 65V13L71.5 39L9.75 65ZM16.25 55.25L54.7625 39L16.25 22.75V34.125L35.75 39L16.25 43.875V55.25ZM16.25 55.25V39V22.75V34.125V43.875V55.25Z"
      fill="#D9D9D9"
    />
  </Svg>
);
export default SendButton;
