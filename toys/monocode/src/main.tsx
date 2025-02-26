import { render } from "preact";

const app = document.getElementById("app");

const App = () => {
  return <div>Hello world!</div>;
};

if (app != null) {
  render(<App />, app);
}
