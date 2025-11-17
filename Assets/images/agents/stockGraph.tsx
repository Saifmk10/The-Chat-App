import * as React from "react";
import Svg, { G, Path, Line, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={170}
    height={100}
    viewBox="0 0 428 203"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_470_122)">
      <Path
        d="M5.04492 149.485C217.545 355.986 216.045 -269.513 408.045 149.485"
        stroke="white"
        strokeWidth={3}
        strokeDasharray="1.5 1.5"
      />
    </G>
    <Path
      d="M427.398 128.353C427.594 128.157 427.594 127.841 427.398 127.646L424.216 124.464C424.021 124.268 423.705 124.268 423.509 124.464C423.314 124.659 423.314 124.975 423.509 125.171L426.338 127.999L423.509 130.827C423.314 131.023 423.314 131.339 423.509 131.535C423.705 131.73 424.021 131.73 424.216 131.535L427.398 128.353ZM8.04492 127.999V128.499H427.045V127.999V127.499H8.04492V127.999Z"
      fill="white"
    />
    <Line
      x1={288.545}
      y1={4.49907}
      x2={288.545}
      y2={126.499}
      stroke="#23CF00"
      strokeDasharray="2 2"
    />
    <Line
      x1={81.5449}
      y1={129.499}
      x2={81.5449}
      y2={188.499}
      stroke="#FF0505"
      strokeDasharray="2 2"
    />
    <Defs></Defs>
  </Svg>
);
export default SVGComponent;
