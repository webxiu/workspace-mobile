// https://segmentfault.com/a/1190000039255368

// import "virtual:svg-icons-register";

import SvgIcon from "@/components/SvgIcon";
import { createApp } from "vue";

export function useSvgIcon(app: ReturnType<typeof createApp>) {
  app.component("SvgIcon", SvgIcon);
}
