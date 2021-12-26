import { createApp } from "vue";
import Toast from "../components/Toast.vue";

function show(message: string, type: string, duration: number) {
  const tempDiv = document.createElement("div");
  document.body.appendChild(tempDiv);
  const cbs = {
    destory: () => {
      app.unmount();
      tempDiv.remove();
    },
  };
  const app = createApp(Toast, {
    message,
    type,
    duration,
    destory: cbs.destory,
  });
  app.mount(tempDiv);
}

// NOTE: Just for mocking alert and only for this project.
namespace toast {
  export function succeed(message: string, duration = 2000) {
    return show(message, "succeed", duration);
  }
  export function warn(message: string, duration = 2000) {
    return show(message, "warn", duration);
  }
}

export default toast;
