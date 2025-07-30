import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const LoginSuccessfullTick = (props) => (
  <Svg
    width={80}
    height={80}
    viewBox="0 0 265 265"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={132.5} cy={132.5} r={132.5} fill="#4DE44E" />
    <Path
      d="M61.5 144L113 181L203 86"
      stroke="black"
      strokeWidth={20}
      strokeLinecap="round"
    />
  </Svg>
);
export default LoginSuccessfullTick;
