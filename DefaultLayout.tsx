/** @jsx h */
import { h } from "./refuse.ts";

const DefaultLayout: React.FC = ({ children }) => {
  return (
    <html>
      <head>
        <title>Refuse</title>
      </head>
      <body>{children}</body>
    </html>
  );
};

export default DefaultLayout;
