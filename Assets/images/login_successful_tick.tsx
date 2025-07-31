import * as React from "react";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
const LoginSuccessfullTick = (props) => (
  <Svg
    width={80}
    height={80}
    viewBox="0 0 265 265"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={132.5} cy={132.5} r={132.5} fill="url(#paint0_linear_306_43)" />
    <Path
      d="M61.5 144L113 181L203 86"
      stroke="url(#paint1_linear_306_43)"
      strokeWidth={20}
      strokeLinecap="round"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_306_43"
        x1={132.5}
        y1={0}
        x2={132.5}
        y2={265}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#5F48F5" />
        <Stop offset={1} />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_306_43"
        x1={132.25}
        y1={86}
        x2={132.25}
        y2={181}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#D9D9D9" />
        <Stop offset={1} stopColor="white" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default LoginSuccessfullTick;

