import { withPluginApi } from "discourse/lib/plugin-api";
import { iconNode } from "discourse-common/lib/icon-library";
import { dasherize } from "@ember/string";

export default {
  name: "header-icon-links",
  initialize() {
    withPluginApi("0.8.41", api => {
      try {
        const splitLinks = settings.Header_links.split("|").filter(Boolean);

        splitLinks.forEach(link => {
          const fragments = link.split(",").map(fragment => fragment.trim());
          const title = fragments[0];
          const icon = iconNode(fragments[1].toLowerCase());
          const href = fragments[2].replace('%{username}', Discourse.User.currentProp("username"));
          const className = `header-icon-${dasherize(fragments[0])}`;
          const viewClass = fragments[3].toLowerCase();
          const target = fragments[4].toLowerCase() === "blank" ? "_blank" : "";
          const selector = `li.${className}.${viewClass}`;

          api.decorateWidget("header-icons:before", helper => {
            return helper.h(selector, [
              helper.h(
                "a.icon.btn-flat",
                {
                  href,
                  title,
                  target
                },
                icon
              )
            ]);
          });
        });
      } catch (error) {
        console.error(error);
        console.error(
          "There's an issue in the header icon links component. Check if your settings are entered correctly"
        );
      }
    });
  }
};
