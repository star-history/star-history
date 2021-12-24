import { createApp } from "vue";
import Toast from "../components/Toast.vue";

function show(message: string, type: string, duration = 2000) {
  const tempDiv = document.createElement("div");
  document.body.appendChild(tempDiv);
  const app = createApp(Toast, {
    message,
    type,
  });
  app.mount(tempDiv);
  setTimeout(() => {
    app.unmount();
    tempDiv.remove();
  }, duration);
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
