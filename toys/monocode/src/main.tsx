import { render } from "preact";
import styled from "styled-components";

const app = document.getElementById("app");

const App = () => {
  return <Root>Hello world!</Root>;
};

const Root = styled.div`
  color: blue;
`;

if (app != null) {
  render(<App />, app);
}
