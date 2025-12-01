import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DeleteLogo = (props) => (
  <Svg
    width={25}
    height={25}
    viewBox="0 0 57 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.625 49.875C15.3187 49.875 14.2005 49.4099 13.2703 48.4797C12.3401 47.5495 11.875 46.4312 11.875 45.125V14.25H9.5V9.5H21.375V7.125H35.625V9.5H47.5V14.25H45.125V45.125C45.125 46.4312 44.6599 47.5495 43.7297 48.4797C42.7995 49.4099 41.6813 49.875 40.375 49.875H16.625ZM40.375 14.25H16.625V45.125H40.375V14.25ZM21.375 40.375H26.125V19H21.375V40.375ZM30.875 40.375H35.625V19H30.875V40.375Z"
      fill="#1D1B20"
    />
  </Svg>
);
export default DeleteLogo;
